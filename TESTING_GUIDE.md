# Backend Testing Guide - Ownership Scenarios

## Current API Routes

**Base URL:** `http://localhost:8000`

### Authentication Routes
- `POST /login` - Login and get JWT token
- `GET /me` - Get current user profile (requires auth)
- `PATCH /me` - Update current user profile (requires auth)

### Children Routes
- `GET /children` - List all children for authenticated parent (requires auth)
- `GET /children/:id` - Get child by ID (requires auth + ownership)
- `POST /children` - Create new child (requires auth)
- `PATCH /children/:id` - Update child (requires auth + ownership)
- `DELETE /children/:id` - Delete child (requires auth + ownership)

---

## Test Scenarios

### Prerequisites

1. **Seed the database** (if not already done):
```bash
npm run seed
```

2. **Start the server**:
```bash
npm run dev
```

3. **Seeded Users** (for testing):
   - Email: `parent1@example.com` / Password: `password123`
   - Email: `parent2@example.com` / Password: `password123`
   - Email: `parent3@example.com` / Password: `password123`

---

## Test A: Success - Parent sees only their children

### Step 1: Login as Parent A
**Request:**
```http
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "parent1@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ahmed Ali",
    "email": "parent1@example.com",
    "phone": null,
    "address": null
  }
}
```

**Save the token** from the response for next steps.

### Step 2: Get Parent A's children
**Request:**
```http
GET http://localhost:8000/children
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "parentId": "507f1f77bcf86cd799439011",
    "name": "Omar Ahmed",
    "dateOfBirth": "2016-01-01T00:00:00.000Z",
    "gender": "male",
    "medicalHistory": "Autism Spectrum Disorder - Diagnosed at age 3...",
    "notes": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Verification Checklist:**
- ✅ Status code: 200 OK
- ✅ Returns an array
- ✅ All children have `parentId` matching Parent A's user ID
- ✅ No children from other parents appear in the list
- ✅ Array is sorted by `createdAt` (newest first)

---

## Test B: Security - Access another parent's child

### Step 1: Login as Parent A
```http
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "parent1@example.com",
  "password": "password123"
}
```

Save Parent A's token.

### Step 2: Login as Parent B (to get a child ID)
```http
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "parent2@example.com",
  "password": "password123"
}
```

**Get Parent B's children:**
```http
GET http://localhost:8000/children
Authorization: Bearer PARENT_B_TOKEN
```

Save a child ID from Parent B's response (e.g., `507f1f77bcf86cd799439013`).

### Step 3: Try to access Parent B's child using Parent A's token
**Request:**
```http
GET http://localhost:8000/children/507f1f77bcf86cd799439013
Authorization: Bearer PARENT_A_TOKEN
```

**Expected Response (404 Not Found):**
```json
{
  "message": "Child not found",
  "code": "CHILD_NOT_FOUND"
}
```

**Verification Checklist:**
- ✅ Status code: 404 Not Found (not 403)
- ✅ Error message: "Child not found"
- ✅ Error code: "CHILD_NOT_FOUND"
- ✅ Parent A cannot access Parent B's child

**Why 404 instead of 403?**
This is a security best practice called "security by obscurity" - we don't reveal that the child exists but belongs to someone else. We return 404 as if the child doesn't exist at all.

---

## Test C: Unauthorized - Access without token

### Test C1: Get children list without token
**Request:**
```http
GET http://localhost:8000/children
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Missing Bearer token",
  "code": "UNAUTHORIZED"
}
```

### Test C2: Get children list with invalid token
**Request:**
```http
GET http://localhost:8000/children
Authorization: Bearer invalid_token_here
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

### Test C3: Get children list with malformed header
**Request:**
```http
GET http://localhost:8000/children
Authorization: invalid_format
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Missing Bearer token",
  "code": "UNAUTHORIZED"
}
```

**Verification Checklist:**
- ✅ Status code: 401 Unauthorized
- ✅ Error message indicates missing/invalid token
- ✅ Error code: "UNAUTHORIZED"
- ✅ No data is returned

---

## Test D: Get Current User Profile (/me endpoint)

### Step 1: Login
```http
POST http://localhost:8000/login
Content-Type: application/json

{
  "email": "parent1@example.com",
  "password": "password123"
}
```

Save the token.

### Step 2: Get current user profile
**Request:**
```http
GET http://localhost:8000/me
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Ali",
  "email": "parent1@example.com",
  "phone": null,
  "address": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Verification Checklist:**
- ✅ Status code: 200 OK
- ✅ Returns user data matching the logged-in user
- ✅ Does NOT include `passwordHash`
- ✅ Includes `id`, `name`, `email`, `phone`, `address`, `createdAt`, `updatedAt`

### Step 3: Access /me without token
**Request:**
```http
GET http://localhost:8000/me
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Missing Bearer token",
  "code": "UNAUTHORIZED"
}
```

---

## Postman Collection Setup

### Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:8000`
- `token`: (will be set after login)

### Collection Structure
1. **Authentication**
   - Login (POST `/login`)
   - Get Me (GET `/me`)
   - Update Me (PATCH `/me`)

2. **Children**
   - List Children (GET `/children`)
   - Get Child (GET `/children/:id`)
   - Create Child (POST `/children`)
   - Update Child (PATCH `/children/:id`)
   - Delete Child (DELETE `/children/:id`)

### Postman Scripts

**For Login Request (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("userId", jsonData.user.id);
}
```

**For Protected Routes (Pre-request Script):**
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get("token")
});
```

---

## cURL Commands (Alternative Testing)

### Test A: Success Flow
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent1@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get children
curl -X GET http://localhost:8000/children \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Test B: Security Test
```bash
# 1. Login as Parent A
TOKEN_A=$(curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent1@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Login as Parent B and get a child ID
TOKEN_B=$(curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent2@example.com","password":"password123"}' \
  | jq -r '.token')

CHILD_ID=$(curl -X GET http://localhost:8000/children \
  -H "Authorization: Bearer $TOKEN_B" | jq -r '.[0].id')

# 3. Try to access Parent B's child with Parent A's token
curl -X GET http://localhost:8000/children/$CHILD_ID \
  -H "Authorization: Bearer $TOKEN_A"
# Should return 404
```

### Test C: Unauthorized
```bash
# Without token
curl -X GET http://localhost:8000/children
# Should return 401

# With invalid token
curl -X GET http://localhost:8000/children \
  -H "Authorization: Bearer invalid_token"
# Should return 401
```

### Test D: Get Me
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent1@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get profile
curl -X GET http://localhost:8000/me \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## Expected Results Summary

| Test | Endpoint | Token | Expected Status | Expected Behavior |
|------|----------|-------|-----------------|-------------------|
| A | `GET /children` | Parent A | 200 | Returns only Parent A's children |
| B | `GET /children/:id` | Parent A (accessing Parent B's child) | 404 | Returns "Child not found" |
| C1 | `GET /children` | None | 401 | Returns "Missing Bearer token" |
| C2 | `GET /children` | Invalid | 401 | Returns "Invalid or expired token" |
| D | `GET /me` | Valid | 200 | Returns current user profile |
| D2 | `GET /me` | None | 401 | Returns "Missing Bearer token" |

---

## Notes

1. **Route Structure**: Currently routes are at root level (`/login`, `/me`, `/children`). If you need `/api/users/me`, you can update `app.ts` to:
   ```typescript
   app.use("/api/users", usersRoutes);
   app.use("/api/children", childrenRoutes);
   ```

2. **Token Expiration**: Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN` env var).

3. **Ownership Enforcement**: All child operations automatically filter by `parentId` matching the authenticated user's ID.

4. **Error Responses**: All errors follow a consistent format:
   ```json
   {
     "message": "Error message",
     "code": "ERROR_CODE"
   }
   ```
