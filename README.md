# InternHub — Student Internship Management Portal

InternHub is an enterprise-grade student internship dashboard and learning management portal built with **React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui patterns, Lucide React, and Supabase**.

---

## 🌟 Key Functional Features

1. **Dashboard & Navigation**
   - 8 functional, responsive sections: **Dashboard**, **My Internships**, **Learning**, **Projects**, **Progress**, **Feedback**, **Support**, and **Profile**.
   - 240px desktop persistent sidebar, 64px header, and accessible slide-over mobile drawer for tablet & mobile devices.
   - Dynamic 3-column layout on wide screens (`1.6fr / 1fr / 1.1fr`) with 4 KPI cards and synchronized metric calculations.
2. **Interactive Global Search Engine**
   - Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>Cmd</kbd> + <kbd>K</kbd>) to instantly open universal search.
   - Live real-time indexing of all 8 application sections, active deliverables/sprints, and curriculum topics.
   - Categorized search result cards with category tags and keyboard navigation (<kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Enter</kbd>).
3. **Google Authentication & Protected Routes**
   - Google OAuth 2.0 flow via Supabase client with token persistence and session lifecycle.
   - Protected route guards redirecting unauthorized visitors to `/login`.
   - Pre-flight OAuth validation prevents landing on raw error screens if the provider is pending configuration.
   - Displays student Google avatar, verified email, and full name.
   - One-click **Demo Student Mode** for instant, zero-setup evaluation without needing API keys.
4. **Interactive Learning Path & Dynamic Progress**
   - Hierarchical curriculum structure (Courses → Modules → Topics).
   - Interactive topic completion checkboxes that instantly recalculate module percentages and bubble up to overall fellowship completion.
   - Slide-over Topic Lesson modal with overview, key takeaways, and technical code snippets.
   - Dual persistence: Optimistic UI state + Supabase PostgreSQL + LocalStorage offline recovery.
5. **Hands-on Projects & Deliverables**
   - Assigned engineering sprints with difficulty badges, tech stack tags, and deliverables checklists.
   - Interactive Project Submission form: GitHub repository URL validation, live working demo URL, and technical architecture reflection notes.
   - Submissions dynamically update status to `Under Review` with timestamps, toast notifications, and Supabase database synchronization.
   - Evaluated deliverable ledger with rubric scores and mentor feedback.
6. **Progress & Analytics**
   - Visual progress gauges and module completion breakdown bars.
   - Synchronized metric calculations across Dashboard, Learning, and Progress pages.
   - Verified engineering competencies matrix (React 19, TypeScript, Tailwind CSS v4, Supabase RLS, CI/CD).
7. **Continuous Feedback & Retrospectives**
   - Mentor rubric scorecards across 4 core criteria (Code Quality, Architecture, UI/UX, Communication).
   - Interactive Weekly Self-Reflection submission form with live Supabase persistence.
8. **Support & Knowledge Base**
   - Support ticket creation modal (Category, Priority, Description) with verified continuous typing and focus retention.
   - Direct persistence to Supabase `support_tickets` table.
   - Searchable FAQ accordion with instant keyword search.
   - Direct mentor office hours and community escalation links.
9. **Student Profile & Settings**
   - Editable bio, university, graduation year, GitHub URL, and LinkedIn URL.
   - Direct synchronization to Supabase `profiles` table.
   - Synchronized header avatar and Google identity metadata.

---

## 🗄️ Database Architecture (Supabase PostgreSQL)

InternHub connects to Supabase with Row Level Security (RLS) enabled on all tables:

| Table Name | Purpose / Schema | RLS Policy |
| :--- | :--- | :--- |
| `profiles` | Student info (UUID, name, email, avatar, bio, links) | `Public read profiles (FOR ALL)` |
| `courses` | Curriculum tracks (id, title, total_modules) | `Public read courses (FOR SELECT)` |
| `modules` | Weekly modules (id, course_id, week_number, title) | `Public read modules (FOR SELECT)` |
| `topics` | Lessons & code samples (id, module_id, title, duration) | `Public read topics (FOR SELECT)` |
| `topic_completions` | Student progress (UUID, student_id, topic_id, completed_at) | `Public manage completions (FOR ALL)` |
| `projects` | Assigned sprints (id, title, difficulty, tech_stack) | `Public read projects (FOR SELECT)` |
| `project_submissions` | Submissions (UUID, project_id, student_id, repo_url, demo_url) | `Public manage submissions (FOR ALL)` |
| `support_tickets` | Tickets (UUID, student_id, ticket_number, subject, description) | `Public manage tickets (FOR ALL)` |
| `weekly_reflections` | Retrospectives (UUID, student_id, week_number, notes) | `Public manage reflections (FOR ALL)` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/InternHub.git
cd InternHub
npm install
```

### 2. Environment Configuration
The application includes a built-in interactive demo mode that works immediately out of the box with zero configuration.

To connect live Supabase:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Supabase project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. To enable Google OAuth, toggle the Google Provider ON in Supabase Auth Settings (Auth → Providers → Google) with your Google Cloud Client ID & Secret.

### 3. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Automated Testing
Run the complete Vitest test suite (E2E workflows, modal focus regression, and search navigation):
```bash
npm test
```

### 5. Run Lint Checks
```bash
npm run lint
```

### 6. Build for Production
To verify TypeScript and bundle the application:
```bash
npm run build
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
4. Add environment variables if using live Supabase OAuth (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Deploy!

---

## 📄 License
MIT License. Built for student internship excellence.
