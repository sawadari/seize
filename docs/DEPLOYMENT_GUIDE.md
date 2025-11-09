# Deployment Guide - Claude Code Detail Control Documentation

This guide explains how to deploy the documentation site to Vercel.

---

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally (optional but recommended)
   ```bash
   npm install -g vercel
   ```

---

## Deployment Options

### Option 1: Deploy via Vercel CLI (Recommended)

#### Step 1: Login to Vercel

```bash
vercel login
```

#### Step 2: Deploy from Project Root

```bash
# Navigate to project root
cd /devb/seize

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? claude-code-detail-control-docs
# - Directory? ./
# - Override settings? No
```

#### Step 3: Deploy to Production

```bash
vercel --prod
```

Your site will be available at:
```
https://claude-code-detail-control-docs.vercel.app
```

Or your custom domain if configured.

---

### Option 2: Deploy via Vercel GitHub Integration

#### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Add Claude Code detail control documentation"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/SEIZE.git
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `SEIZE` repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: `docs`
5. Click "Deploy"

#### Step 3: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

### Option 3: Deploy via Vercel Dashboard (Manual)

#### Step 1: Prepare Deployment Package

```bash
# Create a deployment package
cd /devb/seize
zip -r docs-deployment.zip docs/ vercel.json
```

#### Step 2: Upload to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "Import Third-Party Git Repository" or "Deploy from Template"
4. Upload the `docs-deployment.zip` file
5. Configure settings (if prompted)
6. Click "Deploy"

---

## Configuration

### vercel.json

The project includes a `vercel.json` configuration file:

```json
{
  "version": 2,
  "name": "claude-code-detail-control-docs",
  "builds": [
    {
      "src": "docs/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/docs/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/docs/$1"
    }
  ],
  "public": true
}
```

This configuration:
- Serves the `docs/` directory as static files
- Routes root `/` to `docs/index.html`
- Enables public access

---

## Post-Deployment

### Verify Deployment

1. Visit your deployment URL
2. Check these pages load correctly:
   - `/` (index.html)
   - `/index.md` (documentation home)
   - `/guides/controlling-detail-levels.md`
   - `/examples/detail-control-examples.md`

### Update Links

If using a custom domain, update links in:
- `README.md`
- `docs/index.md`
- `docs/README.md`

---

## Continuous Deployment

### Automatic Deployments (with GitHub Integration)

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run deployment checks

### Manual Updates

```bash
# Make changes to documentation
vim docs/guides/controlling-detail-levels.md

# Deploy updated version
vercel --prod
```

---

## Environment Variables (if needed)

If your docs require environment variables:

```bash
# Set via CLI
vercel env add VARIABLE_NAME

# Or in Vercel Dashboard
# Project Settings → Environment Variables
```

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project Settings → Domains
2. Enter your domain (e.g., `docs.yourdomain.com`)
3. Click "Add"

### Step 2: Configure DNS

Add these DNS records at your domain provider:

**For Apex Domain** (`yourdomain.com`):
```
Type: A
Name: @
Value: 76.76.21.21
```

**For Subdomain** (`docs.yourdomain.com`):
```
Type: CNAME
Name: docs
Value: cname.vercel-dns.com
```

### Step 3: Verify

Wait for DNS propagation (up to 48 hours, usually faster).
Vercel will automatically issue an SSL certificate.

---

## Troubleshooting

### Issue: 404 on Markdown Files

**Problem**: Markdown files return 404

**Solution**: Vercel serves static files as-is. Browsers won't render `.md` files.

**Options**:
1. Convert markdown to HTML (recommended for production)
2. Use a static site generator (e.g., Docusaurus, VitePress)
3. Keep HTML landing page and link to GitHub for markdown docs

### Issue: Routes Not Working

**Problem**: Routes redirect incorrectly

**Solution**: Verify `vercel.json` configuration:
```json
{
  "routes": [
    { "src": "/", "dest": "/docs/index.html" },
    { "src": "/(.*)", "dest": "/docs/$1" }
  ]
}
```

### Issue: Build Fails

**Problem**: Deployment build fails

**Solution**:
- Check `vercel.json` syntax
- Ensure `docs/` directory exists
- Verify file permissions

---

## Alternative: GitHub Pages

If you prefer GitHub Pages:

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Copy docs to root
cp -r docs/* .

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Enable GitHub Pages in repo settings
# Settings → Pages → Source: gh-pages branch
```

---

## Cost

Vercel Free Tier includes:
- Unlimited deployments
- Automatic SSL
- Global CDN
- 100GB bandwidth/month
- Perfect for documentation sites

For high-traffic sites, see [Vercel Pricing](https://vercel.com/pricing).

---

## Monitoring

### Analytics

Enable Vercel Analytics:
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View traffic insights in dashboard

### Logs

View deployment logs:
```bash
vercel logs [deployment-url]
```

Or in Vercel Dashboard → Deployments → [Select Deployment] → Logs

---

## Next Steps

1. **Deploy**: Choose a deployment method above
2. **Test**: Verify all pages load correctly
3. **Share**: Share the deployment URL
4. **Iterate**: Update docs and redeploy as needed

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Ready to deploy?** Start with [Option 1: Vercel CLI](#option-1-deploy-via-vercel-cli-recommended)
