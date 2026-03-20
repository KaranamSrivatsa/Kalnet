# Deployment Guide

## Deploy to Vercel (Recommended)

### Step 1: Prepare Your Repository

1. Create a new GitHub repository
2. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/explain-my-plan.git
git push -u origin main
```

### Step 2: Set Up Groq API (Free)

1. Go to [https://console.groq.com](https://console.groq.com)
2. Create a free account
3. Generate an API key
4. Copy the API key for later use

### Step 3: Set Up Firebase (Optional but Recommended)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (select Spark plan - it's free)
3. Enable Firestore Database
4. Go to Project Settings > General
5. Copy the Firebase config values

### Step 4: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure Environment Variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID

6. Click "Deploy"

### Step 5: Verify Deployment

1. Wait for the build to complete
2. Click on the deployed URL
3. Test the application with sample inputs

## Alternative: Deploy Frontend Only (Static Export)

If you only want to deploy the frontend without the API:

1. Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

2. Build the project:

```bash
npm run build
```

3. Deploy the `dist` folder to any static hosting service (Netlify, GitHub Pages, etc.)

**Note**: With static export, the API won't work. You'll need to either:
- Use a separate backend service
- Use client-side AI directly (not recommended for API keys)

## Free Tier Limits

### Groq API
- 1,000,000 tokens per day
- 20 requests per minute
- Perfect for development and small-scale usage

### Firebase (Spark Plan)
- 50,000 reads per day
- 20,000 writes per day
- 1GB storage
- Includes localStorage fallback in the app

### Vercel (Hobby Plan)
- 100GB bandwidth per month
- 6,000 execution hours per month
- Perfect for personal projects

## Troubleshooting

### Build Fails
1. Check that all dependencies are installed: `npm install`
2. Verify environment variables are set correctly
3. Check the build logs for specific errors

### API Not Working
1. Verify `GROQ_API_KEY` is set in Vercel dashboard
2. Check that the API key is valid in Groq console
3. Verify you're not exceeding rate limits

### Firebase Not Connecting
1. Check Firebase config values are correct
2. Verify Firestore database is created
3. Check Firestore security rules allow read/write
4. The app will fallback to localStorage if Firebase fails

## Updating Your Deployment

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy your application.
