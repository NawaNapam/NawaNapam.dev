# Production-Grade Validation System for Random Video Chat Platform

This project implements a comprehensive validation system using **Zod** for a random video chat platform similar to Omegle. The validation system ensures data integrity, security, and type safety across the entire application.

## 🏗️ Architecture Overview

### Core Components

1. **Validation Schemas** (`src/lib/validationSchemas.ts`)
   - Comprehensive Zod schemas for all data models
   - Input validation for API endpoints
   - Type inference for TypeScript

2. **API Validation Middleware** (`src/lib/apiValidation.ts`)
   - Middleware functions for Next.js API routes
   - Error handling and response formatting
   - Rate limiting and security features

3. **Database Models**
   - `users.model.ts` - Anonymous and registered users
   - `videoSession.model.ts` - Video chat sessions
   - `matchingQueue.model.ts` - Smart user matching
   - `report.model.ts` - Safety and moderation
   - `subscription.model.ts` - Premium features

## 🛡️ Validation Features

### User Validation

```typescript
// Anonymous User Creation
const anonymousUser = {
  socketId: "socket_abc123",
  nickname: "FriendlyUser",
  interests: ["music", "gaming"],
  preferences: {
    sessionType: "video",
    ageRange: { min: 18, max: 30 },
    genderPreference: "any",
  },
};
```

### Video Session Validation

```typescript
// Session Creation
const sessionData = {
  sessionId: "session_12345",
  participants: {
    user1: {
      socketId: "socket_user1",
      isAnonymous: true,
      nickname: "User1",
    },
    user2: {
      socketId: "socket_user2",
      isAnonymous: true,
      nickname: "User2",
    },
  },
  sessionType: "video",
};
```

### API Validation Middleware

```typescript
// Example API route with validation
export async function POST(req: NextRequest) {
  return ValidationMiddlewares.createUser(req, async (req, validatedData) => {
    // Your business logic here with guaranteed valid data
    const user = new User(validatedData);
    await user.save();
    return createSuccessResponse(user, "User created successfully", 201);
  });
}
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install zod
```

### 2. Use Validation in API Routes

```typescript
import {
  ValidationMiddlewares,
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/apiValidation";

export async function POST(req: NextRequest) {
  return ValidationMiddlewares.createAnonymousUser(
    req,
    async (req, validatedData) => {
      // validatedData is fully typed and validated
      const user = await createUser(validatedData);
      return createSuccessResponse(user, "User created", 201);
    }
  );
}
```

### 3. Socket.IO Integration

```typescript
import { ValidationSchemas } from "@/lib/validationSchemas";

socket.on("joinQueue", async (data, callback) => {
  const validationResult =
    ValidationSchemas.matchingQueue.create.safeParse(data);

  if (!validationResult.success) {
    callback({ success: false, error: validationResult.error.issues });
    return;
  }

  // Process validated data
  const validatedData = validationResult.data;
});
```

## 📋 Available Validation Schemas

### User Schemas

- `ValidationSchemas.user.create` - Complete user creation
- `ValidationSchemas.user.anonymous` - Anonymous user creation
- `ValidationSchemas.user.update` - User profile updates
- `ValidationSchemas.user.preferences` - User preferences

### Session Schemas

- `ValidationSchemas.videoSession.create` - Video session creation
- `ValidationSchemas.videoSession.addMessage` - Chat messages
- `ValidationSchemas.videoSession.updateStatus` - Session status updates
- `ValidationSchemas.videoSession.reportQuality` - Connection quality

### Matching Schemas

- `ValidationSchemas.matchingQueue.create` - Join matching queue
- `ValidationSchemas.matchingQueue.update` - Update preferences

### Safety Schemas

- `ValidationSchemas.report.create` - Report inappropriate behavior
- `ValidationSchemas.subscription.create` - Premium subscriptions

## 🛡️ Security Features

### Input Sanitization

- Automatic string trimming
- XSS prevention through content validation
- SQL injection prevention
- Length limits on all text fields

### Rate Limiting

```typescript
// Built-in rate limiting
const rateLimiter = new RateLimiter(100, 900000); // 100 requests per 15 minutes

// Usage in API routes
if (!rateLimiter.isAllowed(clientIP)) {
  return createErrorResponse("Rate limit exceeded", 429);
}
```

### Validation Middleware

```typescript
// Automatic validation, error handling, and response formatting
ValidationMiddlewares.createUser(req, handler);
ValidationMiddlewares.createVideoSession(req, handler);
ValidationMiddlewares.createReport(req, handler);
```

## 📊 Error Handling

### Structured Error Responses

```typescript
// Validation errors
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    }
  ]
}

// Business logic errors
{
  "success": false,
  "message": "User already exists",
  "statusCode": 409
}
```

### Custom Error Types

```typescript
class ApiError extends Error {
  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
```

## 🎯 Best Practices

### 1. Always Validate Input

```typescript
// ❌ Never trust raw input
const user = new User(req.body);

// ✅ Always validate first
const validationResult = ValidationSchemas.user.create.safeParse(req.body);
if (!validationResult.success) {
  return createErrorResponse(
    "Invalid input",
    400,
    validationResult.error.issues
  );
}
const user = new User(validationResult.data);
```

### 2. Use Type-Safe Handlers

```typescript
// ✅ Middleware ensures type safety
ValidationMiddlewares.createUser(
  req,
  async (req, validatedData: CreateUserInput) => {
    // validatedData is fully typed
    const user = new User(validatedData);
  }
);
```

### 3. Proper Error Handling

```typescript
try {
  const result = await someOperation();
  return createSuccessResponse(result, "Operation successful");
} catch (error) {
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode, error.errors);
  }
  return createErrorResponse("Internal server error", 500);
}
```

## 🧪 Testing

### Unit Tests for Validation

```typescript
import { ValidationSchemas } from "@/lib/validationSchemas";

describe("User Validation", () => {
  test("should validate anonymous user creation", () => {
    const result = ValidationSchemas.user.anonymous.safeParse({
      socketId: "socket_123",
      nickname: "TestUser",
      preferences: { sessionType: "video" },
    });

    expect(result.success).toBe(true);
  });

  test("should reject invalid email", () => {
    const result = ValidationSchemas.user.create.safeParse({
      email: "invalid-email",
      username: "testuser",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("email");
  });
});
```

## 📈 Performance Considerations

### Schema Caching

- Zod schemas are compiled once and reused
- Validation is performed in-memory with minimal overhead
- TypeScript compilation ensures zero runtime type errors

### Validation Pipeline

1. **Parse Request** - Extract and parse JSON body
2. **Validate Schema** - Run Zod validation
3. **Sanitize Data** - Clean and normalize input
4. **Execute Handler** - Run business logic with clean data
5. **Format Response** - Return structured response

## 🔧 Configuration

### Environment Variables

```env
# Rate limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000

# CORS
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/videochat
```

### Customizing Validation

```typescript
// Extend existing schemas
const customUserSchema = ValidationSchemas.user.create.extend({
  customField: z.string().optional(),
});

// Override defaults
const strictUserSchema = ValidationSchemas.user.create.strict();
```

## 🚦 API Routes Examples

### User Management

- `POST /api/users/create-registered` - Create registered user
- `POST /api/users/create-anonymous` - Create anonymous user
- `PUT /api/users/update-preferences` - Update user preferences

### Video Sessions

- `POST /api/video-sessions/create` - Create video session
- `POST /api/video-sessions/add-message` - Send message
- `PUT /api/video-sessions/update-status` - Update session status

### Matching System

- `POST /api/matching/find-match` - Join matching queue
- `GET /api/matching/find-match` - Check for matches
- `DELETE /api/matching/leave-queue` - Leave queue

### Safety & Moderation

- `POST /api/reports/create` - Report inappropriate behavior
- `GET /api/reports/my-reports` - Get user's reports

## 📱 Frontend Integration

### React Hook Example

```typescript
const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: CreateUserInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/create-registered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
};
```

## 🔍 Monitoring & Debugging

### Validation Metrics

- Track validation failure rates
- Monitor most common validation errors
- Alert on unusual validation patterns

### Debug Mode

```typescript
// Enable detailed validation logging
const result = ValidationSchemas.user.create.safeParse(data);
if (!result.success) {
  console.log("Validation failed:", result.error.format());
}
```

This validation system provides enterprise-grade data validation, ensuring your random video chat platform is secure, reliable, and maintainable.
