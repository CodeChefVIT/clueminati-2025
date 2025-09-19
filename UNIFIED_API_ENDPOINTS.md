# 🎯 Unified Round API Endpoints

## Overview
The round system has been successfully integrated into unified endpoints that handle both Round 1 and Round 2 logic dynamically based on the current game state.

## ✅ Unified Endpoints

### 1. **GET /api/round/serve-question**
Serves questions for both Round 1 and Round 2.

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
    "question_description": "What is...?",
    "difficulty": "easy",
    "round": "1"
  },
  "round": "1"
}
```

### 2. **POST /api/round/validate-answer**
Validates answers for both rounds with Round 2 secret character reveals.

**Body:**
```json
{
  "questionId": "64abc123def456",
  "userAnswer": "correct answer"
}
```

**Round 1 Response:**
```json
{
  "message": "correct",
  "data": { ...question },
  "round": "1"
}
```

**Round 2 Response (with secret reveal):**
```json
{
  "message": "correct",
  "data": { ...question },
  "round": "2",
  "reveal": "s",
  "nextStation": {
    "stationId": "newStationId",
    "station_name": "Station B"
  }
}
```

## 🔄 Round Detection Logic

The unified endpoints use `getCurrentRound()` utility to determine:
- `"not_started"` - Game hasn't begun
- `"1"` - Round 1 active
- `"2"` - Round 2 active  
- `"finished"` - Game completed

## 🎮 Round 2 Special Features

### Secret Character Reveals
- Characters revealed at 3rd, 5th, and 7th questions solved
- Automatically managed in `validate-answer` endpoint
- Tracks `secret_chars_revealed` count

### Station Management
- Automatic station assignment using `assignNextStation()` utility
- Replaces the old `/api/round-two/next-station` route
- Integrated directly into answer validation

## 📋 Migration Notes

### ✅ Completed Integration:
- ✅ Secret character reveal logic
- ✅ Station assignment within validate-answer
- ✅ Unified question serving for both rounds
- ✅ Dynamic round detection
- ✅ Consistent error handling

### 🗂️ Deprecated Endpoints (kept for reference):
- `/api/round-one/` - Replace with `/api/round/`
- `/api/round-two/` - Replace with `/api/round/`
- `/api/round-two/next-station` - Logic moved to validate-answer

## 🧪 Testing

**Round 1 Test:**
```bash
# 1. Serve question
curl "http://localhost:3000/api/round/serve-question?teamId=TEAM_ID&difficulty=easy"

# 2. Validate answer  
curl -X POST http://localhost:3000/api/round/validate-answer \
  -H "Content-Type: application/json" \
  -d '{"questionId":"QUESTION_ID","userAnswer":"answer"}'
```

**Round 2 Test:**
```bash
# 1. Serve question (requires stationId)
curl "http://localhost:3000/api/round/serve-question?teamId=TEAM_ID&difficulty=easy&stationId=STATION_ID"

# 2. Validate answer (returns secret char + next station)
curl -X POST http://localhost:3000/api/round/validate-answer \
  -H "Content-Type: application/json" \
  -d '{"questionId":"QUESTION_ID","userAnswer":"answer"}'
```

## 🎯 Next Steps

1. **Test both endpoints** with Postman
2. **Verify secret character reveals** work at 3rd, 5th, 7th questions
3. **Confirm station assignments** happen automatically
4. **Remove old round-specific folders** when ready

---
*Integration completed successfully! 🚀*