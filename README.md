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

[Add setup instructions here]

## Development Workflow

[Add development workflow instructions here] 
