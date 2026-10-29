# InternHub Design System Specification & Component Guide

This document defines the centralized design system for **InternHub**, a Student Internship Management Portal built with React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui patterns, and Lucide React.

---

## 1. Design Tokens & Color Palette

All surfaces, borders, and typography consume these exact centralized tokens.

### A. Core Neutral & Brand Colors

| Token Name | Hex Value | Purpose / Usage |
| :--- | :--- | :--- |
| `primary` | `#7950F2` | Primary purple: action buttons, active navigation icons, primary links |
| `primaryHover` | `#6741D9` | Hover state for primary buttons |
| `primarySoft` | `#F3F0FF` | Active sidebar item background, soft primary pills |
| `pageBackground` | `#F8FAFF` | Main page canvas background |
| `surface` | `#FFFFFF` | Cards, sidebar, header, and dialog surfaces |
| `subtleSurface` | `#F5F7FC` | Input field background, search fields, subtle list rows |
| `border` | `#EDF0F6` | Card borders, dividers, list separators |
| `textMain` | `#25324B` | Main headings, card titles, high-contrast text |
| `textSecondary` | `#64748B` | Supporting descriptions, subheadings, labels |
| `textMuted` | `#8993A7` | Timestamps, placeholder text, secondary metadata |
| `track` | `#EEF1F7` | Progress bar background track |
| `illustrationBg`| `#EDE9FF` | Illustration background accent |

### B. Promotional Illustration Gradient
```css
background: linear-gradient(135deg, #F3F0FF 0%, #E4DEFF 100%);
```

### C. Semantic Domain Pairings & Accessible Contrast

For maximum legibility and WCAG AA compliance, text on soft badge backgrounds uses dedicated accessible foreground tokens:

| Meaning / Domain | Accent Icon | Soft Background | Accessible Badge Text |
| :--- | :---: | :---: | :---: |
| **Internship / Learning** | `#7950F2` | `#F3F0FF` | `#7950F2` |
| **Completed / Active / Success** | `#20C997` | `#E6FCF5` | `#087F5B` |
| **Projects / Submissions** | `#F06595` | `#FFF0F6` | `#C2255C` |
| **Pending / Warnings** | `#FFB347` | `#FFF4E6` | `#9A4D00` |
| **Information / Files** | `#4DABF7` | `#E7F5FF` | `#1864AB` |
| **Error / Critical Alerts** | `#DC2626` | `#FEF2F2` | `#991B1B` |

---

## 2. Typography Hierarchy (Inter Font)

Font family: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.

| Role | Font Size | Weight | Line Height | CSS Utility Classes |
| :--- | :---: | :---: | :---: | :--- |
| **App Name** | 18px | 700 (Bold) | 26px | `text-[18px] font-bold leading-[26px]` |
| **Page Heading** | 24px (22px mobile) | 700 (Bold) | 32px (30px mobile) | `text-[22px] md:text-[24px] font-bold leading-[30px] md:leading-[32px]` |
| **Section Heading** | 18px | 600 (Semibold) | 26px | `text-[18px] font-semibold leading-[26px]` |
| **Card Heading** | 15px | 600 (Semibold) | 22px | `text-[15px] font-semibold leading-[22px]` |
| **KPI Value** | 26px | 700 (Bold) | 32px | `text-[26px] font-bold leading-[32px]` |
| **Sidebar / Nav** | 14px | 500 (Medium) | 20px | `text-[14px] font-medium leading-[20px]` |
| **Button Label** | 14px | 600 (Semibold) | 20px | `text-[14px] font-semibold leading-[20px]` |
| **Input Text** | 14px (16px mobile) | 400 (Regular) | 20px | `text-[16px] md:text-[14px] font-normal leading-[20px]` |
| **Form Label** | 13px | 500 (Medium) | 20px | `text-[13px] font-medium leading-[20px]` |
| **Body Text** | 14px | 400 (Regular) | 22px | `text-[14px] font-normal leading-[22px]` |
| **Supporting Text** | 12px | 400 (Regular) | 18px | `text-[12px] font-normal leading-[18px]` |
| **Status Badge** | 12px | 600 (Semibold) | 16px | `text-[12px] font-semibold leading-[16px]` |

> **Note on Mobile Inputs:** To prevent mobile Safari / iOS from automatically zooming into form fields upon focus, inputs use `text-[16px]` on mobile screens and `text-[14px]` on desktop.

---

## 3. Spatial Dimensions & Component Geometry

- **Desktop Sidebar:** Exactly `240px` wide, white background, right border `1px solid #EDF0F6`.
- **Top Header:** Minimum `64px` height, white background, bottom border `1px solid #EDF0F6`.
- **Main Canvas Padding:** `24px` on desktop ($\ge 1024$px), `20px` on laptop, `16px` on tablet/mobile.
- **Card Radius & Border:** `12px` border radius, `1px solid #EDF0F6`, shadow `0 2px 12px rgba(30, 41, 59, 0.04)`.
- **Card Padding:** `20px` desktop, `16px` on small screens.
- **Buttons:** Minimum `40px` height (44px on touch), `8px` radius, `16px` horizontal padding.
- **Inputs & Search:** Minimum `42px` height, `8px` radius, `#F5F7FC` background.
- **Metric Icon Containers:** `36 × 36px`, `10px` radius, soft semantic background.
- **Avatars:** `32 × 32px` circular (header), `80 × 80px` circular (profile).
- **Progress Bars:** `6px` height, fully rounded ends (`rounded-full`), `#EEF1F7` background track.
- **Interactive Transitions:** `150ms cubic-bezier(0.4, 0, 0.2, 1)`.
- **Keyboard Focus:** Visible `2px solid #7950F2` outline with `2px offset`.

---

## 4. Multi-Breakpoint Responsive Engine

```
Breakpoints:
┌───────────────┬──────────────────────────────────────────────────────────────────┐
│ Screen Width  │ Layout & Grid Behavior                                           │
├───────────────┼──────────────────────────────────────────────────────────────────┤
│ ≥ 1280px      │ Full 240px sidebar, 4 KPI columns, Dashboard 3-column layout     │
│               │ (1.6fr / 1.0fr / 1.1fr)                                          │
├───────────────┼──────────────────────────────────────────────────────────────────┤
│ 1024 – 1279px │ Full 240px sidebar, 2 content columns, right cards wrap below,   │
│               │ 4 or 2 KPI columns                                               │
├───────────────┼──────────────────────────────────────────────────────────────────┤
│ 768 – 1023px  │ Navigation Drawer (Sheet), 2 content columns, 2 KPI columns      │
├───────────────┼──────────────────────────────────────────────────────────────────┤
│ < 768px       │ Navigation Drawer (Sheet), 1 content column, 2 KPI columns      │
├───────────────┼──────────────────────────────────────────────────────────────────┤
│ < 400px       │ 1 KPI column to prevent cramped labels and numbers               │
└───────────────┴──────────────────────────────────────────────────────────────────┘
```

---

## 5. Reusable Component Directory

| Component | Path | Description |
| :--- | :--- | :--- |
| `Button` | `src/components/ui/Button.tsx` | Primary, secondary, outline, ghost, danger buttons |
| `Card` | `src/components/ui/Card.tsx` | Card, CardHeader, CardTitle, CardContent with 12px radius & shadow |
| `StatusBadge` | `src/components/ui/StatusBadge.tsx` | Semantic pill badge with accessible contrast text |
| `MetricIcon` | `src/components/ui/MetricIcon.tsx` | 36x36px icon container with 10px radius |
| `ProgressBar` | `src/components/ui/ProgressBar.tsx` | 6px rounded progress bar on `#EEF1F7` track |
| `StatCard` | `src/components/ui/StatCard.tsx` | Metric card with icon, KPI number, label, and trend |
| `FormField` | `src/components/ui/FormField.tsx` | Input, Textarea, Select, and FormField wrapper |
| `Modal` | `src/components/ui/Modal.tsx` | Accessible dialog with focus trap & Escape dismissal |
| `FeedbackStates`| `src/components/ui/FeedbackStates.tsx`| PageHeader, EmptyState, ErrorState, LoadingState |
| `ToastContainer`| `src/components/ui/ToastContainer.tsx`| Real-time action toast alerts |
| `Sidebar` | `src/components/layout/Sidebar.tsx` | Desktop 240px navigation bar |
| `Header` | `src/components/layout/Header.tsx` | Top 64px header with search, notifications & avatar |
| `MobileDrawer` | `src/components/layout/MobileDrawer.tsx`| Slide-over drawer for tablets and mobile devices |
| `AppLayout` | `src/components/layout/AppLayout.tsx` | Main protected shell |

---

## 6. Functional Architecture & Data Flow

InternHub runs entirely on the frontend with a **reactive client-side state store** (`AppContext` and `AuthContext`):
- **Topic Completion:** Checking off any topic immediately updates module completion and overall curriculum progress percentages in real time, saving to `localStorage`.
- **Project Submissions:** Interns can submit their GitHub repo URL, live demo URL, and reflection notes. Submitting dynamically shifts project status to `Under Review` with timestamps.
- **Weekly Reflections:** Interns submit weekly retrospectives, saving into the reflection ledger.
- **Support Tickets:** Interns can raise support tickets with category and priority.
- **Google OAuth & Demo Mode:** Supports live Google OAuth via Supabase, alongside an instant "Explore as Demo Student" one-click mode for zero-setup evaluation.
