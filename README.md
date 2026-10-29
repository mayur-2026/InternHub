# InternHub — Student Internship Management Portal

InternHub is a student internship dashboard and learning management portal built with **React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui patterns, Lucide React, and Supabase**.

---

## 🌟 Key Functional Features

1. **Dashboard & Navigation**
   - 8 functional, responsive sections: **Dashboard**, **My Internships**, **Learning**, **Projects**, **Progress**, **Feedback**, **Support**, and **Profile**.
   - 240px desktop persistent sidebar, 64px header, and accessible slide-over mobile drawer for tablet & mobile devices.
   - Dynamic 3-column layout on wide screens (`1.6fr / 1fr / 1.1fr`) with 4 KPI cards.
2. **Google Authentication & Protected Routes**
   - Google OAuth 2.0 flow via Supabase client with token persistence and session lifecycle.
   - Protected route guards redirecting unauthorized visitors to `/login`.
   - Displays student Google avatar, verified email, and full name.
   - One-click **Demo Student Mode** for instant, zero-setup evaluation without needing API keys.
3. **Interactive Learning Path**
   - Hierarchical curriculum structure (Courses → Modules → Topics).
   - Interactive topic completion checkboxes that instantly recalculate module percentages and bubble up to overall fellowship completion.
   - Slide-over Topic Lesson modal with overview, key takeaways, and technical code snippets.
   - Real-time search and topic status filters (`All`, `In Progress`, `Completed`).
4. **Hands-on Projects & Deliverables**
   - Assigned engineering sprints with difficulty badges, tech stack tags, and deliverables checklists.
   - Interactive Project Submission form: GitHub repository URL validation, live working demo URL, and technical architecture reflection notes.
   - Submissions dynamically update status to `Under Review` with timestamps and toast notifications.
   - Evaluated deliverable ledger with rubric scores and mentor feedback.
5. **Progress & Analytics**
   - Visual progress gauges and module completion breakdown bars.
   - Verified engineering competencies matrix (React 19, TypeScript, Tailwind CSS v4, Supabase RLS, CI/CD).
6. **Continuous Feedback & Retrospectives**
   - Mentor rubric scorecards across 4 core criteria (Code Quality, Architecture, UI/UX, Communication).
   - Interactive Weekly Self-Reflection submission form with retrospective ledger.
7. **Support & Knowledge Base**
   - Support ticket creation modal (Category, Priority, Description).
   - Searchable FAQ accordion with instant keyword search.
   - Direct mentor office hours and community escalation links.
8. **Student Profile & Settings**
   - Editable bio, university, graduation year, GitHub URL, and LinkedIn URL.
   - Synchronized header avatar and Google identity metadata.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/InternHub.git
cd InternHub
npm install
```

### 2. Environment Configuration (Optional for Google OAuth)
The application includes a built-in interactive demo mode that works immediately out of the box with zero configuration.

To connect live Supabase Google OAuth:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Supabase project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Enable Google Provider in your Supabase Auth settings and configure Google Cloud OAuth 2.0 credentials.

### 3. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
To verify TypeScript and bundle the application:
```bash
npm run build
```

### 5. Run Lint Checks
```bash
npm run lint
```

---

## 🎨 Design System

InternHub strictly follows a centralized design token system:
- **Primary Purple:** `#7950F2` (hover `#6741D9`, soft `#F3F0FF`)
- **Page Canvas:** `#F8FAFF`
- **Surfaces:** `#FFFFFF` with `12px` radius and `1px solid #EDF0F6` border
- **Card Shadow:** `0 2px 12px rgba(30, 41, 59, 0.04)`
- **Typography:** Inter (400, 500, 600, 700)
- **Accessible Badge Foregrounds:** Success `#087F5B`, Warning `#9A4D00`, Info `#1864AB`, Project `#C2255C`

For the complete component and token specifications, see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

---

## ☁️ Deployment on Vercel

This is a pure frontend React SPA configured with `vercel.json` rewrites for seamless client-side routing.
1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. The build command `npm run build` and output directory `dist` are automatically detected.
4. Add environment variables if using live Supabase OAuth.
5. Deploy!

---

## 📄 License
MIT License. Built for student internship excellence.
