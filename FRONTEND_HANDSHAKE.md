# Frontend-Backend Handshake Configuration

## ✅ Final Integration Settings Verified

---

## 1. CORS Configuration ✅

### Status: **CONFIGURED FOR FRONTEND PORTS**

**File:** `src/app.ts` (lines 17-29)

**Configuration:**
```typescript
app.use(
  cors({
    origin: [
      "http://localhost:3000",    // React development server
      "http://localhost:19006",  // Expo web
      "http://127.0.0.1:3000",
      "http://127.0.0.1:19006",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

**Allowed Frontend Ports:**
- ✅ `http://localhost:3000` - React/Vite development server
- ✅ `http://localhost:19006` - Expo web development
- ✅ `http://127.0.0.1:3000` - Alternative localhost format
- ✅ `http://127.0.0.1:19006` - Alternative localhost format

**Features:**
- ✅ `credentials: true` - Allows cookies and auth headers
- ✅ All HTTP methods allowed (GET, POST, PATCH, DELETE)
- ✅ Authorization header allowed for JWT tokens
- ✅ Content-Type header allowed for JSON requests

**For Production:**
Add your production frontend URL to the `origin` array:
```typescript
origin: [
  ...developmentUrls,
  process.env.FRONTEND_URL || "https://your-frontend-domain.com"
]
```

---

## 2. Token Format Verification ✅

### Login Endpoint: `POST /api/users/login`

**Response Format:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDUzODcwMDAsImV4cCI6MTcxMTM4NzAwMH0...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ahmed Ali",
    "email": "parent1@example.com",
    "phone": null,
    "address": null
  }
}
```

**Key Fields:**
- ✅ `token` - JWT token string (ready for Authorization header)
- ✅ `user.id` - User ID (string format, MongoDB ObjectId)
- ✅ `user.name` - User's full name
- ✅ `user.email` - User's email address
- ✅ `user.phone` - User's phone number (nullable)
- ✅ `user.address` - User's address (nullable)

**Implementation:**
- **File:** `src/modules/users/users.service.ts` (lines 20-29)
- **Token:** Generated with `signAccessToken(user._id.toString())`
- **User Data:** Excludes `passwordHash`, includes all profile fields

---

### Get Me Endpoint: `GET /api/users/me`

**Response Format:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Ali",
  "email": "parent1@example.com",
  "phone": 1234567890,
  "address": "123 Main St",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Key Fields:**
- ✅ `id` - User ID (string format, MongoDB ObjectId)
- ✅ `name` - User's full name
- ✅ `email` - User's email address
- ✅ `phone` - User's phone number (nullable number)
- ✅ `address` - User's address (nullable string)
- ✅ `createdAt` - Account creation timestamp (ISO 8601)
- ✅ `updatedAt` - Last update timestamp (ISO 8601)

**Implementation:**
- **File:** `src/modules/users/users.service.ts` (lines 38-46)
- **Authentication:** Required (JWT token in Authorization header)
- **User Data:** Excludes `passwordHash`, includes timestamps

---

## Frontend Integration Guide

### Step 1: Login and Store Token

```typescript
// Frontend code example
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Store token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data; // { token, user: { id, name, email, ... } }
};
```

### Step 2: Verify Token on App Load

```typescript
// Frontend code example
const verifyAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await fetch('http://localhost:8000/api/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const user = await response.json();
      return user; // { id, name, email, ... }
    } else {
      // Token invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  } catch (error) {
    return null;
  }
};
```

### Step 3: Make Authenticated Requests

```typescript
// Frontend code example
const getChildren = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8000/api/children', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return response.json(); // Array of children
};
```

---

## Response Format Consistency

### Login Response:
```typescript
{
  token: string;        // JWT token
  user: {
    id: string;        // User ID
    name: string;       // User name
    email: string;      // User email
    phone: number | null;
    address: string | null;
  }
}
```

### Get Me Response:
```typescript
{
  id: string;          // User ID (same as login.user.id)
  name: string;         // User name
  email: string;        // User email
  phone: number | null;
  address: string | null;
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;   // ISO 8601 timestamp
}
```

**Consistency:**
- ✅ Both return `id` field (string format)
- ✅ Both return `name`, `email`, `phone`, `address`
- ✅ Login includes `token` field
- ✅ Get Me includes `createdAt` and `updatedAt`
- ✅ No `passwordHash` in any response

---

## Common Frontend Integration Patterns

### Pattern 1: Axios with Interceptor
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email: string, password: string) => {
  const { data } = await api.post('/users/login', { email, password });
  localStorage.setItem('token', data.token);
  return data;
};

// Get Me
const getMe = async () => {
  const { data } = await api.get('/users/me');
  return data;
};
```

### Pattern 2: Fetch with Helper
```typescript
const API_BASE = 'http://localhost:8000/api';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
};

// Usage
const login = (email: string, password: string) =>
  apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

const getMe = () => apiRequest('/users/me');
```

---

## Testing CORS from Frontend

### React (Port 3000):
```javascript
// In browser console or React component
fetch('http://localhost:8000/api/users/me', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
// Expected: No CORS error, returns user data
```

### Expo (Port 19006):
```javascript
// In Expo app or browser console
fetch('http://localhost:8000/api/users/me', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
// Expected: No CORS error, returns user data
```

---

## Error Response Formats

### 401 Unauthorized (Missing/Invalid Token):
```json
{
  "message": "Missing Bearer token",
  "code": "UNAUTHORIZED"
}
```

### 401 Unauthorized (Invalid Credentials):
```json
{
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

### 404 Not Found:
```json
{
  "message": "User not found",
  "code": "USER_NOT_FOUND"
}
```

### 400 Validation Error:
```json
{
  "message": "Invalid request",
  "code": "VALIDATION_ERROR",
  "details": { ... }
}
```

---

## ✅ Handshake Checklist

- [x] **CORS configured** - Allows ports 3000 and 19006
- [x] **Credentials enabled** - Allows auth headers
- [x] **Login returns token** - JWT token in response
- [x] **Login returns user.id** - User ID included
- [x] **Get Me returns id** - Consistent ID format
- [x] **Token format** - Ready for Authorization header
- [x] **User data format** - Consistent across endpoints
- [x] **No passwordHash** - Security verified

---

## ✅ Backend Ready for Frontend Integration

All handshake settings are configured correctly. The backend is ready to communicate with:
- React apps on `http://localhost:3000`
- Expo apps on `http://localhost:19006`
- Any frontend using the standard JWT token format

**API Base URL:** `http://localhost:8000/api`
