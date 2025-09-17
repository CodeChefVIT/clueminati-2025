# ⚠️ DEPRECATED ENDPOINTS

**These folders contain deprecated API endpoints that have been replaced by unified `/api/round/` endpoints.**

## Migration Guide

### Old → New Endpoint Mapping:

- `❌ /api/round-one/get-question-by-id` → `✅ /api/round/serve-question`  
- `❌ /api/round-two/serve-question` → `✅ /api/round/serve-question`
- `❌ /api/round-two/validate-answer` → `✅ /api/round/validate-answer` 
- `❌ /api/round-two/next-station` → `✅ Integrated into validate-answer`

## ⚠️ Status: DEPRECATED - DO NOT USE

These endpoints are kept temporarily for reference but should **not be used** in production.

**Use the unified endpoints in `/api/round/` instead.**

See `UNIFIED_API_ENDPOINTS.md` for complete documentation.

---
*Migration completed on: $(date)*