<div align="center">

# 🌿 VyaparSathi

### Your AI Partner for Starting and Growing a Business

An AI-driven hyperlocal business advisory and financial assistance platform for rural micro-entrepreneurs in India.

**Built for Smart India Hackathon (SIH) 2026**

[**🌐 Live Demo**](https://vyaparsathi26.vercel.app) · [**🐛 Report a Bug**](https://github.com/V0idCaster/VayparSathi26FinalVersion/issues) · [**💡 Request a Feature**](https://github.com/V0idCaster/VayparSathi26FinalVersion/issues)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## 📖 About

Starting a business in rural India is hard. Aspiring entrepreneurs often don't know which business suits their area, how much money they need, or which government schemes and loans they qualify for.

**VyaparSathi** ("business companion") guides a person through the whole journey in one place: discovering the right business opportunity for their location and budget, planning finances, finding suitable government schemes, and tracking the health of the business after launch, all in their own language.

---

## ✨ Features

| | Feature | What it does |
|---|---|---|
| 🔐 | **Secure Login** | Email and password accounts with Supabase Auth. Each user's profile is stored against their own account. |
| 🧭 | **Guided Onboarding** | A short questionnaire captures name, location, budget and language to personalise the experience. |
| 🔄 | **Reset Preferences** | Users can redo onboarding at any time to switch to a different business type. |
| 📊 | **Dashboard** | An at-a-glance view of the best opportunity, key scores and next steps. |
| 📍 | **Opportunities** | Hyperlocal business ideas matched to the user's location and budget. |
| ✅ | **Feasibility** | AI-style feasibility scoring, demand and risk indicators. |
| 📝 | **Business Plan** | A structured plan for the chosen business. |
| 💰 | **Finance** | Investment, expected profit and funding planning. |
| 🏛️ | **Schemes & Loans** | Government schemes and loans suited to the entrepreneur. |
| 🚀 | **Launch** | A checklist and guidance for getting started. |
| 🩺 | **Business Doctor & Health** | Diagnose problems and track business health over time. |
| 🧪 | **Simulator** | Test "what-if" scenarios before committing money. |
| 👥 | **Community** | A space to ask questions and learn from other entrepreneurs. |
| 🗺️ | **Business Journey** | A step-by-step roadmap from idea to growth. |
| 🌐 | **Multi-language** | The interface can be switched between Indian languages. |
| 🤖 | **AI Assistant** | An in-app assistant for quick guidance. |
| 📱 | **Responsive UI** | Fixed, collapsible sidebar on desktop and a drawer on mobile. |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4
- **Charts & motion:** Recharts, Framer Motion
- **Icons:** Lucide React
- **Backend / Auth / Database:** Supabase (Auth + Postgres with Row Level Security)
- **Hosting:** Vercel
- **Package manager:** pnpm

---

## 📁 Project Structure

```
src/
├── components/      # Shell (sidebar + header), AI assistant, shared UI
├── pages/           # Landing, Auth, Onboarding, Dashboard, Finance, Schemes, ...
├── lib/             # Supabase client, translations (i18n), app data
├── App.tsx          # Routing between screens + session/profile handling
├── main.tsx         # App entry point
└── index.css        # Tailwind + global styles
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20.19 or higher (22 LTS recommended)
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- A free [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone https://github.com/V0idCaster/VayparSathi26FinalVersion.git
cd VayparSathi26FinalVersion
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a file named `.env` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-or-publishable-key
```

> Use the **public** key only. Never put the `service_role` / secret key in this project. The URL must end at `.supabase.co`, without `/rest/v1/`.

### 4. Create the database table

In the Supabase **SQL Editor**, run:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
```

Row Level Security ensures each user can only read and write their own row.

### 5. Configure Supabase Auth

In **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:8443` (use your live address in production)
- **Redirect URLs:** add `http://localhost:8443/**` and your live address with and without `/**`

For development you can turn off **Confirm email** under **Authentication → Sign In / Providers → Email**. Turn it back on, and connect an SMTP provider, before real users sign up.

### 6. Run the app

```bash
pnpm dev
```

Open **http://localhost:8443**.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server on port 8443 |
| `pnpm build` | Create a production build in `dist/` |
| `pnpm preview` | Preview the production build locally |

---

## ☁️ Deployment

The site is deployed on **Vercel** and redeploys automatically on every push to `main`.

1. Push the repository to GitHub.
2. Import it into Vercel (framework preset: **Vite**, build command `pnpm build`, output directory `dist`).
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Environment Variables**.
4. Add the live address to Supabase's **Site URL** and **Redirect URLs**.

---

## 🔒 Security Notes

- Only the public Supabase key is used in the frontend.
- Row Level Security is enabled, so users can only access their own profile data.
- Sessions are stored per browser tab and end when the tab is closed.
- `.env` is git-ignored and must never be committed.

---

## 🗺️ Roadmap

- [ ] Forgot password and Google login
- [ ] Personalise every page using the saved profile
- [ ] Custom domain
- [ ] Offline-friendly / low-bandwidth mode for rural users
- [ ] More regional languages and voice input

---

## 📸 Screenshots

| Landing | Dashboard |
|---|---|
| ![Landing page](docs/landing.png) | ![Dashboard](docs/dashboard.png) |

| Funding | Schemes & Loans |
|---|---|
| ![Funding](docs/funding.png) | ![Schemes and loans](docs/loan_scheme.png) |
---

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## 👤 Author

**Sachin Kumar**
GitHub: [@V0idCaster](https://github.com/V0idCaster)

---

<div align="center">

Made with ❤️ for India's rural entrepreneurs

</div>
