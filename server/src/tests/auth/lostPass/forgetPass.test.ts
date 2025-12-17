// src/tests/auth/lostPass/forgetPass.test.ts

import request  from 'supertest'; // ← Named import (fixed previous error)
import express from 'express';
import { forgotPassword } from '../../../controllers/user/forget.psWrd.Controller';
import User from '../../../models/user.model';

// Mocks
jest.mock('../../../models/user.model');

// Manual mock for the email service
jest.mock('../../../emails/emailerSender', () => ({
  sendPasswordResetEmailService: jest.fn(),
}));

jest.mock('../../../config/config', () => ({
  CLIENT_URL: 'http://localhost:5500/api/v1/auth',
}));

// Get the mocked function directly from the mock
const mockedSendEmailService = require('../../../emails/emailerSender').sendPasswordResetEmailService as jest.Mock;

const mockedUserModel = jest.mocked(User);

const app = express();
app.use(express.json());
app.post('/forgot-password', forgotPassword);

describe('POST /forgot-password', () => {
  const mockedUser = {
    _id: '123',
    fullName: 'John Doe',
    email: 'john@example.com',
    generatePasswordResetToken: jest.fn().mockReturnValue('mocked-plain-token'),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return generic success message when user exists and email is sent', async () => {
    mockedUserModel.findOne.mockResolvedValue(mockedUser as any);
    mockedSendEmailService.mockResolvedValue({ success: true });

    const res = await request(app)
      .post('/forgot-password')
      .send({ email: 'john@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('If an account with this email exists, a password reset link has been sent.');
    expect(mockedUser.generatePasswordResetToken).toHaveBeenCalled();
    expect(mockedUser.save).toHaveBeenCalled();
    expect(mockedSendEmailService).toHaveBeenCalledWith(
      'john@example.com',
      'John Doe',
      'http://localhost:5500/api/v1/auth/reset-password/mocked-plain-token'
    );
  });

  it('should return generic success message even if user does not exist (prevent enumeration)', async () => {
    mockedUserModel.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/forgot-password')
      .send({ email: 'nonexistent@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('If an account with this email exists, a password reset link has been sent.');
    expect(mockedSendEmailService).not.toHaveBeenCalled();
  });

  it('should return 400 if email is missing or invalid', async () => {
    const res = await request(app)
      .post('/forgot-password')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide a valid email address.');
  });

  it('should return 400 if email is not a string', async () => {
    const res = await request(app).post('/forgot-password').send({ email: 12345 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide a valid email address.');
  });

  it('should handle case-insensitive and trimmed email lookup', async () => {
    mockedUserModel.findOne.mockResolvedValue(mockedUser as any);
    mockedSendEmailService.mockResolvedValue({ success: true });

    const res = await request(app).post('/forgot-password').send({ email: '  JOHN@EXAMPLE.COM  ' });

    expect(res.status).toBe(200);
    expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
  });

  it('should handle database error gracefully', async () => {
    mockedUserModel.findOne.mockRejectedValue(new Error('Database connection failed'));

    const res = await request(app).post('/forgot-password').send({ email: 'john@example.com' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('An unexpected error occurred. Please try again later.');
  });

  it('should handle user.save() failure', async () => {
    mockedUserModel.findOne.mockResolvedValue(mockedUser as any);
    mockedUser.save.mockRejectedValue(new Error('Save failed'));
    mockedSendEmailService.mockResolvedValue({ success: true });

    const res = await request(app).post('/forgot-password').send({ email: 'john@example.com' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('An unexpected error occurred. Please try again later.');
  });

  it('should handle token generation failure gracefully', async () => {
    const badUser = {
      ...mockedUser,
      generatePasswordResetToken: jest.fn().mockImplementation(() => {
        throw new Error('Crypto failure');
      }),
    };
    mockedUserModel.findOne.mockResolvedValue(badUser as any);

    const res = await request(app).post('/forgot-password').send({ email: 'john@example.com' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('An unexpected error occurred. Please try again later.');
  });

});