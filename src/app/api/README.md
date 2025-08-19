# API Documentation

This document describes the REST API endpoints available in the ICPC Platform.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication via session cookies. Session cookies are set upon successful login.

### Authentication Headers

```http
Cookie: session=<encrypted-session-token>
```

## Endpoints

### Authentication

#### Register User

**POST** `/api/auth/register`

Creates a new user account and sends email verification.

**Request Body:**
```json
{
  "username": "string (3-20 chars)",
  "gmail": "string (valid email)",
  "cfHandle": "string (Codeforces handle)",
  "password": "string (min 8 chars)"
}
```

**Response (200):**
```json
{
  "message": "registered"
}
```

**Errors:**
- `400`: Invalid input or user already exists
- `500`: Server error

#### Login User

**POST** `/api/auth/login`

Authenticates user and creates session.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (307):**
```json
{
  "message": "authenticated"
}
```

**Errors:**
- `401`: Invalid credentials
- `500`: Server error

### Training Management

#### Create Training

**POST** `/api/training`

Creates a new training program. Requires admin authentication.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "startDate": "string (ISO date)",
  "duration": "number (hours)"
}
```

**Response (201):**
```json
{
  "message": "Training created successfully"
}
```

**Errors:**
- `401`: Unauthorized
- `500`: Server error

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "data": "object|array|null",
  "message": "string"
}
```

### Error Response
```json
{
  "error": "string (error message)",
  "code": "string (optional error code)"
}
```

## Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid input or request
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Server error

## Testing

You can test API endpoints using the `.rest` files located in:
- `src/app/api/auth/__tests__/auth.rest`
- Additional `.rest` files in respective API directories

### Using REST Client Extensions

1. Install a REST client extension in your editor (e.g., REST Client for VS Code)
2. Open the `.rest` files
3. Click "Send Request" above each request block

### Example Request

```http
### Register User
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "gmail": "test@example.com",
  "cfHandle": "testuser_cf",
  "password": "securepassword123"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

## Versioning

The API is currently unversioned. Breaking changes will be documented in the changelog.

## Support

For API-related questions or issues:
1. Check the inline JSDoc comments in route handlers
2. Review the `.rest` test files for usage examples
3. Open an issue on GitHub
4. Check the [Contributing Guide](../../CONTRIBUTING.md) for development guidelines