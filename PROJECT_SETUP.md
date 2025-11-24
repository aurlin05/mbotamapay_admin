# MbotamaPay Admin Dashboard - Project Setup

## Overview
This is the admin dashboard for MbotamaPay, built with Next.js 16, TypeScript, and Tailwind CSS.

## Tech Stack

### Core Framework
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **CSS Variables** - Custom theme with dark mode support

### State Management & Data Fetching
- **@tanstack/react-query** - Server state management
- **axios** - HTTP client

### Form Handling & Validation
- **react-hook-form** - Form management
- **zod** - Schema validation

### UI Components & Utilities
- **lucide-react** - Icon library
- **framer-motion** - Animation library
- **recharts** - Chart library
- **date-fns** - Date utility library
- **clsx** & **tailwind-merge** - Utility for conditional classes

### Code Quality
- **ESLint** - Linting
- **Prettier** - Code formatting

## Project Structure

```
mbotamapay_admin/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and API clients
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── .env.local             # Environment variables (not in git)
└── tailwind.config.ts     # Tailwind configuration
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## Theme Configuration

The project uses a custom theme with support for light and dark modes. Theme colors are defined in `app/globals.css` using CSS variables:

- Primary: Blue (#3b82f6)
- Secondary: Slate gray
- Destructive: Red (#ef4444)
- Muted: Light gray
- Accent: Light gray

Dark mode is automatically applied based on system preferences and can be toggled programmatically.

## Next Steps

1. Set up shadcn/ui component library (Task 2)
2. Implement authentication system (Task 3)
3. Create dashboard layout and navigation (Task 4)

## Development Guidelines

- Use TypeScript for all new files
- Follow the existing project structure
- Use Tailwind CSS for styling
- Format code with Prettier before committing
- Ensure all builds pass before pushing
