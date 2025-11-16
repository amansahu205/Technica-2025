# Authentication Setup - InvestIQ

Simple database-backed authentication system for InvestIQ. Users can sign up, login, and their data is stored in the D1 database.

## Overview

**Type:** Simple email/password authentication
**Storage:** Cloudflare D1 (SQLite)
**Security:** Basic (passwords stored as plain text - **demo only**)

⚠️ **This is NOT production-ready**. Passwords are stored unencrypted for demo purposes. For production, use proper password hashing (bcrypt) or a third-party auth service (Clerk, Auth0).

---

## Features

✅ User signup with email/password
✅ User login with credential verification
✅ User data stored in database
✅ Persistent sessions (localStorage)
✅ Dummy test users pre-seeded
✅ Guest mode (continue without login)

---

## Database Schema

### Users Table (existing)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  skill_level TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### User Credentials Table (new)
```sql
CREATE TABLE user_credentials (
  user_id TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

---

## API Endpoints

### 1. Signup
**POST** `/api/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "region": "north-america",
  "familiarity": "starting"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "user_1234567890_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "skillLevel": "beginner"
  }
}
```

**Response (Error):**
```json
{
  "error": "User with this email already exists"
}
```

---

### 2. Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "user_alice_001",
    "email": "alice@example.com",
    "name": "Alice Johnson",
    "skillLevel": "beginner",
    "onboardingComplete": true
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid email or password"
}
```

---

## Setup Instructions

### 1. Create User Credentials Table

Run this command to create the credentials table:

```bash
cd backend
wrangler d1 execute investiq --command "
  CREATE TABLE IF NOT EXISTS user_credentials (
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
" --remote
```

### 2. Seed Dummy Users

Load 10 test users into the database:

```bash
cd backend
wrangler d1 execute investiq --file=seed-dummy-users.sql --remote
```

**Dummy users created:**
```
Email                  | Password     | Name           | Skill Level
-----------------------|--------------|----------------|-------------
alice@example.com      | password123  | Alice Johnson  | beginner
bob@example.com        | password123  | Bob Smith      | intermediate
carol@example.com      | password123  | Carol Williams | advanced
david@example.com      | password123  | David Brown    | beginner
eve@example.com        | password123  | Eve Davis      | intermediate
frank@example.com      | password123  | Frank Miller   | beginner
grace@example.com      | password123  | Grace Wilson   | advanced
henry@example.com      | password123  | Henry Moore    | intermediate
ivy@example.com        | password123  | Ivy Taylor     | beginner
jack@example.com       | password123  | Jack Anderson  | advanced
```

### 3. Test Login

Visit your deployed site:
```
https://your-site.pages.dev/login
```

Login with any dummy user:
- **Email:** `alice@example.com`
- **Password:** `password123`

---

## How It Works

### Signup Flow

1. User fills out signup form (email, password, name, preferences)
2. Frontend calls `/api/auth/signup`
3. API checks if email already exists
4. If new, generates unique user ID: `user_<timestamp>_<random>`
5. Inserts into `users` table
6. Inserts password into `user_credentials` table
7. Returns user object to frontend
8. Frontend stores user in context + localStorage
9. Redirects to home page

### Login Flow

1. User enters email and password
2. Frontend calls `/api/auth/login`
3. API looks up user by email
4. Checks if password matches
5. If valid, updates `last_active` timestamp
6. Returns user object to frontend
7. Frontend stores user in context + localStorage
8. Redirects to home page

### Session Persistence

User data is stored in browser `localStorage`:

```javascript
localStorage.setItem('investiq-user', JSON.stringify({
  id: "user_alice_001",
  email: "alice@example.com",
  name: "Alice Johnson",
  skillLevel: "beginner"
}))
```

When page loads, `UserContext` restores user from localStorage.

---

## User Context

The `useUser()` hook now provides:

```typescript
const {
  user,         // Full user object { id, email, name, skillLevel }
  name,         // User's name (for backward compatibility)
  isAuthenticated,
  setUser,      // Set logged-in user
  logout,       // Clear user data
} = useUser()
```

**Example usage:**
```typescript
// In any component
const { user } = useUser()

if (user) {
  console.log(`Hello ${user.name}!`)
  console.log(`User ID: ${user.id}`)
}
```

---

## Testing

### Test Signup
1. Go to `/signup`
2. Enter new email, password (min 6 chars), name
3. Complete onboarding steps
4. Should redirect to home logged in

### Test Login
1. Go to `/login`
2. Enter: `alice@example.com` / `password123`
3. Should redirect to home logged in

### Test Assessment Persistence
1. Login as a user
2. Take the assessment at `/assessment`
3. Answers are saved to database with your user ID
4. Check database:
```bash
wrangler d1 execute investiq --command "
  SELECT user_id, question_id, is_correct
  FROM user_question_answers
  WHERE user_id = 'user_alice_001'
" --remote
```

---

## Security Warnings ⚠️

**Current implementation is NOT secure:**

1. ❌ Passwords stored as plain text
2. ❌ No rate limiting on login attempts
3. ❌ No CSRF protection
4. ❌ No session tokens/JWT
5. ❌ No password complexity requirements
6. ❌ No email verification
7. ❌ No password reset functionality

**For production, you MUST:**
- Use bcrypt to hash passwords
- Implement proper session management (JWT tokens)
- Add rate limiting
- Use HTTPS only
- Add email verification
- Implement password reset
- Or use a service like Clerk/Auth0

---

## Upgrading to Production Auth

### Option 1: Add Password Hashing

```typescript
// Install bcrypt
npm install bcryptjs

// In signup.ts
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash(password, 10)
// Store hashedPassword instead of plain password

// In login.ts
const isValid = await bcrypt.compare(password, credentials.password)
```

### Option 2: Use Clerk (Recommended)

```bash
npm install @clerk/nextjs

# Follow Clerk setup guide
# Replace login/signup pages with Clerk components
# Keep D1 database for app data, use Clerk for auth
```

---

## Files Modified

**API:**
- `frontend/functions/api/auth/signup.ts` - Signup endpoint
- `frontend/functions/api/auth/login.ts` - Login endpoint

**Frontend:**
- `code/lib/user-context.tsx` - Added user object, setUser(), logout()
- `code/app/signup/page.tsx` - Calls signup API
- `code/app/login/page.tsx` - Calls login API
- `code/app/assessment/page.tsx` - Uses user.id instead of name

**Database:**
- `backend/seed-dummy-users.sql` - Creates 10 test users

---

## Troubleshooting

### "User with this email already exists"
- Email is already in database
- Try a different email or use login instead

### "Invalid email or password"
- Check email spelling
- Remember password is case-sensitive
- For dummy users, password is exactly: `password123`

### Login successful but data not saving
- Make sure you're logged in (check `user.id` exists)
- Run database setup scripts to create tables
- Check browser console for API errors

### "Failed to create account"
- Check database exists and is accessible
- Make sure `user_credentials` table is created
- Check browser console for detailed error

---

## Quick Reference

```bash
# Create credentials table
wrangler d1 execute investiq --command "CREATE TABLE IF NOT EXISTS user_credentials (user_id TEXT PRIMARY KEY, password TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)" --remote

# Seed dummy users
wrangler d1 execute investiq --file=backend/seed-dummy-users.sql --remote

# View all users
wrangler d1 execute investiq --command "SELECT id, email, name FROM users" --remote

# View credentials (for debugging)
wrangler d1 execute investiq --command "SELECT * FROM user_credentials" --remote

# Delete a user
wrangler d1 execute investiq --command "DELETE FROM users WHERE email = 'user@example.com'" --remote
```

---

## Next Steps

1. **Deploy changes** to Cloudflare Pages
2. **Seed dummy users** for testing
3. **Test login/signup** on deployed site
4. **Take assessments** to verify data persistence
5. **Upgrade security** before going live

For production use, strongly consider implementing proper authentication or using Clerk/Auth0.
