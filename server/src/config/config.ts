import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5500,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URI || '',

};

export default config;