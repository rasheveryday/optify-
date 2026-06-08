# ColdReach MVP — Complete Setup & Deployment Guide

**Timeline:** 2-3 hours total (mostly waiting for deployments)

---

## Part 1: Create Infrastructure Accounts (15 minutes)

### 1.1 Supabase (Database + Auth)
1. Go to https://supabase.com/
2. Sign up with GitHub
3. Create new project:
   - Name: `coldreach-mvp`
   - Region: closest to you
4. Wait for project to create (~2 min)
5. Go to "Settings" → "API"
6. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_KEY`

### 1.2 Anthropic (Claude API)
1. Go to https://console.anthropic.com/
2. Sign up / login
3. Create new API key
4. Copy → `ANTHROPIC_API_KEY`

### 1.3 Apollo.io (Lead Finder)
1. Go to https://www.apollo.io/
2. Sign up
3. Get API key from settings
4. Copy → `APOLLO_IO_API_KEY`

### 1.4 Resend (Email Sending)
1. Go to https://resend.com/
2. Sign up
3. Get API key
4. Copy → `RESEND_API_KEY`

### 1.5 GitHub
1. Create account if you don't have one
2. Create two repos:
   - `coldreach-frontend`
   - `coldreach-backend`

### 1.6 Vercel
1. Go to https://vercel.com/
2. Sign up with GitHub
3. We'll deploy later

### 1.7 Railway
1. Go to https://railway.app/
2. Sign up with GitHub
3. We'll deploy later

---

## Part 2: Set Up Database Schema (10 minutes)

### 2.1 Create Tables
1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy the entire schema from `database/schema.sql`
4. Run the query
5. Verify: Go to "Table Editor" and see all tables

### 2.2 Enable pgvector
Already in the schema file (first line with `CREATE EXTENSION`)

---

## Part 3: Set Up Backend (45 minutes)

### 3.1 Initialize Node.js Project
```bash
cd nfac_startup/backend
npm init -y
npm install express cors dotenv @supabase/supabase-js jsonwebtoken bcrypt axios @anthropic-ai/sdk openai resend
npm install -D typescript @types/express @types/node ts-node
```

### 3.2 Create Backend Files
Copy these into `backend/src/`:
- `server.ts`
- `routes/auth.ts`
- `routes/campaigns.ts`
- `services/apollo.ts`
- `services/claude.ts`
- `services/resend.ts`

(See separate code files provided)

### 3.3 Create .env File
```bash
cat > backend/.env << 'EOF'
JWT_SECRET=your-random-secret-key-here-minimum-32-chars
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
APOLLO_IO_API_KEY=...
RESEND_API_KEY=...
SUPABASE_URL=https://[project].supabase.co
SUPABASE_KEY=...
FRONTEND_URL=http://localhost:3000
PORT=3001
EOF
```

### 3.4 Update package.json
```json
{
  "scripts": {
    "dev": "ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 3.5 Run Locally
```bash
npm run dev
# Server at http://localhost:3001
```

---

## Part 4: Set Up Frontend (45 minutes)

### 4.1 Initialize Next.js
```bash
cd nfac_startup/frontend
npx create-next-app@latest . --typescript --tailwind --eslint
```

### 4.2 Install Dependencies
```bash
npm install @supabase/supabase-js axios react-hook-form zod
```

### 4.3 Create .env.local
```bash
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
EOF
```

### 4.4 Create Pages
- `app/page.tsx` (landing)
- `app/signup/page.tsx` (signup)
- `app/login/page.tsx` (login)
- `app/dashboard/page.tsx` (main dashboard)

(See separate code files provided)

### 4.5 Run Locally
```bash
npm run dev
# Frontend at http://localhost:3000
```

---

## Part 5: Deploy (30 minutes)

### 5.1 Deploy Backend to Railway
1. Push code to GitHub repo
2. Go to https://railway.app/
3. New project → Connect GitHub repo
4. Add environment variables from `.env`
5. Deploy
6. Copy public URL

### 5.2 Deploy Frontend to Vercel
1. Push code to GitHub repo
2. Go to https://vercel.com/
3. Import project
4. Add environment variables
5. Deploy
6. Copy public URL

---

## Part 6: Test with Real Users (1-2 hours)

1. Send link to 5 F-1 students
2. Have them test the flow
3. Collect feedback
4. Iterate based on feedback

---

## Troubleshooting

**"Cannot find module..."**
- Run `npm install`

**"API key invalid"**
- Check for copy-paste errors, extra spaces

**"Email not sending"**
- Verify Resend API key

**"Leads not found"**
- Check Apollo API key, try different search terms

See `docs/MVP-CHECKLIST.md` for more details.
