# GW2 Quest Tracker - Deployment Guide

Complete guide to deploy your GW2 Quest Tracker application from scratch to production.

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Supabase account (free tier)
- Vercel account (free tier)

## Step 1: Local Setup

### 1.1 Install Dependencies

```bash
npm install
```

### 1.2 Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to Project Settings > API
4. Copy the following:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)
5. Go to Project Settings > Database
6. Copy the Connection String (URI format)

### 1.3 Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

3. Generate encryption keys:
```bash
# For ENCRYPTION_KEY
openssl rand -base64 32

# For CRON_SECRET
openssl rand -base64 32
```

Add them to your `.env.local`:
```env
ENCRYPTION_KEY=generated_key_here
CRON_SECRET=generated_secret_here
```

### 1.4 Set Up Database Schema

1. Open Supabase SQL Editor
2. Copy the entire content of `DATABASE_SCHEMA.sql`
3. Run the SQL in Supabase SQL Editor
4. Verify tables are created in the Table Editor

### 1.5 Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and test:
1. Register a new account
2. Add your GW2 API key in Settings
3. Sync characters
4. Create a test quest

## Step 2: Deploy to Vercel

### 2.1 Push to GitHub

1. Initialize Git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/yourusername/gw2-tracker.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: .next

5. Add Environment Variables:
   Click "Environment Variables" and add ALL variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `ENCRYPTION_KEY`
   - `CRON_SECRET`

6. Click "Deploy"

### 2.3 Configure Cron Jobs

After deployment:

1. Go to your Vercel project dashboard
2. Click "Settings" > "Cron Jobs"
3. Add two cron jobs:

**Daily Reset Job:**
- Path: `/api/cron/reset-daily`
- Schedule: `0 0 * * *` (Every day at 00:00 UTC)

**Weekly Reset Job:**
- Path: `/api/cron/reset-weekly`
- Schedule: `30 7 * * 1` (Every Monday at 07:30 UTC)

4. For each cron job, add the header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_CRON_SECRET` (use the same CRON_SECRET from env vars)

## Step 3: Post-Deployment

### 3.1 Test Production

1. Visit your Vercel URL (e.g., `your-app.vercel.app`)
2. Register a new account
3. Add GW2 API key
4. Sync characters
5. Create quests
6. Test all features

### 3.2 Set Up Custom Domain (Optional)

1. In Vercel, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### 3.3 Monitor Cron Jobs

1. Check Vercel logs to ensure cron jobs run successfully
2. Monitor database for quest resets

## Troubleshooting

### Build Errors

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "Database connection failed"**
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure IP is not blocked

### Runtime Errors

**"Not authenticated" errors**
- Check Supabase URL and keys
- Verify RLS policies are enabled
- Check cookies are enabled in browser

**Cron jobs not running**
- Verify `CRON_SECRET` matches in both env vars and cron job headers
- Check Vercel deployment logs
- Ensure cron job paths are correct

### API Key Issues

**"Invalid API key"**
- Verify `ENCRYPTION_KEY` is set correctly
- Ensure key hasn't been rotated
- Check GW2 API key permissions

## Maintenance

### Updating the App

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically redeploy.

### Database Migrations

When schema changes:
1. Update `DATABASE_SCHEMA.sql`
2. Run new migrations in Supabase SQL Editor
3. Update Drizzle schema (`src/lib/db/schema.ts`)
4. Test locally before deploying

### Backups

Supabase automatically backs up your database. To export:
1. Go to Supabase Dashboard
2. Database > Backups
3. Download latest backup

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate keys regularly** - Update encryption and cron secrets periodically
3. **Monitor Supabase logs** - Check for suspicious activity
4. **Use strong passwords** - Enforce in your user registration
5. **Keep dependencies updated** - Run `npm audit` and `npm update` regularly

## Cost Estimates (Free Tier Limits)

**Supabase Free Tier:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

**Vercel Free Tier:**
- 100 GB bandwidth
- 100 hours serverless function execution
- Unlimited deployments

Both tiers are sufficient for personal use and small communities (up to ~100 active users).

## Support

For issues:
1. Check application logs in Vercel
2. Check database logs in Supabase
3. Review this deployment guide
4. Check Next.js and Supabase documentation

## Next Steps

After successful deployment:
1. Share app URL with your guild
2. Create common quest templates
3. Use Export/Import to share quest lists
4. Monitor performance and user feedback
5. Consider adding features like analytics or social features

Congratulations! Your GW2 Quest Tracker is now live! 🎉
