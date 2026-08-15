const mongoose = require('mongoose');
const dns = require('dns');

// Override DNS servers to Google & Cloudflare DNS to resolve querySrv EREFUSED issues on local system/ISP DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('⚠️ Custom DNS setting warning:', e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn('⚠️ Server is still running on port 5000.');
  }
};

module.exports = connectDB;

