import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUrl: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_TO: string;
  CLIENT_URL: string;
  NAME: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5500,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URI || (() => {
    throw new Error('MONGO_URI environment variable is required');
  })(),
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is required');
  })(),
  RESEND_API_KEY: process.env.RESEND_API_KEY || (() => {
    throw new Error('RESEND_API_KEY environment variable is required');
  })(),
  EMAIL_FROM: process.env.EMAIL_FROM || (() => {
    throw new Error('EMAIL_FROM environment variable is required');
  })(),
  EMAIL_TO: process.env.EMAIL_TO || (() => {
    throw new Error('EMAIL_TO environment variable is required');
  })(),
  CLIENT_URL: process.env.CLIENT_URL || (() => {
    throw new Error('CLIENT_URL environment variable is required');
  })(),
  NAME: process.env.NAME || (() => {
    throw new Error('NAME environment variable is required');
  })(),

};

export default config;