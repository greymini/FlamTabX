# Deployment Guide

This project can be deployed to several free hosting services. Here are the easiest options:

## Option 1: Vercel (Recommended - Easiest)

### Method A: Using Vercel CLI (Quickest)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Deploy from your project directory:
   ```bash
   cd /Users/phoenix/Downloads/flamtabx-building-resilience-main
   vercel
   ```

3. Follow the prompts:
   - Login to Vercel (or create account)
   - Link to existing project or create new
   - Confirm settings (defaults work fine)

4. Your site will be live at a URL like: `https://FlamTabX.vercel.app`

### Method B: Using Vercel Website (No CLI needed)

1. Go to [vercel.com](https://vercel.com) and sign up/login (free with GitHub/GitLab/Bitbucket)

2. Click "Add New Project"

3. Import your Git repository:
   - If you have a GitHub repo, connect it
   - Or drag and drop your project folder

4. Vercel will auto-detect Vite settings
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Click "Deploy" - your site will be live in minutes!

## Option 2: Netlify

### Method A: Using Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd /Users/phoenix/Downloads/flamtabx-building-resilience-main
   netlify deploy --prod
   ```

### Method B: Using Netlify Website

1. Go to [netlify.com](https://netlify.com) and sign up/login

2. Drag and drop your `dist` folder (after running `npm run build`) to Netlify's deploy area

3. Or connect your Git repository for automatic deployments

## Option 3: Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)

2. Sign up/login (free)

3. Connect your Git repository or upload the `dist` folder

4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`

## Option 4: GitHub Pages

1. Push your code to a GitHub repository

2. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json` scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Quick Deploy Commands

If you want to deploy right now using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd /Users/phoenix/Downloads/flamtabx-building-resilience-main

# Deploy
vercel
```

## Notes

- All these services offer free tiers that are perfect for personal projects
- Vercel and Netlify offer automatic deployments when you push to Git
- Your site will get a free subdomain (e.g., `your-project.vercel.app`)
- You can add a custom domain later if needed
