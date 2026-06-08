# NearFac Startup — ColdReach MVP

**Automated cold email outreach for F-1 students and tech internship seekers.**

---

## Project Structure

```
nfac_startup/
├── frontend/          # Next.js 14 app (Vercel deployment)
├── backend/           # Node.js/Express + TypeScript (Railway deployment)
├── database/          # Supabase PostgreSQL schema + migrations
├── docs/              # Documentation
├── scripts/           # Utility scripts
└── README.md          # This file
```

## Quick Start

**See `docs/SETUP-GUIDE.md` for complete setup instructions.**

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- Git + GitHub account
- API keys: Anthropic, OpenAI, Apollo.io, Resend

### Setup (6 hours)
1. Follow `docs/SETUP-GUIDE.md` step-by-step
2. Create Supabase database (schema in `database/schema.sql`)
3. Deploy backend to Railway
4. Deploy frontend to Vercel
5. Test with real users

## Key Files

- `docs/IMPLEMENTATION-PLAN.md` — Technical architecture
- `docs/SETUP-GUIDE.md` — Step-by-step deployment
- `docs/MVP-CHECKLIST.md` — Launch checklist
- `database/schema.sql` — Supabase database schema
- `backend/` — Express server + services
- `frontend/` — Next.js app

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, TailwindCSS
- **Backend:** Express, Node.js, TypeScript
- **Database:** Supabase (PostgreSQL + pgvector)
- **Auth:** Supabase Auth + JWT
- **Email Enrichment:** Apollo.io
- **Email Generation:** Anthropic Claude
- **Email Sending:** Resend
- **Deployment:** Vercel (frontend) + Railway (backend)

## MVP Scope

✅ User signup/login  
✅ CV upload + location/role selection  
✅ Lead finding via Apollo.io  
✅ Email generation via Claude  
✅ Email sending via Resend  
✅ CSV export  

❌ Email tracking (add post-launch)  
❌ Analytics dashboard (add post-launch)  
❌ Advanced personalization (add post-launch)  

## Status

- [x] Product validation (5 F-1 students confirmed)
- [x] Architecture designed
- [x] Code written
- [ ] Database schema created
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] User testing
- [ ] Iterations & improvements

## Next Steps

1. Create Supabase tables (see `database/schema.sql`)
2. Set up backend (see `docs/SETUP-GUIDE.md` Part 3)
3. Set up frontend (see `docs/SETUP-GUIDE.md` Part 4)
4. Deploy (see `docs/SETUP-GUIDE.md` Part 5)
5. Test with users (see `docs/MVP-CHECKLIST.md`)

---

**Last updated:** 2026-06-08  
**Status:** MVP - Ready to deploy
