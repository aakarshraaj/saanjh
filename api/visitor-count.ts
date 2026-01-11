import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory counter (resets on cold start, but works without database setup)
// For persistent storage, set up Upstash Redis through Vercel Marketplace
let visitorCount = 0;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // Try to use Upstash Redis/KV if available (requires setup in Vercel dashboard)
    // Check for various possible environment variable names that Vercel might provide
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 
                     process.env.KV_REST_API_URL || 
                     process.env.REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || 
                       process.env.KV_REST_API_TOKEN;
    
    let redis = null;
    if (redisUrl && redisToken) {
      try {
        const { Redis } = await import('@upstash/redis');
        // Create Redis client with explicit URL and token
        redis = new Redis({
          url: redisUrl,
          token: redisToken,
        });
      } catch (importError) {
        console.error('Failed to import or initialize Redis:', importError);
      }
    }
    
    if (redis) {
      // Use Upstash Redis for persistent storage
      if (request.method === 'POST') {
        const currentCount = (await redis.get('saanjh_visitor_count') as number) || 0;
        const newCount = currentCount + 1;
        await redis.set('saanjh_visitor_count', newCount);
        return response.status(200).json({ count: newCount });
      } else {
        const count = (await redis.get('saanjh_visitor_count') as number) || 0;
        return response.status(200).json({ count });
      }
    } else {
      // Fallback: in-memory counter (works without database setup)
      if (request.method === 'POST') {
        visitorCount += 1;
        return response.status(200).json({ count: visitorCount });
      } else {
        return response.status(200).json({ count: visitorCount || 1 });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    // Fallback: return current in-memory count or 1
    return response.status(200).json({ count: visitorCount || 1 });
  }
}
