// src/controllers/authController.ts
import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../../models/user.model';
import { sendPasswordResetEmailService } from '../../emails/emailerSender';
import config from '../../config/config';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ message: 'Please provide a valid email address.' });
    return;
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Always respond the same way — prevents email enumeration attacks
    const genericMessage = 'If an account with this email exists, a password reset link has been sent.';

    if (!user) {
      res.status(200).json({ message: genericMessage });
      return;
    }

    // Generate secure reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Build frontend reset URL
    const resetUrl = `${config.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email using our clean service
    const emailResult = await sendPasswordResetEmailService(
      user.email,
      user.fullName,
      resetUrl
    );

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      // Still return generic message — don't reveal email failure
    }

    res.status(200).json({ message: genericMessage });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Basic validation
  if (!password && password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match.' });
    return;
  }

  try {
    // Hash the token from URL to match stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token and non-expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token. Please request a new one.' });
      return;
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Password successfully reset! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
};