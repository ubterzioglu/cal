**Project Overview**
- CAL Community is a Vite + React + Supabase web app for clubs, student events/teams, alumni profiles, and alumni solidarity discussions.
- Primary UI entry: [src/App.tsx](src/App.tsx) with public routes and a small protected area (students/alumni).
- Analytics: Microsoft Clarity and GoatCounter load only after analytics consent via the cookie banner — see [src/legal/loaders.ts](src/legal/loaders.ts) and [src/components/legal/CookieBanner.tsx](src/components/legal/CookieBanner.tsx).

**Architecture**
- Frontend: Vite React app with shadcn/ui components and React Query for data fetching.
- Backend: Supabase for data/auth, plus Vercel Serverless Functions in the api/ folder for write operations and enforcement.
- Data flow: reads go to public views (Supabase) from the client; critical writes go through /api endpoints.

**Frontend Structure**
- Routing and access gates: [src/App.tsx](src/App.tsx#L1-L48), [src/components/auth/RequireAuth.tsx](src/components/auth/RequireAuth.tsx#L1-L49).
- Core pages: clubs, events, teams, alumni, students, solidarity, admin, login.
- Data layer: [src/data](src/data) contains fetchers and mappers for Supabase views.

**API Surface (Serverless)**
- Shared helpers: [api/_shared.js](api/_shared.js)
  - CORS allowlist, JSON parsing, Supabase admin client, ip_hash + rate limit, text hashing utilities.
- Alumni profile create (write path): [api/alumni-profiles.js](api/alumni-profiles.js)
- Solidarity topic create (write path): [api/solidarity/topics.js](api/solidarity/topics.js)
- Solidarity comment create (write path): [api/solidarity/comments.js](api/solidarity/comments.js)

**Supabase Schema Summary**
- Core content tables:
  - Clubs: [supabase/migrations/202602010001_create_clubs.sql](supabase/migrations/202602010001_create_clubs.sql)
  - Student events/teams: [supabase/migrations/202602090001_add_events_teams_views_and_admin_rpc.sql](supabase/migrations/202602090001_add_events_teams_views_and_admin_rpc.sql)
  - Alumni profiles: [supabase/migrations/202602010008_create_alumni_profiles.sql](supabase/migrations/202602010008_create_alumni_profiles.sql)
  - Student profiles: [supabase/migrations/202602010011_create_student_profiles.sql](supabase/migrations/202602010011_create_student_profiles.sql)
  - Solidarity topics/comments: [supabase/migrations/202602010013_create_alumni_solidarity.sql](supabase/migrations/202602010013_create_alumni_solidarity.sql)
- Admin mappings + RLS:
  - Club admins: [supabase/migrations/202602010002_add_admins_and_rls.sql](supabase/migrations/202602010002_add_admins_and_rls.sql)
  - Event/team admins + RLS + public views: [supabase/migrations/202602090001_add_events_teams_views_and_admin_rpc.sql](supabase/migrations/202602090001_add_events_teams_views_and_admin_rpc.sql)
- Alumni profile field alignment:
  - instagram_url + whatsapp_number + nullable email: [supabase/migrations/202602090002_fix_alumni_profile_fields.sql](supabase/migrations/202602090002_fix_alumni_profile_fields.sql)
- Security enforcement tables:
  - Rate limit events + text_hash unique indexes: [supabase/migrations/202602090003_add_security_limits.sql](supabase/migrations/202602090003_add_security_limits.sql)

**Public Views (Client Read Models)**
- public_clubs, public_student_events, public_student_teams, public_alumni_profiles, public_student_profiles, public_alumni_solidarity_topics, public_alumni_solidarity_comments
- Defined in [supabase/migrations/202602090001_add_events_teams_views_and_admin_rpc.sql](supabase/migrations/202602090001_add_events_teams_views_and_admin_rpc.sql)
- Alumni view masks personal data when is_anonymous is true.

**Authentication & Authorization**
- Client auth is managed via Supabase JS in [src/lib/supabase.ts](src/lib/supabase.ts).
- Protected routes: students/alumni only, gated by [src/components/auth/RequireAuth.tsx](src/components/auth/RequireAuth.tsx).
- Admin access: Email-based superadmin enforcement in DB policies and RPCs.
- Admin panel uses Supabase auth session + RLS for read/update in [src/pages/Admin.tsx](src/pages/Admin.tsx).

**Security Controls Implemented**
- Client is untrusted: critical writes moved to /api and validated server-side.
- Rate limits (ip_hash) on writes:
  - Alumni profile create: 5/hour, 20/day, 50/week.
  - Solidarity topics: 3/hour, 10/day, 20/week.
  - Solidarity comments: 10/hour, 50/day, 200/week.
- Duplicate detection: text_hash unique indexes on alumni_profiles, solidarity topics, solidarity comments.
- CORS allowlist enforced in serverless API via ALLOWED_ORIGINS.
- CSP and security headers set in [vercel.json](vercel.json).

**Data Access Patterns**
- Reads: public views via Supabase client (read-only) in [src/data](src/data).
- Writes:
  - Alumni profile creation via /api in [src/data/alumni.ts](src/data/alumni.ts).
  - Solidarity topics/comments via /api in [src/data/alumniSolidarity.ts](src/data/alumniSolidarity.ts).
  - Admin updates still use Supabase client directly (club/event/team updates and admin assignment RPCs).

**Environment Variables**
- Client (Vite):
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  - VITE_CLARITY_ID (required for Clarity; if unset, Clarity simply does not load — no hard-coded fallback)
- Server (Vercel functions):
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - ALLOWED_ORIGINS (optional, comma-separated)
  - IP_HASH_SALT (optional but recommended)

**Operational Notes**
- Local dev server configured to run on port 8080: [vite.config.ts](vite.config.ts#L1-L16).
- Production security headers configured in [vercel.json](vercel.json).
- Supabase project metadata in [PROJECT_NOTES.md](PROJECT_NOTES.md).

**Known Gaps / Risks**
- The consolidated schema ([202606180001_reconstruct_schema_for_fresh_projects.sql](supabase/migrations/202606180001_reconstruct_schema_for_fresh_projects.sql)) enables RLS on all tables and defines only read / superadmin-all / admin-update policies — there is no anon `insert` policy, and `anon` is granted only `select` on public views. Anon-key inserts are blocked; all writes go through /api (service_role). (Verify on the live DB that only the reconstruct migration is applied, not the older RLS-less incremental `202602010013`.)
- Admin panel writes still go directly to Supabase; these are protected by RLS but not by API-level validation.
- No explicit CSRF handling for serverless routes; safe for token-less endpoints, but review if auth cookies are introduced.
- Role selection on login page is currently UI-only (no backend enforcement); the actual access gate is the Supabase session via RequireAuth.

**Suggested Next Hardening Steps**
- Remove public insert policies and enforce writes only through /api (or add stricter RLS rules).
- Move admin writes to /api and validate payloads centrally.
- Add moderation/report tables and throttle policies if user-generated content scales.

**How To Run**
- Install deps: npm install
- Dev: npm run dev
- Build: npm run build
- Tests: npm run test
