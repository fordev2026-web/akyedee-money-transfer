# Railway Deployment Guide for Akyedee Money Transfer Backend

## 🚄 Deploy to Railway

### 1. Prerequisites
- Railway account: [Sign up at railway.app](https://railway.app)
- GitHub repository with your code
- Railway CLI (optional): `npm install -g @railway/cli`

### 2. Deployment Steps

#### Option A: GitHub Integration (Recommended)
1. **Connect GitHub**: Go to [railway.app](https://railway.app) and connect your GitHub account
2. **Create New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your `rork-akyedee-money-transfer2.2-main` repository
4. **Configure Build**: Railway will auto-detect the Dockerfile and build settings
5. **Deploy**: Click deploy and wait for the build to complete

#### Option B: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 3. Environment Variables
After deployment, add these environment variables in Railway dashboard:

- `NODE_ENV`: `production`
- `PORT`: `3000` (Railway will auto-assign this)
- Add any other environment variables your backend needs

### 4. Update Your App Configuration
After successful deployment, you'll get a Railway URL like:
`https://your-app-name.railway.app`

Update your `.env` file:
```env
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-app-name.railway.app
```

### 5. Test Your Deployment
Visit your Railway URL to test:
- Base URL: `https://your-app-name.railway.app`
- API Status: `https://your-app-name.railway.app/api/trpc`

### 6. Automatic Deployments
Railway will automatically redeploy when you push to your main branch.

## 📁 Files Created for Railway Deployment
- `Dockerfile` - Container configuration
- `railway.json` - Railway-specific settings
- `backend/index.ts` - Production entry point
- `tsconfig.backend.json` - Backend TypeScript config
- Updated `package.json` with build scripts

## 🔧 Build Process
1. Railway detects the Dockerfile
2. Installs dependencies with `npm ci`
3. Builds TypeScript with `tsc`
4. Starts the server with `node dist/backend/index.js`

## 🎯 Next Steps After Deployment
1. Test all API endpoints
2. Monitor logs in Railway dashboard
3. Set up custom domain (optional)
4. Configure database connection (next phase)
5. Update mobile app to use production API