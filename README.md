# 📚 Library Book Borrowing and Inventory System

A modern library management system built with **Laravel 12**, **Breeze**, **InertiaJS**, **React**, and **TypeScript**.

## ✨ Features

- 🔐 **Role-Based Authentication** (Admin & Staff)
- 👥 **User Management** (CRUD operations)
- 📧 **Scheduled Email Reminders** for book returns
- 🌙 **Dark Mode Support**
- 💼 **Profile Management** with avatar upload
- 📊 **Role-Based Dashboards**
- ⚡ **Modern UI** with Tailwind CSS

## 🛠️ Tools and Technologies

| **Component** | **Tools / Languages** | **Description** |
|--------------|----------------------|-----------------|
| **Front-end** | React 18, TypeScript, Inertia.js 2.0, Tailwind CSS 3, Vite 7 | User interface, styling, and build tools |
| **Back-end** | PHP 8.2+, Laravel 12, Laravel Breeze | Server-side logic, authentication, and API |
| **Database** | PostgreSQL | Data storage and management |
| **Others** | Git, Composer, npm, Lucide React, React Toastify | Version control, package management, icons, and notifications |

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Library-System-master
```

2. **Install dependencies and setup**
```bash
composer setup
```
This will:
- Install PHP dependencies
- Copy `.env.example` to `.env`
- Generate application key
- Run migrations
- Install npm dependencies
- Build frontend assets

3. **Configure environment**
```bash
# Update .env file with your settings
QUEUE_CONNECTION=database
MAIL_MAILER=smtp
# ... other mail settings
```

## 🔧 Development

**Start development server (recommended):**
```bash
composer dev
```
This starts three services concurrently:
- Laravel server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Vite dev server (`npm run dev`)

**Or start services manually:**
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Queue worker (required for email scheduling)
php artisan queue:work --tries=3

# Terminal 3: Vite dev server
npm run dev
```

## 📧 Email Reminder System

The email reminder system uses Laravel's queue system to schedule emails for specific dates and times.

**Important:** The queue worker must be running for scheduled emails to be sent!

**For details, see:** [EMAIL_SCHEDULING_GUIDE.md](EMAIL_SCHEDULING_GUIDE.md)

### Quick Start:
1. Start queue worker: `php artisan queue:work`
2. Go to Email Reminder page
3. Enter email, date, and time
4. Email will be sent at scheduled time

## 🎯 Project Structure

### Root Directory Overview

```
Library-App/
├── app/                    # Backend PHP code (Laravel)
├── config/                 # Application configuration files
├── database/               # Migrations, seeders, and factories
├── public/                 # Public assets and entry point (index.php)
├── resources/              # Frontend code and views
├── routes/                 # Route definitions
├── storage/                # Logs, cache, and uploaded files
├── tests/                  # Automated tests
└── vendor/                 # Composer dependencies (auto-generated)
```

---

### Backend Structure (`app/`)

The backend handles all server-side logic, database operations, and API responses.

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/              # Admin-only controllers
│   │   │   └── UserController.php
│   │   │
│   │   ├── Auth/               # Authentication controllers (login, register, password)
│   │   │
│   │   ├── Shared/             # Controllers accessible by both Admin and Staff
│   │   │   ├── AIChatController.php
│   │   │   ├── BookSearchController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── ProfileController.php
│   │   │   ├── Catalog/        # Catalog management
│   │   │   │   ├── AuthorController.php
│   │   │   │   ├── CatalogItemController.php
│   │   │   │   ├── CatalogItemCopyController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   └── PublisherController.php
│   │   │   ├── Circulation/    # Book borrowing/returns
│   │   │   │   ├── BookRequestController.php
│   │   │   │   └── BookReturnController.php
│   │   │   ├── Members/        # Member management
│   │   │   │   └── MemberController.php
│   │   │   └── Tools/          # Utility tools
│   │   │       └── EmailReminderController.php
│   │   │
│   │   └── SetupController.php
│   │
│   ├── Middleware/             # Request filters (auth, roles, etc.)
│   │
│   └── Requests/               # Form validation classes
│       ├── BookRequestStoreRequest.php
│       ├── StoreCatalogItemRequest.php
│       ├── StoreMemberRequest.php
│       ├── UpdateCatalogItemRequest.php
│       └── ... (other validation requests)
│
├── Jobs/                       # Background jobs (email scheduling, heavy tasks)
│
├── Mail/                       # Email templates and mailable classes
│
├── Models/                     # Database models (Eloquent ORM)
│   ├── Author.php              # Book authors
│   ├── BookRequest.php         # Borrow requests from members
│   ├── BookReturn.php          # Return records
│   ├── CatalogItem.php         # Books/items in the catalog
│   ├── CatalogItemCopy.php     # Physical copies of catalog items
│   ├── Category.php            # Book categories
│   ├── Member.php              # Library members
│   ├── Publisher.php           # Book publishers
│   └── User.php                # System users (Admin/Staff)
│
├── Notifications/              # System notifications
│
├── Providers/                  # Service providers (app bootstrapping)
│
└── Services/                   # Business logic and external integrations
```

**Flow:** Routes → Controllers → Requests (validation) → Models → Database

---

### Frontend Structure (`resources/js/`)

The frontend is built with React and TypeScript, using Inertia.js to connect with Laravel.

```
resources/js/
├── components/                 # Reusable UI components
│   ├── authors/                # Author-related components
│   ├── book-returns/           # Book return components
│   ├── books/                  # Book display components
│   ├── catalog-items/          # Catalog item form sections and displays
│   ├── categories/             # Category components
│   ├── common/                 # Shared components (tables, cards, etc.)
│   ├── forms/                  # Form input components
│   ├── members/                # Member-related components
│   ├── menu/                   # Navigation menu items
│   ├── modals/                 # Modal dialogs
│   ├── navigation/             # Navigation bar components
│   ├── publishers/             # Publisher components
│   ├── sidebars/               # Sidebar navigation
│   ├── skeletons/              # Loading skeleton components
│   ├── users/                  # User management components
│   └── welcome/                # Landing page components
│
├── contexts/                   # React Context providers (global state)
│   └── ThemeContext.tsx        # Dark/light mode theme management
│
├── layouts/                    # Page layout wrappers
│   ├── AuthenticatedLayout.tsx # Layout for logged-in users (with sidebar)
│   └── GuestLayout.tsx         # Layout for guest pages (login, register)
│
├── pages/                      # Inertia page components (routes render these)
│   ├── admin/                  # Admin pages
│   │   ├── catalog-items/      # Add, Edit, View catalog items
│   │   ├── circulations/       # Book circulation management
│   │   ├── members/            # Add, Edit, View members
│   │   ├── Authors.tsx         # Author management
│   │   ├── BookReturns.tsx     # Return processing
│   │   ├── CatalogItems.tsx    # Catalog listing
│   │   ├── Categories.tsx      # Category management
│   │   ├── Dashboard.tsx       # Admin dashboard
│   │   ├── Members.tsx         # Member listing
│   │   ├── Publishers.tsx      # Publisher management
│   │   └── users.tsx           # User management
│   │
│   ├── auth/                   # Authentication pages
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   │
│   ├── profile/                # User profile pages
│   ├── staff/                  # Staff-specific pages
│   ├── BookDetails.tsx         # Single book view
│   ├── BorrowRequest.tsx       # Borrow request form
│   └── Welcome.tsx             # Landing page
│
├── types/                      # TypeScript type definitions
│   ├── index.d.ts              # Main types (User, CatalogItem, Member, etc.)
│   └── global.d.ts             # Global type declarations
│
├── utils/                      # Utility/helper functions
│   ├── breadcrumbGenerator.ts  # Dynamic breadcrumb creation
│   ├── lazyLoad.ts             # Component lazy loading
│   └── performanceMonitor.ts   # Performance tracking
│
├── app.tsx                     # Main React entry point
└── bootstrap.ts                # Frontend bootstrapping
```

**Flow:** User Action → Inertia Router → Laravel Route → Controller → Inertia::render() → Page Component

---

### Database Structure (`database/`)

```
database/
├── factories/                  # Model factories for generating fake data
│
├── migrations/                 # Database table definitions
│   ├── create_users_table.php
│   ├── create_authors_table.php
│   ├── create_categories_table.php
│   ├── create_publishers_table.php
│   ├── create_catalog_items_table.php
│   ├── create_catalog_item_copies_table.php
│   ├── create_members_table.php
│   ├── create_book_requests_table.php
│   ├── create_book_returns_table.php
│   └── create_notifications_table.php
│
└── seeders/                    # Initial data seeders
    ├── DatabaseSeeder.php      # Main seeder
    ├── DefaultAdminSeeder.php  # Creates default admin user
    └── RoleBasedUserSeeder.php # Creates test users with roles
```

**Key Tables:**
- `users` - Admin and Staff accounts
- `members` - Library members who borrow books
- `catalog_items` - Books and other library items
- `catalog_item_copies` - Physical copies of each catalog item
- `book_requests` - Borrow requests from members
- `book_returns` - Return records and history

---

### Routes (`routes/`)

```
routes/
├── web.php         # Main application routes (Inertia pages)
├── auth.php        # Authentication routes (login, register, password reset)
└── console.php     # Artisan command definitions
```

**Route Groups:**
- `/` - Public routes (Welcome page)
- `/admin/*` - Admin-only routes (protected by middleware)
- `/staff/*` - Staff routes
- `/profile` - Profile management (shared)

---

### Configuration (`config/`)

```
config/
├── app.php         # Application settings (name, timezone, locale)
├── auth.php        # Authentication guards and providers
├── database.php    # Database connections
├── mail.php        # Email configuration
├── queue.php       # Queue/job settings
└── session.php     # Session management
```

---

### How It All Connects (Request Flow)

```
1. User visits URL
       ↓
2. routes/web.php matches the URL to a Controller
       ↓
3. Controller processes the request
   - Validates input using Requests/
   - Interacts with Models/ for database operations
   - May trigger Jobs/ for background tasks
       ↓
4. Controller returns Inertia::render('page/Name', $data)
       ↓
5. Inertia sends data to React
       ↓
6. React page component (resources/js/pages/) renders the UI
       ↓
7. User sees the page with data
```

## 🧪 Testing

```bash
composer test
```

## 🛠️ Built With Laravel

Laravel is a web application framework with expressive, elegant syntax. Features used in this project:

- [Routing Engine](https://laravel.com/docs/routing)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Queue System](https://laravel.com/docs/queues)
- [Mail System](https://laravel.com/docs/mail)
- [Authentication (Breeze)](https://laravel.com/docs/starter-kits)

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
