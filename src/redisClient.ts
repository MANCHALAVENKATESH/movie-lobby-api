import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';

const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
});

// Handle Redis client errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Handle successful connection
redisClient.on('ready', async () => {
  console.log('Redis client connected successfully');

  // Store a sample cache
  try {
    await redisClient.set('sample_key', 'Hello, Redis!');
    console.log('Sample cache set: sample_key = Hello, Redis!');

    // Retrieve the sample cache to verify
    const value = await redisClient.get('sample_key');
    console.log('Retrieved from cache:', value);
  } catch (err) {
    console.error('Error setting or getting cache:', err);
  }
});

// Connect the client
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

export default redisClient;