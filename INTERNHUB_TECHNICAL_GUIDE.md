# 📘 InternHub — Technical Architecture & Client Presentation Guide

> **Audience:** Junior Developers, Solutions Architects, and Technical Presenters  
> **Purpose:** A straightforward, accurate, codebase-verified guide for presenting, understanding, and maintaining the InternHub platform.

---

## 1. What InternHub Is and Its Purpose

**InternHub** is a production-ready Student Internship Management Dashboard designed for tech fellowship programs, corporate training academies, and universities. It bridges the gap between structured curriculum learning and real-world software engineering delivery.

### Key Capabilities:
- **Guided Curriculum:** Multi-week structured modules with lessons, key takeaways, code snippets, and interactive progress checklists.
- **Hands-On Project Workspace:** Milestone sprints with client-side GitHub and live deployment URL validation, review status tracking, and rubric grading.
- **Dynamic Growth Analytics:** Real-time weighted completion metrics that recalculate whenever students check off topics or submit deliverables.
- **Mentorship & Quality Feedback:** Direct office-hours scheduling, qualitative mentor rubric evaluations, and weekly student retrospectives.
- **Support Assistance Desk:** Real-time ticketing with category routing, priority tagging, and zero focus-loss forms.
- **Google Identity & Profile:** Automated Google profile synchronization with student links and editable bios.

---

## 2. Actual Technology Stack & Why It Was Chosen

| Technology | Version | Purpose in InternHub | Why It Was Chosen |
| :--- | :--- | :--- | :--- |
| **React** | 19.3.1 | Core UI Library | Native transitions, concurrent hooks (`useOptimistic`), and high component performance. |
| **TypeScript** | 5.9.3 | Type Safety | Catches bugs at compile time; strict type interfaces across all models and props. |
| **Vite** | 8.3.5 | Build Tool & Dev Server | Sub-second Hot Module Replacement (HMR) and optimized Rollup production bundling. |
| **Tailwind CSS** | 4.3.3 | Styling Engine | Modern `@theme` CSS variable tokens for rapid, consistent styling without CSS bloat. |
| **Supabase** | 2.118.0 | Backend & Database | Managed PostgreSQL with built-in Google OAuth 2.0 PKCE flow and Row Level Security. |
| **React Router** | 7.18.5 | Client-side Routing | Fast single-page routing with layout nesting and protected route guards. |
| **Lucide React** | 1.64.0 | UI Iconography | Crisp, lightweight, tree-shakable SVG icon set. |
| **Vitest** | 5.0.5 | Unit & Component Testing | Fast in-memory testing for critical state logic and focus retention regressions. |
| **Playwright-Core** | 1.64.1 | Automated Browser E2E | Verifies workflows and responsive breakpoints in headless Google Chrome. |

---

## 3. High-Level Architecture Flow

```
+-------------------------------------------------------------------------+
|                               Browser Client                            |
|                                                                         |
|  +--------------------+   +---------------------+   +----------------+  |
|  |     LoginPage      |   |  Protected Layout   |   | Global Search  |  |
|  | Google / Demo Auth |   | Sidebar + 8 Pages   |   |   Ctrl + K     |  |
|  +---------+----------+   +----------+----------+   +-------+--------+  |
|            |                         |                      |           |
|  +---------v-------------------------v----------------------v--------+  |
|  |                         React Context Layer                       |  |
|  |   AuthContext (Session / Identity) + AppContext (Data & Sync)     |  |
|  +-----------------------------------+-------------------------------+  |
+--------------------------------------|----------------------------------+
                                       |
                   REST API / Realtime / Auth (HTTPS)
                                       |
+--------------------------------------v----------------------------------+
|                          Supabase Backend Cloud                         |
|                                                                         |
|  +-------------------+  +--------------------+  +--------------------+  |
|  |  GoTrue Auth      |  |  PostgreSQL Engine |  | Row-Level Security |  |
|  |  Google OAuth 2.0 |  |  Tables & Rel.     |  | (auth.uid() = id)  |  |
|  +-------------------+  +--------------------+  +--------------------+  |
+-------------------------------------------------------------------------+
```

---

## 4. How the Codebase is Organized

```
C:\InternHub\
├── src\
│   ├── components\
│   │   ├── layout\         # AppLayout, Header (Search index), Sidebar, MobileDrawer, ProtectedRoute
│   │   └── ui\             # Button, Card, FormField, Modal, ProgressBar, StatCard, StatusBadge, Toast
│   ├── context\
│   │   ├── AuthContext.tsx # Google OAuth exchange, demo mode toggle, profile upsert, session listener
│   │   └── AppContext.tsx  # Pure catalog vs demo state, Supabase hydration, dynamic metrics
│   ├── data\
│   │   └── seedData.ts     # Curriculum syllabus, project prompts, demo fixtures
│   ├── pages\              # 8 Primary Pages + Login
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── InternshipsPage.tsx
│   │   ├── LearningPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProgressPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   ├── SupportPage.tsx
│   │   └── ProfilePage.tsx
│   ├── lib\
│   │   └── supabase.ts     # Initialized Supabase client instance
│   └── test\               # Automated Vitest regression and workflow suites
├── supabase\
│   └── schema_and_seed.sql # Production PostgreSQL migration and catalog seed script
├── scripts\
│   └── e2e-qa-audit.mjs    # Automated 19-point Playwright Chrome audit script
└── vercel.json             # Single Page Application rewrite rules
```

---

## 5. How Google OAuth Works with Supabase

1. **Initiation:** The student clicks **"Continue with Google"** on `/login`.
2. **Provider Call:** `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'http://localhost:5173/dashboard' } })` triggers.
3. **Google Consent:** The student approves their Google account on `accounts.google.com`.
4. **Callback Exchange:** Google redirects to `https://jfojsvaiflwipbnobxzy.supabase.co/auth/v1/callback` with an external auth code.
5. **Session Resolution:** Supabase verifies the code and redirects back to InternHub with either a PKCE `?code=` query or `#access_token=`.
6. **Session Guard:** `AuthContext.tsx` detects the incoming parameter, exchanges the code with `supabase.auth.exchangeCodeForSession(code)`, retrieves the student profile from the `profiles` table, and sets `user`.
7. **Clean State Guarantee:** Authenticated Google students begin with an authentic **0% progress** workspace, completely isolated from demo fixtures.

---

## 6. How the Database Stores Student Records

All database operations run against Supabase PostgreSQL:

1. **`profiles`:** Matches `auth.users(id)`. Stores full name, email, avatar, university, graduation year, bio, and social links.
2. **`courses`, `modules`, `topics`, `projects`:** Catalog tables. These define the syllabus, requirements, and deliverables. Students have read access.
3. **`topic_completions`:** Records completed topics per student: `(student_id, topic_id)`.
4. **`project_submissions`:** Stores repository URL, demo URL, reflection notes, submission timestamp, review status (*Under Review* / *Approved*), and mentor feedback.
5. **`support_tickets`:** Stores support inquiries: ticket number, subject, category, priority, status, and description.
6. **`weekly_reflections`:** Stores weekly retrospects: what went well, blockers, and next sprint goals.

### Data Security (Row Level Security):
Every student-specific table has PostgreSQL RLS enabled:
```sql
CREATE POLICY "Users can only mutate own records" 
ON public.topic_completions 
FOR ALL USING (auth.uid() = student_id);
```
No student can view, modify, or corrupt another student's submissions or completions.

---

## 7. How Progress Percentages Are Calculated

InternHub does not use static progress values. Metrics calculate in real time in `AppContext.tsx`:

$$\text{Curriculum Progress} = \text{round}\left(\frac{\text{Completed Topics}}{\text{Total Topics}} \times 100\right)$$

$$\text{Overall Fellowship Progress} = \text{round}\left((\text{Curriculum Progress} \times 0.6) + \left(\frac{\text{Approved Projects}}{\text{Total Projects}} \times 100 \times 0.4\right)\right)$$

- When a student checks a topic on the **Dashboard** or **Learning** page, the progress bar and KPI counters update immediately across all pages.
- When an evaluator approves a project submission, the overall score incorporates the 40% project weighting.

---

## 8. How to Run the Project Locally

### Prerequisites:
- Node.js (v18 or higher; tested on v24)
- Google Chrome (for automated Playwright tests)

### Step-by-Step Commands:
```bash
# 1. Clone repository and navigate to folder
cd C:\InternHub

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# Server starts at http://localhost:5173

# 4. Run automated unit and regression tests
npm test

# 5. Run ESLint verification
npm run lint

# 6. Verify production build
npm run build

# 7. Execute automated real browser E2E audit
node scripts/e2e-qa-audit.mjs
```

---

## 9. How to Deploy to Vercel

InternHub is configured for zero-configuration Vercel deployment:

1. Push your repository to GitHub (`master` or `main` branch).
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"** → Import your GitHub repository.
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://jfojsvaiflwipbnobxzy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<your-supabase-anon-key>`
4. Click **Deploy**.
5. Vercel automatically runs `tsc -b && vite build` and serves the output from `dist/` with single-page client routing via [`vercel.json`](file:///c:/InternHub/vercel.json).

---

## 10. How to Explain InternHub in a 2-Minute Client Presentation

When presenting to clients, follow this simple 4-step script:

> **[0:00 - 0:30] Introduction & Value Proposition:**  
> *"Welcome everyone. This is InternHub, our complete student internship and fellowship dashboard. It's built to give interns a clear roadmap from their first day to their completion certificate, while giving mentors full visibility over deliverables and progress."*

> **[0:30 - 1:00] Authentication & Workspace Isolation:**  
> *"Students can sign in securely with their Google account via Supabase, or evaluators can click 'Explore as Demo Student' to preview an active student's workspace. Every student gets their own isolated PostgreSQL workspace with complete Row-Level Security."*

> **[1:00 - 1:30] Live Curriculum & Real-Time Analytics:**  
> *"In the Learning section, curriculum is split into step-by-step modules. Watch what happens when I check off a topic: the module completion, the overall fellowship score, and the dashboard KPI cards instantly recalculate in real time without refreshing. And when I refresh, Supabase ensures all progress is permanently saved."*

> **[1:30 - 2:00] Hands-On Delivery & Support:**  
> *"In the Projects section, students submit real GitHub and demo URLs with full validation. In the Support desk, students can report blockers with an accessible ticket form. The entire system is responsive, accessible, and ready for deployment."*

