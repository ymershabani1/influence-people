# Influencer Directory

A production-ready full-stack influencer directory platform built with **Laravel 12** (REST API) and **Angular 20** (standalone components).

**Repository:** https://github.com/ymershabani1/influence-people

## Quick Start

### Requirements

- PHP 8.2+ (extensions: `mbstring`, `openssl`, `pdo_mysql`, `fileinfo`, `gd` or `imagick`)
- Composer 2.x
- MySQL 8.0+
- Node.js 20+ (LTS recommended; Node 22 works)
- npm 10+
- Git

### 1. Clone the project

```bash
git clone https://github.com/ymershabani1/influence-people.git
cd influence-people
```

### 2. Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
```

Edit `backend/.env` and set your MySQL credentials:

```env
DB_DATABASE=influence_people
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

Create the database in MySQL:

```sql
CREATE DATABASE influence_people;
```

Then run:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API runs at **http://localhost:8000**

### 3. Frontend (Angular)

Open a **second terminal**:

```bash
cd frontend
npm install
npm start
```

App runs at **http://localhost:4200**

The frontend proxies API requests to `localhost:8000` automatically.

### 4. Admin login

Go to **http://localhost:4200/admin/login**

| Field | Value |
|-------|-------|
| Email | `admin@influencer.directory` |
| Password | `password` |

Override via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` before running `php artisan migrate --seed`.

### 5. Seeded data

- 100 sample influencers
- 21 categories
- 1 admin user

### Windows notes

If `php` or `composer` is not recognized, install them and restart your terminal:

- PHP: https://windows.php.net/download/
- Composer: https://getcomposer.org/download/

Or with winget:

```powershell
winget install PHP.PHP.8.3
winget install Composer.Composer
```

### Troubleshooting

- **Database connection error** — check MySQL is running and `.env` credentials are correct.
- **Images not showing** — run `php artisan storage:link` in the `backend` folder.
- **Login not working** — make sure both servers are running (`php artisan serve` and `npm start`).
- **Port already in use** — stop other apps on ports 8000 or 4200, or use different ports.

## Architecture

```
influence-people/
├── backend/          # Laravel 12 REST API
│   ├── app/
│   │   ├── Enums/           # UserRole, Gender, FollowersMode
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   ├── Resources/
│   │   │   └── Responses/   # Standardized JSON responses
│   │   ├── Models/
│   │   ├── Policies/
│   │   ├── Repositories/    # Repository pattern (interfaces + implementations)
│   │   └── Services/        # Business logic layer
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/         # 100 influencers + 21 categories + admin user
│   └── routes/api.php
└── frontend/         # Angular 20 SPA
    └── src/app/
        ├── core/            # Guards, interceptors, services, models
        ├── shared/          # Reusable components (cards, social icons, toasts)
        └── features/
            ├── public/      # Homepage, influencer detail
            └── admin/       # Dashboard, CRUD, categories, settings
```

### Design Decisions

| Layer | Pattern | Purpose |
|-------|---------|---------|
| Backend | Repository + Service | Separates data access from business logic; easy to swap storage or add caching |
| Backend | API Resources | Consistent JSON transformation for future mobile/desktop clients |
| Backend | Form Requests | Centralized validation for all endpoints |
| Backend | Policies | Role-based authorization (admin-only mutations) |
| Frontend | Standalone + Lazy Routes | Smaller bundles, feature-based code splitting |
| Frontend | Signals + RxJS | Reactive state for filters; observables for HTTP |
| Auth | Laravel Sanctum (SPA) | Cookie-based session auth with CSRF protection |

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/influencers` | List influencers (search, filter, sort, paginate) |
| GET | `/api/v1/influencers/{id}` | Get influencer details |
| GET | `/api/v1/influencers/price-range` | Get min/max price for filters |
| GET | `/api/v1/categories` | List categories |

### Admin (requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/login` | Admin login |
| POST | `/api/v1/logout` | Logout |
| GET | `/api/v1/me` | Current user |
| GET | `/api/v1/dashboard` | Dashboard stats |
| POST | `/api/v1/influencers` | Create influencer |
| PUT | `/api/v1/influencers/{id}` | Update influencer |
| DELETE | `/api/v1/influencers/{id}` | Delete influencer |
| POST | `/api/v1/influencers/bulk-delete` | Bulk delete |
| POST | `/api/v1/categories` | Create category |
| PUT | `/api/v1/categories/{id}` | Update category |
| DELETE | `/api/v1/categories/{id}` | Delete category |

### Query Parameters (GET /influencers)

- `search` — first name, last name, username, category
- `gender` — male, female, other
- `min_price`, `max_price` — price range
- `category_id` — filter by category
- `sort` — newest, oldest, lowest_price, highest_price, most_followers, alphabetical
- `per_page`, `page` — pagination

## Features

### Public Website
- Responsive influencer card grid with hover animations
- Live search with debounce
- Price range slider, gender filter, sort dropdown
- Social media icons with per-platform follower counts (K/M format)
- Influencer detail page with information, categories, languages, call and email buttons
- EUR-only pricing

### Admin Dashboard
- Sidebar navigation (Dashboard, Influencers, Categories, Settings)
- Influencer CRUD with image upload
- Followers entry: total manually **or** per-platform (auto-summed)
- Bulk delete
- Category management
- Server-side pagination, search, filtering

### Security
- Laravel Sanctum SPA authentication
- CSRF protection
- Rate limiting on login (5/min)
- Form request validation
- Authorization policies
- File upload validation (images only, max 5MB)

## Future-Ready

The architecture supports adding without major refactoring:

- Mobile apps (Flutter/React Native) — consume the same REST API
- Desktop app (Electron) — consume the same REST API
- Public API with API keys — add token-based auth alongside Sanctum
- Role-based permissions — extend `UserRole` enum and policies
- Favorites, messaging, bookings — add new models/services/repositories

## Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && php artisan config:cache && php artisan route:cache
```

Serve the Angular `dist/frontend/browser` output via your web server and point API requests to the Laravel backend.

## License

MIT
