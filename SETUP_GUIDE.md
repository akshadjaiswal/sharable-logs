# LogShare Setup Guide

This guide will walk you through setting up LogShare from scratch, including Supabase configuration, environment setup, and testing.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher installed
- npm or yarn package manager
- A Supabase account (free tier works)
- Git installed
- Code editor (VS Code recommended)

## Step-by-Step Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd sharable-logs

# Navigate to app directory
cd app

# Install dependencies
npm install
```

Expected output: `added XXX packages` without errors.

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: `logshare` (or your preference)
   - **Database Password**: Save this securely
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait for project to initialize (~2 minutes)

### Step 3: Get Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** tab
3. Copy these values:
   - **Project URL** (under "Configuration")
   - **anon public** key (under "Project API keys")

### Step 4: Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Open `app/lib/supabase/schema.sql` in your code editor
4. Copy the **entire contents**
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

Expected result: "Success. No rows returned"

#### Verify Tables Created

1. Go to **Table Editor** in Supabase Dashboard
2. You should see two tables:
   - `logs` (with columns: id, content, metadata, detected_context, etc.)
   - `comments` (with columns: id, log_id, line_number, content, etc.)

### Step 5: Configure Environment Variables

```bash
# In app directory
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual credentials from Step 3.

### Step 6: Start Development Server

```bash
# Make sure you're in the app directory
npm run dev
```

Expected output:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

### Step 7: Test the Application

#### Test Landing Page

1. Open browser to [http://localhost:3000](http://localhost:3000)
2. You should see:
   - Hero section with "Share Terminal Logs Beautifully"
   - How It Works section with 3 steps
   - Features section with 6 cards
   - Header and Footer

#### Test API - Create Log

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/api/logs/create \
  -H "Content-Type: application/json" \
  -d '{
    "content": "npm run dev\nnext dev\n▲ Next.js 15.0.0\nLocal: http://localhost:3000\n✓ Ready in 2.1s"
  }'
```

Expected response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "http://localhost:3000/log/550e8400-...",
  "redacted": false
}
```

Copy the `id` value for next steps.

#### Test Log Viewer

1. Navigate to `http://localhost:3000/log/{your-log-id}`
2. You should see:
   - Syntax highlighted log content
   - Line numbers on the left
   - Metadata sidebar (context, date, views)
   - Share controls at top (Copy Link, Download)
3. Click any line number
4. Comment form should slide in from right

#### Test Comments

1. In the comment form, fill in:
   - **Name**: "Test User"
   - **Comment**: "This is a test comment"
2. Click "Post Comment"
3. Comment should appear below the line
4. Toast notification: "Comment added!"

#### Test Dashboard

1. Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. You should see your log in a card
3. Test filters:
   - Select context filter dropdown
   - Type in search box (debounced)
4. Test actions:
   - Hover over log card
   - Click "Copy Link" icon
   - Toast notification: "Link copied to clipboard!"

## Common Issues & Solutions

### Issue: "Connection refused" or "Failed to fetch"

**Solution**: Check if Supabase is accessible
```bash
# Test Supabase connection
curl https://your-project.supabase.co/rest/v1/
```

If this fails, check:
1. Supabase project URL is correct
2. Project is not paused (free tier pauses after inactivity)
3. Your internet connection

### Issue: "Table does not exist"

**Solution**: Database migration not run correctly

1. Go to Supabase Dashboard → Table Editor
2. If `logs` and `comments` tables are missing:
   - Go to SQL Editor
   - Re-run the schema.sql script
   - Check for errors in the output

### Issue: Syntax highlighting not working

**Solution**: Shiki may need to download language grammars

1. Check console for errors
2. Ensure `shiki` package is installed:
   ```bash
   npm list shiki
   ```
3. Reinstall if needed:
   ```bash
   npm install shiki
   ```

### Issue: Comments not appearing

**Solution**: Check RLS policies

1. In Supabase Dashboard, go to **Authentication → Policies**
2. Ensure these policies exist:
   - `public_read_logs` on `logs` table
   - `public_create_logs` on `logs` table
   - `public_read_comments` on `comments` table
   - `public_create_comments` on `comments` table

### Issue: Tailwind styles not applied

**Solution**: Restart dev server

```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Landing page loads with all sections
- [ ] Can create log via API (curl command)
- [ ] Log viewer displays syntax highlighted code
- [ ] Can click line numbers to open comment form
- [ ] Can add comments successfully
- [ ] Comments appear with correct author name
- [ ] Dashboard shows list of logs
- [ ] Context filter works
- [ ] Search filter works (try searching for "next")
- [ ] Can copy log link (toast notification appears)
- [ ] Can download log as .txt file
- [ ] Responsive design works (resize browser)
- [ ] No console errors

## Next Steps

Once everything is working:

1. **Customize Design**
   - Edit colors in `app/tailwind.config.js`
   - Modify fonts in `app/app/globals.css`

2. **Add More Features**
   - Implement authentication
   - Add private logs
   - Build Electron desktop app

3. **Deploy to Production**
   - See README.md deployment section
   - Use Vercel for hosting
   - Point to production Supabase

4. **Set Up Monitoring**
   - Add error tracking (Sentry)
   - Set up analytics
   - Monitor Supabase usage

## Getting Help

If you encounter issues not covered here:

1. Check `PROGRESS.md` for implementation details
2. Review API documentation in README.md
3. Check Supabase logs in Dashboard
4. Open an issue on GitHub

## Development Workflow

### Making Changes

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make your changes
# ...

# Test locally
npm run dev

# Build for production (test)
npm run build

# Commit and push
git add .
git commit -m "Add feature: my-feature"
git push origin feature/my-feature
```

### Code Style

- TypeScript strict mode enabled
- ESLint configured
- Prettier for formatting

Run linter:
```bash
npm run lint
```

### Database Changes

When modifying database schema:

1. Update `app/lib/supabase/schema.sql`
2. Update `app/lib/supabase/types.ts`
3. Run migration in Supabase SQL Editor
4. Test locally

## Performance Tips

### Development

- Use React DevTools to identify re-renders
- Check Network tab for slow API calls
- Use Lighthouse for performance metrics

### Production

- Enable Next.js image optimization
- Use CDN for static assets
- Implement caching headers
- Monitor Supabase query performance

## Security Notes

### Current Security (MVP)

- All logs are public (no authentication)
- RLS policies allow public read/write
- Sensitive data redacted automatically

### Production Security Recommendations

1. **Add Authentication**
   - Use Supabase Auth
   - Require sign-in for dashboard
   - Add user ownership to logs

2. **Update RLS Policies**
   - Restrict log creation to authenticated users
   - Allow only log owners to delete
   - Keep comments public or require auth

3. **Rate Limiting**
   - Implement rate limits on API
   - Use Supabase rate limiting features
   - Add CAPTCHA for public endpoints

4. **Input Validation**
   - Already using Zod for validation
   - Add additional sanitization
   - Validate file uploads (if added)

## Troubleshooting Commands

```bash
# Check Node version
node --version  # Should be 18+

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update all packages (careful!)
npm update

# Check TypeScript errors
npx tsc --noEmit

# Check for unused dependencies
npx depcheck
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com)

---

**Congratulations!** Your LogShare application should now be fully functional. If you have any questions, refer to the README.md or open an issue.
