/**
 * Verified, authoritative technical learning resources for InternHub curriculum lessons.
 * All URLs are official, publicly accessible, permanent engineering documentation and guides.
 */

export interface LessonResource {
  id: string
  title: string
  url: string
  type: 'documentation' | 'guide' | 'tutorial' | 'exercise' | 'specification'
  platform: string
  description?: string
}

export const TOPIC_RESOURCES: Record<string, LessonResource[]> = {
  // Module 1: Modern Frontend Architecture & React 19
  top_1_1: [
    {
      id: 'res_1_1_1',
      title: 'React 19 Official Documentation & Hooks Reference',
      url: 'https://react.dev/reference/react',
      type: 'documentation',
      platform: 'React.dev',
      description: 'Official API reference for concurrent hooks, transitions, and React 19 action primitives.',
    },
    {
      id: 'res_1_1_2',
      title: 'Managing State & Optimistic UI Updates in React 19',
      url: 'https://react.dev/learn/managing-state',
      type: 'guide',
      platform: 'React Official Guides',
      description: 'Deep dive into concurrent transitions, optimistic UI hooks, and server-action compatible state architecture.',
    },
    {
      id: 'res_1_1_3',
      title: 'Interactive useOptimistic Hook Sandbox',
      url: 'https://react.dev/reference/react/useOptimistic',
      type: 'exercise',
      platform: 'React Interactive Sandbox',
      description: 'Hands-on playground demonstrating zero-latency user updates with rollback handling.',
    },
  ],
  top_1_2: [
    {
      id: 'res_1_2_1',
      title: 'TypeScript Handbook: Type Manipulation & Generics',
      url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
      type: 'documentation',
      platform: 'TypeScript Official Handbook',
      description: 'Creating types from types, mapped types, template literal types, and conditional types.',
    },
    {
      id: 'res_1_2_2',
      title: 'Discriminated Unions and Type Narrowing in Enterprise Apps',
      url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
      type: 'guide',
      platform: 'TypeScript Documentation',
      description: 'Techniques for polymorphic UI components and strict API boundary validation.',
    },
  ],
  top_1_3: [
    {
      id: 'res_1_3_1',
      title: 'shadcn/ui Component Library Architecture',
      url: 'https://ui.shadcn.com/docs/components',
      type: 'documentation',
      platform: 'shadcn/ui',
      description: 'Accessible, reusable components built with Radix Primitives and Tailwind CSS.',
    },
    {
      id: 'res_1_3_2',
      title: 'Tailwind CSS v4 Theming & Design Tokens',
      url: 'https://tailwindcss.com/docs/theme',
      type: 'guide',
      platform: 'Tailwind CSS Docs',
      description: 'Configuring custom tokens, CSS variables, and meeting WCAG AA contrast standards.',
    },
  ],

  // Module 2: Navigation, Client Routing & Caching Architecture
  top_2_1: [
    {
      id: 'res_2_1_1',
      title: 'React Router v7 Protected Routes & Route Guards',
      url: 'https://reactrouter.com/en/main/start/overview',
      type: 'documentation',
      platform: 'React Router Docs',
      description: 'Implementing client-side route protection, session boundaries, and redirect flows.',
    },
    {
      id: 'res_2_1_2',
      title: 'SPA Navigation, Redirect Preservation & Loading Fallbacks',
      url: 'https://reactrouter.com/en/main/components/navigate',
      type: 'guide',
      platform: 'React Router Guides',
      description: 'Preventing layout flashes and preserving destination query parameters across login.',
    },
  ],
  top_2_2: [
    {
      id: 'res_2_2_1',
      title: 'TanStack Query v5 Server State & Query Keys',
      url: 'https://tanstack.com/query/latest/docs/framework/react/overview',
      type: 'documentation',
      platform: 'TanStack Query Docs',
      description: 'Mastering declarative queries, caching lifecycles, and background data synchronization.',
    },
    {
      id: 'res_2_2_2',
      title: 'Optimistic Mutation Patterns & Cache Invalidation',
      url: 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates',
      type: 'guide',
      platform: 'TanStack Query Guides',
      description: 'Step-by-step implementation of optimistic UI mutations with rollback on network failure.',
    },
  ],
  top_2_3: [
    {
      id: 'res_2_3_1',
      title: 'MDN Web Docs: Responsive Navigation & CSS Media Queries',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries',
      type: 'documentation',
      platform: 'MDN Web Docs',
      description: 'CSS grid and flexbox patterns for fluid multi-breakpoint navigation without layout shift.',
    },
    {
      id: 'res_2_3_2',
      title: 'W3C WAI-ARIA Modal Dialog & Mobile Drawer Accessibility',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      type: 'specification',
      platform: 'W3C WAI-ARIA',
      description: 'Accessible drawer specifications: keyboard focus trapping, Escape key closing, and screen reader labels.',
    },
  ],

  // Module 3: Cloud Backend, PostgreSQL & Row-Level Security
  top_3_1: [
    {
      id: 'res_3_1_1',
      title: 'Supabase Database: PostgreSQL Tables & Foreign Keys',
      url: 'https://supabase.com/docs/guides/database/tables',
      type: 'documentation',
      platform: 'Supabase Docs',
      description: 'Relational database schema modeling, primary keys, cascades, and data constraints.',
    },
    {
      id: 'res_3_1_2',
      title: 'PostgreSQL Indexing Strategies & Query Optimization',
      url: 'https://supabase.com/docs/guides/database/postgres/indexes',
      type: 'guide',
      platform: 'PostgreSQL Guides',
      description: 'B-tree indexes, composite indexes, and performance tuning for high-frequency queries.',
    },
  ],
  top_3_2: [
    {
      id: 'res_3_2_1',
      title: 'Supabase Row Level Security (RLS) Policies',
      url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
      type: 'documentation',
      platform: 'Supabase Security Guide',
      description: 'Writing granular SQL policies restricting reads, inserts, and updates to verified student IDs.',
    },
    {
      id: 'res_3_2_2',
      title: 'Multi-Tenant Security & auth.uid() Patterns',
      url: 'https://supabase.com/docs/guides/database/postgres/row-level-security#user-based-policies',
      type: 'guide',
      platform: 'Supabase Security Architecture',
      description: 'Defense-in-depth authorization ensuring students cannot view or mutate other interns records.',
    },
  ],
  top_3_3: [
    {
      id: 'res_3_3_1',
      title: 'Supabase Google OAuth 2.0 PKCE Flow',
      url: 'https://supabase.com/docs/guides/auth/social-login/auth-google',
      type: 'documentation',
      platform: 'Supabase Auth Docs',
      description: 'Configuring Google identity providers, PKCE token exchange, and secure session management.',
    },
    {
      id: 'res_3_3_2',
      title: 'IETF RFC 7636: Proof Key for Code Exchange (PKCE)',
      url: 'https://datatracker.ietf.org/doc/html/rfc7636',
      type: 'specification',
      platform: 'IETF Standards',
      description: 'Official internet engineering specification for secure authorization code interception prevention.',
    },
  ],

  // Module 4: Full-Stack Project Delivery & Submissions
  top_4_1: [
    {
      id: 'res_4_1_1',
      title: 'GitHub Documentation: Pull Requests and Submissions',
      url: 'https://docs.github.com/en/get-started/writing-on-github',
      type: 'documentation',
      platform: 'GitHub Docs',
      description: 'Structuring clean git repositories, clear commit messages, and deployment links.',
    },
    {
      id: 'res_4_1_2',
      title: 'Conventional Commits Specification',
      url: 'https://www.conventionalcommits.org/en/v1.0.0/',
      type: 'specification',
      platform: 'Conventional Commits',
      description: 'Standardized commit message conventions for automated versioning and transparent changelogs.',
    },
  ],
  top_4_2: [
    {
      id: 'res_4_2_1',
      title: 'Google Engineering Practices: Code Reviewer Guide',
      url: 'https://google.github.io/eng-practices/review/reviewer/',
      type: 'documentation',
      platform: 'Google Engineering',
      description: 'Industry-standard guidelines for reviewing pull requests: design, functionality, complexity, and tests.',
    },
    {
      id: 'res_4_2_2',
      title: 'Writing Constructive and Actionable Code Reviews',
      url: 'https://google.github.io/eng-practices/review/reviewer/looking-for.html',
      type: 'guide',
      platform: 'Google Engineering Guides',
      description: 'Best practices for providing empathetic, actionable technical feedback on student projects.',
    },
  ],

  // Module 5: Production Testing, Performance & Vercel CI/CD
  top_5_1: [
    {
      id: 'res_5_1_1',
      title: 'GitHub Actions: Automated CI/CD Workflows',
      url: 'https://docs.github.com/en/actions',
      type: 'documentation',
      platform: 'GitHub Actions Docs',
      description: 'Automating linting, TypeScript compilation, and test execution on every pull request.',
    },
    {
      id: 'res_5_1_2',
      title: 'Vercel Production Deployments & Edge Routing',
      url: 'https://vercel.com/docs/deployments/overview',
      type: 'guide',
      platform: 'Vercel Documentation',
      description: 'Configuring zero-downtime edge deployments, preview branches, and vercel.json rewrite rules.',
    },
  ],
  top_5_2: [
    {
      id: 'res_5_2_1',
      title: 'web.dev: Core Web Vitals & Performance Auditing',
      url: 'https://web.dev/articles/vitals',
      type: 'documentation',
      platform: 'Google web.dev',
      description: 'Measuring and optimizing Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).',
    },
    {
      id: 'res_5_2_2',
      title: 'Lighthouse Performance & Accessibility Audit Guide',
      url: 'https://web.dev/articles/cls',
      type: 'guide',
      platform: 'web.dev Guides',
      description: 'Strategies for eliminating layout shifts, optimizing web fonts, and achieving perfect 100 Lighthouse scores.',
    },
  ],
}

/**
 * Returns verified learning resources for any topic, combining built-in resources
 * with any custom resource link stored on the topic record.
 */
export function getTopicResources(topicId: string, customResourceLink?: string): LessonResource[] {
  const base = TOPIC_RESOURCES[topicId] || []
  if (customResourceLink && !base.some((r) => r.url === customResourceLink)) {
    return [
      {
        id: `res_custom_${topicId}`,
        title: 'Official Technical Reference',
        url: customResourceLink,
        type: 'documentation',
        platform: 'Official Documentation',
        description: 'Primary technical documentation reference for this lesson.',
      },
      ...base,
    ]
  }
  return base
}

