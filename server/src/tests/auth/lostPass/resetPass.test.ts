import request from 'supertest';
import express from 'express';
import crypto from 'crypto';
import { resetPassword } from '../../../controllers/user/forget.psWrd.Controller';
import User from '../../../models/user.model';

// Mocks
jest.mock('../../../models/user.model');

const app = express();
app.use(express.json());
app.post('/reset-password/:token', resetPassword);

describe('POST /reset-password/:token', () => {
  const validPlainToken = 'valid-plain-token';
  const validHashedToken = crypto.createHash('sha256').update(validPlainToken).digest('hex');

  const mockedUser = {
    _id: '123',
    fullName: 'John Doe',
    email: 'john@example.com',
    password: undefined,
    resetPasswordToken: validHashedToken,
    resetPasswordExpires: Date.now() + 3600000, // 1 hour in future
    save: jest.fn(),
  };
  

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully reset password with valid token', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockedUser);

    const res = await request(app)
      .post(`/reset-password/${validPlainToken}`)
      .send({
        password: 'newstrongpassword123',
        confirmPassword: 'newstrongpassword123',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password successfully reset! You can now log in with your new password.');
    expect(mockedUser.password).toBe('newstrongpassword123');
    expect(mockedUser.resetPasswordToken).toBeUndefined();
    expect(mockedUser.resetPasswordExpires).toBeUndefined();
    expect(mockedUser.save).toHaveBeenCalled();
  });

  it('should reject if passwords do not match', async () => {
    const res = await request(app)
      .post(`/reset-password/${validPlainToken}`)
      .send({
        password: 'password1',
        confirmPassword: 'password2',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Passwords do not match.');
  });

  it('should reject if password is too short', async () => {
    const res = await request(app)
      .post(`/reset-password/${validPlainToken}`)
      .send({
        password: 'short',
        confirmPassword: 'short',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password must be at least 8 characters long.');
  });

  it('should reject invalid or expired token', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // No user found

    const res = await request(app)
      .post('/reset-password/invalid-token')
      .send({
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid or expired reset token. Please request a new one.');
  });
});