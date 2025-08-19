# Contributing to ICPC Platform

Thank you for your interest in contributing to the ICPC Platform! This guide will help you understand our project structure, development practices, and contribution workflow.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Contribution Workflow](#contribution-workflow)
- [Code Standards](#code-standards)
- [API Guidelines](#api-guidelines)
- [Database Guidelines](#database-guidelines)
- [UI/UX Guidelines](#uiux-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Getting Help](#getting-help)

## Getting Started

Before contributing, please:

1. Read the [README.md](./README.md) for setup instructions
2. Join our community discussions (if applicable)
3. Check existing [issues](https://github.com/ICPCPlatform/icpc-platform/issues) and [pull requests](https://github.com/ICPCPlatform/icpc-platform/pulls)
4. Set up your development environment following the Getting Started guide

## Project Structure

### Architecture Overview

The ICPC Platform follows a modern full-stack architecture:

```
📁 icpc-platform/
├── 📁 src/                    # Application source code
│   ├── 📁 app/               # Next.js App Router (13+)
│   │   ├── 📁 api/          # Backend API endpoints
│   │   ├── 📁 (routes)/     # Frontend page routes
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Home page
│   ├── 📁 components/       # React components
│   │   ├── 📁 ui/          # Basic/reusable UI components
│   │   └── 📁 features/    # Feature-specific components
│   ├── 📁 lib/             # Shared utilities and business logic
│   │   ├── 📁 db/          # Database layer (Drizzle ORM)
│   │   ├── 📁 auth/        # Authentication utilities
│   │   └── 📁 utils/       # Helper functions
│   └── 📁 hooks/           # Custom React hooks
├── 📁 drizzle/             # Database migrations and schema
├── 📁 public/              # Static assets
└── 📁 doc/                 # Project documentation
```

### Key Directories Explained

#### `src/app/` - Next.js App Router

- **File-based routing**: Each folder becomes a route
- **Special files**:
  - `page.tsx` - Route page component
  - `layout.tsx` - Shared layout for route group
  - `route.ts` - API route handler
  - `loading.tsx` - Loading UI component
  - `error.tsx` - Error UI component

#### `src/app/api/` - Backend API

Each API feature follows this structure:
```
📁 feature-name/
├── route.ts              # Main API handler (GET, POST, etc.)
├── 📁 __tests__/         # API tests and documentation
│   └── feature.rest      # HTTP request examples
└── expectedBody.ts       # Zod validation schemas
```

#### `src/components/` - React Components

- **`ui/`**: Basic, reusable components (buttons, inputs, cards)
  - Should be generic and not tied to specific business logic
  - Follow Radix UI + shadcn/ui patterns
- **`features/`**: Feature-specific components
  - Can contain business logic
  - May use multiple UI components

#### `src/lib/` - Shared Code

- **`db/`**: Database layer with Drizzle ORM
  - `schema/`: Table definitions and relationships
  - `index.ts`: Database connection configuration
- **Type-safe**: Leverages TypeScript for compile-time safety

### Route Groups and Access Control

- **`(authorized-only)/`**: Pages requiring user login
- **`(admin-only)/`**: Pages requiring admin privileges
- **Public routes**: No parentheses, accessible to all users

## Development Guidelines

### Branch Naming

Use descriptive branch names following these patterns:

```bash
feature/user-authentication    # New features
fix/login-validation-bug      # Bug fixes
docs/api-documentation        # Documentation updates
refactor/database-schema      # Code refactoring
chore/update-dependencies     # Maintenance tasks
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile management
fix: resolve login session timeout issue
docs: update API endpoint documentation
style: format code with prettier
refactor: simplify database query logic
test: add unit tests for auth middleware
chore: update dependencies to latest versions
```

### Pull Request Process

1. **Create descriptive PR title and description**
2. **Link related issues** using keywords like "Fixes #123"
3. **Request reviews** from relevant maintainers
4. **Ensure CI passes** (linting, type checking, tests)
5. **Update documentation** if needed
6. **Squash commits** before merging (if multiple commits)

## Code Standards

### TypeScript Guidelines

- **Strict mode**: Project uses strict TypeScript configuration
- **Type safety**: Prefer explicit types over `any`
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use const assertions or union types instead of enums when possible

```typescript
// ✅ Good
interface UserData {
  id: number;
  username: string;
  role: 'admin' | 'user' | 'mentor';
}

// ❌ Avoid
const userData: any = { ... };
```

### React Component Guidelines

- **Functional components**: Use function declarations with TypeScript
- **Props interface**: Define clear props interfaces
- **JSDoc comments**: Document complex components and their props

```typescript
/**
 * UserCard component displays user information in a card format
 * 
 * @param user - User data object
 * @param onEdit - Callback function when edit button is clicked
 */
interface UserCardProps {
  user: UserData;
  onEdit?: (userId: number) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  // Component implementation
}
```

### File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **CSS Modules**: `ComponentName.module.css`
- **API routes**: `route.ts`

## API Guidelines

### Route Handler Structure

```typescript
/**
 * API endpoint description
 * 
 * @param request - Next.js request object
 * @returns Response with appropriate status and data
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validate input using Zod
    const validation = schema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input" }, 
        { status: 400 }
      );
    }

    // 2. Check authentication/authorization
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // 3. Business logic
    const result = await performOperation(validation.data);

    // 4. Return success response
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
```

### Input Validation

Always use Zod for API input validation:

```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### Error Handling

Use consistent error response format:

```typescript
// Success response
return NextResponse.json({ 
  data: result, 
  message: "Operation successful" 
}, { status: 200 });

// Error response
return NextResponse.json({ 
  error: "Descriptive error message",
  code: "SPECIFIC_ERROR_CODE" 
}, { status: 400 });
```

## Database Guidelines

### Schema Design

- **Use TypeScript**: Leverage Drizzle's type inference
- **Descriptive names**: Clear table and column names
- **Relationships**: Define foreign key relationships properly
- **Migrations**: Always generate migrations for schema changes

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Query Guidelines

- **Type-safe queries**: Use Drizzle's query builder
- **Error handling**: Wrap database operations in try-catch
- **Transactions**: Use transactions for multi-table operations

```typescript
// ✅ Good
try {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
    
  if (user.length === 0) {
    throw new Error('User not found');
  }
  
  return user[0];
} catch (error) {
  console.error('Database error:', error);
  throw error;
}
```

## UI/UX Guidelines

### Component Design

- **Accessibility**: Follow WCAG guidelines
- **Responsive**: Mobile-first design approach
- **Consistent**: Use design system components
- **Performance**: Optimize for loading and interaction

### Styling

- **Tailwind CSS**: Use utility classes for styling
- **CSS Modules**: For component-specific styles
- **Design tokens**: Use consistent spacing, colors, and typography

```tsx
// ✅ Good - Using Tailwind utilities
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
  Submit
</button>

// ✅ Good - CSS Modules for complex styling
<div className={styles.complexComponent}>
  {/* Component content */}
</div>
```

### shadcn/ui Integration

- Use shadcn/ui components as building blocks
- Customize using Tailwind CSS variables
- Maintain consistent component API patterns

## Testing Guidelines

### Unit Tests

- **Test utilities**: Pure functions and business logic
- **Component testing**: User interactions and rendering
- **API testing**: Request/response handling

### Integration Tests

- **Database operations**: Test with test database
- **API endpoints**: Test full request/response cycle
- **Authentication flows**: Test user authentication scenarios

### Test Files

```
src/
├── components/
│   ├── UserCard.tsx
│   └── __tests__/
│       └── UserCard.test.tsx
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
└── app/api/
    ├── users/
    │   ├── route.ts
    │   └── __tests__/
    │       ├── users.test.ts
    │       └── users.rest
```

## Getting Help

### Before Asking for Help

1. **Check documentation**: README, this guide, and code comments
2. **Search issues**: Existing GitHub issues and discussions
3. **Review code**: Similar implementations in the codebase
4. **Test locally**: Reproduce the issue in your development environment

### Where to Get Help

- **GitHub Issues**: For bugs, feature requests, and technical questions
- **GitHub Discussions**: For general questions and community support
- **Code Review**: Request reviews on pull requests for feedback
- **Documentation**: Check inline JSDoc comments and README files

### Reporting Issues

When reporting issues, include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Environment details** (Node.js version, OS, browser)
5. **Screenshots or code snippets** if relevant

### Feature Requests

For feature requests, include:

1. **Problem statement**: What problem does this solve?
2. **Proposed solution**: How should it work?
3. **Use cases**: When would this be used?
4. **Alternatives considered**: Other solutions you've thought about

## Code Review Guidelines

### For Contributors

- **Self-review**: Review your own code before requesting review
- **Description**: Provide clear PR description and context
- **Small PRs**: Keep changes focused and manageable
- **Tests**: Include tests for new functionality
- **Documentation**: Update docs for public APIs

### For Reviewers

- **Be constructive**: Provide helpful feedback, not just criticism
- **Explain reasoning**: Help contributors understand suggestions
- **Approve quickly**: Don't delay reviews for minor issues
- **Check thoroughly**: Test functionality when possible

## Release Process

1. **Version bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md with new features and fixes
3. **Testing**: Ensure all tests pass and manual testing is complete
4. **Documentation**: Update any relevant documentation
5. **Deploy**: Follow deployment procedures for staging and production

---

## Thank You!

Your contributions help make the ICPC Platform better for the entire competitive programming community. Whether you're fixing bugs, adding features, improving documentation, or helping other contributors, every contribution matters!

For questions about this contributing guide, please open an issue or reach out to the maintainers.