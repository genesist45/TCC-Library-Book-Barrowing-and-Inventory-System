---
alwaysApply: true
---
# Library Book Borrowing and Inventory System
**Tech Stack:** Laravel 12 + Breeze + InertiaJS + React + TypeScript + Vite

---

## 🎯 FRONTEND STRUCTURE RULES

### Directory Structure
- All frontend code must be placed inside `resources/js/`
- **Folder naming:** Use lowercase for all directories (`components/`, `pages/`, `layouts/`, `types/`, `utils/`, `contexts/`)
- **File naming:** 
  - Components → PascalCase (e.g., `BookCard.tsx`, `UserTable.tsx`)
  - Hooks → camelCase with 'use' prefix (e.g., `useAuth.ts`, `useDebounce.ts`)
  - Utils → camelCase (e.g., `formatDate.ts`, `cn.ts`)
  - Types → PascalCase or index (e.g., `User.ts`, `index.d.ts`)

### Routing & Navigation
- **Laravel handles ALL routing** — never install or use `react-router-dom`
- All Inertia pages must be stored in `pages/` and must match the path used in `Inertia::render()`
- Page structure must mirror Laravel controller render paths (e.g., `Inertia::render('auth/Login')` → `pages/auth/Login.tsx`)

### Component Organization
- Keep reusable UI elements inside `components/`, never inside `pages/`
- Use `layouts/` for shared layout structures (e.g., `AuthenticatedLayout.tsx`, `GuestLayout.tsx`)
- Pages should only handle page-specific logic and composition
- Create feature-based component folders when needed (e.g., `components/users/`, `components/books/`)

### Type Safety
- Define all TypeScript interfaces and types inside `types/`
- Always type component props, state, and function parameters
- Use Inertia's `PageProps` type for page components
- Export shared types from `types/index.d.ts`

### State Management
- Use `contexts/` only for truly global state (Auth, Theme, App Settings)
- Prefer React hooks (`useState`, `useReducer`) for local component state
- Use Inertia's built-in state management for server data
- Consider Zustand for complex global state needs

### Data Fetching
- **Primary:** Use Inertia's built-in data passing from controllers
- **Secondary:** Use `@inertiajs/react` hooks (`router.get()`, `useForm()`)
- Avoid calling axios or fetch directly inside components unless absolutely necessary
- If additional API calls are needed, use TanStack Query or SWR

### Import Conventions
- **Always use path aliases** instead of relative paths
- Alias format: `@/components/...`, `@/layouts/...`, `@/pages/...`, `@/types/...`, `@/utils/...`
- ✅ Good: `import Button from '@/components/Button'`
- ❌ Bad: `import Button from '../../components/Button'`

### Code Quality
- Keep all code modular, reusable, and strongly typed
- Follow consistent component structure: imports → types → component → export
- Use functional components with hooks (no class components)
- Implement proper error boundaries for production resilience

---

## ⚙️ BACKEND STRUCTURE RULES

### Directory Organization

**Controllers** (`app/Http/Controllers/`)
- Group by role or feature: `Admin/`, `Auth/`, `Shared/`
- Keep controllers lightweight — handle only request flow and responses
- Use `Inertia::render()` for page responses
- Use `response()->json()` for API endpoints
- Return proper HTTP status codes

**Models** (`app/Models/`)
- Define relationships, casts, and accessors only
- Keep business logic in Services or Actions (optional)
- Use proper type hints and return types
- Implement model events when needed

**Requests** (`app/Http/Requests/`)
- Handle all validation logic here
- Define authorization rules
- Keep controllers clean of validation code

**Middleware** (`app/Http/Middleware/`)
- Authentication, roles, permissions
- Request filtering and transformation
- CORS, rate limiting, etc.

**Services** (optional: `app/Services/`)
- Complex business logic
- Third-party API integrations
- Keep controllers thin by moving logic here

### Routing Best Practices

**Route Files:**
- `web.php` → Inertia (frontend) routes
- `auth.php` → Breeze authentication routes (included from web.php)
- `api.php` → RESTful API routes (if needed)
- `console.php` → Artisan command definitions

**Route Organization:**
- Group routes using prefixes and middleware
- Name routes clearly: `admin.books.index`, `books.show`, `profile.edit`
- Use resource routes when appropriate: `Route::resource('books', BookController::class)`
- Protect routes with proper middleware: `auth`, `verified`, `role:admin`

### Database Management

**Migrations** (`database/migrations/`)
- Define table structures with proper foreign keys and indexes
- Use meaningful migration names
- Never modify existing migrations in production

**Seeders** (`database/seeders/`)
- Store initial or default data
- Use factories for large datasets
- Separate admin/test data from production seeds

**Factories** (`database/factories/`)
- Generate fake data for testing and seeding
- Keep data realistic and consistent

### Best Practices

**Code Standards:**
- Follow PSR-12 coding standard
- Use dependency injection and type hints everywhere
- Apply Single Responsibility Principle (one class = one purpose)
- Return typed responses from methods

**Validation:**
- Always use Form Requests for validation
- Never validate directly in controllers
- Reuse validation rules when possible

**Security:**
- Use Laravel Sanctum for SPA authentication
- Protect routes with middleware
- Validate and sanitize all inputs
- Use Laravel's built-in CSRF protection

**Performance:**
- Use eager loading to prevent N+1 queries
- Cache frequently accessed data
- Optimize database queries
- Use queue jobs for heavy operations

---

## ✅ RECOMMENDED FRONTEND TOOLS

**Essential:**
1. **Tailwind CSS** – Utility-first CSS framework
2. **Shadcn/UI** – Accessible, customizable components
3. **Lucide React** – Modern icon library
4. **React Hook Form** – Performant form handling
5. **Zod** – TypeScript-first schema validation

**Highly Recommended:**
6. **date-fns** – Date formatting and calculations
7. **React Datepicker** – Date/time selection
8. **Sonner** – Clean toast notifications
9. **clsx** or **cn** utility – Conditional className handling

**Optional (Based on Needs):**
10. **TanStack Query** – Advanced data fetching/caching (if needed beyond Inertia)
11. **Zustand** – Global state management (if contexts become complex)
12. **Framer Motion** – Advanced animations
13. **ApexCharts** or **Recharts** – Charts for analytics dashboards

---

## ✅ RECOMMENDED BACKEND TOOLS

**Essential (Already Included):**
1. **Laravel Breeze** – Auth scaffolding with Inertia
2. **Eloquent ORM** – Models, relationships, queries
3. **Form Requests** – Validation handling
4. **Migrations & Seeders** – Database management
5. **Laravel Storage** – File uploads (`php artisan storage:link`)

**Highly Recommended:**
6. **Spatie Laravel Permission** – Role & permission management
7. **Laravel Sanctum** – SPA authentication
8. **Laravel Tinker** – Command-line testing

**Optional (Based on Needs):**
9. **Intervention Image** – Image manipulation for book covers
10. **Laravel Debugbar** – Development debugging (dev only)
11. **Laravel Excel** – Export/import reports (Maatwebsite/Laravel-Excel)
12. **Laravel Telescope** – Application monitoring (dev only)
13. **Spatie Laravel Query Builder** – Advanced filtering
14. **Spatie Laravel Media Library** – Advanced file management

---

## 🚀 DEVELOPMENT WORKFLOW

1. **Setup:** `composer install`, `npm install`, `php artisan migrate --seed`
2. **Development:** Run `npm run dev` and `php artisan serve` concurrently
3. **Build:** `npm run build` for production assets
4. **Code Quality:** Keep TypeScript strict mode enabled, use ESLint/Prettier
5. **Testing:** Write tests for critical business logic (borrowing rules, due dates, etc.)

---

💡 **Remember:** Keep code clean, modular, and well-documented. Follow Laravel and React best practices consistently across the entire project.
