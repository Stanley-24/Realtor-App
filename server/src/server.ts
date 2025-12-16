import app from './app';
import config from './config/config';
import { connectDB } from './lib/db';



// 🌍 Port setup
const PORT = config.port;

// 🚀 Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`⚡️ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
