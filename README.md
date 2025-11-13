# 📚 Library Book Borrowing and Inventory System

A modern library management system built with **Laravel 12**, **Breeze**, **InertiaJS**, **React**, and **TypeScript**.

## ✨ Features

- 🔐 **Role-Based Authentication** (Admin & Staff)
- 👥 **User Management** (CRUD operations)
- 📧 **Scheduled Email Reminders** for book returns
- 📱 **QR Code Scanner** for book tracking
- 🌙 **Dark Mode Support**
- 💼 **Profile Management** with avatar upload
- 📊 **Role-Based Dashboards**
- ⚡ **Modern UI** with Tailwind CSS

## 🛠️ Tools and Technologies

| **Component** | **Tools / Languages** | **Description** |
|--------------|----------------------|-----------------|
| **Front-end** | React 18, TypeScript, Inertia.js 2.0, Tailwind CSS 3, Vite 7 | User interface, styling, and build tools |
| **Back-end** | PHP 8.2+, Laravel 12, Laravel Breeze | Server-side logic, authentication, and API |
| **Database** | SQLite, MySQL | Data storage and management |
| **Others** | Git, Composer, npm, Lucide React, Sonner | Version control, package management, and development tools |

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

```
app/
├── Http/Controllers/
│   ├── Admin/          # Admin-only controllers
│   ├── Auth/           # Authentication controllers
│   ├── Shared/         # Shared controllers (admin & staff)
│   └── Staff/          # Staff controllers
├── Jobs/               # Background jobs
├── Mail/               # Email templates
└── Models/             # Eloquent models

resources/js/
├── components/         # Reusable React components
├── contexts/           # React contexts (Theme, etc.)
├── layouts/            # Page layouts
├── pages/              # Inertia pages
├── types/              # TypeScript definitions
└── utils/              # Utility functions
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
