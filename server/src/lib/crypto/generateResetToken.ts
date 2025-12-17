// src/lib/crypto/generateResetToken.ts
import crypto from 'crypto';

/**
 * Generates a secure password reset token
 * @returns { token: string, hashedToken: string, expires: Date }
 */
export const generatePasswordResetToken = () => {
  // 32 bytes = 64 chars hex → extremely secure
  const token = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  return {
    token,        // Plain token to send in email
    hashedToken,  // Store this in DB
    expires,
  };
};