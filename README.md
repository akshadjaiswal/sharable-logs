# LogShare - Share Terminal Logs Beautifully

LogShare is a modern web application for sharing terminal logs with beautiful formatting, syntax highlighting, and collaborative features. Built for developers who value beautiful tools.

![LogShare Preview](https://via.placeholder.com/1200x600/FAFAF8/1A1A1A?text=LogShare)

## Features

- ✨ **Syntax Highlighting** - Beautiful code formatting with 25+ language support
- 🔒 **Auto Redaction** - Automatically removes API keys, tokens, and sensitive data
- 💬 **Line Comments** - Collaborate with team members on specific lines
- 🔍 **Smart Search** - Full-text search with context filtering
- 📊 **Dashboard** - Browse all logs with filters and pagination
- 🎨 **Beautiful Design** - Serif editorial design system with warm colors
- 🚀 **Fast** - Server-side rendering with Next.js 16
- ♿ **Accessible** - WCAG AA compliant

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom design tokens
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Syntax Highlighting**: Shiki
- **Icons**: Lucide React

## Project Structure

```
sharable-logs/
├── app/                          # Next.js app directory
│   ├── app/                      # App Router pages
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── log/[id]/page.tsx    # Log viewer
│   │   ├── dashboard/page.tsx   # Dashboard
│   │   └── api/                 # API routes
│   ├── components/              # React components
│   │   ├── ui/                  # Design system
│   │   ├── landing/             # Landing page
│   │   ├── log-viewer/          # Log viewer
│   │   ├── dashboard/           # Dashboard
│   │   └── layout/              # Header, Footer
│   ├── lib/                     # Utilities
│   │   ├── supabase/            # Database services
│   │   ├── stores/              # Zustand stores
│   │   └── hooks/               # Custom hooks
│   └── globals.css              # Global styles
├── electron-app/                # Desktop app (Phase 8)
├── PROGRESS.md                  # Implementation progress
└── README.md                    # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account with a project created
- macOS (for desktop app, optional)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sharable-logs
```

### 2. Install Dependencies

```bash
cd app
npm install
```

### 3. Set Up Supabase

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

#### Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `app/lib/supabase/schema.sql`
3. Paste and execute to create tables

#### Configure Environment Variables

```bash
cd app
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Log (via API)

```bash
curl -X POST http://localhost:3000/api/logs/create \
  -H "Content-Type: application/json" \
  -d '{
    "content": "npm run dev\nnext dev\n▲ Next.js 15.0.0\n✓ Ready in 2.1s"
  }'
```

Response:
```json
{
  "id": "abc123-...",
  "url": "http://localhost:3000/log/abc123-...",
  "redacted": false
}
```

### Viewing a Log

Navigate to `/log/{id}` to view:
- Syntax highlighted code
- Metadata sidebar (context, date, views)
- Share controls (copy link, download)
- Line-by-line comments

### Browsing Logs

Navigate to `/dashboard` to:
- View all logs in a grid
- Filter by context (Next.js, Python, etc.)
- Search by content
- Load more with pagination

### Adding Comments

1. Click any line number in the log viewer
2. Fill in your name and comment
3. Submit to add your comment
4. Reply to existing comments

## API Reference

### POST /api/logs/create

Create a new log.

**Request:**
```json
{
  "content": "string (required)",
  "metadata": {
    "terminal": "string (optional)",
    "os": "string (optional)"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "string",
  "redacted": boolean
}
```

### GET /api/logs/[id]

Get a specific log.

**Response:**
```json
{
  "id": "uuid",
  "content": "string",
  "detected_context": "string",
  "created_at": "timestamp",
  "view_count": number,
  "redacted": boolean,
  "metadata": object
}
```

### GET /api/logs/list

List logs with pagination and filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (1-100, default: 20)
- `context` (string): Filter by detected context
- `search` (string): Full-text search

**Response:**
```json
{
  "logs": [...],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/comments

Create a comment on a log.

**Request:**
```json
{
  "logId": "uuid (required)",
  "lineNumber": number (required),
  "content": "string (required)",
  "authorName": "string (required)",
  "authorEmail": "string (optional)",
  "parentId": "uuid (optional, for replies)"
}
```

### GET /api/comments?logId={id}

Get all comments for a log.

**Response:**
```json
{
  "comments": [
    {
      "id": "uuid",
      "line_number": number,
      "content": "string",
      "author_name": "string",
      "created_at": "timestamp",
      "replies": [...]
    }
  ]
}
```

## Design System

LogShare uses a Serif editorial design system with:

### Colors
- Background: `#FAFAF8` (warm ivory)
- Foreground: `#1A1A1A` (rich black)
- Accent: `#B8860B` (burnished gold)
- Muted: `#F5F3F0` (secondary surfaces)
- Border: `#E8E4DF` (warm gray)

### Typography
- **Display**: Playfair Display (headlines)
- **Body**: Source Sans 3 (paragraphs)
- **Mono**: IBM Plex Mono (code)

### Principles
- Serif headlines for major headings
- Thin horizontal rules (1px)
- Small caps labels with wide tracking
- Generous whitespace (py-32 sections)
- Subtle shadows and refined interactions

## Development

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-prod-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Future Features (Roadmap)

- [ ] Desktop app (Electron menubar for macOS)
- [ ] Authentication (user accounts)
- [ ] Private logs
- [ ] Team workspaces
- [ ] Log expiration
- [ ] Slack integration
- [ ] API rate limiting
- [ ] Log analytics

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: [Report bugs](https://github.com/your-repo/issues)
- Documentation: [Full docs](https://your-docs-url.com)
- Email: support@logshare.app

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Shiki](https://shiki.matsu.io)
- [Lucide Icons](https://lucide.dev)

---

**LogShare** - Share terminal logs beautifully. Made with ❤️ for developers.
