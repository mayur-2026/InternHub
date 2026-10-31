-- ==============================================================================
-- MIGRATION: Add started_at column and allow nullable deliverables for in-progress projects
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/jfojsvaiflwipbnobxzy/sql)
-- ==============================================================================

-- 1. Add started_at timestamp column to record when student clicks "Start Project"
ALTER TABLE public.project_submissions 
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT now();

-- 2. Allow repo_url and demo_url to be optional initially when project is In Progress
ALTER TABLE public.project_submissions 
  ALTER COLUMN repo_url DROP NOT NULL;

ALTER TABLE public.project_submissions 
  ALTER COLUMN demo_url DROP NOT NULL;

-- 3. Ensure Row Level Security allows authenticated students to start and update their own projects
DROP POLICY IF EXISTS "Submissions modify policy" ON public.project_submissions;
CREATE POLICY "Submissions modify policy" ON public.project_submissions FOR ALL 
USING (auth.uid() = student_id) 
WITH CHECK (auth.uid() = student_id);

-- 4. Enable Supabase Realtime broadcast for project_submissions
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_submissions;

