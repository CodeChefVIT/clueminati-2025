# 🧪 **Postman Testing Guide - Role Selection & Round System**

## 📋 **Prerequisites**

1. **Server Running**: `pnpm run dev` (http://localhost:3000)
2. **Authentication**: You need a valid JWT token from login
3. **Team Setup**: User must be part of a team for some endpoints

---

## 🔐 **Authentication Setup**

### 1. **Login First** (Required for all protected endpoints)
```
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response**: JWT token will be set in cookies automatically

---

## 🎭 **Role Selection API Testing**

### **POST /api/role-selection**
Assigns a game role to the authenticated user.

**Headers:**
```
Content-Type: application/json
Cookie: token=<JWT_TOKEN_FROM_LOGIN>
```

**Body:**
```json
{
  "gameRole": "liar"
}
```

**Available Roles:**
- `"liar"` - The liar role
- `"role1"` - Role 1
- `"role2"` - Role 2  
- `"role3"` - Role 3
- `"role4"` - Role 4

**Success Response (200):**
```json
{
  "message": "Role assigned successfully",
  "success": true,
  "user": {
    "_id": "userId",
    "fullname": "User Name",
    "email": "user@example.com",
    "gameRole": "liar",
    "teamId": "teamId",
    "role": "core-member"
  }
}
```

**Error Responses:**
- **401**: `{"error": "Unauthorized"}` - No valid token
- **400**: `{"error": "Invalid request data"}` - Invalid role
- **404**: `{"error": "User not found"}` - User doesn't exist

---

## 🎮 **Round System API Testing**

### **1. GET /api/round/serve-question**
Serves questions for both Round 1 and Round 2.

**Headers:**
```
Cookie: token=<JWT_TOKEN_FROM_LOGIN>
```

**Round 1 Example:**
```
GET http://localhost:3000/api/round/serve-question?teamId=<TEAM_ID>&difficulty=easy
```

**Round 2 Example:**
```
GET http://localhost:3000/api/round/serve-question?teamId=<TEAM_ID>&difficulty=medium&stationId=<STATION_ID>
```

**Parameters:**
- `teamId` (required): Team identifier
- `difficulty` (required): `easy`, `medium`, or `hard`
- `stationId` (required for Round 2 only): Station identifier

**Success Response (200):**
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

### **2. POST /api/round/validate-answer**
Validates answers for both rounds with Round 2 secret character reveals.

**Headers:**
```
Content-Type: application/json
Cookie: token=<JWT_TOKEN_FROM_LOGIN>
```

**Body:**
```json
{
  "questionId": "64abc123def456789",
  "userAnswer": "Paris"
}
```

**Round 1 Success Response (200):**
```json
{
  "message": "correct",
  "data": {
    "_id": "questionId",
    "question_description": "What is the capital of France?",
    "answer": "Paris",
    "difficulty": "easy",
    "round": "1"
  },
  "round": "1"
}
```

**Round 2 Success Response (200) - with secret reveal:**
```json
{
  "message": "correct",
  "data": {
    "_id": "questionId",
    "question_description": "What is the capital of Germany?",
    "answer": "Berlin",
    "difficulty": "medium",
    "round": "2"
  },
  "round": "2",
  "reveal": "s",
  "nextStation": {
    "stationId": "newStationId",
    "station_name": "Station B",
    "difficulty": "medium"
  }
}
```

**Incorrect Answer Response (200):**
```json
{
  "message": "incorrect"
}
```

---

## 🧪 **Complete Testing Workflow**

### **Step 1: Authentication**
```
1. POST /api/users/signup (if new user)
2. POST /api/users/login 
3. Copy JWT token from cookies
```

### **Step 2: Team Setup**
```
1. POST /api/users/create-team OR
2. POST /api/users/join-team
```

### **Step 3: Role Selection**
```
1. POST /api/role-selection
   Body: {"gameRole": "liar"}
```

### **Step 4: Round Testing**
```
1. GET /api/round/serve-question?teamId=<ID>&difficulty=easy
2. POST /api/round/validate-answer
   Body: {"questionId": "<ID>", "userAnswer": "correct answer"}
```

---

## 📊 **Round 2 Secret Character Testing**

To test secret character reveals in Round 2:

1. **Answer 3 questions correctly** → Get 1st character
2. **Answer 5 questions correctly** → Get 2nd character  
3. **Answer 7 questions correctly** → Get 3rd character

**Expected Response Pattern:**
```json
{
  "message": "correct",
  "round": "2",
  "reveal": "s",  // Character from secret string
  "nextStation": { ... }
}
```

---

## ⚠️ **Common Issues & Solutions**

### **401 Unauthorized**
- **Solution**: Login first and ensure JWT cookie is included

### **403 Access Denied** 
- **Solution**: User role must be "core-member" or "admin", not "participant"

### **400 Invalid teamId**
- **Solution**: Create or join a team first

### **Round 2 requires stationId**
- **Solution**: Include `stationId` parameter for Round 2 questions

### **No questions available**
- **Solution**: Ensure questions exist in database for that round/difficulty

---

## 🎯 **Quick Test Collection**

**Postman Collection Structure:**
```
📁 Clueminati 2025 API
├── 🔐 Authentication
│   ├── POST Login
│   └── POST Signup
├── 👥 Team Management  
│   ├── POST Create Team
│   └── POST Join Team
├── 🎭 Role Selection
│   └── POST Assign Role
└── 🎮 Round System
    ├── GET Serve Question (Round 1)
    ├── GET Serve Question (Round 2) 
    └── POST Validate Answer
```

---

**All endpoints are now ready for testing! 🚀**

*Make sure to test both successful and error scenarios to ensure robust functionality.*