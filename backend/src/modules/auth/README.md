# Authentication Module

This module provides complete authentication functionality for the Designer Portfolio Platform using NestJS, Passport.js, JWT tokens, and bcrypt for password hashing.

## Features

- **User Registration**: Register new users with invite code validation
- **User Login**: Authenticate users with email/password
- **Password Security**: bcrypt hashing with salt rounds of 12
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Role-Based Access**: Support for artist and admin roles
- **Guards & Decorators**: Ready-to-use authentication guards and decorators

## Components

### Services
- `AuthService`: Core authentication logic
- `LocalStrategy`: Passport.js local authentication strategy
- `JwtStrategy`: Passport.js JWT authentication strategy

### Controllers
- `AuthController`: Authentication endpoints (/auth/register, /auth/login, etc.)

### Guards
- `LocalAuthGuard`: Protects login endpoint
- `JwtAuthGuard`: Protects authenticated routes
- `RolesGuard`: Role-based access control

### Decorators
- `@CurrentUser()`: Extract current user from request
- `@Roles()`: Define required roles for endpoints

### DTOs
- `RegisterDto`: Registration request validation
- `LoginDto`: Login request validation

## API Endpoints

### POST /auth/register
Register a new user with invite code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "inviteCode": "ABC123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "artist",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt.token.here"
}
```

### POST /auth/login
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "artist",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt.token.here"
}
```

### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt.token.here
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "artist",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### POST /auth/logout
Logout endpoint (client-side token removal).

**Headers:**
```
Authorization: Bearer jwt.token.here
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Usage Examples

### Protecting Routes
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser, Roles, RolesGuard } from '../auth';
import { User, UserRole } from '../../entities/user.entity';

@Controller('protected')
export class ProtectedController {
  // Require authentication
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  // Require admin role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  adminOnly() {
    return { message: 'Admin access granted' };
  }
}
```

### Frontend Integration
```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { user, token } = await response.json();

// Store token
localStorage.setItem('token', token);

// Use token for authenticated requests
const protectedResponse = await fetch('/api/protected/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Environment Variables

Required environment variables in `.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Security**: Configurable secret and expiration
- **Input Validation**: Class-validator DTOs
- **Error Handling**: Secure error messages
- **Role-Based Access**: Granular permission control

## Testing

Run the authentication tests:

```bash
npm test auth.service.spec.ts
```

The test suite covers:
- Password hashing and validation
- User registration with invite codes
- User login authentication
- Error handling scenarios
- JWT token generation