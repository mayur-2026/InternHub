import type {
  UserProfile,
  InternshipInfo,
  Course,
  Project,
  FeedbackEvaluation,
  WeeklyReflection,
  SupportTicket,
  FAQItem,
} from '../types'

export const INITIAL_USER: UserProfile = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'alex.rivera.dev@gmail.com',
  fullName: 'Alex Rivera',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Passionate Frontend & Full-Stack engineering student focused on building accessible, high-performance web applications with React, TypeScript, and modern design systems.',
  university: 'University of California, Berkeley',
  graduationYear: '2027',
  githubUrl: 'https://github.com/alexrivera-dev',
  linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
  role: 'Student Intern',
  track: 'Full-Stack Web Engineering',
  joinedDate: 'September 2026',
}

export const INITIAL_INTERNSHIP: InternshipInfo = {
  id: 'int_2026_fs',
  title: 'Full-Stack Software Engineering Fellowship',
  company: 'CloudScale Technologies Inc.',
  role: 'Software Engineering Intern',
  cohort: 'Fall 2026 • Cohort Alpha',
  startDate: 'Sep 01, 2026',
  endDate: 'Nov 30, 2026',
  status: 'Active',
  stipend: '$2,800 / month',
  hoursPerWeek: 25,
  description:
    'Intensive 12-week software engineering internship focusing on scalable React architecture, TypeScript type safety, design system engineering, and cloud backend integration with automated CI/CD pipelines.',
  mentor: {
    name: 'Dr. Sarah Lin',
    title: 'Staff Architect & Engineering Lead',
    email: 'sarah.lin@cloudscale.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    officeHours: 'Tuesdays & Thursdays, 3:00 PM – 5:00 PM PST',
    meetingLink: 'https://meet.google.com/lin-mentor-office-hours',
  },
}

export const INITIAL_COURSE: Course = {
  id: 'course_fs_101',
  title: 'Full-Stack Web Engineering Curriculum',
  totalModules: 5,
  modules: [
    {
      id: 'mod_1',
      weekNumber: 1,
      title: 'Modern Frontend Architecture & React 19',
      description: 'Master strict TypeScript patterns, component composition, and modern React 19 compiler features.',
      topics: [
        {
          id: 'top_1_1',
          moduleId: 'mod_1',
          title: 'React 19 Hooks, Action Transitions & State Models',
          durationMinutes: 45,
          isCompleted: true,
          description: 'Deep dive into concurrent transitions, optimistic UI hooks, and server-action compatible state architecture.',
          keyTakeaways: [
            'Understanding optimistic state mutation without UI flicker',
            'Structuring robust state lifecycles with TypeScript generics',
            'Performance profiling with React DevTools',
          ],
          codeSnippet: `const [optimisticState, setOptimistic] = useOptimistic(
  currentState,
  (state, update) => ({ ...state, ...update })
);`,
          resourceLink: 'https://react.dev/reference/react',
        },
        {
          id: 'top_1_2',
          moduleId: 'mod_1',
          title: 'Strict TypeScript Design Patterns for Enterprise Apps',
          durationMinutes: 60,
          isCompleted: true,
          description: 'Leveraging discriminated unions, template literal types, and utility types for zero-defect component APIs.',
          keyTakeaways: [
            'Discriminated unions for robust polymorphic UI components',
            'Ensuring type soundness across async network boundaries',
            'Eliminating any/unknown types through generic constraints',
          ],
          codeSnippet: `type Variant = 'primary' | 'success' | 'warning' | 'error';
type BadgeProps = { variant: Variant; label: string; count?: number };`,
          resourceLink: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
        },
        {
          id: 'top_1_3',
          moduleId: 'mod_1',
          title: 'Design System Engineering with Tailwind CSS & shadcn/ui',
          durationMinutes: 50,
          isCompleted: true,
          description: 'Building an atomic, token-driven component library with full keyboard accessibility and WCAG contrast.',
          keyTakeaways: [
            'Defining semantic tokens for colors, shadows, and spacing',
            'Keyboard focus management with visible 2px outlines',
            'Accessible Dialog and Drawer implementations with focus trapping',
          ],
          resourceLink: 'https://ui.shadcn.com/docs/components',
        },
      ],
    },
    {
      id: 'mod_2',
      weekNumber: 2,
      title: 'Navigation, Client Routing & Caching Architecture',
      description: 'Implement complex nested routing with React Router v7 and client cache synchronization.',
      topics: [
        {
          id: 'top_2_1',
          moduleId: 'mod_2',
          title: 'Protected Routing & Authentication Guards',
          durationMinutes: 40,
          isCompleted: true,
          description: 'Enforcing route protection, handling return URLs, and managing public vs authenticated layout boundaries.',
          keyTakeaways: [
            'Protected route wrappers using React Router v7',
            'Redirect preservation for post-auth navigation',
            'Preventing layout flash with global session loading skeletons',
          ],
          resourceLink: 'https://reactrouter.com/en/main/start/overview',
        },
        {
          id: 'top_2_2',
          moduleId: 'mod_2',
          title: 'TanStack Query Server State & Cache Invalidation',
          durationMinutes: 55,
          isCompleted: true,
          description: 'Mastering query keys, background revalidation, stale time configuration, and mutation side effects.',
          keyTakeaways: [
            'Separation of client UI state from server-synced state',
            'Optimistic mutations with automated rollback on failure',
            'Declarative loading and error boundary patterns',
          ],
          resourceLink: 'https://tanstack.com/query/latest/docs/framework/react/overview',
        },
        {
          id: 'top_2_3',
          moduleId: 'mod_2',
          title: 'Responsive Multi-Breakpoint Navigation Patterns',
          durationMinutes: 45,
          isCompleted: true,
          description: 'Engineering responsive desktop sidebars, tablet drawers, and mobile quick-access docks without layout shift.',
          keyTakeaways: [
            'Desktop 240px persistent sidebar vs mobile accessible sheet drawer',
            'Escape key listener, focus restoration, and touch tap-targets ≥ 44px',
            'Fluid grid calculations (1.6fr / 1fr / 1.1fr) for large monitors',
          ],
        },
      ],
    },
    {
      id: 'mod_3',
      weekNumber: 3,
      title: 'Cloud Backend, PostgreSQL & Row-Level Security',
      description: 'Integrate Supabase PostgreSQL database, schema design, and secure authorization rules.',
      topics: [
        {
          id: 'top_3_1',
          moduleId: 'mod_3',
          title: 'Relational Schema Modeling for EdTech Systems',
          durationMinutes: 50,
          isCompleted: true,
          description: 'Structuring tables for students, internships, modules, topics, submissions, and feedback with foreign keys.',
          keyTakeaways: [
            'Normalization and index optimization for fast queries',
            'Foreign key cascades and data integrity constraints',
            'Schema migration strategies for production databases',
          ],
        },
        {
          id: 'top_3_2',
          moduleId: 'mod_3',
          title: 'Row Level Security (RLS) & Multi-Tenant Isolation',
          durationMinutes: 60,
          isCompleted: false,
          description: 'Authoring strict SQL policies ensuring students can only view and mutate their own verified records.',
          keyTakeaways: [
            'Writing auth.uid() based RLS policies in PostgreSQL',
            'Granting read access to curriculum while restricting submissions',
            'Audit logging and security testing for database queries',
          ],
          codeSnippet: `CREATE POLICY "Users can only read own submissions"
ON project_submissions FOR SELECT
USING (auth.uid() = student_id);`,
        },
        {
          id: 'top_3_3',
          moduleId: 'mod_3',
          title: 'OAuth 2.0 PKCE Flow & Profile Synchronization',
          durationMinutes: 45,
          isCompleted: false,
          description: 'Configuring Google Identity Providers, redirect callbacks, token storage, and user profile sync.',
          keyTakeaways: [
            'Understanding PKCE security exchange in single-page apps',
            'Synchronizing Google name, email, and avatar into public profile tables',
            'Graceful session expiry and token refresh lifecycle',
          ],
        },
      ],
    },
    {
      id: 'mod_4',
      weekNumber: 4,
      title: 'Full-Stack Project Delivery & Submissions',
      description: 'Building end-to-end applications with live review pipelines, rubric evaluations, and code reviews.',
      topics: [
        {
          id: 'top_4_1',
          moduleId: 'mod_4',
          title: 'Interactive Project Submission Workflows',
          durationMinutes: 40,
          isCompleted: false,
          description: 'Designing submission interfaces with client-side URL validation, reflection textareas, and instant status updates.',
          keyTakeaways: [
            'Regex validation for GitHub and live deployment links',
            'State transitions: Not Started → In Progress → Under Review → Approved',
            'Toast notification triggers and revision resubmission handling',
          ],
        },
        {
          id: 'top_4_2',
          moduleId: 'mod_4',
          title: 'Code Review Standards & Rubric Evaluations',
          durationMinutes: 50,
          isCompleted: false,
          description: 'Conducting high-impact pull request reviews across architecture, clean code, UI accessibility, and performance.',
          keyTakeaways: [
            'Structured feedback rubrics with 4 core criteria',
            'Writing constructive, actionable technical code reviews',
            'Continuous self-reflection and weekly goal setting',
          ],
        },
      ],
    },
    {
      id: 'mod_5',
      weekNumber: 5,
      title: 'Production Testing, Performance & Vercel CI/CD',
      description: 'Audit Core Web Vitals, configure automated GitHub Actions, and deploy to Vercel production edge.',
      topics: [
        {
          id: 'top_5_1',
          moduleId: 'mod_5',
          title: 'Automated CI/CD with GitHub Actions & Vercel',
          durationMinutes: 45,
          isCompleted: false,
          description: 'Setting up automated build verification, TypeScript checking, ESLint gates, and instant preview branches.',
          keyTakeaways: [
            'Configuring zero-downtime Vercel edge deployment',
            'Adding SPA rewrites in vercel.json for direct route access',
            'Securing environment secrets across development and production',
          ],
        },
        {
          id: 'top_5_2',
          moduleId: 'mod_5',
          title: 'Performance Auditing & Core Web Vitals Optimization',
          durationMinutes: 50,
          isCompleted: false,
          description: 'Achieving sub-second First Contentful Paint, 0 Layout Shift, and accessible 100/100 Lighthouse scores.',
          keyTakeaways: [
            'Bundle splitting and dynamic component lazy loading',
            'Font preloading and responsive image sizing',
            'Zero layout shift through predefined aspect ratios and skeleton loaders',
          ],
        },
      ],
    },
  ],
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'InternHub Dashboard & Design System',
    description:
      'Design and implement an enterprise-grade, responsive internship portal with 8 core sections, Google OAuth, interactive curriculum tracking, and full design system consistency.',
    difficulty: 'Intermediate',
    status: 'Approved',
    dueDate: 'Oct 24, 2026',
    estimatedHours: 24,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'React Router v7', 'Lucide React'],
    deliverables: [
      'Centralized design system with exact color tokens',
      '8 fully functional, interactive sections',
      'Interactive topic completion and project submission form',
      'Responsive multi-breakpoint layout (Desktop, Laptop, Tablet, Mobile)',
    ],
    submission: {
      repoUrl: 'https://github.com/alexrivera-dev/internhub-portal',
      demoUrl: 'https://internhub-portal.vercel.app',
      notes:
        'Built with strict TypeScript type safety. Integrated Tailwind CSS v4 @theme tokens. Completed all 8 pages with responsive drawer and instant topic recalculation.',
      submittedAt: 'Oct 23, 2026 • 04:30 PM',
      grade: 98,
      mentorFeedback:
        'Outstanding execution! The design system token adherence is flawless. The responsive drawer and instant topic recalculation provide an exceptional student UX.',
    },
  },
  {
    id: 'proj_2',
    title: 'Real-time Collaborative Task Board',
    description:
      'Architect a Kanban-style sprint task board with drag-and-drop mechanics, optimistic state updates, and real-time team presence indicators.',
    difficulty: 'Intermediate',
    status: 'Under Review',
    dueDate: 'Nov 04, 2026',
    estimatedHours: 20,
    techStack: ['React', 'TypeScript', 'TanStack Query', 'Supabase Realtime'],
    deliverables: [
      'Kanban board with Backlog, In Progress, Review, and Done columns',
      'Drag-and-drop state updates with optimistic UI rollback',
      'Multi-user live presence avatars',
    ],
    submission: {
      repoUrl: 'https://github.com/alexrivera-dev/collaborative-board',
      demoUrl: 'https://collab-board-demo.vercel.app',
      notes:
        'Added optimistic UI for card movements and smooth animations. Handled network disconnection gracefully with offline indicators.',
      submittedAt: 'Oct 28, 2026 • 11:15 AM',
    },
  },
  {
    id: 'proj_3',
    title: 'Distributed Analytics Microservice & Telemetry',
    description:
      'Construct a lightweight telemetry ingestion endpoint that buffers events, aggregates student metrics, and exposes REST endpoints for dashboard analytics.',
    difficulty: 'Advanced',
    status: 'In Progress',
    dueDate: 'Nov 12, 2026',
    estimatedHours: 30,
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    deliverables: [
      'Batch ingestion pipeline with rate limiting',
      'Database aggregation functions with PostgreSQL views',
      'Automated integration test suite with >85% coverage',
    ],
  },
  {
    id: 'proj_4',
    title: 'Production Infrastructure as Code (IaC)',
    description:
      'Provision multi-region cloud infrastructure using declarative Terraform configs with automated security group scanning and cost monitoring.',
    difficulty: 'Advanced',
    status: 'Not Started',
    dueDate: 'Nov 24, 2026',
    estimatedHours: 28,
    techStack: ['Terraform', 'AWS/GCP', 'GitHub Actions', 'Docker'],
    deliverables: [
      'Modular Terraform repository for VPC, RDS, and ECS/Cloud Run',
      'CI/CD pipeline with terraform plan validation',
      'Architecture diagram and disaster recovery runbook',
    ],
  },
]

export const INITIAL_FEEDBACK: FeedbackEvaluation[] = [
  {
    id: 'fb_01',
    mentorName: 'Dr. Sarah Lin',
    mentorRole: 'Staff Architect & Lead Mentor',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    date: 'Oct 24, 2026',
    overallRating: 4.9,
    criteria: {
      codeQuality: 5.0,
      architecture: 4.8,
      uiux: 5.0,
      communication: 4.8,
    },
    projectName: 'InternHub Dashboard & Design System',
    comments:
      'Alex demonstrated top-tier engineering hygiene. The component breakdown adheres cleanly to atomic design, and the semantic color tokens make the application visually cohesive and accessible. Keep up this high standard of documentation and attention to detail!',
  },
  {
    id: 'fb_02',
    mentorName: 'Dr. Sarah Lin',
    mentorRole: 'Staff Architect & Lead Mentor',
    date: 'Oct 15, 2026',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    overallRating: 4.8,
    criteria: {
      codeQuality: 4.7,
      architecture: 4.8,
      uiux: 4.9,
      communication: 4.8,
    },
    projectName: 'Module 1 & 2 Technical Sprint Review',
    comments:
      'Solid grasp of TypeScript generics and React 19 transition patterns. Demonstrated great initiative during our weekly architecture sync. For the upcoming telemetry project, pay close attention to connection pool management under peak query loads.',
  },
]

export const INITIAL_REFLECTIONS: WeeklyReflection[] = [
  {
    id: 'ref_01',
    weekNumber: 3,
    date: 'Oct 27, 2026',
    whatWentWell:
      'Successfully implemented the responsive navigation drawer with full keyboard focus trap and Escape key dismissal. Reached 100% test coverage on component props.',
    blockers:
      'Spent time diagnosing CSS specificity with third-party libraries, solved by transitioning to centralized CSS variable tokens.',
    goalsForNextWeek:
      'Finalize the collaborative board project and begin the initial database schemas for telemetry ingestion.',
  },
]

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_01',
    ticketNumber: 'TKT-1082',
    subject: 'Request for AWS Sandbox Credits for Infrastructure Sprint',
    category: 'Technical Issue',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: 'Oct 28, 2026 • 09:15 AM',
    description:
      'Hi team, our upcoming Project 4 requires provisioning a test VPC and multi-AZ database. Requesting an IAM role or sandbox credit allocation.',
    lastReply: 'Cloud Ops: Request approved. Provisioning temporary credentials via AWS IAM Identity Center today.',
  },
  {
    id: 'tkt_02',
    ticketNumber: 'TKT-1049',
    subject: 'Clarification regarding Project 2 Deliverable Rubric',
    category: 'Curriculum Doubt',
    priority: 'Low',
    status: 'Resolved',
    createdAt: 'Oct 20, 2026 • 02:40 PM',
    description: 'Wanted to clarify whether optimistic rollback testing is required for offline scenarios.',
    lastReply: 'Mentor Sarah: Yes, simulating offline status with navigator.onLine is recommended and gives bonus points!',
  },
]

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Projects & Submissions',
    question: 'How do I submit an assigned project for mentor review?',
    answer:
      'Navigate to the Projects section, open the project card, and click "Submit Project". Provide your public GitHub repository URL, a live working deployment URL (e.g. Vercel), and technical reflection notes. Your status will update to "Under Review".',
  },
  {
    id: 'faq_2',
    category: 'Learning & Progress',
    question: 'How is the overall internship completion percentage calculated?',
    answer:
      'Progress is dynamically calculated based on completed curriculum topics (60% weighting) and approved milestone projects (40% weighting). Toggling topics immediately updates your progress bar and KPI counters.',
  },
  {
    id: 'faq_3',
    category: 'Certifications',
    question: 'When and how do I receive my verified Completion Certificate?',
    answer:
      'Once all required modules reach 100% completion and your assigned projects are graded as "Approved", the Completion Certificate button in My Internships will automatically unlock for download and LinkedIn sharing.',
  },
  {
    id: 'faq_4',
    category: 'Mentorship',
    question: 'How do I schedule a 1:1 office hours session with my mentor?',
    answer:
      'Go to either the Dashboard (Mentor Card) or My Internships section. Click "Book 1:1 Meeting" to select an open slot during your mentor’s designated office hours.',
  },
  {
    id: 'faq_5',
    category: 'Technical & Git',
    question: 'What are the required repository standards for project grading?',
    answer:
      'Repositories must include a clean README.md with setup instructions, TypeScript without any implicit "any" errors, ESLint passing with zero errors, and a working production demo link.',
  },
]

// Pure Catalog Data (0% completed, clean slate for authenticated real students)
export const CATALOG_COURSE: Course = {
  ...INITIAL_COURSE,
  modules: INITIAL_COURSE.modules.map((m) => ({
    ...m,
    topics: m.topics.map((t) => ({ ...t, isCompleted: false })),
  })),
}

export const CATALOG_PROJECTS: Project[] = INITIAL_PROJECTS.map((p) => ({
  ...p,
  status: 'In Progress',
  submission: undefined,
}))

// Demo Fixtures for "Explore as Demo Student" Mode
export const DEMO_USER = INITIAL_USER
export const DEMO_COURSE = INITIAL_COURSE
export const DEMO_PROJECTS = INITIAL_PROJECTS
export const DEMO_FEEDBACK = INITIAL_FEEDBACK
export const DEMO_REFLECTIONS = INITIAL_REFLECTIONS
export const DEMO_TICKETS = INITIAL_TICKETS

