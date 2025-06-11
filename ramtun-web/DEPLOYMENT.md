# 🚀 Ramtun - Deployment Guide

## 📋 Netlify Deployment Instructions

### Prerequisites
- GitHub repository with Ramtun code
- Netlify account
- Supabase project (optional - app works in demo mode)
- OpenAI API key (optional - app works in demo mode)

### 1. Connect Repository to Netlify

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select the `ai-ramtun-app` repository
5. Configure build settings:
   - **Base directory**: `ramtun-web`
   - **Build command**: `npm run build`
   - **Publish directory**: `out`

### 2. Environment Variables

Set these environment variables in Netlify dashboard (Site settings > Environment variables):

#### Required for Full Functionality:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Optional (App works in demo mode without these):
```
OPENAI_API_KEY=your-openai-api-key
NEXT_TELEMETRY_DISABLED=1
```

### 3. Build Configuration

The project includes a `netlify.toml` file with optimized settings:
- Static export configuration
- Security headers
- Caching rules
- Redirect rules for SPA routing

### 4. Demo Mode

🎭 **Important**: Ramtun works perfectly in demo mode without any API keys!

- **Without Supabase**: Authentication shows demo messages, all features accessible
- **Without OpenAI**: Crossword generator uses intelligent demo data
- **Full Demo Experience**: Users can explore all functionality

### 5. Deployment Process

1. Push code to GitHub
2. Netlify automatically builds and deploys
3. Site will be available at: `https://your-site-name.netlify.app`

### 6. Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS records as instructed

### 7. Performance Optimizations

The deployment includes:
- ✅ Static export for fast loading
- ✅ Image optimization disabled for compatibility
- ✅ Aggressive caching for static assets
- ✅ Security headers
- ✅ Gzip compression

### 8. Monitoring

Monitor your deployment:
- Netlify dashboard for build logs
- Site analytics in Netlify
- Error tracking in browser console

## 🔧 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check build logs in Netlify dashboard

### Site Not Loading
- Verify publish directory is set to `out`
- Check redirect rules in netlify.toml
- Ensure base directory is `ramtun-web`

### Features Not Working
- Check environment variables are set correctly
- Verify Supabase configuration
- Test in demo mode first

## 📞 Support

For deployment issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Contact support if needed

---

**Ready to deploy!** 🚀 Your Ramtun app will be live in minutes!
