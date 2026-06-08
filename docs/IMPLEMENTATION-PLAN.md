# ColdReach MVP — Implementation Plan

## Overview
- **Frontend:** Next.js 14 with App Router, TailwindCSS
- **Backend:** Node.js with Express, TypeScript
- **Database:** Supabase (PostgreSQL with pgvector)
- **Auth:** Supabase Auth (email/password) + JWT
- **Email Enrichment:** Apollo.io API
- **AI Pipeline:** Anthropic Claude (Haiku for parsing, Sonnet for copy)
- **Email Sending:** Resend API
- **Deployment:** Vercel (frontend) + Railway (backend)

---

## Database Schema (PostgreSQL + pgvector)

See `database/schema.sql` for complete schema.

**Tables:**
- `users` — User accounts
- `campaigns` — Outreach campaigns
- `leads` — Found hiring managers/tech leads
- `generated_emails` — Personalized cold emails
- `email_sends` — Tracking email delivery
- `embeddings` — Vector embeddings for RAG (pgvector)

---

## API Endpoints (Backend)

### Authentication
- `POST /auth/signup` — Register user
- `POST /auth/login` — Login user
- `GET /auth/me` — Get current user

### Campaigns
- `POST /campaigns` — Create campaign
- `GET /campaigns` — List user's campaigns
- `POST /campaigns/:id/find-leads` — Find leads via Apollo
- `POST /campaigns/:id/generate-emails` — Generate cold emails
- `POST /campaigns/:id/send-emails` — Send emails via Resend
- `GET /campaigns/:id/sends` — Get email status

### Exports
- `GET /campaigns/:id/export-csv` — Export leads + emails as CSV

---

## Core Workflow

1. **User uploads CV** → `POST /campaigns`
2. **Find leads via Apollo** → `POST /campaigns/:id/find-leads` (returns ~50 leads)
3. **Generate emails via Claude** → `POST /campaigns/:id/generate-emails`
4. **Send or export** → `POST /campaigns/:id/send-emails` OR `GET /campaigns/:id/export-csv`
5. **Track responses** → `GET /campaigns/:id/sends`

---

## Tech Stack Details

### Frontend (Next.js)
- Next.js 14 with App Router
- TypeScript
- TailwindCSS
- React Hook Form for forms
- Supabase Auth client
- Axios for HTTP

### Backend (Node.js)
- Express.js
- TypeScript
- jsonwebtoken (JWT)
- bcrypt (password hashing)
- @anthropic-ai/sdk
- openai (embeddings)
- axios (Apollo API)
- resend (email sending)
- @supabase/supabase-js

### Deployment
- **Frontend:** Vercel (auto-deploys from GitHub)
- **Backend:** Railway.app (Node.js, PostgreSQL-friendly)
- **Database:** Supabase (PostgreSQL, pgvector, free tier)

---

## File Structure

```
nfac_startup/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── signup/page.tsx       # Signup
│   │   ├── login/page.tsx        # Login
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard
│   │   └── layout.tsx
│   ├── components/               # Reusable components
│   ├── lib/                       # Utilities (API client, auth)
│   ├── .env.local                # Environment variables
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── server.ts             # Express setup
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── campaigns.ts
│   │   │   └── emails.ts
│   │   ├── services/
│   │   │   ├── apollo.ts         # Lead finder
│   │   │   ├── claude.ts         # Email generator
│   │   │   ├── resend.ts         # Email sender
│   │   │   └── rag.ts            # Vector search
│   │   └── types.ts
│   ├── .env                       # API keys
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── schema.sql                # Full schema
│   └── migrations/               # Future migrations
│
├── docs/
│   ├── IMPLEMENTATION-PLAN.md    # This file
│   ├── SETUP-GUIDE.md
│   ├── MVP-CHECKLIST.md
│   └── DESIGN-DOC.md
│
└── README.md
```

---

## Success Criteria for MVP

✅ User can sign up + login  
✅ User uploads CV + selects location/role  
✅ System finds ~50 leads (Apollo)  
✅ System generates 50 personalized emails (Claude)  
✅ User can send emails (Resend) or export CSV  
✅ Email delivery status tracked  
✅ Deployed to production (Vercel + Railway)  
✅ 5 F-1 students test successfully  
✅ At least 1 user gets positive back-outreach  

---

## Timeline

- **Setup:** 30 min (accounts, API keys)
- **Database:** 10 min (create Supabase tables)
- **Backend:** 45 min (copy code, test locally)
- **Frontend:** 45 min (create pages, test locally)
- **Deployment:** 30 min (Vercel + Railway)
- **Testing:** 1-2 hours (with real users)

**Total: 3-4 hours to launch**

---

## Known Constraints / Deferred

**Not in MVP (add post-launch):**
- Email warm-up strategy
- Advanced analytics dashboard
- A/B testing
- Scheduled sends
- Template library
- Multi-user accounts / teams
- Custom domain for email sending

**In MVP:**
- Core workflow (upload → find → generate → send)
- CSV export
- Basic email tracking (status only)

---

## Next: Database Schema

See `database/schema.sql` and follow `docs/SETUP-GUIDE.md` to create tables.
