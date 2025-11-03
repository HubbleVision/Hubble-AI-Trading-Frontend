# Hubble AI Trading Frontend

[🇨🇳 中文](README_CN.md) | [🇺🇸 English](README.md)

> **Open-source frontend system for AI-powered trading management**

Hubble AI Trading Frontend is a modern, full-stack open-source frontend system built for AI trading platforms. Powered by React Router 7, Cloudflare Workers, and D1 database, it provides comprehensive trading analytics, intelligent order management, and real-time portfolio tracking for AI-driven trading strategies.

## 🚀 Tech Stack

- **Frontend**: React Router 7, React 19, TailwindCSS 4
- **Backend**: Cloudflare Workers (edge runtime)
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Infrastructure**: Alchemy (Infrastructure as Code)
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI, Lucide Icons
- **Data Visualization**: Recharts
- **Language**: TypeScript

## 📁 Project Structure

```
trading/
├── app/                          # Application source code
│   ├── features/                 # Feature-based modules
│   │   ├── traders/              # Trader management
│   │   ├── order/                # Order management
│   │   ├── positions/            # Position tracking
│   │   ├── analysis-team/        # Analysis team records
│   │   ├── client.chart/         # Account balance chart visualization
│   │   ├── client.order/         # Order list UI
│   │   └── client.portfolio/     # Portfolio display
│   ├── routes/                   # React Router routes
│   │   └── api/v1/               # RESTful API endpoints
│   ├── components/ui/             # Reusable UI components
│   ├── lib/                      # Shared utilities
│   └── middleware/               # Request middleware
├── database/                      # Database schema definitions
├── drizzle/                      # Database migrations
├── workers/                      # Cloudflare Worker entry point
├── alchemy.run.ts                # Infrastructure definition
└── package.json
```

## 🏗️ Architecture

### Feature-Based Module Organization

The project follows a feature-based architecture where each module is self-contained:

```
app/features/{feature-name}/
├── database/          # Database schema & types
├── api/               # API handlers (server-only)
├── hooks/             # React Query hooks (client)
├── components/        # UI components (client)
└── index.ts           # Unified exports
```

See [`app/features/README.md`](app/features/README.md) for detailed module structure guidelines.

### Server vs Client Separation

- ✅ **Client-safe**: Types, hooks, components
- ❌ **Server-only**: Schema definitions, API handlers, database utilities

### Routes vs Features

- **Routes** (`app/routes/`): Handle routing, export `loader`/`action`
- **Features** (`app/features/`): Business logic, called by routes

## 🔑 Key Features

### AI Trading Management
- **AI Traders**: Manage AI trader accounts, track account balances for algorithmic trading strategies
- **Smart Orders**: Intelligent order lifecycle tracking (NEW, FILLED, CANCELED) with AI-driven decision support
- **Real-time Positions**: Live position monitoring and historical analysis for AI trading systems
- **Analysis Team**: Store and retrieve AI-generated trading analysis and strategy records

### Client Interfaces
- **Interactive Charts**: Real-time account balance curve visualization with AI trader selection and analytics
- **Smart Order Lists**: Advanced filtering and display for AI-generated trading orders
- **Portfolio Dashboards**: Comprehensive portfolio views for AI trading strategies

### API Endpoints

```
GET    /api/v1/traders                    # List traders
GET    /api/v1/traders/pnl                # Get account balance data
GET    /api/v1/traders/latest-balance     # Latest balances
GET    /api/v1/orders                     # Query orders
POST   /api/v1/orders/import              # Import orders
GET    /api/v1/orders/latest              # Latest orders
GET    /api/v1/analysis-records           # Analysis records
GET    /api/v1/position-records           # Position records
GET    /api/v1/config                     # System configuration
```

See individual feature READMEs for detailed API documentation.

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ (or Bun)
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Installation

```bash
# Install dependencies
pnpm install

# Authenticate with Cloudflare
wrangler login
```

### Environment Setup

Create `.env` or `.env.local`:

```bash
# Required for secret encryption
ALCHEMY_PASSWORD=your-secure-password

# Optional: Session configuration
SESSION_EXPIRY=604800  # 7 days in seconds

# Optional: Admin authentication
ADMIN_AUTH_HEADER=auth_admin
ADMIN_AUTH_SECRET=your-secret

# Optional: Initial account balance
INITIAL_ACCOUNT_BALANCE=10000
```

### Development

```bash
# Start development server
pnpm dev

# Type checking
pnpm typecheck

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Database Management

```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open Drizzle Studio (local)
pnpm db:studio

# Open Drizzle Studio (remote)
pnpm db:studio:remote

# Seed database
pnpm db:seed

# Clear seed data
pnpm db:seed:clear
```

### Deployment

```bash
# Deploy to Cloudflare
pnpm deploy

# Destroy all resources (careful!)
pnpm destroy
```

## 📚 Documentation

- [Features Module Guide](app/features/README.md) - Feature-based development patterns
- [Order Feature](app/features/order/README.md) - Order management system
- [Chart Feature](app/features/client.chart/README.md) - Chart visualization
- [API Examples](API_CURL_EXAMPLES.md) - API usage examples

## 🎯 Development Guidelines

### Code Style

- **File naming**: kebab-case (e.g., `use-orders.ts`)
- **Variable naming**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Comments**: Chinese (as per project conventions)
- **Import order**: Node built-ins → Third-party → Project internal → Relative paths

### Error Handling

Three error types:
- `BusinessError`: Business logic errors
- `SystemError`: System/infrastructure errors
- `ValidationError`: Input validation errors

### API Standards

- RESTful conventions: Resources as plural nouns
- URL versioning: `/api/v1/resource`
- Response format: `{success, data/error, meta}`
- Input validation: Zod schemas

### Database Conventions

- Table names: Plural, snake_case
- Fields: snake_case
- Primary key: `id`
- Timestamps: `created_at`, `updated_at`
- All changes via migrations

## 🔒 Security

- Session-based authentication using KV storage
- Admin authentication via header + secret
- Environment variables for sensitive data
- Input validation with Zod

## 🌟 About Hubble AI

**Hubble AI Trading Frontend** is part of the Hubble AI ecosystem, providing open-source frontend infrastructure for AI-powered trading platforms. This project enables developers to build sophisticated trading interfaces that integrate seamlessly with AI trading strategies and algorithms.

### Open Source

This project is open-source, allowing the community to contribute, customize, and extend the platform for their AI trading needs.

## 📝 License

MIT License - See LICENSE file for details
