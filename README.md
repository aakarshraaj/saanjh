
# Saanjh — Minimalist Cultural Brand Website

A minimalist twilight-themed website for the Saanjh cultural brand. Features bilingual support (English/Hindi), interactive visual effects, and a poetic design aesthetic.

## Features

- 🌅 Minimalist twilight/evening theme
- 🌐 Bilingual support (English/Hindi)
- ✨ Interactive features: click-based color shifts, ripple effects
- 🎨 Visual enhancements: ambient lights, horizon line, paper texture, dynamic grain
- 📱 Responsive design with reduced motion support
- 🔢 Global visitor counter (requires Vercel KV setup)

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Setting up Global Visitor Counter (Optional)

For a true global visitor counter that works across all browsers:

1. **Add Upstash Redis through Vercel Marketplace:**
   - Go to your Vercel project dashboard
   - Navigate to **Storage** → **Browse Storage**
   - Click on **Upstash** → **Create Database**
   - Select **Redis** (free tier available)
   - Create the database

2. **Link to Project:**
   - The database will automatically be linked to your project
   - Environment variables (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`) are set automatically

3. **Deploy:**
   - The API route at `/api/visitor-count.ts` will use Upstash Redis automatically
   - If Upstash isn't set up, it falls back to in-memory counter (resets on cold starts)

**Note:** Without Upstash Redis, the counter uses in-memory storage which resets when the serverless function restarts. For persistent global counting, Upstash Redis is recommended (free tier available).

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Vercel Serverless Functions (for visitor counter)
