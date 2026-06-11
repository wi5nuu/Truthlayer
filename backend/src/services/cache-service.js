const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DEFAULT_TTL = 24 * 60 * 60;
const POPULAR_TTL = 6 * 60 * 60;

const POPULAR_DOMAINS = [
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com',
  'wikipedia.org', 'twitter.com', 'instagram.com', 'linkedin.com',
  'reddit.com', 'netflix.com', 'tiktok.com', 'whatsapp.com'
];

let redisClient = null;
let redisAvailable = false;

function getRedisClient() {
  if (!redisClient) {
    try {
      redisClient = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            redisAvailable = false;
            return null;
          }
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true
      });
      redisClient.on('connect', () => { redisAvailable = true; });
      redisClient.on('error', (err) => {
        redisAvailable = false;
        console.error('[Cache] Redis error:', err.message);
      });
      redisClient.on('close', () => { redisAvailable = false; });
    } catch (err) {
      redisAvailable = false;
      console.error('[Cache] Failed to create Redis client:', err.message);
    }
  }
  return redisClient;
}

const localCache = new Map();

function buildKey(domain) {
  return `analysis:v1:${domain}`;
}

async function getCachedAnalysis(domain) {
  const redis = getRedisClient();
  if (redisAvailable && redis) {
    try {
      const data = await redis.get(buildKey(domain));
      if (data) return JSON.parse(data);
    } catch (err) {
      console.error('[Cache] Redis get error:', err.message);
    }
  }
  if (localCache.has(domain)) {
    const entry = localCache.get(domain);
    if (Date.now() - entry.timestamp < entry.ttl * 1000) {
      return entry.data;
    }
    localCache.delete(domain);
  }
  return null;
}

async function setCachedAnalysis(domain, data, customTtl) {
  const isPopular = POPULAR_DOMAINS.includes(domain);
  const ttl = customTtl || (isPopular ? POPULAR_TTL : DEFAULT_TTL);

  localCache.set(domain, { data, timestamp: Date.now(), ttl });

  const redis = getRedisClient();
  if (redisAvailable && redis) {
    try {
      await redis.setex(buildKey(domain), ttl, JSON.stringify(data));
    } catch (err) {
      console.error('[Cache] Redis set error:', err.message);
    }
  }
}

async function invalidateCache(domain) {
  localCache.delete(domain);
  const redis = getRedisClient();
  if (redisAvailable && redis) {
    try {
      await redis.del(buildKey(domain));
    } catch (err) {
      console.error('[Cache] Redis del error:', err.message);
    }
  }
}

async function getCacheStats() {
  const redis = getRedisClient();
  let redisKeys = 0;
  if (redisAvailable && redis) {
    try {
      redisKeys = await redis.dbsize();
    } catch {}
  }
  return {
    redisAvailable,
    localCacheSize: localCache.size,
    redisKeys
  };
}

module.exports = {
  getCachedAnalysis,
  setCachedAnalysis,
  invalidateCache,
  getCacheStats
};
