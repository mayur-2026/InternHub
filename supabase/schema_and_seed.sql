-- ==============================================================================
-- INTERNHUB — COMPLETE DATABASE SCHEMA & CATALOG SEED SCRIPT
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/jfojsvaiflwipbnobxzy/sql)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  university TEXT,
  graduation_year TEXT,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  role TEXT DEFAULT 'Student Intern',
  track TEXT DEFAULT 'Full-Stack Web Engineering',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles upsert policy" ON public.profiles;
CREATE POLICY "Profiles upsert policy" ON public.profiles FOR ALL 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 3. COURSES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  total_modules INT NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Courses read policy" ON public.courses;
CREATE POLICY "Courses read policy" ON public.courses FOR SELECT USING (true);

-- 4. MODULES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Modules read policy" ON public.modules;
CREATE POLICY "Modules read policy" ON public.modules FOR SELECT USING (true);

-- 5. TOPICS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 45,
  description TEXT,
  code_snippet TEXT,
  resource_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Topics read policy" ON public.topics;
CREATE POLICY "Topics read policy" ON public.topics FOR SELECT USING (true);

-- 6. TOPIC COMPLETIONS TABLE (STUDENT SPECIFIC)
CREATE TABLE IF NOT EXISTS public.topic_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, topic_id)
);

ALTER TABLE public.topic_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Completions read policy" ON public.topic_completions;
CREATE POLICY "Completions read policy" ON public.topic_completions FOR SELECT 
USING (auth.uid() = student_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Completions modify policy" ON public.topic_completions;
CREATE POLICY "Completions modify policy" ON public.topic_completions FOR ALL 
USING (auth.uid() = student_id) 
WITH CHECK (auth.uid() = student_id);

-- 7. PROJECTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  due_date TEXT NOT NULL,
  estimated_hours INT NOT NULL DEFAULT 20,
  tech_stack TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects read policy" ON public.projects;
CREATE POLICY "Projects read policy" ON public.projects FOR SELECT USING (true);

-- 8. PROJECT SUBMISSIONS TABLE (STUDENT SPECIFIC)
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  project_id TEXT NOT NULL,
  repo_url TEXT,
  demo_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'In Progress',
  started_at TIMESTAMPTZ DEFAULT now(),
  grade INT,
  mentor_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, project_id)
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Submissions read policy" ON public.project_submissions;
CREATE POLICY "Submissions read policy" ON public.project_submissions FOR SELECT 
USING (auth.uid() = student_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Submissions modify policy" ON public.project_submissions;
CREATE POLICY "Submissions modify policy" ON public.project_submissions FOR ALL 
USING (auth.uid() = student_id) 
WITH CHECK (auth.uid() = student_id);

-- 9. SUPPORT TICKETS TABLE (STUDENT SPECIFIC)
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  ticket_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  description TEXT NOT NULL,
  last_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tickets read policy" ON public.support_tickets;
CREATE POLICY "Tickets read policy" ON public.support_tickets FOR SELECT 
USING (auth.uid() = student_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Tickets insert policy" ON public.support_tickets;
CREATE POLICY "Tickets insert policy" ON public.support_tickets FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- 10. WEEKLY REFLECTIONS TABLE (STUDENT SPECIFIC)
CREATE TABLE IF NOT EXISTS public.weekly_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  week_number INT NOT NULL,
  what_went_well TEXT NOT NULL,
  blockers TEXT,
  goals_for_next_week TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.weekly_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reflections read policy" ON public.weekly_reflections;
CREATE POLICY "Reflections read policy" ON public.weekly_reflections FOR SELECT 
USING (auth.uid() = student_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Reflections insert policy" ON public.weekly_reflections;
CREATE POLICY "Reflections insert policy" ON public.weekly_reflections FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- ==============================================================================
-- 11. CATALOG DATA SEEDING (COURSES, MODULES, TOPICS, PROJECTS)
-- ==============================================================================

-- Seed Course
INSERT INTO public.courses (id, title, total_modules)
VALUES ('course_fs_101', 'Full-Stack Web Engineering Curriculum', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, total_modules = EXCLUDED.total_modules;

-- Seed Modules
INSERT INTO public.modules (id, course_id, week_number, title, description)
VALUES
  ('mod_1', 'course_fs_101', 1, 'Modern Frontend Architecture & React 19', 'Master strict TypeScript patterns, component composition, and modern React 19 compiler features.'),
  ('mod_2', 'course_fs_101', 2, 'Navigation, Client Routing & Caching Architecture', 'Implement complex nested routing with React Router v7 and client cache synchronization.'),
  ('mod_3', 'course_fs_101', 3, 'Cloud Backend, PostgreSQL & Row-Level Security', 'Integrate Supabase PostgreSQL database, schema design, and secure authorization rules.'),
  ('mod_4', 'course_fs_101', 4, 'Full-Stack Project Delivery & Submissions', 'Building end-to-end applications with live review pipelines, rubric evaluations, and code reviews.'),
  ('mod_5', 'course_fs_101', 5, 'Production Testing, Performance & Vercel CI/CD', 'Audit Core Web Vitals, configure automated GitHub Actions, and deploy to Vercel production edge.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, week_number = EXCLUDED.week_number;

-- Seed Topics
INSERT INTO public.topics (id, module_id, title, duration_minutes, description, code_snippet, resource_link)
VALUES
  ('top_1_1', 'mod_1', 'React 19 Hooks, Action Transitions & State Models', 45, 'Deep dive into concurrent transitions, optimistic UI hooks, and server-action compatible state architecture.', 'const [optimisticState, setOptimistic] = useOptimistic(currentState, (state, update) => ({ ...state, ...update }));', 'https://react.dev/reference/react'),
  ('top_1_2', 'mod_1', 'Strict TypeScript Design Patterns for Enterprise Apps', 60, 'Leveraging discriminated unions, template literal types, and utility types for zero-defect component APIs.', 'type Variant = ''primary'' | ''success'' | ''warning'' | ''error'';', 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html'),
  ('top_1_3', 'mod_1', 'Design System Engineering with Tailwind CSS & shadcn/ui', 50, 'Building an atomic, token-driven component library with full keyboard accessibility and WCAG contrast.', NULL, 'https://ui.shadcn.com/docs/components'),
  ('top_2_1', 'mod_2', 'Protected Routing & Authentication Guards', 40, 'Enforcing route protection, handling return URLs, and managing public vs authenticated layout boundaries.', NULL, 'https://reactrouter.com/en/main/start/overview'),
  ('top_2_2', 'mod_2', 'TanStack Query Server State & Cache Invalidation', 55, 'Mastering query keys, background revalidation, stale time configuration, and mutation side effects.', NULL, 'https://tanstack.com/query/latest/docs/framework/react/overview'),
  ('top_2_3', 'mod_2', 'Responsive Multi-Breakpoint Navigation Patterns', 45, 'Engineering responsive desktop sidebars, tablet drawers, and mobile quick-access docks without layout shift.', NULL, NULL),
  ('top_3_1', 'mod_3', 'Relational Schema Modeling for EdTech Systems', 50, 'Structuring tables for students, internships, modules, topics, submissions, and feedback with foreign keys.', NULL, NULL),
  ('top_3_2', 'mod_3', 'Row Level Security (RLS) & Multi-Tenant Isolation', 60, 'Authoring strict SQL policies ensuring students can only view and mutate their own verified records.', 'CREATE POLICY "Users can only read own submissions" ON project_submissions FOR SELECT USING (auth.uid() = student_id);', NULL),
  ('top_3_3', 'mod_3', 'OAuth 2.0 PKCE Flow & Profile Synchronization', 45, 'Configuring Google Identity Providers, redirect callbacks, token storage, and user profile sync.', NULL, NULL),
  ('top_4_1', 'mod_4', 'Interactive Project Submission Workflows', 40, 'Designing submission interfaces with client-side URL validation, reflection textareas, and instant status updates.', NULL, NULL),
  ('top_4_2', 'mod_4', 'Code Review Standards & Rubric Evaluations', 50, 'Conducting high-impact pull request reviews across architecture, clean code, UI accessibility, and performance.', NULL, NULL),
  ('top_5_1', 'mod_5', 'Automated CI/CD with GitHub Actions & Vercel', 45, 'Setting up automated build verification, TypeScript checking, ESLint gates, and instant preview branches.', NULL, NULL),
  ('top_5_2', 'mod_5', 'Performance Auditing & Core Web Vitals Optimization', 50, 'Achieving sub-second First Contentful Paint, 0 Layout Shift, and accessible 100/100 Lighthouse scores.', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title, 
  duration_minutes = EXCLUDED.duration_minutes, 
  description = EXCLUDED.description, 
  code_snippet = EXCLUDED.code_snippet, 
  resource_link = EXCLUDED.resource_link;

-- Seed Projects Catalog
INSERT INTO public.projects (id, title, description, difficulty, due_date, estimated_hours, tech_stack, deliverables)
VALUES
  (
    'proj_1',
    'InternHub Dashboard & Design System',
    'Design and implement an enterprise-grade, responsive internship portal with 8 core sections, Google OAuth, interactive curriculum tracking, and full design system consistency.',
    'Intermediate',
    'Oct 24, 2026',
    24,
    ARRAY['React 19', 'TypeScript', 'Tailwind CSS v4', 'React Router v7', 'Lucide React'],
    ARRAY['Centralized design system with exact color tokens', '8 fully functional, interactive sections', 'Interactive topic completion and project submission form', 'Responsive multi-breakpoint layout (Desktop, Laptop, Tablet, Mobile)']
  ),
  (
    'proj_2',
    'Real-time Collaborative Task Board',
    'Architect a Kanban-style sprint task board with drag-and-drop mechanics, optimistic state updates, and real-time team presence indicators.',
    'Intermediate',
    'Nov 04, 2026',
    20,
    ARRAY['React', 'TypeScript', 'TanStack Query', 'Supabase Realtime'],
    ARRAY['Kanban board with Backlog, In Progress, Review, and Done columns', 'Drag-and-drop state updates with optimistic UI rollback', 'Multi-user live presence avatars']
  ),
  (
    'proj_3',
    'Distributed Analytics Microservice & Telemetry',
    'Construct a lightweight telemetry ingestion endpoint that buffers events, aggregates student metrics, and exposes REST endpoints for dashboard analytics.',
    'Advanced',
    'Nov 12, 2026',
    30,
    ARRAY['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    ARRAY['Batch ingestion pipeline with rate limiting', 'Database aggregation functions with PostgreSQL views', 'Automated integration test suite with >85% coverage']
  ),
  (
    'proj_4',
    'Production Infrastructure as Code (IaC)',
    'Provision multi-region cloud infrastructure using declarative Terraform configs with automated security group scanning and cost monitoring.',
    'Advanced',
    'Nov 24, 2026',
    28,
    ARRAY['Terraform', 'AWS/GCP', 'GitHub Actions', 'Docker'],
    ARRAY['Modular Terraform repository for VPC, RDS, and ECS/Cloud Run', 'CI/CD pipeline with terraform plan validation', 'Architecture diagram and disaster recovery runbook']
  )
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title, 
  description = EXCLUDED.description, 
  difficulty = EXCLUDED.difficulty, 
  due_date = EXCLUDED.due_date, 
  estimated_hours = EXCLUDED.estimated_hours, 
  tech_stack = EXCLUDED.tech_stack, 
  deliverables = EXCLUDED.deliverables;

