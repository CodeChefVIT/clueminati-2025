# 🚀 **User Flow Analysis - Clueminati 2025**

## 📋 **Current User Journey**

### **1. Initial Signup → Login Flow**
```
✅ Signup → Email Verification → Login → JWT Token Set
```

### **2. Post-Login Routing Logic**

#### **For Core Members:**
```
Login → Redirect to /core-member (dashboard)
```

#### **For Participants:**
```
Login → Check teamId in JWT
├── Has teamId → Redirect to / (home page with QR scanner)
└── No teamId → Redirect to /join-team (via middleware)
```

---

## 🔍 **Current Issues Identified**

### **❌ Problem 1: Missing Role Selection Flow**
- **Issue**: After joining a team, users go directly to home page
- **Expected**: Should go through role selection first
- **Current**: `join-team` → redirects to `/role-selection?teamId=X` (frontend only)
- **Fix Needed**: Role selection should be mandatory before accessing main app

### **❌ Problem 2: Inconsistent API Endpoints**
- **Issue**: Frontend calls `/api/join-team` but endpoint is `/api/users/join-team`
- **Error**: This will cause 404 errors
- **Fix Needed**: Update frontend or create redirect

### **❌ Problem 3: Participant Flow Gaps**
- **Issue**: No enforcement of role selection completion
- **Current**: Participants can access home page without selecting roles
- **Fix Needed**: Add role validation to middleware

### **❌ Problem 4: Create Team Flow**
- **Issue**: After creating team, redirects to home page without role selection
- **Expected**: Should also go through role selection

---

## ✅ **Ideal User Flow (Fixed)**

### **For Participants:**
```
1. Signup → Email Verification → Login
2. Check if has team:
   ├── No Team → /join-team OR /create-team
   └── Has Team → Check if has gameRole:
       ├── No Role → /role-selection
       └── Has Role → /profile (main participant view)
```

### **For Core Members:**
```
1. Signup → Email Verification → Login
2. Check if has team:
   ├── No Team → /create-team (can create teams)
   └── Has Team → /core-member (dashboard)
```

---

## 🔧 **Required Fixes**

### **Fix 1: Update join-team Frontend**
```tsx
// In join-team/page.tsx, line where axios.post is called:
// WRONG:
const response = await axios.post('/api/join-team', { joinCode: teamCode });

// CORRECT:
const response = await axios.post('/api/users/join-team', { joinCode: teamCode });
```

### **Fix 2: Enhance Middleware Logic**
```typescript
// Add to middleware.ts:
// Check if user has gameRole selected after team joining
if (payload.role === 'participant' && payload.teamId && !payload.gameRole) {
  if (path !== '/role-selection') {
    return NextResponse.redirect(new URL('/role-selection', request.url))
  }
}
```

### **Fix 3: Update Post-Team Creation Flow**
```tsx
// In create-team/page.tsx:
// After successful team creation, redirect to role selection
const handleProceed = () => {
  setShowModal(false);
  router.push(`/role-selection?teamId=${createdTeam.teamId}`);  // Not just "/"
};
```

### **Fix 4: Update Login Response**
```typescript
// In login/route.ts:
// Include gameRole in JWT token
const tokenData = {
  id: user._id,
  fullname: user.fullname,
  email: user.email,
  role: user.role,
  teamId: user.teamId ?? null,
  region: user.region ?? null,
  gameRole: user.gameRole ?? null  // ADD THIS
}
```

### **Fix 5: Update Role Selection Flow**
```tsx
// After successful role selection:
// Redirect participants to /profile instead of /
router.push('/profile');
```

---

## 🎯 **Corrected Flow Diagram**

### **Participants (Most Users):**
```
Signup → Email Verification → Login
    ↓
Check Team Status
    ├── No Team → Join/Create Team → Role Selection → Profile
    └── Has Team → Check Role Status
        ├── No Role → Role Selection → Profile  
        └── Has Role → Profile
```

### **Core Members (Staff):**
```
Signup → Email Verification → Login
    ↓
Check Team Status
    ├── No Team → Create Team → Core Member Dashboard
    └── Has Team → Core Member Dashboard
```

---

## 🚨 **Priority Fixes**

### **Priority 1 (Critical):**
1. ✅ Fix `/api/join-team` endpoint URL in frontend
2. ✅ Add `gameRole` to JWT token payload
3. ✅ Update middleware to enforce role selection

### **Priority 2 (Important):**
1. ✅ Update create-team flow to include role selection
2. ✅ Ensure proper redirects after role selection
3. ✅ Add role validation in protected routes

### **Priority 3 (Enhancement):**
1. ✅ Add loading states and error handling
2. ✅ Improve UX with proper navigation flow
3. ✅ Add role-based UI components

---

## 📋 **Testing Checklist**

### **Test Participant Flow:**
- [ ] Signup → Login → No team → Join team → Role selection → Profile
- [ ] Signup → Login → No team → Create team → Role selection → Profile  
- [ ] Login with existing team but no role → Role selection → Profile
- [ ] Login with existing team and role → Profile directly

### **Test Core Member Flow:**
- [ ] Signup → Login → No team → Create team → Dashboard
- [ ] Login with existing team → Dashboard directly

### **Test Edge Cases:**
- [ ] Try accessing protected routes without proper flow completion
- [ ] Test middleware redirections work correctly
- [ ] Verify JWT tokens include all necessary data

---

**🎯 Summary:** The user flow needs fixes to ensure proper team → role selection → profile progression for participants, while maintaining direct dashboard access for core members.**