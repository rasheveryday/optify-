# ColdReach MVP — Getting Started

**Status: Code is complete and pushed to GitHub. Ready for deployment.**

Repository: https://github.com/rasheveryday/optify-

---

## 🎉 What's Done

✅ **Backend (Node.js/Express/TypeScript)**
- Express server setup
- Auth routes (signup/login)
- Campaign management
- Apollo.io lead finder integration
- Claude AI email generation
- Resend email sending integration
- Supabase PostgreSQL client

✅ **Frontend (Next.js/React/TypeScript)**
- Landing page
- Signup/login pages
- Dashboard with 3-step workflow
- API client integration
- TailwindCSS styling

✅ **Database**
- Complete Supabase schema (7 tables + pgvector + indexes)
- Ready to paste into Supabase SQL Editor

✅ **Documentation**
- Implementation plan
- Setup guide
- MVP checklist

---

## 📋 Next Steps (3-4 hours to launch)

### Step 1: Create Infrastructure Accounts (15 min)

You need accounts from:
1. **Supabase** — Database
2. **Anthropic** — Claude API
3. **Apollo.io** — Lead finder
4. **Resend** — Email sending
5. **Vercel** — Frontend hosting
6. **Railway** — Backend hosting

See `docs/SETUP-GUIDE.md` Part 1 for detailed instructions.

### Step 2: Set Up Supabase Database (10 min)

1. Create Supabase project
2. Go to SQL Editor
3. Copy entire schema from `database/schema.sql`
4. Run the query
5. Verify all tables created

See `docs/SETUP-GUIDE.md` Part 2 for details.

### Step 3: Set Up Backend (30 min)

1. Copy `.env.example` to `.env` in `backend/` folder
2. Fill in all API keys (Anthropic, Apollo, Resend, Supabase)
3. Run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. Test: `curl http://localhost:3001/health`

See `docs/SETUP-GUIDE.md` Part 3 for details.

### Step 4: Set Up Frontend (30 min)

1. Copy `.env.example` to `.env.local` in `frontend/` folder
2. Fill in API URL + Supabase keys
3. Run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Test: Open http://localhost:3000

See `docs/SETUP-GUIDE.md` Part 4 for details.

### Step 5: Deploy to Production (30 min)

**Backend to Railway:**
1. Push code to GitHub (already done ✓)
2. Create new project on Railway
3. Connect GitHub repo
4. Add environment variables from `.env`
5. Deploy

**Frontend to Vercel:**
1. Import project on Vercel
2. Connect GitHub repo
3. Add environment variables (with production Railway URL)
4. Deploy

See `docs/SETUP-GUIDE.md` Part 5 for details.

### Step 6: Test with Real Users (1-2 hours)

1. Send link to 5 F-1 students
2. Have them:
   - Sign up
   - Upload CV
   - Select location + role
   - Click "Find Leads"
   - Preview emails
   - Send or export
3. Collect feedback
4. Iterate based on feedback

See `docs/MVP-CHECKLIST.md` for testing checklist.

---

## 📁 Project Structure

```
nfac_startup/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express setup
│   │   ├── routes/
│   │   │   ├── auth.ts            # Signup/login
│   │   │   └── campaigns.ts       # Main workflow
│   │   └── services/
│   │       ├── apollo.ts          # Lead finder
│   │       ├── claude.ts          # Email generator
│   │       └── resend.ts          # Email sender
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example               # Template
│   └── .env                       # You'll create this
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Landing
│   │   ├── signup/page.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx     # Main app
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── .env.example               # Template
│   └── .env.local                 # You'll create this
│
├── database/
│   └── schema.sql                 # Ready to paste into Supabase
│
├── docs/
│   ├── IMPLEMENTATION-PLAN.md
│   ├── SETUP-GUIDE.md
│   └── MVP-CHECKLIST.md
│
├── README.md
└── GETTING-STARTED.md             # This file
```

---

## 🚀 Quick Command Reference

### Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:3001

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Environment Variables

**Backend (.env):**
```
JWT_SECRET=random-key
ANTHROPIC_API_KEY=sk-ant-...
APOLLO_IO_API_KEY=...
RESEND_API_KEY=...
SUPABASE_URL=...
SUPABASE_KEY=...
FRONTEND_URL=http://localhost:3000
PORT=3001
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Deployment

```bash
# Backend: Railway
# 1. Push to GitHub (git push)
# 2. Create project on Railway
# 3. Connect GitHub repo
# 4. Add environment variables
# 5. Railway auto-deploys

# Frontend: Vercel
# 1. Push to GitHub (git push)
# 2. Import project on Vercel
# 3. Connect GitHub repo
# 4. Add environment variables
# 5. Vercel auto-deploys
```

---

## 🎯 Success Criteria

✅ User can sign up + log in  
✅ User can upload CV + select location/role  
✅ System finds ~50 leads (Apollo)  
✅ System generates 50 personalized emails (Claude)  
✅ User can send emails (Resend) or export CSV  
✅ Email status tracked  
✅ Deployed to production  
✅ 5 F-1 students tested successfully  

---

## 🆘 If You Get Stuck

1. **Check logs:**
   - Backend: `npm run dev` output
   - Frontend: Browser console (F12)
   - Database: Supabase "Logs" tab

2. **Check environment variables:**
   - Are they filled in?
   - Are there copy-paste errors or extra spaces?

3. **Check API connections:**
   - Can you manually test Apollo.io API?
   - Are Anthropic/OpenAI keys valid?

4. **Refer to docs:**
   - `docs/SETUP-GUIDE.md` — Step-by-step
   - `docs/IMPLEMENTATION-PLAN.md` — Architecture
   - `docs/MVP-CHECKLIST.md` — Verification checklist

---

## 📞 Support

If you hit a blocker:
1. Check the error message carefully
2. Check the relevant docs section
3. Check backend/frontend logs
4. Try restarting (npm run dev)
5. Verify environment variables

---

## 🎬 Ready to Launch?

**Timeline:**
- Accounts setup: 15 min
- Database: 10 min
- Backend: 30 min
- Frontend: 30 min
- Deploy: 30 min
- Testing: 1-2 hours

**Total: 3-4 hours to live with real users.**

Start with Step 1 in `docs/SETUP-GUIDE.md`.

**You've got this. Let's ship it.** 🚀
