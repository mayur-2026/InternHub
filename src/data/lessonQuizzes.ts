import type { Topic } from '../types'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface LessonQuiz {
  topicId: string
  topicTitle: string
  questions: QuizQuestion[]
}

export const TOPIC_QUIZZES: Record<string, QuizQuestion[]> = {
  "top_1_1": [
    {
      id: "q_1_1_1",
      question: "Which React 19 hook allows optimistic UI state mutations during async operations with automatic rollback on error?",
      options: [
        "useTransitionState",
        "useOptimistic",
        "useAsyncCallback",
        "useDeferredState"
      ],
      correctIndex: 1,
      explanation: "useOptimistic provides instantaneous user feedback while an asynchronous Server Action or API mutation completes."
    },
    {
      id: "q_1_1_2",
      question: "What is the primary advantage of React 19 concurrent action transitions?",
      options: [
        "They eliminate the need for any CSS styling",
        "They turn all client components into server components",
        "They keep the interface responsive without blocking the main render thread",
        "They bypass all JavaScript validation"
      ],
      correctIndex: 2,
      explanation: "Action transitions allow state updates to be deferred or deprioritized so user input remains smooth and unblocked."
    },
    {
      id: "q_1_1_3",
      question: "How does React 19 handle form submissions using the new Action attribute on `<form>` elements?",
      options: [
        "It allows passing an async function directly to the action prop with automatic pending states",
        "It requires installing a third-party form library to handle onSubmit",
        "It converts all input fields into uncontrolled components permanently",
        "It forces a full-page browser refresh on every form submission"
      ],
      correctIndex: 0,
      explanation: "React 19 native form Actions accept async functions and integrate seamlessly with hooks like useActionState."
    },
    {
      id: "q_1_1_4",
      question: "What is the key benefit of React 19 automatic batching across asynchronous boundaries?",
      options: [
        "State updates are executed synchronously one by one across separate repaints",
        "It requires manually wrapping all async calls in ReactDOM.flushSync",
        "It disables component re-rendering entirely",
        "Multiple state updates within async callbacks are batched into a single render pass"
      ],
      correctIndex: 3,
      explanation: "Automatic batching across promises and async microtasks minimizes unnecessary intermediate renders and boosts performance."
    },
    {
      id: "q_1_1_5",
      question: "How does the React 19 Compiler optimize component renders compared to manual memoization?",
      options: [
        "It requires developers to manually add useMemo to every single variable in a component",
        "It automatically analyzes and memoizes component subtrees and values without manual useMemo or useCallback",
        "It converts all React JSX into raw WebAssembly binaries",
        "It disables React Virtual DOM reconciliation"
      ],
      correctIndex: 1,
      explanation: "The React Compiler understands JavaScript semantics and automatically memoizes values and component trees at build time."
    }
  ],
  "top_1_2": [
    {
      id: "q_1_2_1",
      question: "Which TypeScript design pattern provides type-safe polymorphic handling across variant state models?",
      options: [
        "Casting everything to any or unknown",
        "Discriminated Unions with a common literal discriminator tag",
        "Global module augmenting with namespace merging",
        "Disabling strictNullChecks in tsconfig.json"
      ],
      correctIndex: 1,
      explanation: "Discriminated unions ensure exhaustive compile-time checking and eliminate accidental runtime property access errors."
    },
    {
      id: "q_1_2_2",
      question: "Why should enterprise component props use generic type constraints?",
      options: [
        "To increase bundle size and slow down TypeScript compilation",
        "To allow arbitrary untyped objects without compiler validation",
        "To enforce strict type safety across async boundaries without losing narrow types",
        "To disable React synthetic event propagation"
      ],
      correctIndex: 2,
      explanation: "Generic constraints guarantee type soundness when passing polymorphic props, elements, and event handlers."
    },
    {
      id: "q_1_2_3",
      question: "What is the purpose of TypeScript Template Literal Types in enterprise UI libraries?",
      options: [
        "To compose and validate strictly typed string combinations such as Tailwind classes or event keys",
        "To convert HTML strings directly into React Virtual DOM nodes at runtime",
        "To allow arbitrary runtime string concatenation without type checking",
        "To replace TypeScript interfaces with JavaScript template strings"
      ],
      correctIndex: 0,
      explanation: "Template literal types allow compile-time validation for dynamic string patterns, preventing invalid combinations."
    },
    {
      id: "q_1_2_4",
      question: "What does the `as const` assertion achieve in a TypeScript configuration object?",
      options: [
        "It converts the object into a JavaScript runtime Proxy",
        "It converts all functions into async functions",
        "It suppresses all TypeScript compiler warnings for that object",
        "It infers narrow literal types and marks all nested properties as readonly"
      ],
      correctIndex: 3,
      explanation: "Using `as const` instructs TypeScript to infer the most narrow literal types possible and marks object properties as readonly."
    },
    {
      id: "q_1_2_5",
      question: "How does an exhaustive switch statement with the `never` type prevent runtime regressions?",
      options: [
        "It automatically executes all switch cases simultaneously",
        "It causes a compile-time error if a new variant is added to a union without being handled",
        "It ignores unknown union variants without throwing any errors",
        "It converts runtime exceptions into console warnings"
      ],
      correctIndex: 1,
      explanation: "Assigning unhandled values to a variable typed as `never` guarantees at compile time that all union cases have been handled."
    }
  ],
  "top_1_3": [
    {
      id: "q_1_3_1",
      question: "What is a critical WCAG accessibility requirement for modal Dialog components in shadcn/ui?",
      options: [
        "Playing an audible beep every time a modal opens",
        "Trapping keyboard focus within the dialog and restoring focus upon close",
        "Preventing the Escape key from closing the dialog",
        "Hiding the dialog background overlay completely"
      ],
      correctIndex: 1,
      explanation: "Accessible dialogs must trap focus inside the modal, respond to the Escape key, and restore focus to the trigger on close."
    },
    {
      id: "q_1_3_2",
      question: "How do semantic CSS tokens benefit design system maintainability in Tailwind CSS?",
      options: [
        "They hardcode absolute pixel hex values across all component templates",
        "They eliminate the need for any CSS classes in HTML files",
        "They centralize brand colors, typography, and spacing into theme variables supporting effortless dark mode and rebranding",
        "They increase the total number of CSS classes required in every component"
      ],
      correctIndex: 2,
      explanation: "Semantic tokens abstract concrete values like hex codes into meaningful design concepts (e.g., bg-primary, text-muted)."
    },
    {
      id: "q_1_3_3",
      question: "Why are Radix UI primitives favored as the foundation for modern headless component libraries?",
      options: [
        "They provide unstyled, accessible interactive logic while giving developers full styling control with Tailwind",
        "They force predefined fixed CSS styles that cannot be customized",
        "They completely replace the React rendering engine with native web components",
        "They only work with jQuery and legacy JavaScript libraries"
      ],
      correctIndex: 0,
      explanation: "Radix UI handles ARIA attributes, keyboard navigation, and focus management while leaving visual presentation 100% to Tailwind."
    },
    {
      id: "q_1_3_4",
      question: "What is the recommended minimum touch tap-target size under WCAG guidelines for mobile touchscreens?",
      options: [
        "10x10 CSS pixels to maximize screen density",
        "100x100 CSS pixels on every button",
        "There is no minimum size recommendation for touch targets",
        "At least 44x44 CSS pixels (or 24x24 pixels with sufficient surrounding spacing)"
      ],
      correctIndex: 3,
      explanation: "A minimum 44x44px target area ensures users with motor impairments or using one-handed mobile devices can reliably tap buttons."
    },
    {
      id: "q_1_3_5",
      question: "What is the purpose of visible 2px focus outlines with `focus-visible` styling in a modern design system?",
      options: [
        "They prevent users from interacting with form inputs",
        "They provide clear visual feedback for keyboard navigators without showing intrusive rings on mouse clicks",
        "They create a permanent visual border around all screen elements",
        "They disable browser tab navigation entirely"
      ],
      correctIndex: 1,
      explanation: "The `:focus-visible` pseudo-class ensures keyboard navigation is clearly indicated while avoiding distracting rings on mouse clicks."
    }
  ],
  "top_2_1": [
    {
      id: "q_2_1_1",
      question: "In React Router v7, how should an authentication guard preserve the user’s intended destination?",
      options: [
        "Store the destination in an unencrypted localStorage key with a 1-year expiration",
        "Pass the current location in the navigation state: `<Navigate to=\"/login\" replace state={{ from: location }} />`",
        "Force the user back to the homepage and forget what they clicked",
        "Block navigation with an alert prompt"
      ],
      correctIndex: 1,
      explanation: "Preserving the previous location in React Router state allows seamless redirection back to the target page after login."
    },
    {
      id: "q_2_1_2",
      question: "What is the best way to prevent layout flash while checking authentication status on page load?",
      options: [
        "Immediately render the protected view and hope the network request succeeds",
        "Redirect to login immediately before checking authentication",
        "Render a full-page layout skeleton until session resolution finishes",
        "Disable all CSS animations"
      ],
      correctIndex: 2,
      explanation: "Displaying a skeleton or loader during initial session initialization prevents jarring visual flashes between public and private views."
    },
    {
      id: "q_2_1_3",
      question: "What is the key difference between HTTP 401 Unauthorized and HTTP 403 Forbidden in client routing?",
      options: [
        "401 signifies unauthenticated (must log in); 403 signifies authenticated but lacks required permissions",
        "401 means the server is down; 403 means the URL does not exist",
        "401 and 403 are completely identical in modern HTTP standards",
        "401 redirects to the homepage; 403 crashes the application"
      ],
      correctIndex: 0,
      explanation: "A 401 response prompts the user to log in, whereas a 403 response shows an unauthorized role permissions screen."
    },
    {
      id: "q_2_1_4",
      question: "How do React Router v7 loader functions enhance page load performance?",
      options: [
        "They compress client images on the fly before rendering",
        "They bundle all JavaScript into a single synchronous file",
        "They bypass client-side routing and trigger server-rendered PHP pages",
        "They fetch critical route data in parallel before the route component begins rendering"
      ],
      correctIndex: 3,
      explanation: "Loaders decouple data fetching from component rendering, preventing sequential render-then-fetch request waterfalls."
    },
    {
      id: "q_2_1_5",
      question: "Why should route transition guards use `replace: true` when redirecting unauthenticated users?",
      options: [
        "To prevent the user from ever visiting the target URL again",
        "To replace the current history entry so clicking the browser Back button does not trigger an infinite redirect loop",
        "To speed up JavaScript execution by clearing the entire browser history",
        "To disable browser forward navigation permanently"
      ],
      correctIndex: 1,
      explanation: "Replacing the history entry prevents the user from being trapped in an endless redirect loop when pressing Back."
    }
  ],
  "top_2_2": [
    {
      id: "q_2_2_1",
      question: "What is the primary architectural purpose of TanStack Query in a modern React application?",
      options: [
        "Replacing local component useState and useReducer completely",
        "Managing asynchronous server state with automated caching, background refetching, and deduplication",
        "Managing CSS stylesheets and Tailwind themes",
        "Encrypting client-side cookies with symmetric keys"
      ],
      correctIndex: 1,
      explanation: "TanStack Query specializes in server state management, caching remote data, and keeping it synchronized with the backend."
    },
    {
      id: "q_2_2_2",
      question: "What is the fundamental difference between `staleTime` and `gcTime` in TanStack Query?",
      options: [
        "staleTime is measured in days while gcTime is measured in milliseconds",
        "staleTime applies to mutations while gcTime applies to queries",
        "staleTime defines how long data is considered fresh; gcTime defines how long unused cache is preserved in memory",
        "There is no difference; they are aliases for the same configuration"
      ],
      correctIndex: 2,
      explanation: "Data remains fresh during staleTime and will not refetch on mount. gcTime dictates when unobserved cached data is garbage collected."
    },
    {
      id: "q_2_2_3",
      question: "What is the recommended pattern when performing optimistic updates with TanStack Query?",
      options: [
        "Cancel outgoing refetches, save snapshot of current cache in context, update cache optimistically, and rollback on error",
        "Mutate the database directly from client React components without checking for errors",
        "Wait for the server response before updating the user interface",
        "Reload the entire browser window whenever a mutation occurs"
      ],
      correctIndex: 0,
      explanation: "Optimistic updates provide instant UI feedback while ensuring safety through snapshot-based rollbacks if the network request fails."
    },
    {
      id: "q_2_2_4",
      question: "How should query keys be structured in TanStack Query to allow granular cache invalidation?",
      options: [
        "Using a single random string that changes on every render",
        "Using global numbers like `1`, `2`, `3`",
        "Query keys should always be omitted in production",
        "Using hierarchical arrays like `['projects', projectId, 'submissions']`"
      ],
      correctIndex: 3,
      explanation: "Hierarchical array keys allow invalidating specific items or an entire category (e.g. invalidating all queries starting with ['projects'])."
    },
    {
      id: "q_2_2_5",
      question: "What happens when `queryClient.invalidateQueries({ queryKey: ['topics'] })` is called?",
      options: [
        "All cached data is permanently erased and never refetched again",
        "Matching queries are marked as stale, and currently rendered active queries are immediately refetched in the background",
        "The user is logged out of their current session",
        "All browser network connections are severed"
      ],
      correctIndex: 1,
      explanation: "Invalidating queries signals to TanStack Query that the data may have changed, prompting automatic background synchronization."
    }
  ],
  "top_2_3": [
    {
      id: "q_2_3_1",
      question: "How should a responsive dashboard layout handle navigation between desktop and mobile screen sizes?",
      options: [
        "Hide all navigation on mobile to save screen space",
        "Render a persistent sidebar on desktop (≥1024px) and an accessible off-canvas drawer on mobile (<1024px)",
        "Use horizontal scrolling menus on both desktop and mobile",
        "Force desktop screen resolution on mobile devices via viewport meta tags"
      ],
      correctIndex: 1,
      explanation: "Modern enterprise dashboards offer a fixed sidebar for desktop productivity and an overlay drawer for mobile screens."
    },
    {
      id: "q_2_3_2",
      question: "What accessibility requirement must be implemented when an off-canvas mobile drawer opens?",
      options: [
        "Play an audio sound and flash the screen background",
        "Lock the device screen orientation permanently",
        "Trap keyboard focus inside the drawer, handle the Escape key to close, and restore focus to the toggle button",
        "Disable all tap interactions outside the drawer"
      ],
      correctIndex: 2,
      explanation: "Focus trapping and keyboard shortcuts (Escape) are essential WCAG requirements for any overlay or modal drawer component."
    },
    {
      id: "q_2_3_3",
      question: "How do you prevent the background page from scrolling when an overlay navigation drawer is active on iOS and Android?",
      options: [
        "Apply `overflow: hidden` to document.body while the drawer is open",
        "Remove all elements from the DOM except the drawer",
        "Disable JavaScript touch event listeners globally",
        "Set the browser zoom level to 200%"
      ],
      correctIndex: 0,
      explanation: "Setting overflow hidden on the body prevents body scroll chaining while users navigate within a modal or drawer."
    },
    {
      id: "q_2_3_4",
      question: "Which ARIA attribute indicates whether an expandable mobile navigation menu is currently open or collapsed?",
      options: [
        "aria-hidden=\"true\"",
        "aria-selected=\"true\"",
        "aria-checked=\"true\"",
        "aria-expanded=\"true\" or \"false\""
      ],
      correctIndex: 3,
      explanation: "`aria-expanded` communicates to assistive technologies whether an accordion, drawer, or dropdown menu is open."
    },
    {
      id: "q_2_3_5",
      question: "What is the advantage of using fluid CSS Grid column tracks (e.g. `grid-template-columns: 1.6fr 1fr`) on wide displays?",
      options: [
        "It forces all grid columns to maintain a fixed 200px width",
        "It maintains proportional visual hierarchy across ultra-wide monitors without harsh fixed-width breakpoint jumps",
        "It eliminates the need for any CSS stylesheet",
        "It makes the layout non-responsive on small screens"
      ],
      correctIndex: 1,
      explanation: "Fractional units (`fr`) distribute available space smoothly across high-resolution displays, creating balanced dashboards."
    }
  ],
  "top_3_1": [
    {
      id: "q_3_1_1",
      question: "What is the primary benefit of defining `ON DELETE CASCADE` on foreign key relationships in PostgreSQL?",
      options: [
        "Preventing any record from ever being deleted from the database",
        "Automatically deleting dependent child records (such as submissions) when a parent record is removed",
        "Encrypting the foreign key column with AES-256",
        "Converting relational tables into NoSQL document collections"
      ],
      correctIndex: 1,
      explanation: "ON DELETE CASCADE maintains referential integrity by automatically cleaning up orphan rows when parent records are deleted."
    },
    {
      id: "q_3_1_2",
      question: "Why should PostgreSQL foreign key columns (like `student_id` or `project_id`) always be indexed?",
      options: [
        "To prevent the database from writing new rows to disk",
        "To convert foreign key integers into alphanumeric UUIDs",
        "PostgreSQL does not index foreign keys automatically, and indexing them accelerates JOINs and filtered lookups",
        "Indexes are required by law for all database columns"
      ],
      correctIndex: 2,
      explanation: "While primary keys are automatically indexed, foreign keys require explicit indexes to avoid full table scans during JOIN queries."
    },
    {
      id: "q_3_1_3",
      question: "What is the purpose of Third Normal Form (3NF) in relational schema modeling?",
      options: [
        "Eliminating transitive dependencies so every non-key column depends solely on the primary key, reducing redundancy",
        "Combining all database tables into one single monolithic spreadsheet",
        "Storing JSON strings instead of typed relational columns",
        "Disabling foreign key constraints to improve insert speeds"
      ],
      correctIndex: 0,
      explanation: "3NF ensures each piece of information is stored in exactly one place, preventing data anomalies and update discrepancies."
    },
    {
      id: "q_3_1_4",
      question: "How do database transactions (`BEGIN ... COMMIT`) ensure data consistency in multi-step operations?",
      options: [
        "They execute SQL queries asynchronously in random order",
        "They duplicate data across multiple backup tables automatically",
        "They bypass database foreign key checks during writes",
        "They guarantee atomicity: either all operations succeed together, or the entire transaction rolls back with zero partial writes"
      ],
      correctIndex: 3,
      explanation: "Atomicity (the A in ACID) ensures that partial updates do not corrupt the database if an intermediate step fails."
    },
    {
      id: "q_3_1_5",
      question: "What is the function of a `UNIQUE(student_id, topic_id)` composite constraint?",
      options: [
        "It requires student_id and topic_id to be identical numbers",
        "It prevents duplicate progress or completion records for the same student and lesson combination",
        "It prevents any other student from completing that lesson forever",
        "It creates a temporary in-memory database table"
      ],
      correctIndex: 1,
      explanation: "Composite unique constraints ensure that a student can have at most one progress record per topic in the database."
    }
  ],
  "top_3_2": [
    {
      id: "q_3_2_1",
      question: "In Supabase Row Level Security (RLS), how do you restrict students to only read their own project submissions?",
      options: [
        "Filter the data in React using `submissions.filter(s => s.studentId === myId)`",
        "CREATE POLICY \"read_own\" ON project_submissions FOR SELECT USING (auth.uid() = student_id);",
        "Store student passwords in localStorage and send them with every query",
        "Disable Row Level Security on the project_submissions table"
      ],
      correctIndex: 1,
      explanation: "RLS policies operate at the PostgreSQL engine level; auth.uid() verifies the authenticated identity regardless of client code."
    },
    {
      id: "q_3_2_2",
      question: "What command must be executed on a PostgreSQL table before any RLS policies take effect?",
      options: [
        "GRANT ALL PRIVILEGES ON ALL TABLES TO PUBLIC;",
        "DROP POLICY ALL ON table_name;",
        "ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;",
        "SET rls = true IN postgresql.conf;"
      ],
      correctIndex: 2,
      explanation: "By default, PostgreSQL tables ignore policies until `ENABLE ROW LEVEL SECURITY` is explicitly executed on that table."
    },
    {
      id: "q_3_2_3",
      question: "Why is client-side filtering (e.g. `supabase.from('table').eq('student_id', id)`) insufficient without database RLS?",
      options: [
        "Any user can modify client-side network requests or query parameters to access another student’s data if RLS is disabled",
        "Client-side filters are too slow to execute in modern browsers",
        "PostgreSQL rejects any query that contains a `.eq()` filter",
        "Browsers do not support sending query parameters over HTTPS"
      ],
      correctIndex: 0,
      explanation: "Never rely on client-side filtering for security. Without RLS, anyone can alter request payloads to inspect or alter any record."
    },
    {
      id: "q_3_2_4",
      question: "What is the purpose of the `WITH CHECK` clause in an RLS `INSERT` or `UPDATE` policy?",
      options: [
        "It checks whether the database disk has sufficient free space",
        "It checks whether the user has a valid internet connection",
        "It converts the query into a read-only SELECT operation",
        "It validates that newly inserted or updated rows satisfy security criteria (such as setting student_id to auth.uid())"
      ],
      correctIndex: 3,
      explanation: "The `WITH CHECK` expression validates incoming rows before they are written, preventing students from impersonating others."
    },
    {
      id: "q_3_2_5",
      question: "What is the security risk of configuring a PostgreSQL database function as `SECURITY DEFINER` without setting `search_path`?",
      options: [
        "It causes the function to run in a read-only transaction",
        "It executes with the privileges of the function owner, making it susceptible to malicious search_path schema injection",
        "It prevents the function from ever returning any data",
        "It forces all database users to reset their passwords"
      ],
      correctIndex: 1,
      explanation: "SECURITY DEFINER functions should always specify `SET search_path = public` to prevent untrusted schema resolution attacks."
    }
  ],
  "top_3_3": [
    {
      id: "q_3_3_1",
      question: "What is the primary role of PKCE (Proof Key for Code Exchange) in OAuth 2.0 single-page applications?",
      options: [
        "Encrypting the entire web application bundle with RSA keys",
        "Preventing authorization code interception attacks without requiring a client secret in the public browser",
        "Replacing HTTPS certificates with client-generated tokens",
        "Storing user passwords permanently in the browser cookies"
      ],
      correctIndex: 1,
      explanation: "PKCE generates a dynamic code_verifier and code_challenge, ensuring that only the original initiator can exchange the auth code."
    },
    {
      id: "q_3_3_2",
      question: "Why should public Single Page Applications (SPAs) NEVER store client secret keys in client-side code?",
      options: [
        "Client secrets slow down JavaScript execution in the browser",
        "Modern browsers automatically block files containing secrets",
        "All client-side code is visible in the browser, meaning any user or attacker can extract and abuse the secret",
        "Client secrets are only valid for 10 milliseconds"
      ],
      correctIndex: 2,
      explanation: "Client code is completely public. Storing secrets in frontend bundles compromises security and violates OAuth standards."
    },
    {
      id: "q_3_3_3",
      question: "How should student profile information (name, avatar, email) be synchronized after an OAuth sign-in?",
      options: [
        "An automated Supabase database trigger on `auth.users` creates or updates a row in the public `profiles` table",
        "The student must manually type their profile details on every login",
        "Profile information should be stored in plain text browser cookies",
        "Profiles cannot be stored in relational databases"
      ],
      correctIndex: 0,
      explanation: "A PostgreSQL trigger on auth.users automatically propagates Google or GitHub metadata to public application profile tables."
    },
    {
      id: "q_3_3_4",
      question: "What is the purpose of short-lived JWT access tokens paired with refresh tokens?",
      options: [
        "Forcing users to re-enter their password every 5 minutes",
        "Increasing server network traffic to test infrastructure capacity",
        "Preventing browsers from caching static CSS stylesheets",
        "Limiting the window of vulnerability if an access token is leaked, while allowing transparent background renewal"
      ],
      correctIndex: 3,
      explanation: "Short-lived access tokens (e.g. 1 hour) minimize risk from token interception; refresh tokens safely obtain new access tokens."
    },
    {
      id: "q_3_3_5",
      question: "Where should sensitive session tokens ideally be stored to prevent Cross-Site Scripting (XSS) extraction?",
      options: [
        "In `localStorage` or `window.myToken`",
        "In `HttpOnly`, `Secure`, `SameSite=Lax` cookies that JavaScript cannot read",
        "In the document title bar",
        "In a public URL query parameter on every page"
      ],
      correctIndex: 1,
      explanation: "`HttpOnly` cookies cannot be accessed via `document.cookie` or malicious injected scripts, defending against XSS credential theft."
    }
  ],
  "top_4_1": [
    {
      id: "q_4_1_1",
      question: "What regex pattern effectively validates a public GitHub repository URL in a submission input?",
      options: [
        "/^http:\\/\\/localhost:[0-9]+$/",
        "/^https:\\/\\/github\\.com\\/[A-Za-z0-9_.-]+\\/[A-Za-z0-9_.-]+\\/?$/",
        "/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/",
        "/^github\\.exe$/"
      ],
      correctIndex: 1,
      explanation: "The regex verifies the HTTPS protocol, github.com domain, valid username/organization slug, and repository name."
    },
    {
      id: "q_4_1_2",
      question: "Why should project submission forms enforce `https://` protocols for live demo links?",
      options: [
        "Because browsers refuse to open any HTTP website completely",
        "To increase the speed of the user’s broadband connection",
        "To prevent Mixed Content security warnings, data tampering, and insecure plain-text HTTP connections",
        "HTTPS is only required for e-commerce shopping carts"
      ],
      correctIndex: 2,
      explanation: "HTTPS provides encrypted transport security and protects reviewers from visiting compromised or insecure endpoints."
    },
    {
      id: "q_4_1_3",
      question: "What is the correct sequential status progression for an internship project in InternHub?",
      options: [
        "Assigned / Not Started → In Progress → Under Review → Approved (or Needs Revision)",
        "Approved → In Progress → Assigned → Deleted",
        "Under Review → Not Started → Approved → In Progress",
        "There are no status values; all projects are always completed"
      ],
      correctIndex: 0,
      explanation: "Projects begin as assigned, transition to in progress when started, enter review when submitted, and complete upon approval."
    },
    {
      id: "q_4_1_4",
      question: "How do you prevent duplicate submission requests when a student clicks the Submit Project button multiple times?",
      options: [
        "Hide the browser window immediately after the first click",
        "Clear all form fields before the network request is initiated",
        "Show an alert box asking the user to wait 10 seconds",
        "Disable the button and set an `isSubmitting` loading state during the pending asynchronous operation"
      ],
      correctIndex: 3,
      explanation: "Disabling the submit button and showing an active loading spinner prevents duplicate requests and accidental multiple records."
    },
    {
      id: "q_4_1_5",
      question: "Why should submission forms provide helpful, contextual error messages rather than generic error banners?",
      options: [
        "Generic error messages reduce JavaScript bundle size",
        "Clear error feedback explains exactly what field is invalid (e.g. invalid GitHub URL structure) so the student can correct it quickly",
        "Contextual errors are only necessary for backend database administrators",
        "Error messages should be hidden from students completely"
      ],
      correctIndex: 1,
      explanation: "Descriptive validation messages satisfy usability heuristics and help students quickly resolve input errors."
    }
  ],
  "top_4_2": [
    {
      id: "q_4_2_1",
      question: "What are the four core criteria of an effective engineering code review rubric?",
      options: [
        "Font Selection, Color Schemes, Background Wallpapers, and Logo Sizes",
        "Architecture & Patterns, Code Quality & Maintainability, Accessibility & UI, and Test Coverage",
        "Number of Lines Written, Speed of Typing, Keystroke Count, and Mouse Clicks",
        "Whether the author used Mac or Windows"
      ],
      correctIndex: 1,
      explanation: "High-impact code reviews evaluate technical structure, readability, accessibility compliance, and test verification."
    },
    {
      id: "q_4_2_2",
      question: "How should a senior engineer phrase constructive feedback during a pull request code review?",
      options: [
        "Criticize the author personally and reject the pull request without explanation",
        "Approve all pull requests immediately without reading the code",
        "Explain the rationale, highlight potential edge cases, and provide an actionable code example or alternative approach",
        "Tell the author to delete the repository and start over"
      ],
      correctIndex: 2,
      explanation: "Constructive reviews foster growth by explaining the reasoning behind suggestions and offering concrete solutions."
    },
    {
      id: "q_4_2_3",
      question: "Why is automated linting and formatting (ESLint, Prettier) separated from human code review?",
      options: [
        "Automated tools eliminate trivial stylistic debates so human reviewers can focus on architecture, correctness, and security",
        "Human reviewers are better at counting indentation spaces than automated parsers",
        "Linters should only be run after code has been deployed to production",
        "Prettier replaces the need for any human code reviews"
      ],
      correctIndex: 0,
      explanation: "Automating mechanical style checks frees reviewers to evaluate high-level architecture, business logic, and security."
    },
    {
      id: "q_4_2_4",
      question: "What is the optimal pull request size according to software engineering industry benchmarks?",
      options: [
        "At least 5,000 lines of code per pull request to minimize the number of commits",
        "Exactly 1 single character per pull request",
        "PR size has no impact on code review thoroughness or bug rates",
        "Under 400 lines of changed code to maximize review quality and defect detection rates"
      ],
      correctIndex: 3,
      explanation: "Studies show review effectiveness drops drastically beyond 400 lines of diff as reviewer cognitive fatigue sets in."
    },
    {
      id: "q_4_2_5",
      question: "What role does structured self-reflection play in an engineering internship evaluation?",
      options: [
        "It is a mandatory formality with no impact on learning outcomes",
        "It helps interns assess their progress, identify technical bottlenecks, and set concrete goals for subsequent development sprints",
        "It replaces code writing entirely during the internship",
        "It is only used to compute the intern’s daily attendance score"
      ],
      correctIndex: 1,
      explanation: "Regular retrospectives build metacognitive skills, helping junior developers learn faster and target areas for improvement."
    }
  ],
  "top_5_1": [
    {
      id: "q_5_1_1",
      question: "What is the purpose of running automated GitHub Actions CI workflows on every pull request?",
      options: [
        "Increasing cloud server bills without testing code",
        "Catching TypeScript errors, lint violations, and broken tests before code reaches the main branch",
        "Replacing manual code reviews with automated bot approvals",
        "Publishing development builds directly to production without testing"
      ],
      correctIndex: 1,
      explanation: "Continuous Integration verifies code health automatically on every commit, preventing regressions in production."
    },
    {
      id: "q_5_1_2",
      question: "Why is an SPA rewrite configuration (`\"source\": \"/(.*)\", \"destination\": \"/index.html\"`) necessary in `vercel.json`?",
      options: [
        "It redirects all HTTP requests to Google.com",
        "It blocks search engine web crawlers from indexing the site",
        "It routes all direct URL visits and browser page refreshes to the single-page application entry point instead of returning 404",
        "It converts React components into static HTML files at build time"
      ],
      correctIndex: 2,
      explanation: "SPAs use client-side routing. Without a rewrite rule, the web server would return a 404 for deep links like /learning or /projects."
    },
    {
      id: "q_5_1_3",
      question: "How does caching `node_modules` and package lock files in GitHub Actions improve CI build performance?",
      options: [
        "It avoids downloading identical npm dependencies on every build, reducing CI pipeline runtimes from minutes to seconds",
        "It prevents new packages from ever being installed",
        "It reduces the disk space of the developer’s local laptop",
        "It disables npm package security audits"
      ],
      correctIndex: 0,
      explanation: "Action caching saves and restores dependency directories, drastically accelerating repetitive build and test cycles."
    },
    {
      id: "q_5_1_4",
      question: "How should sensitive environment variables (such as database credentials or API keys) be configured in Vercel?",
      options: [
        "Hardcoded directly into `src/constants.ts` and pushed to public GitHub repositories",
        "Written into a public README.md file for easy access",
        "Transmitted as plaintext URL parameters in browser bookmarks",
        "Defined securely in Vercel Project Settings under Environment Variables with scoped production and preview environments"
      ],
      correctIndex: 3,
      explanation: "Platform environment variables inject secrets securely at build and runtime without exposing them in version control."
    },
    {
      id: "q_5_1_5",
      question: "What is the primary benefit of Vercel preview deployments generated for every pull request branch?",
      options: [
        "They replace the need for automated testing",
        "They provide an isolated, live production-identical URL for stakeholders and QA engineers to test changes before merging",
        "They publish unfinished code directly to the customer-facing production domain",
        "They permanently delete the previous production build"
      ],
      correctIndex: 1,
      explanation: "Preview deployments allow full manual and automated end-to-end verification in a real production-like environment before merging."
    }
  ],
  "top_5_2": [
    {
      id: "q_5_2_1",
      question: "Which Core Web Vital measures visual stability and prevents jarring layout shifts as images and web fonts load?",
      options: [
        "Largest Contentful Paint (LCP)",
        "Cumulative Layout Shift (CLS)",
        "Interaction to Next Paint (INP)",
        "First Contentful Paint (FCP)"
      ],
      correctIndex: 1,
      explanation: "Cumulative Layout Shift (CLS) scores how much content unexpectedly jumps around during page loading."
    },
    {
      id: "q_5_2_2",
      question: "How do you achieve a near-zero Cumulative Layout Shift (CLS) score for media thumbnails and video players?",
      options: [
        "Load images without specifying any dimensions and let the browser reflow the page when they finish downloading",
        "Disable all images and media across the application",
        "Reserve display space in advance using CSS aspect-ratio or explicit width/height dimensions, paired with skeleton loaders",
        "Wait 5 seconds before displaying any text on the page"
      ],
      correctIndex: 2,
      explanation: "Explicit dimensions and aspect-ratio CSS rules reserve layout space immediately, eliminating layout shifts when assets load."
    },
    {
      id: "q_5_2_3",
      question: "Which technique is most effective for optimizing Largest Contentful Paint (LCP) for above-the-fold hero content?",
      options: [
        "Preloading the hero image via `<link rel=\"preload\">`, using modern formats (WebP/AVIF), and optimizing server response times",
        "Lazy loading the hero image with loading=\"lazy\"",
        "Compressing JavaScript bundles with zero code splitting",
        "Serving uncompressed 4K resolution PNG images to all mobile devices"
      ],
      correctIndex: 0,
      explanation: "Preloading and prioritizing the main above-the-fold image ensures the browser fetches it immediately, driving down LCP."
    },
    {
      id: "q_5_2_4",
      question: "What is the primary objective of the Interaction to Next Paint (INP) Core Web Vital metric?",
      options: [
        "Measuring how long it takes to download HTML from the server",
        "Measuring the total number of colors used in CSS stylesheets",
        "Measuring the speed of CSS animations during idle time",
        "Measuring how quickly the page responds visually to user interactions like clicks, taps, and key presses"
      ],
      correctIndex: 3,
      explanation: "INP evaluates responsiveness throughout the entire page lifecycle by measuring the latency of user interactions until visual feedback."
    },
    {
      id: "q_5_2_5",
      question: "How does route-based code splitting with `React.lazy` and `Suspense` benefit initial page load times?",
      options: [
        "It downloads all possible future pages synchronously before rendering the current page",
        "It splits the application into smaller JavaScript chunks, downloading only the code required for the current route on first visit",
        "It disables browser caching so users always download fresh JavaScript",
        "It converts React components into server-rendered PDF documents"
      ],
      correctIndex: 1,
      explanation: "Code splitting dramatically reduces initial bundle size, allowing the browser to parse, compile, and execute code much faster."
    }
  ]
}

/**
 * Returns authored quiz questions for a topic, with guaranteed >= 5 questions
 */
export function getLessonQuiz(topic: Topic): QuizQuestion[] {
  const baseQuestions = TOPIC_QUIZZES[topic.id] ? [...TOPIC_QUIZZES[topic.id]] : []

  if (baseQuestions.length >= 5) {
    return baseQuestions
  }

  // Fallbacks to strictly guarantee at least 5 questions
  const supplementaryPrompts = [
    {
      q: `What is the primary architectural objective of studying "${topic.title}"?`,
      correct: topic.description || `To master the engineering standards and patterns required for ${topic.title}.`,
      distractors: [
        'To bypass all modern software engineering guidelines',
        'To introduce regressions and technical debt into production',
        'To eliminate component modularity and reusability',
      ],
      targetIdx: 1,
      exp: `Understanding ${topic.title} ensures robust, production-grade application architecture.`,
    },
    {
      q: `How does applying the concepts from "${topic.title}" improve overall product reliability?`,
      correct: 'By enforcing consistent type safety, resilient error handling, and scalable design patterns.',
      distractors: [
        'By disabling automated linting and continuous integration',
        'By avoiding all code reviews and feedback iterations',
        'By coupling business logic tightly to concrete DOM implementations',
      ],
      targetIdx: 2,
      exp: 'Rigorous engineering standards ensure system stability under real-world production conditions.',
    },
    {
      q: `Which verification technique should be used after implementing changes related to "${topic.title}"?`,
      correct: 'Running automated unit and integration tests along with strict TypeScript compilation checks.',
      distractors: [
        'Deploying untested code directly to customer production environments',
        'Deleting all existing test files to accelerate the build pipeline',
        'Disabling all browser console error reporting',
      ],
      targetIdx: 0,
      exp: 'Verification through automated tests and compile-time type checks prevents regressions.',
    },
    {
      q: `When collaborating with team members on "${topic.title}", what is an industry best practice?`,
      correct: 'Opening focused, well-documented pull requests with clear commit histories and test coverage.',
      distractors: [
        'Committing directly to the production branch without code review',
        'Omitting pull request descriptions and architectural rationales',
        'Refusing to address reviewer feedback and suggestions',
      ],
      targetIdx: 3,
      exp: 'High-performing engineering teams prioritize transparent, structured code review workflows.',
    },
    {
      q: `What is the expected outcome upon completing the test and practical exercises for "${topic.title}"?`,
      correct: 'The lesson is verified, progress is persisted in the cloud database, and the next curriculum module is unlocked.',
      distractors: [
        'All student progress is reset back to zero',
        'The application locks the student out of the platform permanently',
        'The course catalog becomes read-only and unclickable',
      ],
      targetIdx: 1,
      exp: 'Successful completion validates your technical mastery and advances your internship curriculum progress.',
    },
  ]

  let promptIdx = 0
  while (baseQuestions.length < 5 && promptIdx < supplementaryPrompts.length) {
    const p = supplementaryPrompts[promptIdx]
    const opts: string[] = []
    let dIdx = 0
    for (let i = 0; i < 4; i++) {
      if (i === p.targetIdx) {
        opts.push(p.correct)
      } else {
        opts.push(p.distractors[dIdx++])
      }
    }
    baseQuestions.push({
      id: `q_${topic.id}_sup_${promptIdx + 1}`,
      question: p.q,
      options: opts,
      correctIndex: p.targetIdx,
      explanation: p.exp,
    })
    promptIdx++
  }

  return baseQuestions
}
