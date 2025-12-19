// src/middlewares/rateLimiterContact.ts
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis'; // Updated to the current package name
import { RedisReply } from 'rate-limit-redis';
import redisClient from '../config/redis';
import type { Request } from 'express';

// Helper to safely get normalized IP (same as your existing file)
const getIp = (req: Request): string => {
  const ip = (req.ip || 'unknown-ip').split(':').pop() || 'unknown-ip'; 
  return ip;
};

// Create Redis store with unique prefix for contact form
const createContactRedisStore = (prefix: string) =>
  new RedisStore({
    sendCommand: (command: string, ...args: string[]): Promise<RedisReply> => {
      return redisClient.call(command, ...args) as Promise<RedisReply>;
    },
    prefix,
  });

export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, 
  store: createContactRedisStore('rl:contact:'),
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    message: 'Too many form submissions. Please try again in an hour or write us via email.',
  },

  keyGenerator: (req: Request): string => {
    return `ip:${getIp(req)}`;
  },
  
  // Custom handler for consistent response format
  handler: (_, res) => {
    res.status(429).json({
      message: 'Too many form submissions. Please try again in an hour or write us via email.',
    });
  },
});