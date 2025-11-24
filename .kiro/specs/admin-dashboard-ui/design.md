# Design Document - MbotamaPay Admin Dashboard UI/UX

## Overview

The MbotamaPay Admin Dashboard is a modern, responsive web application built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS. It provides administrators with comprehensive tools to manage users, monitor transactions, and view platform analytics. The design emphasizes usability, performance, and accessibility while maintaining a professional aesthetic.

### Key Design Principles

1. **User-Centric**: Prioritize admin workflows and common tasks
2. **Performance**: Fast loading, optimistic updates, efficient data fetching
3. **Accessibility**: WCAG 2.1 AA compliant, keyboard navigable, screen reader friendly
4. **Responsive**: Mobile-first approach with adaptive layouts
5. **Consistency**: Unified design language using shadcn/ui components
6. **Feedback**: Clear visual feedback for all user actions

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+ with custom theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context + TanStack Query (React Query)
- **Forms**: react-hook-form with zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios with interceptors
- **Date Handling**: date-fns

### Project Structure

```
mbotamapay_admin/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── transactions/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Sidebar, Header, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── users/           # User management components
│   └── transactions/    # Transaction components
├── lib/
│   ├── api/             # API client and endpoints
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── constants.ts     # App constants
├── types/
│   ├── auth.ts
│   ├── user.ts
│   ├── transaction.ts
│   └── stats.ts
└── .env.local
```


## Components and Interfaces

### Authentication Components

#### LoginForm Component
- Email and password inputs with validation
- Password visibility toggle
- Loading state during authentication
- Error message display
- "Remember me" checkbox (optional)
- Responsive layout

#### AuthProvider Context
- Manages authentication state (user, token, isAuthenticated)
- Provides login, logout, and token refresh functions
- Handles token storage in httpOnly cookies via API routes
- Automatic token expiration handling

### Layout Components

#### DashboardLayout
- Responsive sidebar navigation (collapsible on mobile)
- Top header with user profile, notifications, theme toggle
- Main content area with proper spacing
- Breadcrumb navigation
- Mobile menu overlay

#### Sidebar Component
- Navigation links with active state indicators
- Icons for each menu item
- Collapsible on mobile/tablet
- Smooth expand/collapse animations
- User profile section at bottom

#### Header Component
- Global search bar
- Notification bell with badge
- Theme toggle (light/dark)
- User dropdown menu (profile, settings, logout)
- Responsive layout

### Dashboard Components

#### StatsCard Component
- Title and value display
- Trend indicator (up/down with percentage)
- Icon representation
- Loading skeleton state
- Customizable colors
- Drag handle for reordering

#### TransactionChart Component
- Line chart for transaction volume over time
- Responsive sizing
- Interactive tooltips
- Loading state
- Empty state handling
- Date range selector

#### StatusChart Component
- Bar or pie chart for transaction status distribution
- Color-coded by status (success: green, pending: yellow, failed: red)
- Interactive legend
- Responsive sizing

### User Management Components

#### UsersTable Component
- Sortable columns (email, phone, KYC level, balance, date, status)
- Search input with debouncing
- Filter dropdowns (KYC level, status)
- Pagination controls
- Row click navigation to detail page
- Loading skeleton rows
- Empty state message

#### UserDetailCard Component
- User profile information display
- Wallet balance with formatting
- Status badge (active/banned)
- Action buttons (ban/unban)
- Recent transactions list
- Loading states

### Transaction Components

#### TransactionsTable Component
- Sortable columns (reference, sender, receiver, amount, status, date)
- Search input with debouncing
- Status filter dropdown
- Pagination controls
- Row click opens detail modal
- Status badges with colors
- Amount formatting with XAF symbol

#### TransactionDetailModal Component
- Complete transaction information
- Sender and receiver details
- Amount and fees breakdown
- Status with timestamp
- Reference number (copyable)
- Close button

### Shared Components

#### DataTable Component (Generic)
- Reusable table with sorting, filtering, pagination
- Column configuration
- Loading and empty states
- Responsive (converts to cards on mobile)

#### SearchBar Component
- Debounced input
- Clear button
- Loading indicator
- Dropdown results with grouping
- Keyboard navigation (arrow keys, enter, escape)

#### Toast Notification System
- Success, error, warning, info variants
- Auto-dismiss after 5 seconds
- Manual dismiss button
- Stacking support
- Slide-in animation

#### ConfirmDialog Component
- Title and description
- Confirm and cancel buttons
- Loading state during action
- Customizable button labels and colors


## Data Models

### TypeScript Interfaces

```typescript
// types/auth.ts
interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// types/user.ts
interface UserResponse {
  id: number;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  kycLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  active: boolean;
  createdAt: string;
  wallet: {
    id: number;
    balance: number;
  };
}

interface UserFilters {
  search?: string;
  kycLevel?: string;
  status?: 'active' | 'banned';
  page: number;
  pageSize: number;
}

// types/transaction.ts
interface TransactionResponse {
  id: number;
  reference: string;
  senderEmail: string;
  receiverEmail: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  type: 'TRANSFER' | 'TOP_UP';
  createdAt: string;
}

interface TransactionFilters {
  search?: string;
  status?: string;
  page: number;
  pageSize: number;
}

// types/stats.ts
interface AdminStatsResponse {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: number;
  transactionsByStatus: {
    pending: number;
    success: number;
    failed: number;
  };
  transactionsByDay: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
}
```

### API Response Formats

All API responses follow consistent patterns:

**Success Response:**
```json
{
  "data": { /* response data */ },
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

**Paginated Response:**
```json
{
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication Properties

Property 1: Valid credentials result in token storage
*For any* valid admin credentials, when submitted through the login form, the JWT token should be stored securely in httpOnly cookies
**Validates: Requirements 1.1**

Property 2: Successful authentication redirects to dashboard
*For any* successful authentication, the user should be redirected to the main dashboard page
**Validates: Requirements 1.2**

Property 3: Invalid credentials show generic error
*For any* invalid credentials (wrong email or password), the error message should not reveal which field was incorrect
**Validates: Requirements 1.3**

Property 4: Expired token triggers redirect
*For any* expired JWT token, attempting to access protected routes should redirect to the login page
**Validates: Requirements 1.4**

Property 5: Logout clears token and redirects
*For any* authenticated session, clicking logout should clear the JWT token and redirect to login
**Validates: Requirements 1.5**

### Dashboard Statistics Properties

Property 6: Statistics display all required metrics
*For any* statistics response, the rendered dashboard should display total users, active users, total transactions, and total volume
**Validates: Requirements 2.1**

Property 7: Currency formatting includes separators and symbol
*For any* numeric currency value, the formatted output should include thousand separators and the XAF symbol
**Validates: Requirements 2.5**

Property 8: Refresh button fetches updated data
*For any* dashboard state, clicking the refresh button should trigger a new API call to fetch current statistics
**Validates: Requirements 2.4**

### Chart Interaction Properties

Property 9: Chart hover displays tooltip
*For any* chart data point, hovering over it should display a tooltip with detailed information
**Validates: Requirements 3.3**

Property 10: Charts resize responsively
*For any* viewport size change, charts should adapt their dimensions to maintain readability
**Validates: Requirements 3.5**

### User Management Properties

Property 11: Users table displays all required columns
*For any* user list response, the rendered table should include columns for email, phone, KYC level, wallet balance, registration date, and status
**Validates: Requirements 4.1**

Property 12: Search filters users by email or phone
*For any* search query, the filtered user list should only include users whose email or phone contains the query string
**Validates: Requirements 4.2**

Property 13: Filter shows only matching users
*For any* selected filter (KYC level or status), the displayed users should only include those matching the filter criteria
**Validates: Requirements 4.3**

Property 14: Pagination appears for large datasets
*For any* user list with more than 20 entries, pagination controls should be displayed
**Validates: Requirements 4.4**

Property 15: User row click navigates to detail
*For any* user row in the table, clicking it should navigate to that user's detail page
**Validates: Requirements 4.5**

Property 16: User detail displays complete profile
*For any* user detail page, all profile fields (email, phone, KYC level, registration date, status) should be displayed
**Validates: Requirements 5.1**

Property 17: User detail shows wallet and transactions
*For any* user detail page, the wallet balance and recent transaction history should be displayed
**Validates: Requirements 5.2**

Property 18: Appropriate action button is shown
*For any* user detail page, the displayed action button (ban or unban) should match the user's current status
**Validates: Requirements 5.3**

### User Action Properties

Property 19: Ban updates user status
*For any* active user, clicking the ban button should send a ban request and update the user status to banned
**Validates: Requirements 6.1**

Property 20: Unban updates user status
*For any* banned user, clicking the unban button should send an unban request and update the user status to active
**Validates: Requirements 6.2**

Property 21: Action buttons disabled during operation
*For any* ban or unban action in progress, the action button should be disabled and show a loading indicator
**Validates: Requirements 6.3**

Property 22: Success shows notification and refreshes
*For any* successful ban or unban action, a success notification should appear and user data should refresh
**Validates: Requirements 6.4**

Property 23: Failure shows error notification
*For any* failed ban or unban action, an error notification with the failure reason should be displayed
**Validates: Requirements 6.5**

### Transaction Management Properties

Property 24: Transactions table displays all required columns
*For any* transaction list response, the rendered table should include columns for reference, sender, receiver, amount, status, and timestamp
**Validates: Requirements 7.1**

Property 25: Search filters transactions
*For any* search query, the filtered transaction list should only include transactions whose reference, sender email, or receiver email contains the query
**Validates: Requirements 7.2**

Property 26: Status filter shows matching transactions
*For any* selected status filter, the displayed transactions should only include those with the matching status
**Validates: Requirements 7.3**

Property 27: Transaction pagination for large datasets
*For any* transaction list with more than 20 entries, pagination controls should be displayed
**Validates: Requirements 7.4**

Property 28: Transaction row click opens modal
*For any* transaction row, clicking it should open a modal displaying complete transaction details
**Validates: Requirements 7.5**

### Responsive Design Properties

Property 29: Tables convert to cards on small screens
*For any* viewport size change to below 768px, data tables should convert to card layouts
**Validates: Requirements 8.4**

Property 30: Functionality maintained across screen sizes
*For any* viewport size, all dashboard features should remain accessible and functional
**Validates: Requirements 8.5**

### Theme Properties

Property 31: Theme toggle switches color scheme
*For any* current theme state, clicking the theme toggle should switch to the opposite theme (light to dark or dark to light)
**Validates: Requirements 9.1**

Property 32: Theme preference persisted
*For any* theme change, the new preference should be saved to localStorage
**Validates: Requirements 9.2**

Property 33: Saved theme loaded on return
*For any* dashboard load, the theme should match the preference stored in localStorage
**Validates: Requirements 9.3**

Property 34: Dark mode maintains contrast
*For any* text element in dark mode, the contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
**Validates: Requirements 9.4**

Property 35: Light mode maintains contrast
*For any* text element in light mode, the contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
**Validates: Requirements 9.5**

### Animation Properties

Property 36: Navigation shows transitions
*For any* page navigation, transition animations should be displayed
**Validates: Requirements 10.1**

Property 37: Skeleton loaders match content layout
*For any* loading state, skeleton loaders should structurally match the layout of the content being loaded
**Validates: Requirements 10.2**

Property 38: Interactive elements disabled during actions
*For any* action in progress, related interactive elements should be disabled
**Validates: Requirements 10.3**

Property 39: Animation durations within range
*For any* content appearance or disappearance animation, the duration should be between 150ms and 300ms
**Validates: Requirements 10.4**

Property 40: Reduced motion respected
*For any* animation, when the user's browser has prefers-reduced-motion enabled, animations should be minimal or disabled
**Validates: Requirements 10.5**

### Notification Properties

Property 41: Success actions show success toast
*For any* successful admin action, a success toast notification should be displayed
**Validates: Requirements 11.1**

Property 42: Failed actions show error toast
*For any* failed admin action, an error toast notification with the error reason should be displayed
**Validates: Requirements 11.2**

Property 43: Toasts auto-dismiss after 5 seconds
*For any* toast notification, it should automatically disappear after 5 seconds
**Validates: Requirements 11.3**

Property 44: Multiple toasts stack vertically
*For any* multiple simultaneous notifications, they should be stacked vertically without overlapping
**Validates: Requirements 11.4**

Property 45: Close button dismisses toast
*For any* toast notification, clicking the close button should immediately remove it
**Validates: Requirements 11.5**

### Export Properties

Property 46: User export generates valid CSV
*For any* filtered user dataset, clicking export should generate a valid CSV file containing all filtered user data
**Validates: Requirements 12.1**

Property 47: Transaction export generates valid CSV
*For any* filtered transaction dataset, clicking export should generate a valid CSV file containing all filtered transaction data
**Validates: Requirements 12.2**

Property 48: Export button shows loading
*For any* export operation in progress, the export button should display a loading indicator
**Validates: Requirements 12.3**

Property 49: Export completion triggers download
*For any* completed export, the browser should initiate a download of the CSV file
**Validates: Requirements 12.4**

Property 50: Export failure shows error
*For any* failed export operation, an error notification should be displayed
**Validates: Requirements 12.5**

### Auto-Refresh Properties

Property 51: Dashboard stats refresh every 30 seconds
*For any* dashboard home page view, statistics should automatically refresh every 30 seconds
**Validates: Requirements 13.1**

Property 52: Transactions refresh every 60 seconds
*For any* transactions page view, the transaction list should automatically refresh every 60 seconds
**Validates: Requirements 13.2**

Property 53: Refresh doesn't disrupt interaction
*For any* automatic refresh, it should not interrupt or reset the user's current interaction state
**Validates: Requirements 13.3**

Property 54: Active interactions pause refresh
*For any* active form or modal interaction, automatic refresh should be paused until the interaction completes
**Validates: Requirements 13.4**

Property 55: Offline pauses refresh and shows warning
*For any* loss of network connectivity, automatic refresh should pause and a warning indicator should be displayed
**Validates: Requirements 13.5**

### Global Search Properties

Property 56: Global search covers all entities
*For any* search query in the global search bar, results should include matching users (by email, phone) and transactions (by reference)
**Validates: Requirements 14.1**

Property 57: Search results grouped by type
*For any* search results, they should be displayed in a dropdown grouped by entity type (users, transactions)
**Validates: Requirements 14.2**

Property 58: Search result click navigates
*For any* search result item, clicking it should navigate to the detailed view of that entity
**Validates: Requirements 14.3**

Property 59: Clear input hides results
*For any* search state with visible results, clearing the input should hide the results dropdown
**Validates: Requirements 14.5**

### Dashboard Customization Properties

Property 60: Cards can be reordered
*For any* dashboard card, dragging it should allow reordering among other cards
**Validates: Requirements 15.1**

Property 61: Hide button removes card
*For any* dashboard card, clicking the hide button should remove it from view
**Validates: Requirements 15.2**

Property 62: Settings show visibility options
*For any* dashboard settings access, options to show or hide specific cards should be displayed
**Validates: Requirements 15.3**

Property 63: Reset restores default layout
*For any* customized dashboard, clicking reset to defaults should restore the original layout
**Validates: Requirements 15.4**

Property 64: Customizations persisted
*For any* dashboard customization change, the preferences should be saved to localStorage
**Validates: Requirements 15.5**

### Accessibility Properties

Property 65: Focus indicators visible
*For any* interactive element, when focused via keyboard navigation, a visible focus indicator should be displayed
**Validates: Requirements 16.1**

Property 66: ARIA labels present
*For any* UI component, appropriate ARIA labels and semantic HTML should be used for screen reader compatibility
**Validates: Requirements 16.2**

Property 67: Color not sole indicator
*For any* information conveyed by color, text or icon alternatives should also be provided
**Validates: Requirements 16.3**

Property 68: Text contrast meets standards
*For any* text element, the contrast ratio should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
**Validates: Requirements 16.4**

Property 69: Form labels associated
*For any* form input, labels should be properly associated and clear error messages should be provided
**Validates: Requirements 16.5**

### Error Handling Properties

Property 70: Failed requests show retry option
*For any* failed network request, a user-friendly error message with a retry option should be displayed
**Validates: Requirements 17.1**

Property 71: API unavailable shows maintenance message
*For any* backend API unavailability, a maintenance message should be displayed and connection retry should be attempted automatically
**Validates: Requirements 17.2**

Property 72: Unexpected errors logged and shown
*For any* unexpected error, the error details should be logged and a generic user-friendly message should be displayed
**Validates: Requirements 17.3**

Property 73: Session expiration preserves destination
*For any* session expiration, the user should be redirected to login and the intended destination should be preserved for post-login redirect
**Validates: Requirements 17.4**

Property 74: Rate limiting shows wait message
*For any* rate limit error, a message indicating the user should wait before retrying should be displayed
**Validates: Requirements 17.5**


## Error Handling

### Error Categories

1. **Network Errors**: Connection failures, timeouts, DNS issues
2. **API Errors**: 4xx and 5xx HTTP status codes
3. **Authentication Errors**: Invalid credentials, expired tokens, insufficient permissions
4. **Validation Errors**: Invalid form inputs, constraint violations
5. **Client Errors**: JavaScript exceptions, rendering errors

### Error Handling Strategy

#### API Client Error Interceptor

```typescript
// lib/api/client.ts
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      clearAuthToken();
      router.push('/login');
    } else if (error.response?.status === 403) {
      // Insufficient permissions
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 429) {
      // Rate limiting
      toast.error('Too many requests. Please wait before trying again');
    } else if (error.response?.status >= 500) {
      // Server error
      toast.error('Server error. Please try again later');
    } else if (!error.response) {
      // Network error
      toast.error('Network error. Please check your connection');
    }
    return Promise.reject(error);
  }
);
```

#### Component-Level Error Handling

- Use React Error Boundaries for catching rendering errors
- Display fallback UI with error message and retry option
- Log errors to console (and optionally to error tracking service)

#### Form Validation

- Client-side validation using zod schemas
- Display inline error messages below form fields
- Prevent form submission until all validations pass
- Show field-level errors as user types (debounced)

### Retry Logic

- Automatic retry for transient network errors (max 3 attempts with exponential backoff)
- Manual retry buttons for failed data fetches
- Optimistic updates with rollback on failure

### Loading States

- Skeleton loaders for initial data loads
- Spinner overlays for actions (ban/unban, export)
- Disabled buttons with loading indicators during operations
- Progress indicators for long-running operations


## Testing Strategy

### Dual Testing Approach

The admin dashboard will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Framework**: fast-check (JavaScript/TypeScript property-based testing library)

**Configuration**:
- Each property-based test should run a minimum of 100 iterations
- Tests should use smart generators that constrain to valid input spaces
- Each property-based test must be tagged with a comment explicitly referencing the correctness property

**Tag Format**: `// Feature: admin-dashboard-ui, Property {number}: {property_text}`

**Example Property Test**:
```typescript
// Feature: admin-dashboard-ui, Property 7: Currency formatting includes separators and symbol
import fc from 'fast-check';

test('currency values are formatted with separators and XAF symbol', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 1000000000 }), (amount) => {
      const formatted = formatCurrency(amount);
      expect(formatted).toMatch(/^[\d,]+\s*XAF$/);
      expect(formatted).toContain('XAF');
      if (amount >= 1000) {
        expect(formatted).toContain(',');
      }
    }),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Framework**: Vitest + React Testing Library

**Coverage Areas**:
- Component rendering with various props
- User interactions (clicks, form submissions, keyboard navigation)
- API integration with mocked responses
- Error handling scenarios
- Accessibility features (ARIA labels, keyboard navigation)

**Example Unit Test**:
```typescript
test('login form displays error on invalid credentials', async () => {
  const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
  render(<LoginForm onLogin={mockLogin} />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
});
```

### Integration Testing

- Test complete user flows (login → view users → ban user)
- Use MSW (Mock Service Worker) for API mocking
- Test navigation between pages
- Verify data persistence (localStorage, cookies)

### Accessibility Testing

- Automated testing with jest-axe
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast verification

### Visual Regression Testing

- Snapshot tests for critical UI components
- Visual diff testing for theme changes
- Responsive layout verification at different breakpoints

### Performance Testing

- Lighthouse CI for performance metrics
- Bundle size monitoring
- Render performance profiling
- Memory leak detection

### Test Organization

```
__tests__/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── auth-flow.test.tsx
│   ├── user-management.test.tsx
│   └── transaction-monitoring.test.tsx
└── property/
    ├── formatting.property.test.ts
    ├── validation.property.test.ts
    └── navigation.property.test.ts
```

### Continuous Integration

- Run all tests on every pull request
- Enforce minimum code coverage (80%)
- Run accessibility audits
- Check bundle size limits
- Verify build succeeds for production

