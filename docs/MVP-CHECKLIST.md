# ColdReach MVP — Launch Checklist

**Timeline: 2-3 hours to deploy, then test with real users**

---

## ✅ Pre-Development (Done)

- [x] Validated problem with 5 F-1 students
- [x] Confirmed $15-20/month willingness to pay
- [x] Tested Apollo.io coverage
- [x] Watched customer workflow
- [x] Locked MVP scope
- [x] Approved architecture & tech stack

---

## 🏗️ Infrastructure Setup (30 min)

- [ ] Create Supabase account + get API keys
- [ ] Create Anthropic account + get API key
- [ ] Create Apollo.io account + get API key
- [ ] Create Resend account + get API key
- [ ] Create GitHub account + 2 repos
- [ ] Create Vercel account
- [ ] Create Railway account

**Checklist:** All accounts created, API keys saved

---

## 📦 Backend Setup (45 min)

- [ ] Clone `coldreach-backend` repo
- [ ] Run `npm install`
- [ ] Create `src/` directory
- [ ] Copy backend files (server.ts, routes/, services/)
- [ ] Create `.env` file with API keys
- [ ] Run `npm run dev` → verify server starts
- [ ] Test `GET /health` endpoint

**Checklist:** Backend runs locally without errors

---

## 🗄️ Database Setup (10 min)

- [ ] Open Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Paste entire schema from `database/schema.sql`
- [ ] Run query → verify tables created
- [ ] Go to Table Editor → verify all 7 tables exist

**Checklist:** Database has all tables: users, campaigns, leads, generated_emails, email_sends, embeddings, audit_log

---

## 🎨 Frontend Setup (45 min)

- [ ] Clone `coldreach-frontend` repo
- [ ] Run `npx create-next-app@latest . --typescript --tailwind`
- [ ] Run `npm install` (additional deps)
- [ ] Create `.env.local` with API keys
- [ ] Create pages (landing, signup, login, dashboard)
- [ ] Create components (forms, displays)
- [ ] Run `npm run dev` → verify frontend starts
- [ ] Test signup/login flow

**Checklist:** Frontend runs locally, auth flow works

---

## 🧪 Local Testing (30 min)

- [ ] Sign up on `http://localhost:3000/signup`
- [ ] Log in
- [ ] Create campaign (upload CV, select location/role)
- [ ] Click "Find Leads" → verify leads appear
- [ ] Click "Generate Emails" → verify emails appear
- [ ] Try "Export CSV" → verify download
- [ ] Try "Send Emails" → verify status changes

**Checklist:** Full workflow works end-to-end locally

---

## 🚀 Production Deployment (30 min)

**Backend (Railway):**
- [ ] Push backend code to GitHub
- [ ] Create new project on Railway
- [ ] Connect GitHub repo
- [ ] Add environment variables
- [ ] Deploy → test health endpoint

**Frontend (Vercel):**
- [ ] Push frontend code to GitHub
- [ ] Import project on Vercel
- [ ] Add environment variables (with production API URL)
- [ ] Deploy → test login flow

**Checklist:** Both deployed and working in production

---

## 👥 Real User Testing (1-2 hours)

- [ ] Send link to 5 F-1 students
- [ ] Have them sign up + test
- [ ] Collect feedback:
  - [ ] Is flow clear?
  - [ ] Are emails good quality?
  - [ ] Did they get useful leads?
  - [ ] Any bugs?
- [ ] Record time to complete (target: <10 min)
- [ ] Track number of emails generated/sent
- [ ] Get feedback on personalization quality

**Checklist:** 5 users successfully tested, feedback collected

---

## 📊 Post-Launch (First Week)

- [ ] Monitor error logs (Railway + Vercel)
- [ ] Collect more user feedback
- [ ] Fix critical bugs immediately
- [ ] Adjust email prompts if needed
- [ ] Track basic metrics:
  - [ ] # of campaigns created
  - [ ] # of emails sent
  - [ ] Delivery rates (from Resend)

---

## 🎯 Success Criteria

**MVP is done when:**
- ✅ User can sign up + log in
- ✅ User can upload CV + select location/role
- ✅ System finds ~50 leads (Apollo)
- ✅ System generates 50 personalized emails (Claude)
- ✅ User can send emails (Resend) or export CSV
- ✅ Email status tracked
- ✅ Deployed to production
- ✅ 5 F-1 students tested successfully
- ✅ At least 1 user got positive back-outreach

---

## 💡 Key Reminders

1. **Don't over-engineer** — MVP is about validation
2. **Keep landing page simple** — Focus on functionality
3. **Test core flow only** — Sign up → Create campaign → Find leads → Generate emails → Send
4. **Ship fast** — Iterate based on feedback
5. **Collect real feedback** — Not just "it's cool"

---

## 🆘 Need Help?

Check:
1. `docs/SETUP-GUIDE.md` — Step-by-step guide
2. `docs/IMPLEMENTATION-PLAN.md` — Architecture details
3. Backend error logs: `railway logs`
4. Frontend errors: Browser console (F12)
5. Database logs: Supabase "Logs" tab

---

## ✨ Timeline Summary

| Step | Time | Owner |
|------|------|-------|
| Infrastructure setup | 30 min | You |
| Database schema | 10 min | You |
| Backend setup | 45 min | You (I wrote code) |
| Frontend setup | 45 min | You (I wrote code) |
| Local testing | 30 min | You |
| Deploy to production | 30 min | You |
| Test with users | 1-2 hours | You |
| **TOTAL** | **~4 hours** | |

**Ship the MVP when all items above are checked.**

---

**Last updated:** 2026-06-08  
**Status:** Ready to launch
