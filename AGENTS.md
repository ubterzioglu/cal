# CAL Community - Agent Guide

CAL Community, Cağaloğlu Anadolu Lisesi öğrenci ve mezunlarını bir araya getiren dijital topluluk platformudur.

## Project Overview

- **Name:** CAL Community (vite_react_shadcn_ts)
- **Type:** Vite + React + TypeScript SPA
- **Backend:** Supabase (auth + database + storage)
- **Hosting:** Vercel
- **Language:** Turkish (UI and documentation)

### Key Features
- Kulüp listesi ve detay sayfaları
- Öğrenci etkinlikleri ve takımları
- Mezun profilleri (üyelik gerektirir)
- Öğrenci profilleri (üyelik gerektirir)
- Mezun dayanışma forumu
- Admin paneli

## Technology Stack

| Layer | Technology |
|-------|------------|
| Build Tool | Vite 5.x |
| Framework | React 18.x |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 3.x |
| UI Components | shadcn/ui + Radix UI primitives |
| State/Data | TanStack React Query |
| Routing | React Router DOM 6.x |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL + Auth) |
| Testing | Vitest + Testing Library |
| Icons | Lucide React |
| Charts | Recharts |
| Analytics | Microsoft Clarity + GoatCounter |

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   └── RequireAuth.tsx
│   ├── home/           # Homepage sections
│   │   ├── CommunityCards.tsx
│   │   ├── CommunityMessage.tsx
│   │   └── HeroSection.tsx
│   ├── layout/         # Layout components
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── ui/             # shadcn/ui components (40+ components)
│   └── NavLink.tsx
├── data/               # Data fetchers and mappers
│   ├── alumni.ts
│   ├── alumniSolidarity.ts
│   ├── clubs.ts
│   ├── events.ts
│   ├── students.ts
│   └── teams.ts
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utility libraries
│   ├── graduation.ts   # Graduation year/term calculations
│   ├── supabase.ts     # Supabase client setup
│   └── utils.ts        # cn() helper for Tailwind
├── pages/              # Route pages
│   ├── Index.tsx
│   ├── Clubs.tsx
│   ├── ClubDetail.tsx
│   ├── Events.tsx
│   ├── EventDetail.tsx
│   ├── Teams.tsx
│   ├── TeamDetail.tsx
│   ├── Alumni.tsx
│   ├── AlumniCreate.tsx
│   ├── AlumniDetail.tsx
│   ├── Students.tsx
│   ├── AlumniSolidarity.tsx
│   ├── Admin.tsx
│   ├── Login.tsx
│   ├── News.tsx
│   ├── Contact.tsx
│   └── [legal pages].tsx
├── test/               # Test setup and examples
│   ├── setup.ts
│   └── example.test.ts
├── App.tsx             # Main app with routes
├── main.tsx            # Entry point
└── index.css           # Global styles + CSS variables

supabase/
└── migrations/         # 25+ SQL migration files

api/                    # Vercel Serverless Functions
├── _shared.js          # Shared utilities (CORS, rate limiting)
├── alumni-profiles.js  # Alumni profile creation endpoint
└── solidarity/
    ├── topics.js       # Solidarity topic creation
    └── comments.js     # Solidarity comment creation
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on port 8080)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Preview production build locally
npm run preview

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run ESLint
npm run lint
```

## Environment Variables

### Client-side (Vite - prefix with `VITE_`)
```
VITE_SUPABASE_URL=https://jtsohmvbyftwzkvzyopy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLARITY_ID=your-clarity-id
```

### Server-side (Vercel Functions)
```
SUPABASE_URL=https://jtsohmvbyftwzkvzyopy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
IP_HASH_SALT=random-salt-for-ip-hashing
```

## Code Style Guidelines

### TypeScript Configuration
- Strict mode is **disabled** (relaxed type checking)
- Path alias `@/` maps to `./src/`
- JSX transform: `react-jsx`
- Target: ES2020

### Component Patterns
- Use functional components with arrow functions
- Use shadcn/ui components as base (located in `src/components/ui/`)
- Compose with `cn()` utility for Tailwind class merging
- Use `React.forwardRef` for component ref forwarding

### Example Component Structure
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary";
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-classes", variant === "primary" && "primary-classes", className)}
        {...props}
      />
    );
  }
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

### Styling Conventions
- Use Tailwind CSS utility classes
- Dark theme is the default (defined in `index.css`)
- Primary color: `#8f1627` (school dark red)
- Supporting colors: black, white, light gray
- Custom brand colors available as CSS variables:
  - `--alm-blue: #01A1F1`
  - `--alm-green: #7CBB00`
  - `--alm-orange: #F65314`
  - `--alm-yellow: #FFBB00`

## Testing Instructions

### Test Setup
- Framework: Vitest
- Environment: jsdom
- Testing Library: `@testing-library/react` + `@testing-library/jest-dom`
- Setup file: `src/test/setup.ts`

### Running Tests
```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch
```

### Writing Tests
Tests should be placed alongside source files or in `src/test/`:
- Pattern: `src/**/*.{test,spec}.{ts,tsx}`

Example:
```ts
import { describe, it, expect } from "vitest";

describe("feature", () => {
  it("should behave correctly", () => {
    expect(true).toBe(true);
  });
});
```

## Security Considerations

### Content Security Policy (CSP)
Configured in `vercel.json`:
- Allows scripts from self and Microsoft Clarity
- Allows connections to Supabase and Clarity
- Strict CSP headers enforced in production

### Rate Limiting
Serverless API endpoints have rate limits:
- Alumni profile create: 5/hour, 20/day, 50/week
- Solidarity topics: 3/hour, 10/day, 20/week
- Solidarity comments: 10/hour, 50/day, 200/week

### Authentication
- Supabase Auth with email/password
- Protected routes wrapped in `RequireAuth` component
- Session persistence handled by Supabase

### Data Access Pattern
- **Reads:** Public views via Supabase client (read-only)
- **Writes:** Serverless API endpoints for critical operations
- **Admin:** Direct Supabase access with RLS protection

## Database Architecture

### Main Tables
- `clubs` - Kulüp bilgileri
- `student_events` - Öğrenci etkinlikleri
- `student_teams` - Öğrenci takımları
- `alumni_profiles` - Mezun profilleri
- `student_profiles` - Öğrenci profilleri
- `alumni_solidarity_topics` - Dayanışma konuları
- `alumni_solidarity_comments` - Dayanışma yorumları

### Public Views (Read-only)
- `public_clubs`
- `public_student_events`
- `public_student_teams`
- `public_alumni_profiles` (maskeleme: is_anonymous=true ise kişisel bilgiler gizlenir)
- `public_student_profiles`
- `public_alumni_solidarity_topics`
- `public_alumni_solidarity_comments`

### Migrations
All database changes are versioned in `supabase/migrations/` with timestamps.

## Deployment

### Vercel Configuration
- SPA routing fallback configured
- Security headers applied to all routes
- Serverless functions in `api/` directory

### Build Output
- Static files: `dist/`
- Vite handles asset optimization

### Supabase Connection
- Project: `jtsohmvbyftwzkvzyopy`
- Region: Central EU (Frankfurt)
- URL: https://jtsohmvbyftwzkvzyopy.supabase.co

## Important Implementation Notes

1. **Supabase Client:** Initialized with optional chaining - returns `null` if env vars missing (graceful degradation)
2. **Fallback Data:** Data fetchers provide fallback/mock data when Supabase is unavailable
3. **Analytics:** Microsoft Clarity and GoatCounter scripts injected in `main.tsx`
4. **Port:** Dev server runs on port 8080 (configured in `vite.config.ts`)
5. **Language:** All UI text is in Turkish

## Known Gaps (As Documented)

- Public insert policies still exist for alumni_profiles and solidarity tables (direct anon-key inserts possible)
- Admin panel writes go directly to Supabase (protected by RLS but not API-level validation)
- No explicit CSRF handling for serverless routes
- Role selection on login page is UI-only (no backend enforcement)

## Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/jtsohmvbyftwzkvzyopy
- **Production URL:** https://calcom-rosy-two.vercel.app
- **Favicon:** `/favicon.svg`
- **Logo:** `/logo.png`
