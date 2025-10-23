import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUrl: string;
  JWT_SECRET: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5500,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is required');
  })()

};

export default config;