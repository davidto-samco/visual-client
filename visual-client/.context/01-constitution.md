# /constitution - Visual DB Order Lookup Frontend

## Project Purpose

Create a modern React web application that replaces a legacy PyQt6 desktop application for accessing 40+ years of historical Visual database records. The application provides read-only access to customer orders, parts inventory, and manufacturing work orders for the Spare Parts department.

## Core Principles

### I. Read-Only Data Access (NON-NEGOTIABLE)

This is a **viewing application only**. No create, update, or delete operations are permitted. All data fetching is read-only from an existing Express.js backend API.

**Rationale**: The Visual database is legacy production data (1985-present). Any modifications must go through the current AX/D365 ERP system. This application exists solely for historical data lookup.

### II. Performance First

Target: <3 second page loads, <1 second interactions

**Requirements**:

- Lazy load modules and routes
- Implement virtual scrolling for large tables (>1000 rows)
- Debounce search inputs (300ms)
- Cache API responses appropriately
- Optimize bundle size (<500KB initial load)

**Rationale**: Users need quick access to historical data during customer service calls. Slow lookups impact business operations.

### III. Desktop-First, Mobile-Aware

Primary users work on desktop workstations, but the application should be responsive.

**Priority**:

1. Desktop (1920x1080+) - Primary target
2. Laptop (1366x768) - Secondary
3. Tablet (768px+) - Nice to have
4. Mobile (<768px) - Best effort

**Rationale**: Spare Parts staff work from office workstations with dual monitors. Mobile access is not a primary requirement.

### IV. Component Reusability

Build once, use everywhere. All UI components must be:

- Reusable across modules
- Properly typed with PropTypes or TypeScript
- Documented with usage examples
- Tested in isolation

**Rationale**: Three modules (Sales, Inventory, Engineering) share common patterns. DRY principle reduces maintenance burden.

### V. Accessibility Standards

Target: WCAG 2.1 AA compliance

**Requirements**:

- Semantic HTML
- Keyboard navigation support
- ARIA labels where needed
- Color contrast ratios >4.5:1
- Screen reader compatible

**Rationale**: Inclusive design is mandatory for enterprise applications. Some users may have disabilities.

### VI. Error Handling & User Feedback

Never show raw error messages or stack traces to users.

**Requirements**:

- User-friendly error messages
- Loading states for all async operations
- Empty states with helpful guidance
- Retry mechanisms for failed requests
- Network error detection

**Rationale**: Historical data queries can be slow or fail. Users need clear feedback about what's happening.

## Technology Constraints

### Approved Stack (MUST USE)

- **Build Tool**: Vite 5+
- **Framework**: React 18+
- **Routing**: React Router v6+
- **UI Components**: shadcn/ui (NOT Material-UI, Ant Design, etc.)
- **HTTP Client**: Axios (already used by backend team)
- **Date Handling**: date-fns (lightweight, tree-shakeable)

### Forbidden Technologies

❌ Redux/MobX (overkill for this application)
❌ GraphQL (backend is REST)
❌ CSS-in-JS libraries (use CSS Modules or Tailwind)
❌ jQuery (no legacy libraries)
❌ Class components (functional components only)

**Rationale**: Stack standardization reduces onboarding time and maintenance complexity.

## Code Quality Standards

### JavaScript/React

- **Style**: Airbnb React/JSX Style Guide
- **ES Version**: ES2022+
- **Functions**: Arrow functions preferred
- **Hooks**: Use custom hooks for shared logic
- **Props**: Destructure in function signature
- **State**: Prefer `useState` for simple state, `useReducer` for complex

### File Organization

```
src/
├── components/     # Reusable UI components
├── modules/        # Feature modules (sales, inventory, engineering)
├── services/       # API clients, utilities
├── hooks/          # Custom React hooks
├── styles/         # Global styles, theme
└── routes/         # Route definitions
```

### Naming Conventions

- **Components**: PascalCase (e.g., `OrderTable.jsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useOrders.js`)
- **Utilities**: camelCase (e.g., `formatCurrency.js`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)
- **CSS Modules**: camelCase (e.g., `orderTable.module.css`)

### Testing Requirements

- **Unit Tests**: All utility functions and custom hooks
- **Component Tests**: All reusable components
- **Integration Tests**: Critical user flows
- **Coverage Target**: >70% (focus on critical paths)

**Testing Tools**: Vitest + React Testing Library

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Commit Messages

Follow Conventional Commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `test:` - Adding tests
- `chore:` - Maintenance

Example: `feat(sales): add order search with date filters`

### Code Review Requirements

- All code must be reviewed before merge
- No direct commits to main/develop
- Must pass linting (ESLint)
- Must pass formatting (Prettier)
- Must pass all tests

## Design System

### Color Palette (DO NOT DEVIATE)

- **Sales Module**: Blue (#007bff) - Primary color
- **Inventory Module**: Green (#28a745) - Success color
- **Engineering Module**: Yellow (#ffc107) - Warning color
- **Background**: #f8f9fa - Light gray
- **Sidebar**: #2c3e50 - Dark blue-gray
- **Text Primary**: #333333
- **Text Secondary**: #6c757d

### Typography

- **Font**: System fonts (already defined in shadcn/ui)
- **Base Size**: 16px (1rem)
- **Scale**: 0.75rem, 0.875rem, 1rem, 1.125rem, 1.25rem, 1.5rem, 2rem

### Spacing

Use 8px grid system: 0.5rem, 1rem, 1.5rem, 2rem, 3rem

### Component Patterns

- **Search**: Search bar with icon, debounced input
- **Tables**: Sortable, hoverable rows, status badges
- **Details**: Header card + tabbed content
- **Navigation**: Left sidebar with module icons
- **Loading**: Centered spinner with optional message
- **Empty**: Centered icon + message + optional action

## API Integration Rules

### Backend API

- **Base URL**: `http://localhost:3001/api/v1`
- **Format**: REST with JSON responses
- **Auth**: None (internal network only)
- **Timeout**: 30 seconds
- **Retry**: 3 attempts with exponential backoff

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

- `GET /orders` - Recent orders
- `GET /orders/:jobNumber` - Order details
- `GET /orders/search` - Search orders
- `GET /parts/:partNumber` - Part details
- `GET /parts/search` - Search parts
- `GET /parts/:partNumber/where-used` - Where-used
- `GET /workorders/search` - Search work orders
- `GET /workorders/:workOrderId` - Work order details
- `GET /workorders/:workOrderId/hierarchy` - BOM tree

## Security Considerations

### Data Protection

- No sensitive data in localStorage
- No authentication tokens (internal network)
- No PII in console logs
- No query strings with sensitive data

### XSS Prevention

- Sanitize all user inputs
- Use React's built-in XSS protection
- No `dangerouslySetInnerHTML` without sanitization

## Success Criteria

### Functional

✅ All three modules (Sales, Inventory, Engineering) operational
✅ Search and filter functionality working
✅ Details views showing complete information
✅ Navigation between all pages working
✅ BOM tree hierarchy display working

### Non-Functional

✅ Page load <3 seconds
✅ Search results <2 seconds
✅ Zero console errors
✅ Zero accessibility violations (tested with aXe)
✅ Works in Chrome, Firefox, Edge (latest versions)

### User Experience

✅ Intuitive navigation
✅ Clear loading states
✅ Helpful error messages
✅ Responsive on desktop sizes
✅ Keyboard navigation support

## Maintenance & Support

### Documentation Requirements

- README with setup instructions
- Component Storybook (optional but recommended)
- API integration guide
- Deployment instructions
- Troubleshooting guide

### Known Limitations

- Historical data only (no real-time updates)
- Desktop-focused (limited mobile optimization)
- Internal network only (no authentication)
- Read-only access (no data modifications)

## Questions to Consider Before Implementation

1. **State Management**: Do we need React Context or is local state sufficient?
2. **Caching**: Should we cache API responses? For how long?
3. **Error Boundaries**: Where should we place error boundaries?
4. **Analytics**: Do we need usage tracking?
5. **Feature Flags**: Do we need to toggle features on/off?
6. **Internationalization**: English only or multi-language?
7. **Print Support**: Should users be able to print order details?
8. **Export**: Should users be able to export data to Excel/CSV?

---

**Last Updated**: December 18, 2024
**Version**: 1.0
**Status**: Draft - Awaiting Team Approval
