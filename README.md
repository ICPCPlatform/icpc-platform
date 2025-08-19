# ICPC Platform

A full-stack Next.js application for managing ICPC-style programming competitions. Built with modern web technologies and following Next.js 13+ App Router conventions.

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: CSS Modules
- **Authentication**: [Add auth provider]

## Project Structure

```
src/                        # All source code
├── app/                    # Next.js App Router
│   ├── api/               # Backend API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   │   ├── route.ts  # Auth API implementation
│   │   │   └── __tests__/# API tests and documentation
│   │   │       └── auth.rest # REST API tests
│   │   └── training/     # Training management API
│   │
│   ├── (routes)/         # Frontend pages
│   │   ├── create-training/  # Training creation page
│   │   └── profile/         # User profile pages
│   │
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page

├── lib/                   # Shared utilities
│   └── db/               # Database layer
│       ├── schema/       # Database tables & relationships
│       └── index.ts      # Database connection

└── components/           # React components
    ├── ui/              # Basic UI components
    └── features/        # Feature-specific components

public/                   # Static assets
└── images/              # Image files

drizzle/                 # Database management
├── migrations/          # Database migrations
└── schema.ts           # Main schema file
```

## Key Directories Explained

### `src/app` - Application Core

The main application code using Next.js App Router:

- **`api/`**: Backend API endpoints

  - Each feature domain (auth, training) contains:
    - `route.ts`: API implementation
    - `__tests__/`: Tests and API documentation
    - `*.rest`: HTTP request examples
  - Uses Next.js Route Handlers
  - Example: `training/route.ts` handles training CRUD operations

- **`(routes)/`**: Frontend pages
  - Each folder is a route in the application
  - `page.tsx` defines the page content
  - `layout.tsx` for shared layouts
  - CSS Modules for styling

### `src/lib` - Shared Code

Common utilities and business logic:

- **`db/`**: Database layer
  - `schema/`: Table definitions and relationships
  - `index.ts`: Database connection and configuration
  - Uses Drizzle ORM for type-safe database operations

### `src/components` - React Components

Reusable UI components:

- **`ui/`**: Basic components (buttons, inputs, cards)
- **`features/`**: Complex, feature-specific components

### `drizzle/` - Database Management

Database version control and schema:

- **`migrations/`**: Track database changes
- **`schema.ts`**: Central schema definition

## File Naming Conventions

- `page.tsx`: Next.js page components
- `layout.tsx`: Layout components
- `route.ts`: API route handlers
- `*.module.css`: CSS Modules for styling
- `index.ts`: Barrel exports

## Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ICPCPlatform/icpc-platform.git
   cd icpc-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/icpc_platform"
   
   # Session Management
   SESSION_SECRET="your-super-secret-session-key-here"
   
   # Email Service (Resend)
   RESEND_API_KEY="your-resend-api-key"
   
   # Application URL
   URL="localhost:3000"
   NODE_ENV="development"
   ```

4. **Database Setup**
   
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE icpc_platform;
   ```
   
   Run database migrations:
   ```bash
   npm run db:migrate
   ```
   
   (Optional) Seed with sample data:
   ```bash
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at [http://localhost:3000](http://localhost:3000)

### Learning Resources

#### For New Contributors
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs) - Learn about App Router, API routes, and React Server Components
- **TypeScript Handbook**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) - Essential for type-safe development
- **Drizzle ORM Guide**: [orm.drizzle.team](https://orm.drizzle.team/) - Database operations and schema management
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs) - Utility-first CSS framework

#### ICPC & Competitive Programming
- **ICPC Official Site**: [icpc.global](https://icpc.global/) - Contest rules, problems, and resources
- **Codeforces**: [codeforces.com](https://codeforces.com/) - Practice problems and contests
- **CP-Algorithms**: [cp-algorithms.com](https://cp-algorithms.com/) - Algorithm implementations and explanations

#### Key Project Documents
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project
- **[API Documentation](./src/app/api/README.md)** - REST API endpoints and usage
- **[Database Schema](./doc/ERDv2.1.svg)** - Visual representation of database structure
- **[Project Roadmap](./todo.md)** - Current tasks and future plans

## Development Workflow

### Daily Development Process

1. **Pull Latest Changes**
   ```bash
   git pull origin main
   npm install  # Update dependencies if needed
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. **Development Cycle**
   ```bash
   # Start development server with Turbopack (faster)
   npm run dev
   
   # Run linter to check code quality
   npm run lint
   
   # Build to check for compilation errors
   npm run build
   ```

4. **Database Changes**
   ```bash
   # Generate new migration after schema changes
   npx drizzle-kit generate:pg
   
   # Apply migrations
   npx drizzle-kit push:pg
   ```

5. **Testing & Quality Assurance**
   ```bash
   # Lint your code
   npm run lint
   
   # Format code (if Prettier is configured)
   npm run format
   
   # Type check
   npm run type-check
   ```

6. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add user authentication system"
   git push origin feature/your-feature-name
   ```

### Useful Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx drizzle-kit studio              # Open Drizzle Studio (database GUI)
npx drizzle-kit generate:pg         # Generate migrations
npx drizzle-kit push:pg             # Apply schema changes
npx drizzle-kit drop                # Drop database (destructive!)

# Utilities
npm run analyze      # Analyze bundle size (if configured)
npm audit           # Check for security vulnerabilities
```

### Development Tools

- **Database GUI**: Access Drizzle Studio at `http://localhost:4983` after running `npx drizzle-kit studio`
- **API Testing**: Use the `.rest` files in `src/app/api/**/__tests__/` with REST client extensions
- **Hot Reload**: Turbopack provides instant updates during development
- **Type Safety**: TypeScript ensures compile-time error catching 
