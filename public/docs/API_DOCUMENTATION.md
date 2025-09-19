# 🎯 **Clueminati 2025 - Complete API Documentation**

## 📖 **Overview**

This documentation covers the complete API for the Clueminati 2025 game system, including authentication, team management, role selection, and the unified round system.

---

## 🔐 **Authentication System**

### **Base Authentication Flow**
1. **Signup** → **Email Verification** → **Login** → **JWT Token**
2. JWT tokens are stored in HTTP-only cookies
3. All protected endpoints require valid JWT authentication

### **Endpoints:**

#### **POST /api/users/signup**
Creates a new user account.

**Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com", 
  "password": "securePassword123",
  "role": "core-member",
  "region": "north"
}
```

#### **POST /api/users/login**
Authenticates user and sets JWT cookie.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### **POST /api/users/logout**
Clears JWT cookie and logs out user.

#### **POST /api/users/verifyemail**
Verifies email using verification token.

**Body:**
```json
{
  "token": "verificationToken"
}
```

---

## 👥 **Team Management System**

### **POST /api/users/create-team**
Creates a new team and assigns user as team leader.

**Authentication:** Required  
**Body:**
```json
{
  "teamName": "Team Alpha"
}
```

**Response:**
```json
{
  "message": "Team created successfully",
  "team": {
    "_id": "teamId",
    "teamName": "Team Alpha", 
    "joinCode": "ABC123",
    "members": ["userId"]
  },
  "token": "newJWTWithTeamId"
}
```

### **POST /api/users/join-team**
Joins an existing team using join code.

**Authentication:** Required  
**Body:**
```json
{
  "joinCode": "ABC123"
}
```

### **POST /api/users/leave-team**
Removes user from their current team.

**Authentication:** Required

### **GET /api/teams/[teamId]/members**
Gets list of team members.

**Authentication:** Required  
**Response:**
```json
{
  "success": true,
  "members": [
    {
      "userId": "id1",
      "name": "John Doe",
      "gameRole": "liar"
    }
  ]
}
```

---

## 🎭 **Role Selection System**

### **POST /api/role-selection**
Assigns a game role to the authenticated user.

**Authentication:** Required  
**Body:**
```json
{
  "gameRole": "liar"
}
```

**Available Roles:**
- `"liar"` - The liar role (special role)
- `"role1"` - Standard role 1  
- `"role2"` - Standard role 2
- `"role3"` - Standard role 3
- `"role4"` - Standard role 4

**Response:**
```json
{
  "message": "Role assigned successfully",
  "success": true,
  "user": {
    "_id": "userId",
    "fullname": "John Doe",
    "gameRole": "liar",
    "teamId": "teamId"
  }
}
```

---

## 🎮 **Unified Round System**

### **Dynamic Round Detection**
The system automatically detects the current round using game timing:
- `"not_started"` - Game hasn't begun
- `"1"` - Round 1 active
- `"2"` - Round 2 active
- `"finished"` - Game completed

### **GET /api/round/serve-question**
Serves questions for both Round 1 and Round 2 dynamically.

**Authentication:** Required (core-member or admin role)

**Parameters:**
- `teamId` (required): Team identifier
- `difficulty` (required): `easy`, `medium`, or `hard`  
- `stationId` (required for Round 2 only): Station identifier

**Round 1 Example:**
```
GET /api/round/serve-question?teamId=123&difficulty=easy
```

**Round 2 Example:**
```
GET /api/round/serve-question?teamId=123&difficulty=medium&stationId=station456
```

**Response:**
```json
{
  "message": "successfully fetched question",
  "data": {
    "_id": "questionId",
    "question_description": "What is the capital of France?",
    "difficulty": "easy", 
    "round": "1"
  },
  "round": "1"
}
```

### **POST /api/round/validate-answer**
Validates answers for both rounds with automatic Round 2 features.

**Authentication:** Required  
**Body:**
```json
{
  "questionId": "64abc123def456789",
  "userAnswer": "Paris"
}
```

**Round 1 Response:**
```json
{
  "message": "correct",
  "data": {...question},
  "round": "1"
}
```

**Round 2 Response (with secret reveal):**
```json
{
  "message": "correct", 
  "data": {...question},
  "round": "2",
  "reveal": "s",
  "nextStation": {
    "stationId": "newStationId",
    "station_name": "Station B"
  }
}
```

---

## 🎯 **Round 2 Special Features**

### **Secret Character Reveals**
- Characters from secret string are revealed at question milestones
- **Reveal Schedule**: 3rd, 5th, and 7th questions solved
- Tracks `secret_chars_revealed` count automatically
- Returns character in `reveal` field of response

### **Station Management**  
- Teams are assigned stations dynamically
- Station validation ensures teams only access assigned stations
- Automatic station assignment after correct answers
- Prevents access to completed stations

### **Scoring System**
- **Easy**: 10 points
- **Medium**: 40 points  
- **Hard**: 70 points
- Scores tracked per round and total

---

## 📊 **Additional Endpoints**

### **GET /api/debug/current-round**
Returns current game round for debugging.

### **GET /api/leaderboard**
Returns team leaderboard with scores.

### **POST /api/users/profile**
Gets current user profile and team information.

### **GET /api/submission-history**
Gets user's question submission history.

---

## 🔒 **Security Features**

### **JWT Authentication**
- HTTP-only cookies for security
- Token includes user ID, email, role, and team ID
- Automatic token validation on protected routes

### **Role-Based Access Control**
- **Participants**: Cannot serve questions
- **Core Members**: Can serve and validate questions
- **Admins**: Full access to all endpoints

### **Input Validation**
- Zod schemas for all request validation
- SQL injection prevention through Mongoose ODM
- Password hashing with bcryptjs

---

## ⚡ **Performance Optimizations**

### **Database Queries**
- Selective field loading with `.select()`
- Efficient question filtering at database level
- Connection pooling with MongoDB

### **Caching Strategy**
- Round detection caching
- Team data optimization
- Question encounter tracking

---

## 🚀 **Deployment Notes**

### **Environment Variables**
```env
MONGO_URI=mongodb://localhost:27017/clueminati
JWT_SECRET=your-jwt-secret
EMAIL_USER=smtp-email
EMAIL_PASS=smtp-password
```

### **Database Requirements**
- MongoDB instance with collections:
  - `users` - User accounts
  - `teams` - Team information  
  - `questions` - Game questions
  - `stations` - Round 2 stations
  - `gamestats` - Game timing

---

## 📈 **API Status**

### ✅ **Production Ready**
- ✅ Authentication system
- ✅ Team management
- ✅ Role selection  
- ✅ Unified round system
- ✅ Round 2 secret features
- ✅ Station management

### 🔄 **Deprecated (But Preserved)**
- ❌ `/api/round-one/*` - Use `/api/round/*`
- ❌ `/api/round-two/*` - Use `/api/round/*`

---

**📚 For testing instructions, see `POSTMAN_TESTING_GUIDE.md`**

*Last Updated: September 17, 2025*
