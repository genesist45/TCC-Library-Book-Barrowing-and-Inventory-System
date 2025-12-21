# 🤖 FRONTEND RULES FOR LARAVEL INERTIA.JS (AI CODERS)

> **Purpose:** Clear, unambiguous rules for AI coding tools to maintain a clean, scalable React + TypeScript + InertiaJS frontend architecture within Laravel's `resources/js/` folder.

---

## ⚡ AI QUICK START (READ THIS FIRST!)

### 🎯 THE GOLDEN RULE
**All main pages and functionality go in `Features/` folder. Each feature is self-contained.**

> **Key Difference from Standalone React:** In InertiaJS, routing is handled by Laravel (backend), NOT React Router. Pages are rendered via `Inertia::render()` from Laravel controllers.

### 📌 5 CRITICAL RULES FOR AI (MEMORIZE THESE!)

| # | Rule | Details |
|---|------|---------|
| 1 | **Pages go in Features** | `Features/{Feature}/Pages/Index.tsx` (NOT root `Pages/`) |
| 2 | **Use Index/Show/Create/Edit** | NOT `{Feature}Page.tsx` - InertiaJS convention! |
| 3 | **Default exports ONLY** | Pages MUST use `export default function` |
| 4 | **Laravel handles routing** | NO React Router - routes are in `routes/web.php` |
| 5 | **Match Inertia::render() path** | `'Features/Members/Pages/Index'` → `Features/Members/Pages/Index.tsx` |

### 🧠 DECISION FLOWCHART FOR AI

```
When asked to CREATE something new in resources/js/:

1. Is it a new PAGE (rendered by Inertia)?
   └── YES → Create in `Features/{FeatureName}/Pages/`
         ├── List page → `Index.tsx`
         ├── Detail page → `Show.tsx`
         ├── Create page → `Create.tsx`
         └── Edit page → `Edit.tsx`

2. Is it a COMPONENT?
   ├── Used by MULTIPLE features? → `Components/`
   └── Used by ONE feature only? → `Features/{Feature}/Components/`

3. Is it a TypeScript TYPE?
   ├── Shared/global? → `types/`
   └── Feature-specific? → `Features/{Feature}/types/`

4. Is it a custom HOOK?
   ├── Used globally? → `Hooks/`
   └── Feature-specific? → `Features/{Feature}/Hooks/`

5. Is it a UTILITY function?
   └── Put in `lib/` or `utils/`
```

> ⚠️ **CRITICAL:** InertiaJS pages MUST use `export default function`. Named exports will NOT work!

### 📍 QUICK FILE PLACEMENT LOOKUP

| I need to create... | Put it in... |
|---------------------|---------------|
| New feature | `Features/{FeatureName}/` |
| List page (CRUD index) | `Features/{Feature}/Pages/Index.tsx` |
| Detail page (show one) | `Features/{Feature}/Pages/Show.tsx` |
| Create page | `Features/{Feature}/Pages/Create.tsx` |
| Edit page | `Features/{Feature}/Pages/Edit.tsx` |
| Feature component | `Features/{Feature}/Components/{Name}.tsx` |
| Shared/reusable component | `Components/{category}/{Name}.tsx` |
| Feature types | `Features/{Feature}/types/{feature}.d.ts` |
| Global types | `types/index.d.ts` or `types/global.d.ts` |
| Custom hook (feature) | `Features/{Feature}/Hooks/use{Name}.ts` |
| Custom hook (global) | `Hooks/use{Name}.ts` |
| Feature context | `Features/{Feature}/Context/{Name}Provider.tsx` |
| Global context | `Contexts/{Name}Context.tsx` |
| Utility function | `lib/{name}.ts` or `utils/{name}.ts` |
| Layout component | `Layouts/{Name}Layout.tsx` |

---

## 🛠️ TECH STACK (Laravel InertiaJS)

| Technology | Purpose |
|------------|---------|
| **Laravel** | Backend framework |
| **InertiaJS** | SPA bridge (no API needed) |
| **React 18/19** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool (via Laravel Vite) |
| **TailwindCSS** | Styling |
| **Ziggy** | Laravel route helper for JS |
| **Lucide React** | Icons |

---

## 📦 RECOMMENDED FRONTEND TOOLS & LIBRARIES

> 💡 **AI INSTRUCTION:** These tools are compatible with InertiaJS and recommended for building features. Use them when appropriate.

### 🎨 UI COMPONENT LIBRARIES

| Library | Purpose | When to Use | Install |
|---------|---------|-------------|---------|
| **shadcn/ui** | Pre-built accessible components | Best choice for InertiaJS - copy components to your project | `npx shadcn-ui@latest init` |
| **Headless UI** | Unstyled accessible components | When you need full styling control | `npm i @headlessui/react` |
| **Radix UI** | Unstyled primitives | Low-level accessible primitives | `npm i @radix-ui/react-*` |

> **RECOMMENDED:** Use **shadcn/ui** - it's the most popular choice for Laravel + InertiaJS projects. Components are copied to your project, not imported from node_modules.

#### shadcn/ui Setup for InertiaJS:
```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
```

Components are added to: `resources/js/Components/ui/`

---

### 📝 FORM HANDLING

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **@inertiajs/react** (useForm) | Built-in Inertia form handling | **PRIMARY CHOICE** - Use for all forms |
| **React Hook Form** | Advanced form handling | Complex forms with many fields |
| **Formik** | Alternative form library | If team prefers Formik |

#### Inertia useForm (RECOMMENDED):
```typescript
import { useForm } from '@inertiajs/react';

export const MemberForm = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('members.store'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <span>{errors.name}</span>}
            <button disabled={processing}>Submit</button>
        </form>
    );
};
```

#### React Hook Form (for complex forms):
```bash
npm i react-hook-form @hookform/resolvers
```

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
});

export const MemberForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
    // ...
};
```

---

### ✅ VALIDATION

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **Zod** | Schema validation | **RECOMMENDED** - TypeScript-first validation |
| **Yup** | Schema validation | Alternative if team prefers Yup |
| **Valibot** | Lightweight validation | When bundle size matters |

#### Zod (RECOMMENDED):
```bash
npm i zod
```

```typescript
// Features/Members/types/member.d.ts
import { z } from 'zod';

export const memberSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.enum(['active', 'inactive']),
});

export type Member = z.infer<typeof memberSchema>;
export type MemberFormData = z.infer<typeof memberSchema>;
```

---

### 📅 DATE & TIME UTILITIES

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **date-fns** | Date manipulation | **RECOMMENDED** - Lightweight, tree-shakeable |
| **dayjs** | Date manipulation | Alternative to date-fns |
| **Luxon** | Advanced date handling | Complex timezone requirements |

#### date-fns (RECOMMENDED):
```bash
npm i date-fns
```

```typescript
import { format, parseISO, formatDistance } from 'date-fns';

// Format date
format(new Date(), 'MMM dd, yyyy'); // "Dec 20, 2024"
format(parseISO(member.created_at), 'PPP'); // "December 20th, 2024"

// Relative time
formatDistance(new Date(), parseISO(member.created_at), { addSuffix: true });
// "2 days ago"
```

---

### 🎭 ICONS

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **Lucide React** | Beautiful icons | **RECOMMENDED** - Modern, consistent icons |
| **Heroicons** | Tailwind's icon set | If using Tailwind ecosystem |
| **React Icons** | Multiple icon packs | When you need variety |

#### Lucide React (RECOMMENDED):
```bash
npm i lucide-react
```

```typescript
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

<button>
    <Plus className="w-4 h-4 mr-2" />
    Add Member
</button>
```

---

### ✨ ANIMATIONS

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **Framer Motion** | Advanced animations | **RECOMMENDED** - Full animation control |
| **Motion** | Lightweight Framer Motion | Smaller bundle size |
| **React Spring** | Physics-based animations | Natural feeling animations |
| **AutoAnimate** | Simple auto-animations | Quick, simple animations |

#### Framer Motion (RECOMMENDED):
```bash
npm i framer-motion
```

```typescript
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
    {isOpen && (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            Modal Content
        </motion.div>
    )}
</AnimatePresence>
```

#### AutoAnimate (for quick simple animations):
```bash
npm i @formkit/auto-animate
```

```typescript
import { useAutoAnimate } from '@formkit/auto-animate/react';

const [parent] = useAutoAnimate();

<ul ref={parent}>
    {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
```

---

### 📊 TABLES & DATA DISPLAY

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **TanStack Table** | Headless table logic | **RECOMMENDED** - Full control over table UI |
| **AG Grid** | Enterprise data grid | Complex data requirements |
| **shadcn/ui DataTable** | Pre-built table component | Quick implementation |

#### TanStack Table (RECOMMENDED):
```bash
npm i @tanstack/react-table
```

```typescript
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
});
```

---

### 🔔 TOAST NOTIFICATIONS

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **Sonner** | Beautiful toasts | **RECOMMENDED** - Best looking, easy to use |
| **React Hot Toast** | Lightweight toasts | Simple notification needs |
| **React Toastify** | Feature-rich toasts | More customization needed |

#### Sonner (RECOMMENDED):
```bash
npm i sonner
```

```typescript
// In your layout
import { Toaster } from 'sonner';

<Toaster position="top-right" richColors />

// In your components
import { toast } from 'sonner';

toast.success('Member created successfully!');
toast.error('Something went wrong');
toast.loading('Saving...');
```

---

### 🛡️ STATE MANAGEMENT

> **NOTE:** InertiaJS pages receive data as props from Laravel. You usually don't need global state management. Use these only when necessary.

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **React Context** | Simple shared state | **RECOMMENDED** - Use first |
| **Zustand** | Lightweight state | When Context becomes complex |
| **Jotai** | Atomic state | Fine-grained state updates |

#### React Context (RECOMMENDED):
```typescript
// Contexts/CartContext.tsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    return (
        <CartContext.Provider value={{ items, setItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
```

#### Zustand (when Context is not enough):
```bash
npm i zustand
```

```typescript
// lib/stores/cartStore.ts
import { create } from 'zustand';

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
    items: [],
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
}));
```

---

### 🧰 OTHER USEFUL UTILITIES

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **clsx** / **cn** | Conditional classes | **ALWAYS USE** - For Tailwind class merging |
| **tailwind-merge** | Merge Tailwind classes | Prevents class conflicts |
| **nanoid** | Generate unique IDs | When you need client-side IDs |
| **lodash-es** | Utility functions | debounce, throttle, etc. |
| **immer** | Immutable state updates | Complex nested state |

#### clsx + tailwind-merge (ESSENTIAL):
```bash
npm i clsx tailwind-merge
```

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Usage
<button className={cn(
    'px-4 py-2 rounded',
    isActive && 'bg-blue-500',
    disabled && 'opacity-50 cursor-not-allowed'
)}>
    Click me
</button>
```

---

### 📋 RECOMMENDED PACKAGES SUMMARY

```bash
# Essential (install these first)
npm i lucide-react clsx tailwind-merge date-fns zod sonner

# shadcn/ui (run init, then add components as needed)
npx shadcn-ui@latest init

# Optional but recommended
npm i @tanstack/react-table framer-motion
npm i @hookform/resolvers  # if using React Hook Form with Zod
```

---

### 🎯 PACKAGE INSTALLATION BY USE CASE

| Use Case | Install |
|----------|---------|
| **Starting a new project** | `npm i lucide-react clsx tailwind-merge date-fns zod sonner` |
| **Building forms** | Use Inertia's `useForm` (built-in) + `zod` for validation |
| **Building tables** | `npm i @tanstack/react-table` + shadcn DataTable |
| **Adding animations** | `npm i framer-motion` or `npm i @formkit/auto-animate` |
| **Complex state** | `npm i zustand` (only if React Context isn't enough) |

---

## 📁 CORE FOLDER STRUCTURE

```
resources/js/
├── Components/       # 🔄 REUSABLE UI components (shared globally)
│   ├── ui/           # Basic UI elements (Button, Input, Modal, etc.)
│   ├── tables/       # Reusable table components
│   └── forms/        # Reusable form components
│
├── Contexts/         # React Context providers (global state)
│
├── Features/         # 🎯 FEATURE MODULES (main pages live here!)
│   ├── Auth/
│   ├── Dashboard/
│   ├── Members/
│   ├── Books/
│   └── ...
│
├── Hooks/            # Custom React hooks (global)
│
├── Layouts/          # Page layout wrappers
│   ├── AuthenticatedLayout.tsx
│   ├── GuestLayout.tsx
│   └── MainLayout.tsx
│
├── lib/              # Utility functions & helpers
│
├── types/            # Global TypeScript types
│   ├── index.d.ts
│   └── global.d.ts
│
├── app.tsx           # Inertia app setup (createInertiaApp)
├── bootstrap.ts      # App bootstrap (axios, etc.)
└── ssr.tsx           # (optional) Server-side rendering
```

### ⚠️ NOTE: Default Breeze vs Feature-Based Structure

**Laravel Breeze/Jetstream default:**
```
resources/js/
├── Pages/           # ❌ All pages in one folder (gets messy!)
│   ├── Dashboard.tsx
│   ├── Profile/
│   └── Auth/
└── Components/      # ❌ All components mixed together
```

**THIS GUIDE (Feature-Based - RECOMMENDED):**
```
resources/js/
├── Features/        # ✅ Organized by feature!
│   ├── Dashboard/
│   ├── Members/
│   └── Auth/
└── Components/      # ✅ Only shared components
```

> 💡 **Why Feature-Based?** Default Breeze structure becomes messy in large projects. Feature-based keeps related code together.

---

## 🎯 RULE #1: FEATURE-BASED ARCHITECTURE

### What is the `Features/` Folder?

The `Features/` folder is the **heart of the frontend**. It contains all the main functionality, organized by feature/module. Each feature is a **self-contained, isolated unit** that includes everything it needs.

> 💡 **AI INSTRUCTION:** When asked to build something new, ALWAYS check if it belongs to an existing feature or if a new feature folder should be created.

---

### 📦 FEATURE FOLDER STRUCTURE (TEMPLATE)

**ALWAYS** follow this structure for every feature:

```
Features/{FeatureName}/
├── Components/       # UI components used ONLY by this feature
│   ├── {Feature}Table.tsx
│   ├── {Feature}Modal.tsx
│   ├── {Feature}Form.tsx
│   └── {Feature}Card.tsx
│
├── Pages/            # Inertia pages (rendered by Laravel)
│   ├── Index.tsx     # List view (e.g., /members)
│   ├── Show.tsx      # Detail view (e.g., /members/{id})
│   ├── Create.tsx    # Create form (e.g., /members/create)
│   └── Edit.tsx      # Edit form (e.g., /members/{id}/edit)
│
├── types/            # TypeScript interfaces/types
│   └── {feature}.d.ts
│
├── Hooks/            # Feature-specific custom hooks (optional)
│   └── use{Feature}.ts
│
├── Context/          # Feature-specific React context (optional)
│   └── {Feature}Provider.tsx
│
└── index.ts          # 🔑 BARREL EXPORT (optional but recommended)
```

---

### 🗂️ REAL EXAMPLES

#### Example 1: Auth Feature (Simple)
```
Features/Auth/
├── Components/
│   └── LoginForm.tsx
├── Pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ForgotPassword.tsx
├── types/
│   └── auth.d.ts
└── index.ts
```

#### Example 2: Members Feature (CRUD)
```
Features/Members/
├── Components/
│   ├── MemberTable.tsx
│   ├── MemberCard.tsx
│   ├── MemberForm.tsx
│   └── MemberModal.tsx
├── Pages/
│   ├── Index.tsx        # GET /members
│   ├── Show.tsx         # GET /members/{id}
│   ├── Create.tsx       # GET /members/create
│   └── Edit.tsx         # GET /members/{id}/edit
├── types/
│   └── member.d.ts
├── Hooks/
│   └── useMemberFilters.ts
└── index.ts
```

#### Example 3: Dashboard Feature (Complex)
```
Features/Dashboard/
├── Components/
│   ├── StatsCard.tsx
│   ├── RecentActivity.tsx
│   ├── QuickActions.tsx
│   └── Charts/
│       ├── SalesChart.tsx
│       └── MembersChart.tsx
├── Pages/
│   └── Index.tsx
├── types/
│   └── dashboard.d.ts
├── Hooks/
│   └── useDashboardStats.ts
└── index.ts
```

---

### 📄 SUBFOLDER EXPLANATIONS

| Folder | Purpose | When to Use | Example Files |
|--------|---------|-------------|---------------|
| `Components/` | UI components for this feature only | Always | `MemberTable.tsx`, `MemberModal.tsx` |
| `Pages/` | Inertia pages (rendered by Laravel) | Always | `Index.tsx`, `Show.tsx`, `Create.tsx` |
| `types/` | TypeScript interfaces and types | When feature has data models | `member.d.ts` |
| `Hooks/` | Custom React hooks | When complex state logic is needed | `useMemberFilters.ts` |
| `Context/` | React Context for state sharing | When state is shared across many components | `MemberProvider.tsx` |

---

### 🔑 BARREL EXPORT (`index.ts`) - RECOMMENDED

```typescript
// Features/Members/index.ts
export * from './Pages/Index';
export * from './Pages/Show';
export * from './Components/MemberTable';
export * from './Components/MemberForm';
export * from './types/member';
```

---

## 🔄 RULE #2: COMPONENT PLACEMENT

### Decision Table:

| Component Type | Location | Example |
|----------------|----------|---------|
| Used by **2+ features** | `Components/` | Button, Modal, DataTable |
| Used by **ONE feature only** | `Features/{Feature}/Components/` | MemberCard, BookForm |
| **Page component** | `Features/{Feature}/Pages/` | Index.tsx, Show.tsx |
| **Layout wrapper** | `Layouts/` | AuthenticatedLayout.tsx |

### AI Decision Flow:
```
Is this component reusable across multiple features?
├── YES → Put in `Components/`
└── NO  → Put in `Features/{Feature}/Components/`
```

---

## 📝 RULE #3: NAMING CONVENTIONS

### File Naming Patterns:

| Type | Pattern | Example |
|------|---------|---------|
| Inertia Page (list) | `Index.tsx` | `Features/Members/Pages/Index.tsx` |
| Inertia Page (detail) | `Show.tsx` | `Features/Members/Pages/Show.tsx` |
| Inertia Page (create) | `Create.tsx` | `Features/Members/Pages/Create.tsx` |
| Inertia Page (edit) | `Edit.tsx` | `Features/Members/Pages/Edit.tsx` |
| Component | `{Name}.tsx` | `MemberCard.tsx`, `BookModal.tsx` |
| Hook | `use{Name}.ts` | `useAuth.ts`, `useMemberFilters.ts` |
| Context | `{Name}Context.tsx` | `AuthContext.tsx` |
| Provider | `{Name}Provider.tsx` | `MemberProvider.tsx` |
| Type file | `{feature}.d.ts` | `member.d.ts`, `book.d.ts` |
| Barrel export | `index.ts` | `index.ts` |
| Layout | `{Name}Layout.tsx` | `AuthenticatedLayout.tsx` |

### Folder Naming:
- **Feature folders:** PascalCase → `Auth/`, `Members/`, `Books/`
- **Subfolders in features:** PascalCase → `Components/`, `Pages/`, `Hooks/`
- **Global utility folders:** lowercase → `lib/`, `types/`, `utils/`

---

## 🛣️ RULE #4: INERTIA PAGE ROUTING

### Key Difference from Standalone React:
- **NO React Router** - Laravel handles all routing
- **NO routes/index.tsx** - Routes are defined in Laravel's `routes/web.php`
- **Pages are rendered** via `Inertia::render()` in Laravel controllers

### How InertiaJS Routing Works:

**Laravel Controller:**
```php
// app/Http/Controllers/MemberController.php
public function index()
{
    return Inertia::render('Features/Members/Pages/Index', [
        'members' => Member::all(),
    ]);
}

public function show(Member $member)
{
    return Inertia::render('Features/Members/Pages/Show', [
        'member' => $member,
    ]);
}
```

**React Page Component:**
```typescript
// resources/js/Features/Members/Pages/Index.tsx
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MemberTable } from '../Components/MemberTable';
import type { Member } from '../types/member';

interface Props {
    members: Member[];
}

export default function Index({ members }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Members" />
            <MemberTable members={members} />
        </AuthenticatedLayout>
    );
}
```

### Page File Location Pattern:

| Laravel Route | Inertia::render() Path | File Location |
|---------------|------------------------|---------------|
| `/members` | `Features/Members/Pages/Index` | `Features/Members/Pages/Index.tsx` |
| `/members/{id}` | `Features/Members/Pages/Show` | `Features/Members/Pages/Show.tsx` |
| `/members/create` | `Features/Members/Pages/Create` | `Features/Members/Pages/Create.tsx` |
| `/members/{id}/edit` | `Features/Members/Pages/Edit` | `Features/Members/Pages/Edit.tsx` |

---

## 🏗️ RULE #5: LAYOUTS

### Layout Files Location:
```
Layouts/
├── AuthenticatedLayout.tsx    # For logged-in users
├── GuestLayout.tsx            # For login/register pages
└── MainLayout.tsx             # Alternative main layout
```

### Layout Usage in Pages:
```typescript
// Features/Members/Pages/Index.tsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ members }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Members" />
            {/* Page content */}
        </AuthenticatedLayout>
    );
}
```

---

## ⚡ RULE #6: CODE ORGANIZATION

### Keep Files Small:
- **One component per file**
- **Max ~200 lines per component** (split if larger)
- **Extract logic to hooks**

### Import Rules:
```typescript
// ✅ CORRECT - Use @/ alias for absolute imports
import { MemberTable } from '@/Features/Members/Components/MemberTable';
import { Button } from '@/Components/ui/Button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ✅ ALSO CORRECT - Relative imports within same feature
import { MemberForm } from '../Components/MemberForm';
import type { Member } from '../types/member';

// ❌ WRONG - Deep relative imports across features
import { MemberTable } from '../../../Features/Members/Components/MemberTable';
```

---

## 📊 RULE #7: TYPES

### Global Types (`types/`):
```typescript
// types/global.d.ts
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
}
```

### Feature Types:
```typescript
// Features/Members/types/member.d.ts
export interface Member {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface MemberFormData {
    name: string;
    email: string;
    status: 'active' | 'inactive';
}
```

---

## 🎨 RULE #8: STYLING

- Use **TailwindCSS** classes directly in components
- Global styles in `resources/css/app.css`
- Use `clsx` or `cn` for conditional classes
- No inline styles or CSS modules

---

## 🚀 HOW TO CREATE A NEW FEATURE (STEP-BY-STEP)

> 💡 **AI INSTRUCTION:** Follow these exact steps when asked to create a new feature.

**Example:** Creating a "Books" feature

### Step 1: Create folder structure
```
Features/Books/
├── Components/
├── Pages/
├── types/
└── index.ts
```

### Step 2: Create types first
```typescript
// Features/Books/types/book.d.ts
export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    status: 'available' | 'borrowed';
    created_at: string;
}
```

### Step 3: Create the Index page
```typescript
// Features/Books/Pages/Index.tsx
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookTable } from '../Components/BookTable';
import type { Book } from '../types/book';

interface Props {
    books: Book[];
}

export default function Index({ books }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Books" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Books</h1>
                <BookTable books={books} />
            </div>
        </AuthenticatedLayout>
    );
}
```

### Step 4: Create components
```typescript
// Features/Books/Components/BookTable.tsx
import type { Book } from '../types/book';

interface Props {
    books: Book[];
}

export const BookTable = ({ books }: Props) => {
    return (
        <table className="min-w-full">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {books.map((book) => (
                    <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
```

### Step 5: Create barrel export (optional)
```typescript
// Features/Books/index.ts
export { default as BooksIndex } from './Pages/Index';
export { BookTable } from './Components/BookTable';
export * from './types/book';
```

### Step 6: Create Laravel route & controller (Backend)
```php
// routes/web.php
Route::resource('books', BookController::class);

// app/Http/Controllers/BookController.php
public function index()
{
    return Inertia::render('Features/Books/Pages/Index', [
        'books' => Book::all(),
    ]);
}
```

---

## ❌ COMMON MISTAKES TO AVOID

| ❌ DON'T | ✅ DO INSTEAD |
|----------|---------------|
| Put feature components in global `Components/` | Put in `Features/{Feature}/Components/` |
| Create pages outside Features folder | Create in `Features/{Feature}/Pages/` |
| Use React Router | Let Laravel handle routing |
| Create API endpoints for Inertia pages | Use Inertia::render() with data props |
| Mix feature code across folders | Keep feature code self-contained |
| Use relative path outside feature | Use `@/` alias for cross-feature imports |

---

## ✅ AI VALIDATION CHECKLIST

Before completing any task, verify:

- [ ] New feature has proper folder structure
- [ ] Pages are in `Features/{Feature}/Pages/`
- [ ] Feature components are in `Features/{Feature}/Components/`
- [ ] Types are in `Features/{Feature}/types/`
- [ ] Page uses correct Layout wrapper
- [ ] Imports use `@/` alias for cross-feature/global imports
- [ ] Page component is default export (required for Inertia)
- [ ] Laravel controller uses correct `Inertia::render()` path

---

## 🔑 KEY PRINCIPLES SUMMARY

1. **Self-contained features** → Each feature has everything it needs
2. **Pages in Features** → All pages live in `Features/{Feature}/Pages/`
3. **Laravel handles routing** → No React Router, use `routes/web.php`
4. **Type safety** → TypeScript for all files
5. **Small, focused files** → One purpose per file
6. **Consistent naming** → Follow the patterns strictly
7. **Layouts wrap pages** → Use AuthenticatedLayout or GuestLayout

---

## 🆚 STANDALONE REACT vs INERTIA COMPARISON

| Aspect | Standalone React | Laravel InertiaJS |
|--------|------------------|-------------------|
| Root folder | `src/` | `resources/js/` |
| Routing | React Router (`routes/index.tsx`) | Laravel (`routes/web.php`) |
| API calls | Axios to REST API | Inertia forms + props from controller |
| Page rendering | Lazy load + Suspense | Inertia::render() from Laravel |
| Data fetching | React Query / useEffect | Props from controller |
| services/ folder | YES (API calls) | Usually NO (data via props) |
| Pages naming | `{Feature}Page.tsx` | `Index.tsx`, `Show.tsx`, etc. |

---

## 💡 FINAL AI INSTRUCTION

> When asked to build something in Laravel InertiaJS:
> 1. **Identify the feature** it belongs to
> 2. **Follow the folder structure** exactly
> 3. **Create pages in** `Features/{Feature}/Pages/`
> 4. **Use naming conventions** strictly (Index, Show, Create, Edit)
> 5. **Remember:** Laravel handles routing, NOT React Router
> 6. **Validate against the checklist** before completing

**When in doubt:** Keep code inside the feature folder. It's easier to move code to global later than to untangle scattered code.
