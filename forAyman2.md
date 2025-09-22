# Clueminati 2025 - Complete System Documentation

## Table of Contents
1. [API Routes Documentation](#api-routes-documentation)
2. [Frontend Pages & Route Connections](#frontend-pages--route-connections)
3. [Utility Functions](#utility-functions)
4. [Library Functions](#library-functions)
5. [Database Models](#database-models)
6. [Potential Improvements](#potential-improvements)

---

## API Routes Documentation

### Authentication & User Management

#### 🔐 `/api/users/login` (POST)
**Purpose**: User authentication
**Input**: 
```json
{
  "email": "string",
  "password": "string"
}
```
**Output**:
```json
{
  "message": "Login successful",
  "success": true,
  "user": {...},
  "suggestion": "participant|core_member|admin"
}
```
**Frontend**: Connected to `/login` page
**Flow**: Sets JWT token in httpOnly cookie, redirects based on role

#### 🔐 `/api/users/signup` (POST)
**Purpose**: User registration
**Input**:
```json
{
  "fullname": "string",
  "email": "string",
  "reg_num": "string",
  "role": "participant|core_member"
}
```
**Output**:
```json
{
  "message": "User created successfully",
  "success": true,
  "password": "generated_password"
}
```
**Frontend**: Connected to `/signup` page
**Flow**: Auto-generates password, sends verification email

#### 🔐 `/api/users/logout` (POST)
**Purpose**: User logout
**Input**: None (uses token)
**Output**:
```json
{
  "message": "Logout successful",
  "success": true
}
```
**Frontend**: Connected to logout buttons across the app
**Flow**: Clears JWT cookie

#### 👤 `/api/users/profile` (GET)
**Purpose**: Get user profile with team data
**Input**: None (uses token)
**Output**:
```json
{
  "success": true,
  "user": {...},
  "team": {...}
}
```
**Frontend**: Connected to `/profile` page
**Flow**: Shows user details, team information, Round 2 progress

#### ✉️ `/api/users/verifyemail` (POST)
**Purpose**: Email verification
**Input**:
```json
{
  "token": "verification_token"
}
```
**Output**:
```json
{
  "message": "Email verified successfully",
  "success": true
}
```
**Frontend**: Connected to `/verifyemail` page
**Flow**: Verifies token, marks user as verified

### Team Management

#### 👥 `/api/users/create-team` (POST)
**Purpose**: Create new team with Round 2 initialization
**Input**:
```json
{
  "team_name": "string"
}
```
**Output**:
```json
{
  "message": "Team created successfully",
  "success": true,
  "team": {...},
  "join_code": "string"
}
```
**Frontend**: Connected to `/create-team` page
**Flow**: 
- Creates team with unique join code
- Auto-assigns secret string for Round 2
- Assigns initial station
- Updates JWT with teamId

#### 👥 `/api/users/join-team` (POST)
**Purpose**: Join existing team
**Input**:
```json
{
  "join_code": "string"
}
```
**Output**:
```json
{
  "message": "Joined team successfully",
  "success": true,
  "team": {...}
}
```
**Frontend**: Connected to `/join-team` page
**Flow**: Validates join code, adds user to team, updates JWT

#### 🌍 `/api/users/region-selection` (POST)
**Purpose**: Select hell/earth region
**Input**:
```json
{
  "region": "hell|earth"
}
```
**Output**:
```json
{
  "message": "Region assigned successfully",
  "success": true,
  "user": {...}
}
```
**Frontend**: Connected to `/role-selection` page
**Flow**: Validates region limits (hell: 2, earth: 3), updates JWT

#### 👥 `/api/teams/[teamId]/members` (GET)
**Purpose**: Get team members list
**Input**: teamId in URL params
**Output**:
```json
{
  "success": true,
  "members": [...]
}
```
**Frontend**: Used in team displays across the app
**Flow**: Returns all team members with their roles and regions

### Game Logic - Round Management

#### 🎮 `/api/round/serve-question` (POST)
**Purpose**: Get question for current round and station
**Input**:
```json
{
  "teamId": "string"
}
```
**Output**:
```json
{
  "success": true,
  "question": {...},
  "round": "1|2"
}
```
**Frontend**: Connected to `/question/[id]` page via scan or station
**Flow**: 
- Round 1: Serves random question
- Round 2: Serves station-specific question for current station

#### ✅ `/api/round/validate-answer` (POST)
**Purpose**: Validate answer and update progress
**Input**:
```json
{
  "questionId": "string",
  "answer": "string",
  "teamId": "string"
}
```
**Output**:
```json
{
  "success": true,
  "correct": boolean,
  "score": number,
  "character_revealed": "string|null",
  "letters_found": [...],
  "message": "string"
}
```
**Frontend**: Connected to question pages for answer submission
**Flow**:
- Validates answer against normalized expected answer
- Round 1: Updates score and progress
- Round 2: Reveals characters at 3rd, 5th, 7th questions, manages station progression

#### 🔤 `/api/round/validate-string` (POST)
**Purpose**: Final secret string validation
**Input**:
```json
{
  "secret_string": "string"
}
```
**Output**:
```json
{
  "success": true,
  "correct_characters": number,
  "points_earned": number,
  "is_perfect_match": boolean,
  "final_score": number
}
```
**Frontend**: Connected to `/validate-string` page
**Flow**: Only available after Round 2 ends, calculates final score

#### 🔍 `/api/round/get-question-by-id` (GET)
**Purpose**: Get specific question details
**Input**: questionId in query params
**Output**:
```json
{
  "success": true,
  "question": {...}
}
```
**Frontend**: Used for question display and validation
**Flow**: Returns question without answer for security

#### ⏭️ `/api/round/skip-question` (POST, GET)
**Purpose**: Skip current question with cooldown
**Input**: None (uses token)
**Output**:
```json
{
  "success": true,
  "message": "Question skipped",
  "can_skip": boolean,
  "time_remaining": number
}
```
**Frontend**: Connected to skip buttons on question pages
**Flow**: Enforces cooldown (Round 1: 2min, Round 2: 3min)

#### 🔄 `/api/round/assign-station` (POST)
**Purpose**: Assign next station to team
**Input**:
```json
{
  "teamId": "string"
}
```
**Output**:
```json
{
  "stationId": "string",
  "station_name": "string",
  "difficulty": "string"
}
```
**Frontend**: Used by core members and automatic progression
**Flow**: Excludes last two visited stations, allows revisiting older ones

### Core Member Management

#### 🏪 `/api/core-member/allocate-station` (POST)
**Purpose**: Allocate station to core member
**Input**:
```json
{
  "stationId": "string"
}
```
**Output**:
```json
{
  "message": "Station allocated successfully",
  "success": true
}
```
**Frontend**: Connected to `/chooseStation` page
**Flow**: Assigns core member to manage specific station

#### 🏪 `/api/core-member/get-stations` (GET)
**Purpose**: Get all available stations
**Input**: None
**Output**:
```json
{
  "success": true,
  "stations": [...]
}
```
**Frontend**: Connected to station selection pages
**Flow**: Returns all stations with their details

#### 📱 `/api/core-member/scan-team` (POST)
**Purpose**: Get team info for core member scanning
**Input**:
```json
{
  "teamId": "string"
}
```
**Output**:
```json
{
  "success": true,
  "team": {...},
  "round2": {...}
}
```
**Frontend**: Connected to `/core-member/scanner` page
**Flow**: Returns comprehensive team data including Round 2 progress

#### ℹ️ `/api/core-member/get-station-info` (GET)
**Purpose**: Get allocated station information
**Input**: None (uses token)
**Output**:
```json
{
  "success": true,
  "station": {...}
}
```
**Frontend**: Connected to core member dashboard
**Flow**: Returns station details for allocated core member

### Admin Management

#### 🔧 `/api/admin/create-station` (POST)
**Purpose**: Create new station
**Input**:
```json
{
  "station_name": "string",
  "difficulty": "easy|medium|hard"
}
```
**Output**:
```json
{
  "message": "Station created successfully",
  "success": true,
  "station": {...}
}
```
**Frontend**: Connected to `/admin/create-station` page
**Flow**: Creates new station for Round 2

#### ❓ `/api/admin/create-question` (POST)
**Purpose**: Create new question
**Input**:
```json
{
  "question_text": "string",
  "question_answer": "string",
  "round": "1|2",
  "stationId": "string" // Round 2 only
}
```
**Output**:
```json
{
  "message": "Question created successfully",
  "success": true,
  "question": {...}
}
```
**Frontend**: Connected to `/admin/create-question` page
**Flow**: Creates questions for specific rounds and stations

#### 🔤 `/api/admin/assign-secret-strings` (POST)
**Purpose**: Auto-assign secret strings to teams
**Input**: None
**Output**:
```json
{
  "message": "Secret strings assigned",
  "success": true,
  "assigned_count": number
}
```
**Frontend**: Connected to `/admin/assign-secret-strings` page
**Flow**: Assigns secret strings to teams without Round 2 data

#### ⏰ `/api/admin/update-round` (POST)
**Purpose**: Update game timing and round status
**Input**:
```json
{
  "r1StartTime": "ISO_string",
  "r1EndTime": "ISO_string",
  "r2StartTime": "ISO_string",
  "r2EndTime": "ISO_string"
}
```
**Output**:
```json
{
  "message": "Game timing updated",
  "success": true
}
```
**Frontend**: Connected to `/admin/update-round` page
**Flow**: Updates game timing, auto-assigns secret strings when Round 2 starts

#### 👥 `/api/admin/users-list` (GET)
**Purpose**: Get all users list
**Input**: None
**Output**:
```json
{
  "success": true,
  "users": [...]
}
```
**Frontend**: Connected to admin user management
**Flow**: Returns all users for admin oversight

#### 👤 `/api/admin/create-user` (POST)
**Purpose**: Admin create user
**Input**:
```json
{
  "fullname": "string",
  "email": "string",
  "reg_num": "string",
  "role": "string"
}
```
**Output**:
```json
{
  "message": "User created successfully",
  "success": true,
  "user": {...}
}
```
**Frontend**: Connected to admin user creation
**Flow**: Admin-level user creation with custom parameters

### Leaderboard & Stats

#### 🏆 `/api/leaderboard` (GET)
**Purpose**: Get game leaderboard
**Input**: None
**Output**:
```json
{
  "success": true,
  "leaderboard": [...]
}
```
**Frontend**: Connected to `/leaderboard` page
**Flow**: Returns sorted teams by total score

#### 🏆 `/api/admin/get-leaderboard` (GET)
**Purpose**: Admin view of leaderboard
**Input**: None
**Output**:
```json
{
  "success": true,
  "leaderboard": [...]
}
```
**Frontend**: Connected to admin leaderboard page
**Flow**: Detailed leaderboard for admin monitoring

#### 🏠 `/api/admin/get-indoor-leaderboard` (GET)
**Purpose**: Indoor activity leaderboard
**Input**: None
**Output**:
```json
{
  "success": true,
  "indoor_leaderboard": [...]
}
```
**Frontend**: Connected to admin indoor leaderboard
**Flow**: Shows indoor activity scores

#### 🌍 `/api/admin/get-outdoor-leaderboard` (GET)
**Purpose**: Outdoor activity leaderboard
**Input**: None
**Output**:
```json
{
  "success": true,
  "outdoor_leaderboard": [...]
}
```
**Frontend**: Connected to admin outdoor leaderboard
**Flow**: Shows outdoor activity scores

#### 📊 `/api/get-game-stat` (GET)
**Purpose**: Get current game statistics and timing
**Input**: None
**Output**:
```json
{
  "success": true,
  "r1StartTime": "ISO_string",
  "r1EndTime": "ISO_string",
  "r2StartTime": "ISO_string",
  "r2EndTime": "ISO_string",
  "current_round": "string"
}
```
**Frontend**: Used across the app for timing and round determination
**Flow**: Central source of game timing information

### Utility & Debug Endpoints

#### 🏢 `/api/indoor/update-score` (POST)
**Purpose**: Update indoor activity scores
**Input**:
```json
{
  "teamId": "string",
  "indoorScore": "number"
}
```
**Output**:
```json
{
  "message": "Score updated",
  "success": true
}
```
**Frontend**: Connected to indoor activity interfaces
**Flow**: Updates indoor scores and total_score for teams

#### 📱 `/api/get-team-by-id` (GET)
**Purpose**: Get team details by ID
**Input**: teamId in query params
**Output**:
```json
{
  "success": true,
  "team": {...}
}
```
**Frontend**: Used for team lookups and QR scanning
**Flow**: Returns comprehensive team information

#### 📝 `/api/submission-history` (GET)
**Purpose**: Get user's submission history
**Input**: None (uses token)
**Output**:
```json
{
  "success": true,
  "submissions": [...]
}
```
**Frontend**: Connected to `/submission-history` page
**Flow**: Shows all user question submissions

#### 🏓 `/api/ping` (GET)
**Purpose**: Health check endpoint
**Input**: None
**Output**:
```json
{
  "message": "pong"
}
```
**Frontend**: Used for connection testing
**Flow**: Simple health check

#### 🐛 `/api/debug/token` (GET)
**Purpose**: Debug token information
**Input**: None (uses token)
**Output**:
```json
{
  "success": true,
  "decoded": {...}
}
```
**Frontend**: Used for debugging authentication issues
**Flow**: Returns decoded JWT payload

#### 🐛 `/api/debug/current-round` (GET)
**Purpose**: Debug current round status
**Input**: None
**Output**:
```json
{
  "success": true,
  "current_round": "string",
  "game_state": {...}
}
```
**Frontend**: Used for debugging game state
**Flow**: Returns current round and timing information

---

## Frontend Pages & Route Connections

### Public Pages

#### 🏠 `/` (Home Page)
**Purpose**: Main dashboard based on user role
**API Connections**: 
- `/api/users/profile` - Get user data
- `/api/get-game-stat` - Check current round
**Features**: 
- Role-based content display
- Round status indicator
- Navigation to appropriate sections

#### 🔐 `/login`
**Purpose**: User authentication
**API Connections**: `/api/users/login`
**Features**: 
- Email/password form
- Role-based redirect after login
- Remember me functionality

#### 📝 `/signup`
**Purpose**: User registration
**API Connections**: `/api/users/signup`
**Features**: 
- Registration form with validation
- Auto-password generation
- Email verification trigger

#### ✉️ `/verifyemail`
**Purpose**: Email verification
**API Connections**: `/api/users/verifyemail`
**Features**: 
- Token validation from email links
- Account activation

### Team Management Pages

#### 👥 `/create-team`
**Purpose**: Create new team
**API Connections**: `/api/users/create-team`
**Features**: 
- Team name input
- Join code generation
- Round 2 initialization

#### 🔗 `/join-team`
**Purpose**: Join existing team
**API Connections**: `/api/users/join-team`
**Features**: 
- Join code input
- Team validation
- Member addition

#### 🌍 `/role-selection`
**Purpose**: Select hell/earth region
**API Connections**: `/api/users/region-selection`
**Features**: 
- Region selection (hell/earth)
- Capacity validation
- Role assignment

### Game Pages

#### ❓ `/question/[id]`
**Purpose**: Display and answer questions
**API Connections**: 
- `/api/round/get-question-by-id`
- `/api/round/validate-answer`
- `/api/round/skip-question`
**Features**: 
- Question display
- Answer submission
- Skip functionality with cooldown
- Score updates

#### ❓ `/question` (Scan Entry)
**Purpose**: Entry point for question scanning
**API Connections**: `/api/round/serve-question`
**Features**: 
- QR code scanning
- Team validation
- Question serving

#### 🔤 `/validate-string`
**Purpose**: Final secret string validation
**API Connections**: `/api/round/validate-string`
**Features**: 
- Character input fields
- Final score calculation
- Perfect match detection

#### 📱 `/scanner`
**Purpose**: QR code scanning interface
**API Connections**: Various based on scanned content
**Features**: 
- Camera integration
- QR code detection
- Route navigation based on scan

### User Pages

#### 👤 `/profile`
**Purpose**: User profile and team information
**API Connections**: `/api/users/profile`
**Features**: 
- Personal information display
- Team details
- Round 2 progress tracking

#### 📜 `/submission-history`
**Purpose**: View submission history
**API Connections**: `/api/submission-history`
**Features**: 
- Question submission log
- Score tracking
- Answer history

#### 🏆 `/leaderboard`
**Purpose**: Game leaderboard
**API Connections**: `/api/leaderboard`
**Features**: 
- Team rankings
- Score display
- Real-time updates

### Core Member Pages

#### 🏪 `/chooseStation`
**Purpose**: Station allocation for core members
**API Connections**: 
- `/api/core-member/get-stations`
- `/api/core-member/allocate-station`
**Features**: 
- Station list display
- Allocation interface
- Availability checking

#### 🎯 `/core-member`
**Purpose**: Core member dashboard
**API Connections**: 
- `/api/core-member/get-station-info`
- `/api/users/profile`
**Features**: 
- Station management
- Team scanning access
- Question serving interface

#### 📱 `/core-member/scanner`
**Purpose**: Team scanning for core members
**API Connections**: `/api/core-member/scan-team`
**Features**: 
- QR code scanning
- Team information display
- Round 2 progress monitoring

#### 🎯 `/core-member/qr`
**Purpose**: QR code generation for station
**API Connections**: None (generates QR locally)
**Features**: 
- Station QR code display
- Print-friendly format

### Admin Pages

#### ⚙️ `/admin`
**Purpose**: Admin dashboard
**API Connections**: Multiple admin endpoints
**Features**: 
- System overview
- Management tools access
- Statistics display

#### 🏪 `/admin/create-station`
**Purpose**: Create new stations
**API Connections**: `/api/admin/create-station`
**Features**: 
- Station creation form
- Difficulty setting
- Validation

#### ❓ `/admin/create-question`
**Purpose**: Create new questions
**API Connections**: `/api/admin/create-question`
**Features**: 
- Question creation form
- Round assignment
- Station linking (Round 2)

#### 🔤 `/admin/assign-secret-strings`
**Purpose**: Assign secret strings to teams
**API Connections**: `/api/admin/assign-secret-strings`
**Features**: 
- Bulk string assignment
- Team selection
- Progress tracking

#### ⏰ `/admin/update-round`
**Purpose**: Update game timing
**API Connections**: `/api/admin/update-round`
**Features**: 
- Time setting interface
- Round control
- Status updates

#### 🏆 `/admin/get-leaderboard`
**Purpose**: Admin leaderboard view
**API Connections**: `/api/admin/get-leaderboard`
**Features**: 
- Detailed team rankings
- Score breakdown
- Export functionality

### Instruction Pages

#### 📖 `/instructions`
**Purpose**: Earth region game instructions
**API Connections**: `/api/get-game-stat`
**Features**: 
- Game rules display
- Round-specific guidance
- Navigation controls

#### 🔥 `/hell-instructions`
**Purpose**: Hell region specific instructions
**API Connections**: `/api/get-game-stat`
**Features**: 
- Hell region rules
- Special mechanics
- Warning information

#### 🔐 `/key-verification`
**Purpose**: Post-game verification
**API Connections**: `/api/round/validate-string`
**Features**: 
- Final string verification
- Score calculation
- Game completion

---

## Utility Functions

### Authentication & Security

#### 🔐 `getUserFromToken(request: NextRequest)`
**Purpose**: Extract and verify user from JWT token
**Input**: NextRequest object
**Output**: User payload or null
**Usage**: Used in all authenticated API routes
**Logic**: 
- Tries cookie first, then Authorization header
- Verifies JWT using jsonwebtoken library
- Returns decoded user data

#### 🔐 `getDataFromToken(request: NextRequest)`
**Purpose**: Alternative token extraction method
**Input**: NextRequest object
**Output**: User data or error
**Usage**: Legacy token handling
**Logic**: Similar to getUserFromToken but different error handling

### Game Logic

#### 🎮 `getRound()`
**Purpose**: Determine current game round
**Input**: None (fetches from database)
**Output**: "not started" | "1" | "half time" | "2" | "finished"
**Usage**: Used across the app for round-based logic
**Logic**: 
- Fetches game stat from database
- Compares current time with round timings
- Returns appropriate round status

#### 🎮 `organizeRound(r1Start, r1End, r2Start, r2End)`
**Purpose**: Utility version of round determination
**Input**: Round timing strings
**Output**: Round status string
**Usage**: Alternative to getRound with provided timings
**Logic**: Pure function for round calculation

#### ❓ `giveQuestion(teamId: string)`
**Purpose**: Serve question for Round 1
**Input**: Team ID
**Output**: Random question object
**Usage**: Round 1 question serving
**Logic**: 
- Fetches random question from Round 1 pool
- Avoids recently answered questions
- Returns question without answer

#### ❓ `giveQuestionRoundTwo(teamId: string)`
**Purpose**: Serve question for Round 2
**Input**: Team ID
**Output**: Station-specific question
**Usage**: Round 2 question serving
**Logic**: 
- Gets team's current station
- Fetches random question for that station
- Avoids recently answered questions
- Returns question without answer

#### 🔤 `normalizeAnswer(answer: string)`
**Purpose**: Normalize answers for comparison
**Input**: Raw answer string
**Output**: Normalized answer string
**Usage**: Answer validation in validate-answer API
**Logic**: 
- Converts to lowercase
- Removes extra spaces
- Handles special characters
- Standardizes format

### Station Management

#### 🏪 `assignNextStation(teamId: string)`
**Purpose**: Assign next station to team
**Input**: Team ID
**Output**: Station object or error
**Usage**: Round 2 station progression
**Logic**: 
- Excludes last two visited stations
- Allows revisiting older stations
- Random selection from available options
- Updates team's current/previous station

#### 🏪 `getAllStations()`
**Purpose**: Get all available stations
**Input**: None
**Output**: Array of station objects
**Usage**: Station selection and management
**Logic**: 
- Fetches all stations from database
- Returns formatted station data
- Used for core member allocation

### Team Management

#### 🔤 `assignTeamString(teamId: string)`
**Purpose**: Assign secret string to team
**Input**: Team ID
**Output**: Assigned string or error
**Usage**: Round 2 initialization
**Logic**: 
- Pool of predefined secret strings
- Assigns unused string to team
- Updates team's Round 2 data
- Returns assigned string

#### 🔤 `autoAssignSecretStrings()`
**Purpose**: Bulk assign secret strings to teams
**Input**: None
**Output**: Assignment results
**Usage**: Admin bulk operations
**Logic**: 
- Finds teams without secret strings
- Assigns strings from available pool
- Initializes Round 2 data structure
- Returns count of assignments

#### 🔗 `generateJoinCode()`
**Purpose**: Generate unique team join code
**Input**: None
**Output**: Unique join code string
**Usage**: Team creation
**Logic**: 
- Generates random alphanumeric code
- Checks for uniqueness in database
- Retries if collision detected
- Returns guaranteed unique code

### Formatting & Display

#### ⏰ `formatTime(timestamp: string | Date)`
**Purpose**: Format timestamps for display
**Input**: Timestamp string or Date object
**Output**: Formatted time string
**Usage**: UI time displays
**Logic**: 
- Converts to readable format
- Handles timezone considerations
- Returns formatted string

---

## Library Functions

### Database Management

#### 🗄️ `connectToDatabase()`
**Purpose**: Establish MongoDB connection
**Input**: None
**Output**: Database connection
**Usage**: Called at the start of API routes
**Logic**: 
- Uses connection pooling
- Handles reconnection logic
- Environment-based configuration
- Error handling for connection failures

### Email Services

#### ✉️ `sendEmail(to, subject, html)`
**Purpose**: Send emails via SMTP
**Input**: Recipient, subject, HTML content
**Output**: Send result
**Usage**: Verification emails, notifications
**Logic**: 
- SMTP configuration
- Template rendering
- Error handling
- Retry logic for failures

#### ✉️ `sendVerificationEmail(email, token)`
**Purpose**: Send verification email
**Input**: Email address, verification token
**Output**: Send result
**Usage**: User registration process
**Logic**: 
- Generates verification link
- Uses email template
- Includes token in URL
- Sends via SMTP

### Data Validation

#### 🔍 `UserSchema`, `TeamSchema`, etc.
**Purpose**: Zod schemas for data validation
**Input**: Raw data objects
**Output**: Validated data or errors
**Usage**: API request validation
**Logic**: 
- Type checking
- Required field validation
- Format validation
- Custom validation rules

### Utility Functions

#### 🛠️ `cn()` (Class Names)
**Purpose**: Conditional class name generation
**Input**: Class name conditions
**Output**: Combined class string
**Usage**: Tailwind CSS class management
**Logic**: 
- Combines conditional classes
- Handles conflicts
- Returns optimized class string

---

## Database Models

### User Model
```typescript
{
  _id: ObjectId,
  fullname: string,
  email: string,
  reg_num: string,
  password: string,
  role: "participant" | "core_member" | "admin",
  isVerified: boolean,
  teamId?: ObjectId,
  region?: "hell" | "earth",
  core_allocated_station?: ObjectId,
  // Verification fields
  verifyToken?: string,
  verifyTokenExpiry?: Date,
  // Password reset fields
  forgotPasswordToken?: string,
  forgotPasswordTokenExpiry?: Date
}
```

### Team Model
```typescript
{
  _id: ObjectId,
  team_name: string,
  join_code: string,
  members: ObjectId[],
  total_score: number,
  
  // Round 1 data
  round1: {
    score: number,
    indoor_score: number,
    questions_answered: ObjectId[],
    lastSkipTimestamp?: Date
  },
  
  // Round 2 data
  round2: {
    secret_string: string,
    letters_found: Array<{character: string, position: number}>,
    currentStation: string,
    previousStation?: string,
    solvedStations: string[],
    score: number,
    indoor_score: number,
    questions_answered: ObjectId[],
    lastSkipTimestamp?: Date,
    stringValidated: boolean,
    validationResult?: {
      correct_characters: number,
      points_earned: number,
      is_perfect_match: boolean
    }
  }
}
```

### Station Model
```typescript
{
  _id: ObjectId,
  station_name: string,
  difficulty: "easy" | "medium" | "hard",
  allocated_core_member?: ObjectId,
  questions: ObjectId[]
}
```

### Question Model
```typescript
{
  _id: ObjectId,
  question_text: string,
  question_answer: string,
  round: "1" | "2",
  stationId?: ObjectId, // Round 2 only
  difficulty?: string,
  created_at: Date
}
```

### GameStat Model
```typescript
{
  _id: ObjectId,
  r1StartTime: Date,
  r1EndTime: Date,
  r2StartTime: Date,
  r2EndTime: Date,
  created_at: Date,
  updated_at: Date
}
```

---

## Potential Improvements

### 🚀 Performance Optimizations

#### Database Performance
1. **Add Database Indexes**
   - `team.join_code` (unique, for fast team lookup)
   - `user.email` (unique, for login optimization)
   - `question.round` and `question.stationId` (compound index)
   - `team.round2.currentStation` (for station queries)

2. **Query Optimization**
   - Implement pagination for leaderboards
   - Add data aggregation pipelines for complex queries
   - Cache frequently accessed data (game stats, station lists)

3. **Connection Pooling**
   - Optimize MongoDB connection pool size
   - Implement connection retry logic
   - Add connection health monitoring

#### API Performance
1. **Response Caching**
   - Cache GET endpoints with Redis
   - Implement cache invalidation strategies
   - Add ETags for conditional requests

2. **Request Optimization**
   - Add request rate limiting
   - Implement request batching for bulk operations
   - Add compression middleware

### 🔒 Security Enhancements

#### Authentication & Authorization
1. **Enhanced JWT Security**
   - Implement refresh tokens
   - Add token rotation mechanism
   - Include IP address validation
   - Add device fingerprinting

2. **API Security**
   - Add API key authentication for admin endpoints
   - Implement CORS properly
   - Add request validation middleware
   - Include SQL injection protection

3. **Data Validation**
   - Add comprehensive input sanitization
   - Implement file upload validation
   - Add XSS protection
   - Include CSRF tokens

#### Access Control
1. **Role-Based Access Control (RBAC)**
   - Implement granular permissions
   - Add role hierarchy
   - Include resource-based permissions
   - Add audit logging

2. **Session Management**
   - Add concurrent session limits
   - Implement session timeout
   - Add logout from all devices
   - Include suspicious activity detection

### 🎮 Game Logic Improvements

#### Round 2 Enhancements
1. **Advanced Station Management**
   - Add station capacity limits
   - Implement queue system for busy stations
   - Add station difficulty balancing
   - Include dynamic station assignment based on team performance

2. **Enhanced Scoring System**
   - Add bonus points for speed
   - Implement multiplier system
   - Add penalty for incorrect attempts
   - Include team collaboration scoring

3. **Character Reveal Logic**
   - Add hint system for struggling teams
   - Implement progressive difficulty
   - Add time-based character reveals
   - Include bonus characters for exceptional performance

#### Game Flow Optimization
1. **Smart Question Selection**
   - Avoid recently seen questions across all teams
   - Implement difficulty adaptation
   - Add question popularity tracking
   - Include performance-based question selection

2. **Team Balance**
   - Add team size validation
   - Implement skill-based balancing
   - Add region distribution optimization
   - Include experience level consideration

### 📱 Frontend Improvements

#### User Experience
1. **Real-time Updates**
   - Add WebSocket support for live updates
   - Implement real-time leaderboard
   - Add live progress tracking
   - Include instant notifications

2. **Mobile Optimization**
   - Add progressive web app (PWA) support
   - Implement offline capability
   - Add touch gesture support
   - Include responsive design improvements

3. **Accessibility**
   - Add ARIA labels
   - Implement keyboard navigation
   - Add screen reader support
   - Include high contrast mode

#### Performance
1. **Loading Optimization**
   - Add lazy loading for components
   - Implement code splitting
   - Add image optimization
   - Include service worker caching

2. **State Management**
   - Add Redux or Zustand for complex state
   - Implement optimistic updates
   - Add undo/redo functionality
   - Include state persistence

### 📊 Analytics & Monitoring

#### Game Analytics
1. **Performance Metrics**
   - Track question difficulty distribution
   - Monitor team progression patterns
   - Add completion time analytics
   - Include success rate tracking

2. **User Behavior Analysis**
   - Track navigation patterns
   - Monitor feature usage
   - Add engagement metrics
   - Include drop-off analysis

#### System Monitoring
1. **Application Monitoring**
   - Add error tracking (Sentry)
   - Implement performance monitoring
   - Add uptime monitoring
   - Include API response time tracking

2. **Business Intelligence**
   - Add dashboard for game statistics
   - Implement real-time monitoring
   - Add alerting for system issues
   - Include capacity planning metrics

### 🔧 Development & DevOps

#### Code Quality
1. **Testing Infrastructure**
   - Add unit tests for utilities
   - Implement integration tests for APIs
   - Add end-to-end tests for critical flows
   - Include performance testing

2. **Code Standards**
   - Add ESLint configuration
   - Implement Prettier formatting
   - Add pre-commit hooks
   - Include code coverage reporting

#### Deployment & Operations
1. **CI/CD Pipeline**
   - Add automated testing
   - Implement automated deployment
   - Add environment promotion
   - Include rollback mechanisms

2. **Infrastructure**
   - Add container orchestration
   - Implement horizontal scaling
   - Add load balancing
   - Include backup and disaster recovery

### 🎯 Feature Additions

#### Administrative Tools
1. **Game Management**
   - Add pause/resume game functionality
   - Implement emergency stop mechanism
   - Add bulk team operations
   - Include game state export/import

2. **Content Management**
   - Add question import/export
   - Implement bulk question creation
   - Add question difficulty analysis
   - Include content versioning

#### Team Features
1. **Team Communication**
   - Add in-game messaging
   - Implement team announcements
   - Add progress sharing
   - Include team achievement system

2. **Enhanced Gameplay**
   - Add power-ups or special abilities
   - Implement mini-games between rounds
   - Add team challenges
   - Include social features (team photos, celebrations)

---

*Documentation Generated: September 22, 2025*
*Version: 1.0.0*
*Last Updated: Post-Upstream Merge*