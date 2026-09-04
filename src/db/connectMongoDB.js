import dns from 'node:dns';
import mongoose from 'mongoose';

// Workaround: on some Windows setups the OS-configured DNS server
// doesn't respond correctly to Node's SRV lookups (used by
// mongodb+srv:// URIs), even though `nslookup` works fine.
// Forcing a public resolver fixes the `querySrv ECONNREFUSED` error.
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Error while connecting to MongoDB', error);
    throw error;
  }
};
