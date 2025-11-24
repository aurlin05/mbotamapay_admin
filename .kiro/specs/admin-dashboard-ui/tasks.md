# Implementation Plan

- [x] 1. Initialize Next.js project with TypeScript and core dependencies




  - Create Next.js 14+ project with App Router in mbotamapay_admin directory
  - Install and configure TypeScript, Tailwind CSS, ESLint, Prettier
  - Install core dependencies: axios, @tanstack/react-query, zod, react-hook-form
  - Install UI dependencies: shadcn/ui, lucide-react, framer-motion, recharts, date-fns
  - Configure tailwind.config.ts with custom theme colors and dark mode
  - Set up project structure with app/, components/, lib/, types/ directories
  - Create .env.local with NEXT_PUBLIC_API_URL variable pointing to http://localhost:8080
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Set up shadcn/ui component library and design system





  - Initialize shadcn/ui with `npx shadcn-ui@latest init`
  - Install essential shadcn components: button, card, input, label, table, dialog, dropdown-menu, toast, skeleton, badge, avatar
  - Create custom theme configuration with MbotamaPay brand colors (primary, secondary, accent)
  - Set up dark mode provider using next-themes
  - Create base layout components structure
  - Configure global CSS with custom utility classes
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3_

- [x] 3. Implement authentication system





- [x] 3.1 Create TypeScript types for authentication


  - Define User, LoginCredentials, AuthResponse, AuthContextValue interfaces in types/auth.ts
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3.2 Build API client with authentication interceptors


  - Create lib/api/client.ts with Axios instance
  - Implement request interceptor to add JWT token to headers
  - Implement response interceptor to handle 401 errors and token expiration
  - Create lib/api/auth.ts with login, logout, refreshToken functions
  - _Requirements: 1.1, 1.4_

- [x] 3.3 Create AuthProvider context and hooks


  - Implement AuthProvider component with authentication state management
  - Create useAuth hook for accessing auth context
  - Implement login, logout, and token refresh logic
  - Add token storage in httpOnly cookies via API routes
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 3.4 Build login page UI


  - Create app/(auth)/login/page.tsx with login form
  - Implement form validation using react-hook-form and zod
  - Add email and password fields with validation
  - Add loading states and error message display
  - Add password visibility toggle
  - Style with Tailwind CSS and shadcn/ui components
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3.5 Implement route protection middleware


  - Create middleware.ts for protecting dashboard routes
  - Redirect unauthenticated users to login page
  - Handle token expiration and automatic logout
  - _Requirements: 1.4, 1.5_

- [ ]* 3.6 Write property tests for authentication flow
  - **Property 1: Valid credentials result in token storage**
  - **Property 2: Successful authentication redirects to dashboard**
  - **Property 3: Invalid credentials show generic error**
  - **Property 4: Expired token triggers redirect**
  - **Property 5: Logout clears token and redirects**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

- [x] 4. Create dashboard layout and navigation







- [x] 4.1 Build dashboard layout component


  - Create app/(dashboard)/layout.tsx with sidebar and header
  - Implement responsive sidebar (collapsible on mobile)
  - Add navigation links with active state indicators
  - Create mobile menu overlay
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 4.2 Implement header component




  - Create components/layout/Header.tsx
  - Add global search bar
  - Add theme toggle button
  - Add user dropdown menu with logout
  - Implement responsive layout
  - _Requirements: 9.1, 14.1_

- [x] 4.3 Create sidebar navigation


  - Create components/layout/Sidebar.tsx
  - Add navigation items (Dashboard, Users, Transactions)
  - Implement active link highlighting
  - Add icons using lucide-react
  - Add collapse/expand functionality
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 4.4 Write property tests for layout
  - **Property 30: Functionality maintained across screen sizes**
  - **Validates: Requirements 8.5**

- [x] 5. Implement theme system







- [x] 5.1 Set up theme provider and toggle

  - Configure next-themes provider in app/layout.tsx
  - Create components/ThemeToggle.tsx button
  - Implement theme switching logic
  - Add theme persistence to localStorage
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 5.2 Configure dark and light mode styles


  - Define CSS variables for light and dark themes in globals.css
  - Ensure proper contrast ratios for accessibility
  - Test all components in both themes
  - _Requirements: 9.4, 9.5_

- [ ]* 5.3 Write property tests for theme system
  - **Property 31: Theme toggle switches color scheme**
  - **Property 32: Theme preference persisted**
  - **Property 33: Saved theme loaded on return**
  - **Property 34: Dark mode maintains contrast**
  - **Property 35: Light mode maintains contrast**
  - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

- [x] 6. Build dashboard home page with statistics





- [x] 6.1 Create TypeScript types for statistics


  - Define AdminStatsResponse interface in types/stats.ts
  - Define chart data interfaces
  - _Requirements: 2.1_

- [x] 6.2 Implement statistics API integration


  - Create lib/api/stats.ts with getStats function
  - Set up React Query hook for fetching statistics
  - Implement auto-refresh every 30 seconds
  - _Requirements: 2.1, 2.4, 13.1_

- [x] 6.3 Build StatsCard component


  - Create components/dashboard/StatsCard.tsx
  - Display title, value, and trend indicator
  - Add icon support
  - Implement loading skeleton state
  - Add drag handle for reordering
  - _Requirements: 2.1, 15.1_


- [x] 6.4 Create dashboard home page

  - Create app/(dashboard)/page.tsx
  - Display statistics cards (total users, active users, total transactions, total volume)
  - Implement currency formatting with XAF symbol
  - Add refresh button
  - Handle loading and error states
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 6.5 Write property tests for statistics
  - **Property 6: Statistics display all required metrics**
  - **Property 7: Currency formatting includes separators and symbol**
  - **Property 8: Refresh button fetches updated data**
  - **Validates: Requirements 2.1, 2.4, 2.5**

- [-] 7. Implement transaction charts



- [x] 7.1 Build TransactionChart component


  - Create components/dashboard/TransactionChart.tsx using Recharts
  - Implement line chart for transaction volume over time
  - Add interactive tooltips on hover
  - Implement responsive sizing
  - Handle loading and empty states
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 7.2 Build StatusChart component


  - Create components/dashboard/StatusChart.tsx using Recharts
  - Implement bar chart for transaction status distribution
  - Color-code by status (success: green, pending: yellow, failed: red)
  - Add interactive legend
  - Implement responsive sizing
  - _Requirements: 3.2, 3.3, 3.5_

- [x] 7.3 Add charts to dashboard home page






  - Integrate TransactionChart and StatusChart into app/(dashboard)/page.tsx
  - Position charts below statistics cards
  - Ensure responsive layout
  - _Requirements: 3.1, 3.2_

- [ ]* 7.4 Write property tests for charts
  - **Property 9: Chart hover displays tooltip**
  - **Property 10: Charts resize responsively**
  - **Validates: Requirements 3.3, 3.5**

- [x] 8. Checkpoint - Ensure all tests pass





  - Run all unit tests and property-based tests
  - Fix any failing tests
  - Verify dashboard home page renders correctly
  - Test authentication flow end-to-end
  - Ask the user if questions arise

- [x] 9. Implement user management pages




- [x] 9.1 Create TypeScript types for users


  - Define UserResponse, UserFilters interfaces in types/user.ts
  - _Requirements: 4.1_

- [x] 9.2 Implement users API integration


  - Create lib/api/users.ts with getAllUsers, getUserById, banUser, unbanUser functions
  - Set up React Query hooks for user operations
  - _Requirements: 4.1, 5.1, 6.1, 6.2_

- [x] 9.3 Build UsersTable component


  - Create components/users/UsersTable.tsx
  - Display columns: email, phone, KYC level, wallet balance, registration date, status
  - Implement sortable columns
  - Add search input with debouncing
  - Add filter dropdowns (KYC level, status)
  - Implement pagination controls
  - Add row click navigation to detail page
  - Handle loading skeleton rows and empty state
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 9.4 Create users list page


  - Create app/(dashboard)/users/page.tsx
  - Integrate UsersTable component
  - Add export to CSV button
  - Implement auto-refresh every 60 seconds (optional for users page)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 12.1_

- [ ]* 9.5 Write property tests for user list
  - **Property 11: Users table displays all required columns**
  - **Property 12: Search filters users by email or phone**
  - **Property 13: Filter shows only matching users**
  - **Property 14: Pagination appears for large datasets**
  - **Property 15: User row click navigates to detail**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 10. Build user detail page



- [x] 10.1 Create UserDetailCard component


  - Create components/users/UserDetailCard.tsx
  - Display user profile information (email, phone, KYC level, registration date, status)
  - Display wallet balance with formatting
  - Add status badge (active/banned)
  - Add action buttons (ban/unban) based on user status
  - Display recent transactions list
  - Implement loading skeleton states
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10.2 Implement ban/unban functionality


  - Add ban and unban button handlers
  - Show confirmation dialog before action
  - Display loading state during operation
  - Show success or error toast notifications
  - Refresh user data after successful action
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 10.3 Create user detail page


  - Create app/(dashboard)/users/[id]/page.tsx
  - Integrate UserDetailCard component
  - Handle loading and error states
  - Add back navigation button
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 10.4 Write property tests for user detail
  - **Property 16: User detail displays complete profile**
  - **Property 17: User detail shows wallet and transactions**
  - **Property 18: Appropriate action button is shown**
  - **Property 19: Ban updates user status**
  - **Property 20: Unban updates user status**
  - **Property 21: Action buttons disabled during operation**
  - **Property 22: Success shows notification and refreshes**
  - **Property 23: Failure shows error notification**
  - **Validates: Requirements 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 11. Implement transaction management




- [x] 11.1 Create TypeScript types for transactions


  - Define TransactionResponse, TransactionFilters interfaces in types/transaction.ts
  - _Requirements: 7.1_

- [x] 11.2 Implement transactions API integration


  - Create lib/api/transactions.ts with getAllTransactions function
  - Set up React Query hook for fetching transactions
  - Implement auto-refresh every 60 seconds
  - _Requirements: 7.1, 13.2_

- [x] 11.3 Build TransactionsTable component


  - Create components/transactions/TransactionsTable.tsx
  - Display columns: reference, sender, receiver, amount, status, timestamp
  - Implement sortable columns
  - Add search input with debouncing
  - Add status filter dropdown
  - Implement pagination controls
  - Add row click to open detail modal
  - Add status badges with colors
  - Format amounts with XAF symbol
  - Handle loading and empty states
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11.4 Build TransactionDetailModal component


  - Create components/transactions/TransactionDetailModal.tsx
  - Display complete transaction information
  - Show sender and receiver details
  - Display amount and fees breakdown
  - Show status with timestamp
  - Add copyable reference number
  - Add close button
  - _Requirements: 7.5_

- [x] 11.5 Create transactions page


  - Create app/(dashboard)/transactions/page.tsx
  - Integrate TransactionsTable component
  - Add export to CSV button
  - Implement auto-refresh every 60 seconds
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 12.2, 13.2_

- [ ]* 11.6 Write property tests for transactions
  - **Property 24: Transactions table displays all required columns**
  - **Property 25: Search filters transactions**
  - **Property 26: Status filter shows matching transactions**
  - **Property 27: Transaction pagination for large datasets**
  - **Property 28: Transaction row click opens modal**
  - **Property 52: Transactions refresh every 60 seconds**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 13.2**

- [x] 12. Checkpoint - Ensure all tests pass



  - Run all unit tests and property-based tests
  - Fix any failing tests
  - Test user management flow end-to-end
  - Test transaction monitoring end-to-end
  - Ask the user if questions arise

- [x] 13. Implement global search functionality





- [x] 13.1 Build SearchBar component


  - Create components/SearchBar.tsx
  - Implement debounced input
  - Add clear button
  - Add loading indicator
  - Create dropdown for results with grouping by entity type
  - Implement keyboard navigation (arrow keys, enter, escape)
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 13.2 Implement global search API


  - Create lib/api/search.ts with globalSearch function
  - Search across users (email, phone) and transactions (reference)
  - Return results grouped by entity type
  - _Requirements: 14.1, 14.2_



- [x] 13.3 Integrate search into header



  - Add SearchBar component to Header component
  - Implement navigation on result click
  - Handle empty state
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]* 13.4 Write property tests for global search
  - **Property 56: Global search covers all entities**
  - **Property 57: Search results grouped by type**
  - **Property 58: Search result click navigates**
  - **Property 59: Clear input hides results**
  - **Validates: Requirements 14.1, 14.2, 14.3, 14.5**

- [x] 14. Implement export functionality





- [x] 14.1 Create CSV export utilities


  - Create lib/utils/export.ts with exportToCSV function
  - Implement data-to-CSV conversion
  - Handle special characters and escaping
  - Trigger browser download
  - _Requirements: 12.1, 12.2, 12.4_

- [x] 14.2 Add export buttons to users page


  - Add export button to users page
  - Show loading indicator during export
  - Display success or error notifications
  - Export filtered user data
  - _Requirements: 12.1, 12.3, 12.4, 12.5_

- [x] 14.3 Add export buttons to transactions page


  - Add export button to transactions page
  - Show loading indicator during export
  - Display success or error notifications
  - Export filtered transaction data
  - _Requirements: 12.2, 12.3, 12.4, 12.5_

- [ ]* 14.4 Write property tests for export
  - **Property 46: User export generates valid CSV**
  - **Property 47: Transaction export generates valid CSV**
  - **Property 48: Export button shows loading**
  - **Property 49: Export completion triggers download**
  - **Property 50: Export failure shows error**
  - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

- [x] 15. Implement toast notification system




- [x] 15.1 Set up toast provider


  - Configure shadcn/ui toast component
  - Create toast provider in app/layout.tsx
  - Define toast variants (success, error, warning, info)
  - _Requirements: 11.1, 11.2_

- [x] 15.2 Create toast utility functions


  - Create lib/utils/toast.ts with helper functions
  - Implement auto-dismiss after 5 seconds
  - Support manual dismiss
  - Implement stacking for multiple toasts
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 15.3 Integrate toasts throughout application


  - Add success toasts for successful actions
  - Add error toasts for failed actions
  - Add loading toasts for long operations (optional)
  - _Requirements: 11.1, 11.2_

- [ ]* 15.4 Write property tests for notifications
  - **Property 41: Success actions show success toast**
  - **Property 42: Failed actions show error toast**
  - **Property 43: Toasts auto-dismiss after 5 seconds**
  - **Property 44: Multiple toasts stack vertically**
  - **Property 45: Close button dismisses toast**
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [x] 16. Implement dashboard customization








- [x] 16.1 Create dashboard settings hook


  - Create lib/hooks/use-dashboard-settings.ts
  - Store preferences in localStorage
  - Support card reordering, hiding, and showing
  - _Requirements: 15.1, 15.2, 15.3_

- [x] 16.2 Add drag and drop to stats cards


  - Install @dnd-kit/core for drag and drop
  - Make stats cards draggable
  - Implement drop zones
  - Animate transitions smoothly
  - Persist new order
  - _Requirements: 15.1, 15.5_

- [x] 16.3 Add hide/show functionality to cards


  - Add hide button to each stats card
  - Persist hidden cards preference
  - Add settings panel to show/hide cards
  - _Requirements: 15.2, 15.3_

- [x] 16.4 Add reset customizations button

















  - Create reset button in settings
  - Restore default dashboard layout on click
  - Show confirmation dialog before reset
  - _Requirements: 15.4_

- [ ]* 16.5 Write property tests for customization
  - **Property 60: Cards can be reordered**
  - **Property 61: Hide button removes card**
  - **Property 62: Settings show visibility options**
  - **Property 63: Reset restores default layout**
  - **Property 64: Customizations persisted**
  - **Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5**

- [x] 17. Implement auto-refresh functionality





- [x] 17.1 Create auto-refresh hook


  - Create lib/hooks/use-auto-refresh.ts
  - Support configurable refresh intervals
  - Pause refresh during active interactions
  - Pause refresh when offline
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 17.2 Add auto-refresh to dashboard home


  - Integrate auto-refresh hook with 30-second interval
  - Update statistics without disrupting UI
  - _Requirements: 13.1, 13.3_

- [x] 17.3 Add auto-refresh to transactions page


  - Integrate auto-refresh hook with 60-second interval
  - Update transaction list without disrupting UI
  - _Requirements: 13.2, 13.3_

- [x] 17.4 Implement offline detection


  - Create lib/hooks/use-online-status.ts
  - Display warning indicator when offline
  - Pause auto-refresh when offline
  - _Requirements: 13.5_

- [ ]* 17.5 Write property tests for auto-refresh
  - **Property 51: Dashboard stats refresh every 30 seconds**
  - **Property 53: Refresh doesn't disrupt interaction**
  - **Property 54: Active interactions pause refresh**
  - **Property 55: Offline pauses refresh and shows warning**
  - **Validates: Requirements 13.1, 13.3, 13.4, 13.5**

- [x] 18. Implement accessibility features




- [x] 18.1 Add keyboard navigation support


  - Ensure all interactive elements are keyboard accessible
  - Add visible focus indicators
  - Implement skip-to-content link
  - Test tab order throughout application
  - _Requirements: 16.1_

- [x] 18.2 Add ARIA labels and semantic HTML


  - Add appropriate ARIA labels to all components
  - Use semantic HTML elements (nav, main, article, etc.)
  - Add screen reader announcements for dynamic content
  - _Requirements: 16.2_

- [x] 18.3 Ensure color accessibility


  - Verify contrast ratios meet WCAG AA standards
  - Provide text/icon alternatives for color-coded information
  - Test in both light and dark modes
  - _Requirements: 16.3, 16.4_

- [x] 18.4 Improve form accessibility


  - Associate labels with inputs properly
  - Provide clear error messages
  - Add aria-invalid and aria-describedby attributes
  - _Requirements: 16.5_

- [ ]* 18.5 Write property tests for accessibility
  - **Property 65: Focus indicators visible**
  - **Property 66: ARIA labels present**
  - **Property 67: Color not sole indicator**
  - **Property 68: Text contrast meets standards**
  - **Property 69: Form labels associated**
  - **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5**

- [x] 19. Implement animations and transitions




- [x] 19.1 Add page transition animations


  - Use framer-motion for page transitions
  - Implement fade or slide animations
  - Keep durations between 150ms and 300ms
  - _Requirements: 10.1, 10.4_

- [x] 19.2 Improve loading states


  - Ensure skeleton loaders match content layout
  - Add smooth transitions for loading states
  - _Requirements: 10.2_

- [x] 19.3 Add interaction feedback animations


  - Disable interactive elements during actions
  - Show loading indicators on buttons
  - Add hover and active states
  - _Requirements: 10.3_

- [x] 19.4 Respect reduced motion preferences


  - Check prefers-reduced-motion media query
  - Disable or minimize animations when set
  - Test with reduced motion enabled
  - _Requirements: 10.5_

- [ ]* 19.5 Write property tests for animations
  - **Property 36: Navigation shows transitions**
  - **Property 37: Skeleton loaders match content layout**
  - **Property 38: Interactive elements disabled during actions**
  - **Property 39: Animation durations within range**
  - **Property 40: Reduced motion respected**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [x] 20. Implement comprehensive error handling



















- [x] 20.1 Create error boundary component


  - Create components/ErrorBoundary.tsx
  - Display fallback UI for rendering errors
  - Log errors to console
  - Provide retry option
  - _Requirements: 17.3_

- [x] 20.2 Enhance API error handling




  - Improve error interceptor in API client
  - Handle specific error codes (401, 403, 429, 5xx)
  - Display appropriate error messages
  - Implement retry logic for transient errors
  - _Requirements: 17.1, 17.2, 17.5_

- [x] 20.3 Implement session expiration handling




  - Detect session expiration
  - Redirect to login page
  - Preserve intended destination for post-login redirect
  - _Requirements: 17.4_

- [ ]* 20.4 Write property tests for error handling
  - **Property 70: Failed requests show retry option**
  - **Property 71: API unavailable shows maintenance message**
  - **Property 72: Unexpected errors logged and shown**
  - **Property 73: Session expiration preserves destination**
  - **Property 74: Rate limiting shows wait message**
  - **Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5**

- [ ] 21. Optimize responsive design
- [ ] 21.1 Test and fix mobile layouts
  - Test all pages on mobile viewport (< 768px)
  - Convert tables to card layouts on small screens
  - Stack form fields vertically on mobile
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 21.2 Test and fix tablet layouts
  - Test all pages on tablet viewport (768px - 1024px)
  - Ensure proper spacing and sizing
  - Test touch interactions
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 21.3 Test responsive charts
  - Ensure charts scale properly on all screen sizes
  - Maintain readability on small screens
  - Test chart interactions on touch devices
  - _Requirements: 8.4_

- [ ]* 21.4 Write property tests for responsive behavior
  - **Property 29: Tables convert to cards on small screens**
  - **Validates: Requirements 8.4**

- [ ] 22. Final checkpoint - Ensure all tests pass
  - Run all unit tests and ensure they pass
  - Run all property-based tests and ensure they pass
  - Fix any failing tests
  - Ensure code coverage meets requirements
  - Ask the user if questions arise

- [ ] 23. Build and deployment preparation
- [ ] 23.1 Configure production build
  - Update next.config.ts for production
  - Set up environment variables for production
  - Configure image optimization domains
  - Enable standalone output mode
  - _Requirements: All requirements_

- [ ] 23.2 Create Dockerfile
  - Write multi-stage Dockerfile for Next.js app
  - Optimize image size
  - Configure proper port exposure
  - _Requirements: All requirements_

- [ ] 23.3 Add production optimizations
  - Enable compression
  - Configure caching headers
  - Optimize bundle size
  - Add security headers
  - _Requirements: All requirements_

- [ ] 23.4 Create deployment documentation
  - Document environment variables
  - Document build and deployment process
  - Add troubleshooting guide
  - _Requirements: All requirements_
