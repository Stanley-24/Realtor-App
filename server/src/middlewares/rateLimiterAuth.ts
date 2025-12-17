// src/middlewares/rateLimiterAuth.ts
import rateLimit from 'express-rate-limit';
import RateLimiterRedis, { RedisReply }  from 'rate-limit-redis';
import redisClient from '../config/redis';
import type { Request } from 'express';

// Helper to safely get normalized IP
const getIp = (req: Request): string => {
  
  const ip = (req.ip || 'unknown-ip').split(':')[0];
  return ip;
};

// Create SEPARATE stores with unique prefixes
const createRedisStore = (prefix: string) =>
  new RateLimiterRedis({
   
    sendCommand: (command: string, ...args: string[]): Promise<RedisReply> => {
      return redisClient.call(command, ...args) as Promise<RedisReply>;
    },
    prefix,
  });


export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  store: createRedisStore('rl:forgot:'), 
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many password reset requests. Please try again in 15 minutes.' },

  keyGenerator: (req: Request): string => {
    if (req.body?.email && typeof req.body.email === 'string') {
      const email = req.body.email.toLowerCase().trim();
      if (email) return `email:${email}`;
    }
    // Fallback to normalized IP
    return `ip:${getIp(req)}`;
  },

  handler: (_, res) => {
    res.status(429).json({
      message: 'Too many password reset requests. Please try again later.',
    });
  },
});


export const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  store: createRedisStore('rl:reset:'), 
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many reset attempts. Please try again in an hour.' },

  keyGenerator: (req: Request): string => `ip:${getIp(req)}`,

  handler: (_, res) => {
    res.status(429).json({
      message: 'Too many attempts. Please try again later.',
    });
  },
});