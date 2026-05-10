# TeamHub Design System

> Universal design system for clean, modern, data-driven admin dashboards.
> Use this as Custom Instructions in claude.ai/design to generate consistent UI.

---

## 1. Design Philosophy

**Visual identity**: Clean, spacious, professional admin dashboard with emerald green accents.

**Principles**:
- **Clarity** — whitespace and hierarchy guide the eye; no visual clutter
- **Consistency** — every element follows the same token system
- **Data Density** — rich information display without feeling overwhelming
- **Accessibility** — WCAG 2.1 AA compliant contrast, keyboard navigable

**Overall feel**: Light background, white cards with subtle shadows, green interactive elements, rounded corners, modern sans-serif typography.

---

## 2. Design Tokens

### 2.1 Colors

#### Primary (Emerald Green)
| Token | Value | Usage |
|-------|-------|-------|
| `primary-50` | `#ECFDF5` | Hover backgrounds, subtle highlights |
| `primary-100` | `#D1FAE5` | Active backgrounds, light fills |
| `primary-200` | `#A7F3D0` | Progress bar tracks, light accents |
| `primary-300` | `#6EE7B7` | Decorative elements |
| `primary-400` | `#34D399` | Icons, secondary actions |
| `primary-500` | `#2DB976` | **Main brand color** — buttons, active states, links |
| `primary-600` | `#249A63` | Button hover, pressed states |
| `primary-700` | `#1B7A4E` | Dark accents |
| `primary-800` | `#155E3B` | High-contrast text on light bg |
| `primary-900` | `#0F4229` | Darkest accent |

#### Neutral (Gray)
| Token | Value | Usage |
|-------|-------|-------|
| `neutral-50` | `#F8FAFB` | **Page background** |
| `neutral-100` | `#F1F5F9` | Table header bg, input bg on focus |
| `neutral-200` | `#E2E8F0` | Borders, dividers |
| `neutral-300` | `#CBD5E1` | Disabled states, placeholder text |
| `neutral-400` | `#94A3B8` | Secondary icons, muted text |
| `neutral-500` | `#64748B` | Body text secondary |
| `neutral-600` | `#475569` | Body text |
| `neutral-700` | `#334155` | Headings, labels |
| `neutral-800` | `#1E293B` | Primary text |
| `neutral-900` | `#0F172A` | Strongest text |

#### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#2DB976` | Positive status, completed, approved |
| `success-light` | `#ECFDF5` | Success badge bg |
| `warning` | `#F59E0B` | Caution, pending review |
| `warning-light` | `#FFFBEB` | Warning badge bg |
| `error` | `#EF4444` | Error, rejected, critical |
| `error-light` | `#FEF2F2` | Error badge bg |
| `info` | `#3B82F6` | Informational, in-progress |
| `info-light` | `#EFF6FF` | Info badge bg |

#### Surface
| Token | Value | Usage |
|-------|-------|-------|
| `surface-page` | `#F8FAFB` | Page background |
| `surface-card` | `#FFFFFF` | Card background |
| `surface-sidebar` | `#FFFFFF` | Sidebar background |
| `surface-overlay` | `rgba(0,0,0,0.5)` | Modal backdrop |
| `surface-hover` | `#F1F5F9` | Table row hover, list hover |

### 2.2 Typography

**Font family**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-xs` | 12px | 400 | 1.5 | Captions, helper text, timestamps |
| `text-sm` | 14px | 400 | 1.5 | Body secondary, table cells, badges |
| `text-base` | 16px | 400 | 1.5 | Body primary, form inputs |
| `text-lg` | 18px | 600 | 1.4 | Card titles, section headers |
| `text-xl` | 20px | 600 | 1.3 | Page subtitles |
| `text-2xl` | 24px | 700 | 1.25 | Page titles, stat values |
| `text-3xl` | 30px | 700 | 1.2 | Hero numbers, large KPIs |
| `text-4xl` | 36px | 700 | 1.15 | Dashboard main metric |

### 2.3 Spacing

4px base unit. Scale: `0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px), 10 (40px), 12 (48px), 16 (64px), 20 (80px)`.

| Context | Value |
|---------|-------|
| Inner card padding | 24px (spacing-6) |
| Gap between cards | 24px (spacing-6) |
| Section gap | 32px (spacing-8) |
| Page padding (desktop) | 24px-32px |
| Page padding (mobile) | 16px |
| Form field gap | 16px (spacing-4) |
| Inline element gap | 8px (spacing-2) |

### 2.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Checkboxes, small inputs |
| `radius-md` | 8px | Buttons, inputs, badges |
| `radius-lg` | 12px | Cards, dropdowns, modals |
| `radius-xl` | 16px | Large cards, hero sections |
| `radius-2xl` | 20px | Feature cards, special containers |
| `radius-full` | 9999px | Avatars, pill badges, toggle |

### 2.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | **Default card shadow** |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)` | Dropdowns, popovers |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.03)` | Modals, elevated panels |
| `shadow-focus` | `0 0 0 3px rgba(45,185,118,0.3)` | Focus ring (primary) |

### 2.6 Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| `z-base` | 0 | Default content |
| `z-dropdown` | 10 | Dropdowns, popovers |
| `z-sticky` | 20 | Sticky headers |
| `z-sidebar` | 30 | Sidebar navigation |
| `z-modal` | 40 | Modal dialogs |
| `z-toast` | 50 | Toast notifications |
| `z-tooltip` | 60 | Tooltips |

---

## 3. Layout System

### 3.1 Page Structure

```
+---------------------------------------------------+
| [Sidebar 240px]  |  [Main Content - fluid]        |
|                  |                                  |
| Logo             |  Breadcrumb > Page              |
| ──────           |  Page Title        [Actions]    |
| Nav Item         |  ─────────────────────────────  |
| Nav Item (active)|  [Content Area]                 |
| Nav Item         |                                  |
| Nav Item         |                                  |
| ...              |                                  |
|                  |                                  |
| [CTA Card]       |  [Footer]                       |
+---------------------------------------------------+
```

### 3.2 Sidebar
- **Width**: 240px expanded, 72px collapsed
- **Background**: white (`surface-sidebar`)
- **Border-right**: 1px solid `neutral-200`
- **Logo**: top, padding-6, brand icon + "TeamHub" text
- **Nav items**: icon (20px) + label, padding-y 10px, padding-x 16px
- **Active item**: `primary-500` background, white text, radius-md
- **Hover**: `neutral-100` background
- **Bottom CTA**: optional promo card with gradient green background, radius-lg

### 3.3 Top Bar (inside main content)
- Search input centered or right-aligned, with search icon
- User avatar + name + dropdown, far right
- Optional notification bell icon

### 3.4 Breakpoints

| Name | Range | Sidebar | Grid Columns |
|------|-------|---------|-------------|
| Desktop | >= 1280px | Expanded 240px | 4 |
| Tablet | 768-1279px | Collapsed 72px or hidden | 2 |
| Mobile | < 768px | Hidden (hamburger menu) | 1 |

### 3.5 Grid
- **CSS Grid** or **Flexbox**, gap: 24px
- Stats cards: `grid-cols-4` (desktop), `grid-cols-2` (tablet), `grid-cols-1` (mobile)
- Chart cards: `grid-cols-2` or `grid-cols-3` depending on content
- Max content width: 1440px, centered

---

## 4. Components

### 4.1 Button

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| **Primary** | `primary-500` | white | none | `primary-600` |
| **Secondary** | transparent | `neutral-700` | 1px `neutral-200` | `neutral-100` bg |
| **Ghost** | transparent | `neutral-600` | none | `neutral-100` bg |
| **Danger** | `error` | white | none | darker red |

**Sizes**: sm (h-8, text-sm, px-3), md (h-10, text-sm, px-4), lg (h-12, text-base, px-6).
**Shape**: radius-md. **Icon button**: square (w = h), icon centered.
**States**: default, hover, active (slight scale-down), disabled (opacity 50%), loading (spinner icon).

### 4.2 Input

- **Height**: 40px (md), 36px (sm)
- **Border**: 1px `neutral-200`, radius-md
- **Focus**: border `primary-500` + `shadow-focus`
- **Label**: above input, text-sm, font-medium, `neutral-700`, margin-bottom 6px
- **Placeholder**: `neutral-400`
- **Helper text**: below input, text-xs, `neutral-500`
- **Error state**: border `error`, helper text in `error` color
- **Disabled**: `neutral-100` bg, `neutral-400` text

**Search input**: left search icon (magnifier), optional right clear button, radius-md or radius-full.

### 4.3 Select / Dropdown

- Same styling as Input
- Right chevron icon (`neutral-400`)
- Dropdown panel: white bg, `shadow-md`, radius-md, border `neutral-200`, max-height 280px with scroll
- Option: padding 8px 12px, hover `neutral-100`, selected shows green checkmark

### 4.4 Checkbox & Radio

- **Checkbox**: 16x16, radius-sm, border `neutral-300`. Checked: `primary-500` bg, white checkmark.
- **Radio**: 16x16, radius-full, border `neutral-300`. Checked: `primary-500` bg, white inner dot.
- **Label**: text-sm, margin-left 8px

### 4.5 Toggle

- Track: 36x20px, radius-full, off: `neutral-300`, on: `primary-500`
- Thumb: 16x16, white circle, shadow-sm, transitions left/right

### 4.6 Card

**Base card**: white bg, radius-xl (12-16px), `shadow-card`, padding 24px. No visible border (shadow defines edge).

**Stats Card**:
```
+------------------------------------------+
| [Icon circle]                            |
| (green bg, white icon, 40x40, radius-full)|
|                                          |
| Label (text-sm, neutral-500)             |
| Value (text-2xl, bold, neutral-900)  128 |
| Trend: +12% ↑ (text-xs, success green)  |
|    or: -3% ↓ (text-xs, error red)       |
+------------------------------------------+
```

**Chart Card**: title (text-lg, semibold) top-left + optional filter/period selector top-right, chart fills remaining space with padding.

### 4.7 Table

- **Container**: white bg card, radius-lg, `shadow-card`, overflow hidden
- **Header row**: `neutral-100` bg, text-xs uppercase, font-semibold, `neutral-500`, letter-spacing 0.05em
- **Body rows**: white bg, border-bottom 1px `neutral-100`
- **Hover row**: `surface-hover` bg
- **Checkbox column**: first column, 48px width
- **Columns**: left-aligned text, right-aligned numbers
- **Sort indicator**: up/down chevron next to header text
- **Actions column**: last, icon buttons (edit, delete, more)
- **Cell padding**: 12px vertical, 16px horizontal

### 4.8 Pagination

```
Show [10 ▼] of 650 results      ← 1 2 [3] 4 ... 16 →
```

- Page numbers: 32x32 square, radius-md
- Active page: `primary-500` bg, white text
- Hover: `neutral-100` bg
- Prev/Next: arrow icons, same button style
- "Show N" dropdown: small select

### 4.9 Badge / Tag

| Variant | Background | Text |
|---------|-----------|------|
| **Success** | `success-light` | `primary-700` |
| **Warning** | `warning-light` | amber-700 |
| **Error** | `error-light` | red-700 |
| **Info** | `info-light` | blue-700 |
| **Neutral** | `neutral-100` | `neutral-600` |

**Shape**: radius-full (pill), padding 4px 10px, text-xs, font-medium. Optional dot indicator left of text.

### 4.10 Avatar

- **Sizes**: sm (32px), md (40px), lg (48px), xl (64px)
- **Shape**: radius-full (circle)
- **Fallback**: `primary-100` bg, `primary-700` initials (first + last name)
- **With status dot**: 8px circle, bottom-right, border 2px white
- **Group**: overlapping, -8px margin-left, z-index stacking

### 4.11 Breadcrumb

```
Dashboard / Employees / Ethan Ray
```
- Text-sm, items: `neutral-500`, active (last): `neutral-800` font-medium
- Separator: `/` or `>` in `neutral-400`

### 4.12 Tabs

- **Underline style**: text items in a row, active has 2px bottom border `primary-500` + `primary-500` text
- Inactive: `neutral-500` text, hover `neutral-700`
- Gap between items: 24px
- Optional: count badge next to tab label

### 4.13 Sidebar Navigation Item

```
[Icon] Label                    [Count badge]
```
- Height: 40px, padding-x 16px, radius-md
- Default: `neutral-600` text, `neutral-400` icon
- Hover: `neutral-100` bg
- Active: `primary-500` bg, white text, white icon

### 4.14 Charts

Use consistent green palette for chart data:

**Donut Chart**: large centered percentage or count, ring thickness 20-30px, legend below or right with color dot + label + value. Colors: `primary-500`, `primary-300`, `neutral-300`, `warning`, `info` for segments.

**Bar Chart**: vertical bars, radius-sm top corners, `primary-500` fill. Grid lines: `neutral-100`. Axis labels: text-xs, `neutral-500`. Gap between bars: 8px.

**Line Chart**: 2px stroke, `primary-500`. Optional area fill with 10% opacity gradient. Dots on data points: 4px circles. Grid: horizontal dashed `neutral-100`.

**Heatmap Calendar**: 7-column grid (Mon-Sun), cells 28x28px radius-sm. Color intensity scale from `primary-50` (low) to `primary-600` (high). Empty/zero: `neutral-100`.

**KPI Widget**: large number (text-3xl, bold), small trend arrow + percentage below, optional sparkline (tiny line chart, height 24px).

### 4.15 Calendar (Month View)

- **Header**: `< June 2035 >`, arrows to navigate, month/week toggle
- **Day headers**: Mon-Sun, text-xs, `neutral-500`, uppercase
- **Day cells**: min-height 100px (desktop), border `neutral-100`
- **Today**: green left/top border accent (2px `primary-500`)
- **Event blocks**: rounded-md (radius-sm), padding 2px 6px, text-xs, color-coded by category. Colors: green, yellow, blue, gray backgrounds with darker text.
- **Click**: expands event in side panel (right)

### 4.16 Modal / Dialog

- **Backdrop**: `surface-overlay`, slight blur (backdrop-filter: blur(4px))
- **Container**: white bg, radius-xl, `shadow-lg`, max-width 480px (sm) / 640px (md) / 800px (lg)
- **Header**: title (text-lg, semibold) + close X button (top-right)
- **Body**: padding 24px
- **Footer**: right-aligned buttons (Cancel secondary + Confirm primary), border-top `neutral-100`, padding 16px 24px

### 4.17 Toast / Notification

- **Position**: bottom-right, stacked vertically with 8px gap
- **Container**: white bg, radius-lg, `shadow-md`, padding 16px, border-left 4px (semantic color)
- **Layout**: icon (left) + title + message (right) + close X
- **Auto-dismiss**: 5 seconds, with progress bar at bottom

### 4.18 Tooltip

- Dark bg (`neutral-800`), white text, text-xs, radius-md, padding 6px 10px
- Arrow pointing to trigger element
- Max-width: 200px

### 4.19 Empty State

- Centered in container
- Illustration/icon: 120px, muted colors
- Title: text-lg, semibold, `neutral-800`
- Description: text-sm, `neutral-500`, max-width 320px
- Action button: primary, below description

### 4.20 Filter Bar

```
[Filter icon] Filter ▼   [Category chips...]   Sort by: [Name ▼]  [+ New Employee]
```
- Filter button: secondary style, opens dropdown panel with checkboxes
- Active filters: pill chips with X to remove, `primary-100` bg, `primary-700` text
- Sort dropdown: compact select

### 4.21 Progress

**Bar**: height 8px, radius-full, track `neutral-200`, fill `primary-500`. Optional percentage label right.

**Circle**: SVG, 48-80px diameter, track `neutral-200` (2-3px stroke), fill `primary-500`, centered percentage text.

---

## 5. Page Patterns

### 5.1 Dashboard Page
```
[Page Title]                           [Date Range Picker]
[Stats Card] [Stats Card] [Stats Card] [Stats Card]

[Calendar Heatmap card]     [Donut Chart card] [Status card]
[Attendance card]           [Progress card]

[Employee List table]
```

### 5.2 List Page (Employees, Attendance, etc.)
```
Breadcrumb > Page
[Page Title]

[Stats Card] [Stats Card]    [Donut/Chart]
[Stats Card] [Stats Card]

[Table Title]  [Search] [Filter ▼] [Sort ▼] [+ New btn]
[Table with checkbox, columns, pagination]
```

### 5.3 Detail Page
```
Breadcrumb > Entity > Name

[Profile Card: avatar + name + role + contact info]

[Tabs: Overview | Projects | Performance | Documents]

[Tab Content Area — cards, lists, info sections]
```

### 5.4 Form Page
```
Breadcrumb > Create New

[Form Title]
[Step Indicator: 1 ─── 2 ─── 3 ─── 4]

[Form Section Title]
[grid: 2 cols of form fields]

[Form Section Title]
[grid: 2 cols of form fields]

                              [Cancel] [Save as Draft] [Submit]
```

### 5.5 Auth Page (Login / Register)
```
+-------------------------+---------------------------+
|                         |                           |
|  [Teal/Green gradient   |  [Logo]                   |
|   background with       |                           |
|   illustration]         |  Welcome Back!            |
|                         |  Subtitle text            |
|  Brand message          |                           |
|                         |  [Email input]            |
|                         |  [Password input]         |
|                         |                           |
|                         |  [Remember me] [Forgot?]  |
|                         |  [Login button - primary]  |
|                         |                           |
|                         |  ─── or ───               |
|                         |  [Google] [LinkedIn]      |
|                         |                           |
|                         |  Don't have account? Sign up|
+-------------------------+---------------------------+
```
Left panel: teal/emerald gradient (`primary-500` to `primary-700`), with a centered illustration (person figure). Right panel: white, form centered vertically.

---

## 6. Responsive Rules

### Desktop (>= 1280px)
- Sidebar expanded (240px)
- Stats cards: 4 columns
- Charts: 2-3 columns
- Table: all columns visible

### Tablet (768px - 1279px)
- Sidebar collapsed (72px, icons only) or hidden with hamburger
- Stats cards: 2 columns
- Charts: 1-2 columns, stack vertically
- Table: hide non-essential columns, horizontal scroll enabled
- Forms: 2-column grid maintained

### Mobile (< 768px)
- Sidebar replaced by bottom navigation bar (5 main items) + hamburger for full menu
- Stats cards: 1 column, swipeable horizontal carousel alternative
- Charts: full-width, stack vertically
- Table: card view (each row becomes a card) or horizontal scroll
- Forms: single column
- Modals: full-screen slide-up
- Auth page: stack vertically (image top, form bottom)

---

## 7. Interaction & Animation

- **Transitions**: 150ms ease for colors/bg, 200ms ease for transforms
- **Hover**: subtle background change, no abrupt shifts
- **Focus**: `shadow-focus` ring (green 30% opacity outline)
- **Button press**: slight scale(0.98) for tactile feedback
- **Page transitions**: fade-in 200ms for content areas
- **Sidebar collapse**: smooth width transition 200ms
- **Loading states**: skeleton screens (pulsing `neutral-200` → `neutral-100` blocks matching content shape)

---

## 8. Accessibility

- **Contrast**: all text meets WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large)
- **Focus indicators**: visible `shadow-focus` on all interactive elements
- **Keyboard**: full tab navigation, Enter/Space to activate, Escape to close modals
- **ARIA**: `role`, `aria-label`, `aria-expanded`, `aria-selected` on interactive widgets
- **Reduced motion**: respect `prefers-reduced-motion`, disable non-essential animations
- **Screen readers**: meaningful alt text, live regions for toasts/notifications

---

## 9. Usage Examples for claude.ai/design

### Example 1: Generate a Dashboard
```
Using the TeamHub Design System, create a project management dashboard with:
- 4 stats cards (Total Projects, Active Tasks, Completed, Overdue)
- A donut chart showing project distribution by status
- A bar chart showing weekly task completion
- A table of recent tasks with status badges and assignee avatars
```

### Example 2: Generate a Data Table Page
```
Using the TeamHub Design System, create an employee list page with:
- Page title "Employees" with breadcrumb
- 4 stats cards (Total, New this month, Turnover rate, Resigned)
- Search bar, filter dropdown, and "New Employee" primary button
- Table with columns: checkbox, ID, Name, Job Title, Department, Type, Status, Date, Actions
- Pagination at bottom
```

### Example 3: Generate a Form
```
Using the TeamHub Design System, create a multi-step form to add a new employee:
- Step indicator (4 steps: Personal Info, Job Details, Documents, Review)
- Form with 2-column grid: first name, last name, email, phone, department select, role select
- Date picker for start date
- File upload for photo
- Cancel and Next Step buttons at bottom
```

### Example 4: Generate a Login Page
```
Using the TeamHub Design System, create a login page:
- Split layout: left side teal gradient with illustration, right side white with form
- Logo at top of form area
- Email and password inputs with labels
- Remember me checkbox and Forgot Password link
- Primary login button full-width
- Divider "or" then Google and LinkedIn social login buttons
- Sign up link at bottom
```
