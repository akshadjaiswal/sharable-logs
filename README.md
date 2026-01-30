# LogShare - Share Terminal Logs Beautifully (In-Progress)

LogShare is a modern web application for sharing terminal logs with beautiful formatting, syntax highlighting, and collaborative features. Built for developers who value beautiful tools.


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
---

**LogShare** - Share terminal logs beautifully. Made with ❤️ for developers.
<div align="center">

**Made with ❤️ by Akshad Jaiswal**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/akshadjaiswal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/akshadsantoshjaiswal)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/akshad_999)

</div>
