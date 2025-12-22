<!--
============================================================================
SYNC IMPACT REPORT
============================================================================
Version Change: 1.0.0 (template) → 1.0.0 (initial ratification)
Ratification Date: 2024-12-18

Modified Principles:
  - All principles newly established from reference document

Added Sections:
  - I. Read-Only Data Access (NON-NEGOTIABLE)
  - II. Performance First
  - III. Desktop-First, Mobile-Aware
  - IV. Component Reusability
  - V. Accessibility Standards
  - VI. Error Handling & User Feedback
  - Technology Constraints
  - Code Quality Standards
  - Development Workflow
  - Design System
  - API Integration Rules
  - Security Considerations
  - Success Criteria
  - Maintenance & Support
  - Governance

Removed Sections: None (initial creation)

Templates Status:
  ✅ .specify/templates/plan-template.md - Reviewed (Constitution Check section aligns)
  ✅ .specify/templates/spec-template.md - Reviewed (Requirements structure compatible)
  ✅ .specify/templates/tasks-template.md - Reviewed (Task organization aligns with principles)
  ⚠ .specify/templates/agent-file-template.md - Pending (no constitution-specific guidance needed)
  ⚠ .specify/templates/checklist-template.md - Pending (no constitution-specific guidance needed)

Follow-up TODOs:
  - None - all placeholders filled
============================================================================
-->

# Visual DB Order Lookup Frontend Constitution

## Project Purpose

Create a modern React web application that replaces a legacy PyQt6 desktop application for accessing 40+ years of historical Visual database records. The application provides read-only access to customer orders, parts inventory, and manufacturing work orders for the Spare Parts department.

## Core Principles

### I. Read-Only Data Access (NON-NEGOTIABLE)

This is a **viewing application only**. No create, update, or delete operations are permitted. All data fetching is read-only from an existing Express.js backend API.

**Requirements**:
- All API calls MUST use HTTP GET methods only
- No POST, PUT, PATCH, or DELETE operations permitted
- No form submissions that modify data
- No inline editing capabilities
- All write operations redirect to AX/D365 ERP system

**Rationale**: The Visual database is legacy production data (1985-present). Any modifications must go through the current AX/D365 ERP system. This application exists solely for historical data lookup. Allowing modifications risks data integrity of decades of business records.

### II. Performance First

Target: <3 second page loads, <1 second interactions

**Requirements**:
- Lazy load modules and routes
- Implement virtual scrolling for large tables (>1000 rows)
- Debounce search inputs (300ms)
- Cache API responses appropriately
- Optimize bundle size (<500KB initial load)
- Use code splitting for each module
- Minimize re-renders with React.memo and useMemo
- Prefetch likely-needed data

**Rationale**: Users need quick access to historical data during customer service calls. Slow lookups impact business operations and customer satisfaction. Phone support staff cannot keep customers waiting while data loads.

### III. Desktop-First, Mobile-Aware

Primary users work on desktop workstations, but the application should be responsive.

**Priority**:
1. Desktop (1920x1080+) - Primary target
2. Laptop (1366x768) - Secondary
3. Tablet (768px+) - Nice to have
4. Mobile (<768px) - Best effort

**Requirements**:
- Design for dual-monitor desktop setups first
- Ensure usability on laptop screens (1366x768 minimum)
- Tables and data grids optimized for wide displays
- Touch targets on smaller screens ≥44px
- Responsive breakpoints at 1366px, 768px, 480px

**Rationale**: Spare Parts staff work from office workstations with dual monitors. Mobile access is not a primary requirement. Budget constraints prioritize desktop experience over comprehensive mobile optimization.

### IV. Component Reusability

Build once, use everywhere. All UI components MUST be:
- Reusable across modules
- Properly typed with PropTypes or TypeScript
- Documented with usage examples
- Tested in isolation
- Following single responsibility principle
- Accepting configuration via props, not hardcoded

**Requirements**:
- Create shared components in `src/components/`
- Each component in its own directory with tests
- PropTypes or TypeScript interfaces for all props
- JSDoc comments for component purpose and usage
- Storybook stories for visual testing (recommended)

**Rationale**: Three modules (Sales, Inventory, Engineering) share common patterns (search bars, data tables, detail views, status badges). DRY principle reduces maintenance burden and ensures consistency. A bug fix in a shared component benefits all modules.

### V. Accessibility Standards

Target: WCAG 2.1 AA compliance

**Requirements**:
- Semantic HTML (use proper heading hierarchy, lists, tables)
- Keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- ARIA labels where needed (particularly for icon buttons)
- Color contrast ratios >4.5:1 for normal text, >3:1 for large text
- Screen reader compatible (test with NVDA or JAWS)
- Focus indicators visible and high contrast
- Skip navigation links for keyboard users
- Alt text for all informational images

**Rationale**: Inclusive design is mandatory for enterprise applications. Some users may have visual, motor, or cognitive disabilities. Legal compliance requires accessibility. Good accessibility also improves usability for all users.

### VI. Error Handling & User Feedback

Never show raw error messages or stack traces to users.

**Requirements**:
- User-friendly error messages (avoid technical jargon)
- Loading states for all async operations (spinners, skeletons)
- Empty states with helpful guidance ("No orders found. Try adjusting filters.")
- Retry mechanisms for failed requests (3 attempts with exponential backoff)
- Network error detection (offline mode notification)
- Success feedback for completed actions (toast notifications)
- Form validation with clear error messages
- Timeout handling (show helpful message after 30s)

**Rationale**: Historical data queries can be slow or fail due to database load or network issues. Users need clear feedback about what's happening. Cryptic errors create support tickets and frustration. Proper error handling reduces user anxiety and support burden.

## Technology Constraints

### Approved Stack (MUST USE)

- **Build Tool**: Vite 5+
- **Framework**: React 18+
- **Routing**: React Router v6+
- **UI Components**: shadcn/ui (NOT Material-UI, Ant Design, etc.)
- **HTTP Client**: Axios (already used by backend team)
- **Date Handling**: date-fns (lightweight, tree-shakeable)
- **Styling**: Tailwind CSS or CSS Modules (NOT styled-components, emotion)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier

### Forbidden Technologies

❌ Redux/MobX (overkill for this application - use React Context or prop drilling)
❌ GraphQL (backend is REST - no abstraction layer needed)
❌ CSS-in-JS libraries (use CSS Modules or Tailwind for performance)
❌ jQuery (no legacy libraries)
❌ Class components (functional components with hooks only)
❌ Moment.js (deprecated - use date-fns)
❌ Lodash (use native ES2022+ features where possible)

**Rationale**: Stack standardization reduces onboarding time and maintenance complexity. Chosen technologies are modern, well-supported, performant, and align with backend team's choices. Avoiding deprecated or heavyweight libraries keeps bundle sizes small.

## Code Quality Standards

### JavaScript/React

- **Style**: Airbnb React/JSX Style Guide
- **ES Version**: ES2022+
- **Functions**: Arrow functions preferred for consistency
- **Hooks**: Use custom hooks for shared logic (prefix with `use`)
- **Props**: Destructure in function signature for clarity
- **State**: Prefer `useState` for simple state, `useReducer` for complex state machines
- **Side Effects**: Use `useEffect` with clear dependency arrays
- **Naming**: Descriptive names (avoid single letters except loop indices)
- **Comments**: Explain "why" not "what" - code should be self-documenting
- **Avoid**: Inline functions in JSX (causes re-renders), nested ternaries, deeply nested conditionals

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.test.jsx
│   │   └── Button.module.css
│   ├── DataTable/
│   ├── SearchBar/
│   └── ...
├── modules/             # Feature modules (sales, inventory, engineering)
│   ├── sales/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   ├── inventory/
│   └── engineering/
├── services/            # API clients, utilities
│   ├── api.js
│   ├── orderService.js
│   └── partService.js
├── hooks/               # Custom React hooks
│   ├── useDebounce.js
│   ├── useOrders.js
│   └── usePagination.js
├── styles/              # Global styles, theme
│   ├── globals.css
│   └── theme.css
├── routes/              # Route definitions
│   └── index.jsx
└── utils/               # Pure utility functions
    ├── formatters.js
    └── validators.js
```

### Naming Conventions

- **Components**: PascalCase (e.g., `OrderTable.jsx`, `SearchBar.jsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useOrders.js`, `useDebounce.js`)
- **Utilities**: camelCase (e.g., `formatCurrency.js`, `validatePartNumber.js`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **CSS Modules**: camelCase (e.g., `orderTable.module.css`)
- **Directories**: kebab-case or camelCase (consistent within project)
- **Test Files**: Match component name with `.test.jsx` suffix

### Testing Requirements

- **Unit Tests**: All utility functions and custom hooks (pure logic)
- **Component Tests**: All reusable components (render, props, interactions)
- **Integration Tests**: Critical user flows (search → view details)
- **Coverage Target**: >70% (focus on critical paths, not 100% for sake of metric)
- **Test Organization**: Colocate tests with code (`Button.test.jsx` next to `Button.jsx`)
- **Test Naming**: Describe behavior not implementation (`it('shows error when API fails')`)

**Testing Tools**: Vitest + React Testing Library

## Development Workflow

### Branch Strategy

- `main` - Production-ready code (protected, requires PR approval)
- `develop` - Integration branch for ongoing work
- `feature/*` - Feature branches (e.g., `feature/order-search`)
- `bugfix/*` - Bug fix branches (e.g., `bugfix/table-sorting`)
- `hotfix/*` - Emergency production fixes

### Commit Messages

Follow Conventional Commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no functional changes)
- `docs:` - Documentation only
- `test:` - Adding or updating tests
- `chore:` - Maintenance (dependencies, config)
- `style:` - Code style changes (formatting, no logic changes)
- `perf:` - Performance improvements

Example: `feat(sales): add order search with date filters`

### Code Review Requirements

- All code MUST be reviewed before merge
- No direct commits to main/develop
- Must pass linting (ESLint) with zero errors
- Must pass formatting (Prettier) checks
- Must pass all tests (no skipped tests without justification)
- Must maintain or improve test coverage
- Must include relevant documentation updates
- Performance impact considered for bundle size

## Design System

### Color Palette (DO NOT DEVIATE)

**Module Colors**:
- **Sales Module**: Blue (#007bff) - Primary color
- **Inventory Module**: Green (#28a745) - Success color
- **Engineering Module**: Yellow/Orange (#ffc107) - Warning color

**UI Colors**:
- **Background**: #f8f9fa - Light gray
- **Sidebar**: #2c3e50 - Dark blue-gray
- **Text Primary**: #333333 - Almost black
- **Text Secondary**: #6c757d - Medium gray
- **Border**: #dee2e6 - Light gray
- **Error**: #dc3545 - Red
- **Success**: #28a745 - Green
- **Warning**: #ffc107 - Yellow

**Accessibility**: All color combinations MUST meet WCAG AA contrast requirements (4.5:1 for normal text).

### Typography

- **Font**: System fonts (already defined in shadcn/ui)
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...
  ```
- **Base Size**: 16px (1rem)
- **Scale**: 0.75rem (12px), 0.875rem (14px), 1rem (16px), 1.125rem (18px), 1.25rem (20px), 1.5rem (24px), 2rem (32px)
- **Line Height**: 1.5 for body text, 1.2 for headings
- **Font Weights**: 400 (normal), 600 (semi-bold), 700 (bold)

### Spacing

Use 8px grid system:
- 0.5rem (4px)
- 1rem (8px)
- 1.5rem (12px)
- 2rem (16px)
- 3rem (24px)
- 4rem (32px)
- 6rem (48px)

### Component Patterns

- **Search**: Search bar with icon (left), debounced input, clear button (right)
- **Tables**: Sortable columns, hoverable rows, status badges, sticky headers for long tables
- **Details**: Header card with key info + tabbed content below
- **Navigation**: Left sidebar with module icons + labels, active state highlighting
- **Loading**: Centered spinner with optional message, skeleton screens for tables
- **Empty**: Centered icon + message + optional action button ("Adjust filters")
- **Errors**: Alert banner with icon, user-friendly message, retry button if applicable

## API Integration Rules

### Backend API

- **Base URL**: `http://localhost:3001/api/v1` (development), configured via environment variable
- **Format**: REST with JSON responses
- **Auth**: None (internal network only)
- **Timeout**: 30 seconds
- **Retry**: 3 attempts with exponential backoff (1s, 2s, 4s)
- **Headers**: `Content-Type: application/json`

### Response Format

All successful responses:
```json
{
  "success": true,
  "data": [...],
  "count": 100
}
```

All error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message"
  }
}
```

### Endpoints

- `GET /orders` - Recent orders (last 100)
- `GET /orders/:jobNumber` - Order details
- `GET /orders/search?query=...&startDate=...&endDate=...` - Search orders
- `GET /parts/:partNumber` - Part details
- `GET /parts/search?query=...` - Search parts
- `GET /parts/:partNumber/where-used` - Where-used report
- `GET /workorders/search?query=...` - Search work orders
- `GET /workorders/:workOrderId` - Work order details
- `GET /workorders/:workOrderId/hierarchy` - BOM tree hierarchy

### Error Handling

**Network Errors**: Show "Unable to connect. Check your connection." with retry button.

**Timeout Errors**: Show "Request timed out. The database may be busy. Please try again."

**404 Errors**: Show "Record not found. It may have been archived."

**500 Errors**: Show "Server error. Please contact IT support if this persists."

**Generic Errors**: Show error message from API if available, otherwise generic message.

## Security Considerations

### Data Protection

- No sensitive data in localStorage (session data only in memory)
- No authentication tokens stored (internal network only)
- No PII in console logs or error messages
- No query strings with sensitive data (use POST body if needed... but remember: READ-ONLY)
- No data exports containing unredacted sensitive information

### XSS Prevention

- Sanitize all user inputs before display
- Use React's built-in XSS protection (avoid dangerouslySetInnerHTML)
- No `dangerouslySetInnerHTML` without DOMPurify sanitization
- Validate and sanitize search queries
- Escape special characters in displayed data

### Input Validation

- Validate all user inputs (search terms, filters, parameters)
- Use allowlists for known values (not just denylists)
- Limit input lengths to reasonable values
- Sanitize inputs before sending to API

## Success Criteria

### Functional

✅ All three modules (Sales, Inventory, Engineering) operational
✅ Search and filter functionality working across all modules
✅ Details views showing complete information
✅ Navigation between all pages working smoothly
✅ BOM tree hierarchy display working with expand/collapse
✅ Date range filtering working correctly
✅ Part number lookup functioning
✅ Where-used reports displaying correctly

### Non-Functional

✅ Page load <3 seconds (measured with Lighthouse)
✅ Search results <2 seconds (95th percentile)
✅ Zero console errors in production build
✅ Zero accessibility violations (tested with aXe DevTools)
✅ Works in Chrome, Firefox, Edge (latest versions)
✅ Bundle size <500KB (initial load, gzipped)
✅ Test coverage >70% (focus on critical paths)

### User Experience

✅ Intuitive navigation (users can find features without training)
✅ Clear loading states (users know when system is working)
✅ Helpful error messages (users understand what went wrong)
✅ Responsive on desktop sizes (1366px to 2560px)
✅ Keyboard navigation support (all features accessible via keyboard)
✅ Empty states with guidance (users know what to do when no data)
✅ Consistent design patterns (similar features work similarly across modules)

## Maintenance & Support

### Documentation Requirements

- **README**: Setup instructions, prerequisites, environment variables, run commands
- **Component Storybook**: Optional but recommended for component library
- **API Integration Guide**: Endpoint documentation, error handling patterns
- **Deployment Instructions**: Build process, environment configuration, server setup
- **Troubleshooting Guide**: Common issues and solutions
- **Architecture Decision Records**: Document major technical decisions

### Known Limitations

- Historical data only (no real-time updates - data may be hours old)
- Desktop-focused (limited mobile optimization)
- Internal network only (no authentication/authorization)
- Read-only access (no data modifications permitted)
- English language only (no internationalization)
- No print optimizations (browser print is basic)
- No data export functionality (use existing AX/D365 reports)

### Open Questions

1. **State Management**: React Context for shared state (user preferences, filters) or prop drilling for simplicity?
2. **Caching**: Cache API responses? For how long? Use React Query or manual?
3. **Error Boundaries**: Placement strategy - per module, per page, or per component?
4. **Analytics**: Usage tracking needed? Which events to track?
5. **Feature Flags**: Toggle features on/off for gradual rollout?
6. **Internationalization**: English only or prepare for multi-language?
7. **Print Support**: Should users be able to print order details? Style print CSS?
8. **Export**: Should users be able to export data to Excel/CSV? Security implications?

## Governance

### Constitution Authority

- This Constitution supersedes all other development practices and style guides
- When conflicts arise, Constitution principles take precedence
- All team members MUST be familiar with Constitution contents
- Violations must be justified in code reviews with documented reasoning

### Amendment Process

- Amendments require written proposal with rationale
- Team approval needed (consensus or 2/3 majority)
- Migration plan required for breaking changes
- Version increment following semantic versioning
- All dependent templates and documentation updated
- Announcement to team with transition period if needed

### Compliance Verification

- All pull requests MUST verify compliance with Constitution principles
- Code reviewers MUST check for violations
- CI/CD pipeline SHOULD enforce automated checks where possible (linting, testing, bundle size)
- Quarterly Constitution review to ensure relevance
- New team members receive Constitution training during onboarding

### Complexity Justification

- Complexity beyond Constitution guidance MUST be justified in writing
- Justifications documented in code comments or ADRs
- Alternatives considered and documented
- Approval from tech lead required for significant deviations

### Living Document

- Constitution is a living document, not set in stone
- Feedback encouraged from all team members
- Regular reviews (quarterly) to assess effectiveness
- Updates reflect lessons learned and changing requirements
- Change history tracked in version control

**Version**: 1.0.0 | **Ratified**: 2024-12-18 | **Last Amended**: 2024-12-18
