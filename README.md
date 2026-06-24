# MoneyMate

Personal finance management app — track income and expenses across multiple accounts, categorize transactions, and visualize your finances with charts.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Key Features

- Multiple accounts per user (bank, cash, savings, etc.)
- Transactions with income/expense types and custom categories
- User-specific and global preset categories
- Transaction filtering by date range, category, type, and account
- Sorting by date or amount (ascending/descending) with pagination
- Financial summaries — total income, expenses, and balance
- Dashboard with Chart.js visualizations
- Dark/light theme switcher
- Role-based access control (admin/user)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | PHP 8.2+, Laravel 12, Laravel Sanctum |
| **Frontend** | Vue 3.5 (Composition API), TypeScript 5.9 |
| **Build tool** | Vite 7 |
| **State management** | Pinia 3 |
| **UI library** | PrimeVue 4, TailwindCSS 4 |
| **Charts** | Chart.js 4 |
| **Validation** | Zod (frontend), Laravel Requests (backend) |
| **Database** | SQLite (development), MySQL (production) |
| **Auth** | Laravel Sanctum (cookie-based sessions) |

---

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 20.19+ or 22.12+
- pnpm (recommended) or npm
- SQLite (bundled with PHP) or MySQL for production

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/MoneyMate-v2.git
cd MoneyMate-v2
```

### 2. Backend setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Configure your `.env` — for local development with SQLite no database changes are needed. For MySQL see the [Environment Variables](#environment-variables) section.

```bash
# Run migrations and seed demo data
php artisan migrate --seed
```

The seeder creates:

| Email | Password | Role |
|---|---|---|
| `admin@admin.pl` | `Admin123.` | admin |
| `user@user.pl` | `User123.` | user |

### 3. Frontend setup

```bash
cd ../frontend

# Install JS dependencies
pnpm install
```

Create a `.env` if you need a custom API URL (defaults to `http://localhost:8000/api`):

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Start development servers

**Option A — Start everything from the backend (recommended):**

```bash
cd backend
composer run dev
```

This starts the PHP server, queue listener, and Vite dev server simultaneously.

**Option B — Start each server manually:**

```bash
# Terminal 1 — Backend API (http://localhost:8000)
cd backend
php artisan serve

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Architecture

### Project structure

```
MoneyMate-v2/
├── backend/                    # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # API controllers
│   │   │   ├── Middleware/     # Auth, role middleware
│   │   │   └── Requests/       # Form request validation
│   │   └── Models/             # Eloquent models
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/            # Demo data seeders
│   ├── routes/
│   │   └── api.php             # All API routes
│   └── config/                 # Laravel config files
│
└── frontend/                   # Vue 3 + TypeScript SPA
    └── src/
        ├── views/              # Page-level components
        ├── components/         # Reusable UI components
        │   ├── auth/           # Sign in, sign up, logout, profile
        │   ├── forms/          # Transaction, account, category forms
        │   ├── transactions/   # Transaction list, filters, card
        │   └── settings/       # Account and category management
        ├── store/              # Pinia stores (user, accounts, categories)
        ├── services/           # Axios API service layer
        ├── router/             # Vue Router with auth guards
        ├── types/              # TypeScript interfaces
        └── schema/             # Zod validation schemas
```

### Request lifecycle

```
Browser → Vue Router → View/Component → Pinia Store → API Service (Axios)
                                                              ↓
                                                  Laravel Route → Controller
                                                              ↓
                                                  Eloquent Model → SQLite/MySQL
                                                              ↓
                                                  JSON Response ← Controller
```

### Authentication flow

1. On app load, `initSession()` in `useUserStore` calls `GET /api/user` to restore session
2. On login, frontend fetches CSRF cookie then posts credentials
3. Laravel Sanctum issues a cookie-based session token
4. All subsequent API requests send the cookie automatically
5. Route guards (`requiresAuth`, `guestOnly`) redirect unauthenticated/authenticated users

### Frontend routes

| Path | View | Guard |
|---|---|---|
| `/` | `HomeView` | Guest only |
| `/sign-in` | `SignInView` | Guest only |
| `/sign-up` | `SignUpView` | Guest only |
| `/app/dashboard` | `DashboardView` | Auth required |
| `/app/transactions` | `TransactionsView` | Auth required |
| `/app/settings` | `SettingsView` | Auth required |
| `/app/profile` | `ProfileView` | Auth required |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `APP_NAME` | Application name | `Laravel` |
| `APP_KEY` | Encryption key (auto-generated) | — |
| `APP_DEBUG` | Show debug errors | `true` |
| `APP_URL` | Backend URL | `http://localhost` |
| `DB_CONNECTION` | Database driver | `sqlite` |
| `DB_HOST` | MySQL host (if MySQL) | `127.0.0.1` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_DATABASE` | Database name or SQLite path | `database/database.sqlite` |
| `DB_USERNAME` | Database user | — |
| `DB_PASSWORD` | Database password | — |
| `SESSION_DRIVER` | Session storage | `file` |
| `QUEUE_CONNECTION` | Queue driver | `database` |
| `SANCTUM_STATEFUL_DOMAINS` | Allowed CORS domains | `localhost:5173` |

**Switching from SQLite to MySQL:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=moneymate
DB_USERNAME=root
DB_PASSWORD=secret
```

Then run:

```bash
php artisan migrate --seed
```

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

---

## Available Scripts

### Backend

```bash
# Start development server
php artisan serve

# Start everything (server + queue + Vite)
composer run dev

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration + seed
php artisan migrate:fresh --seed

# Open Tinker REPL
php artisan tinker

# Run tests
composer run test

# Fix code style (Laravel Pint)
./vendor/bin/pint
```

### Frontend

```bash
# Start development server
pnpm run dev

# Type checking
pnpm run type-check

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

---

## API Reference

All endpoints are prefixed with `/api`. Authentication uses Laravel Sanctum cookie-based sessions.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register new user |
| `POST` | `/auth/login` | No | Login |
| `POST` | `/auth/logout` | Yes | Logout |
| `DELETE` | `/auth/delete` | Yes | Delete own account |

### Current user

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/user` | Yes | Get current user |

### Accounts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/accounts` | Yes | List user accounts |
| `POST` | `/accounts` | Yes | Create account |
| `PUT` | `/accounts/:id` | Yes | Update account |
| `DELETE` | `/accounts/:id` | Yes | Delete account |

### Transactions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/transactions` | Yes | List transactions (supports filters) |
| `POST` | `/transactions` | Yes | Create transaction |
| `PUT` | `/transactions/:id` | Yes | Update transaction |
| `DELETE` | `/transactions/:id` | Yes | Delete transaction |

**Transaction query parameters:**

| Param | Type | Description |
|---|---|---|
| `account_id` | integer | Filter by account |
| `category_id` | integer | Filter by category |
| `type_id` | integer | Filter by type (income/expense) |
| `date_from` | date | Start date filter |
| `date_to` | date | End date filter |
| `sort_by` | string | `date` or `amount` |
| `sort_dir` | string | `asc` or `desc` |
| `per_page` | integer | Items per page (default 10) |

### Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/categories` | Yes | List categories (global + user's own) |
| `POST` | `/categories` | Yes | Create category |
| `PUT` | `/categories/:id` | Yes | Update category |
| `DELETE` | `/categories/:id` | Yes | Delete category |

### Types

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/types` | Yes | List types (income, expense) |

### Admin only

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users` | Admin | List all users |
| `DELETE` | `/users/:id` | Admin | Delete any user |

---

## Database Schema

```
users
├── id              bigint PK
├── name            string
├── email           string unique
├── password        string (hashed)
├── role_id         bigint FK → roles
└── timestamps

roles
├── id              bigint PK
└── name            string unique (admin / user)

accounts
├── id              bigint PK
├── name            string
├── user_id         bigint FK → users
└── timestamps

types
├── id              bigint PK
└── name            string (income / expense)

categories
├── id              bigint PK
├── name            string
├── user_id         bigint FK → users (nullable — null = global preset)
└── timestamps

transactions
├── id              bigint PK
├── name            string
├── amount          decimal(10,2)
├── date            date
├── user_id         bigint FK → users
├── type_id         bigint FK → types
├── category_id     bigint FK → categories
├── account_id      bigint FK → accounts
└── timestamps
```

---

## Testing

### Backend

```bash
cd backend

# Run all tests
composer run test

# Or directly with PHPUnit
./vendor/bin/phpunit
```

Tests are located in `backend/tests/` — `Feature/` for HTTP tests and `Unit/` for unit tests.

### Frontend

```bash
cd frontend

# TypeScript type checking
pnpm run type-check
```

---

## Troubleshooting

### `php artisan serve` fails — port in use

```bash
php artisan serve --port=8001
```

Update `VITE_API_BASE_URL=http://localhost:8001/api` in `frontend/.env`.

### CSRF / 419 errors on login

Ensure `SANCTUM_STATEFUL_DOMAINS` in `backend/.env` matches the frontend origin exactly (including port):

```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

Then clear config cache:

```bash
php artisan config:clear
```

### SQLite database not found

```bash
cd backend
touch database/database.sqlite
php artisan migrate --seed
```

### Migrations fail with MySQL

1. Create the database first: `CREATE DATABASE moneymate;`
2. Verify credentials in `.env`
3. Run `php artisan migrate --seed`

### Frontend can't reach the API (CORS errors)

Verify `backend/config/cors.php` allows `http://localhost:5173` and that `SESSION_DRIVER` is not `cookie` in development (use `file` or `database`).

### `pnpm` not installed

```bash
npm install -g pnpm
```

### Composer not installed

Download from [getcomposer.org](https://getcomposer.org/download/) or via package manager:

```bash
# macOS
brew install composer

# Ubuntu/Debian
sudo apt install composer
```
