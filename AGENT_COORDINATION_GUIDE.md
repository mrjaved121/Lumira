# 🤝 Agent Coordination Guide

This guide helps multiple agents work efficiently on the Lumira platform project.

---

## 🎯 Current Project Status

**Overall:** 6.7% Complete (7/105 APIs)  
**Phase:** Phase 2 - User Management  
**Foundation:** ✅ Solid (Auth system complete)

---

## 👥 Recommended Agent Teams

### Team 1: Core Features (High Priority)
**Agent 1A: Authentication Completion**
- Complete remaining auth APIs (Google OAuth, password reset)
- **Files to work with:** `app/api/auth/`, `lib/schemas/auth.schema.ts`

**Agent 1B: User Management**
- Complete user management APIs
- **Files to work with:** `app/api/users/`, `lib/schemas/user.schema.ts`

---

### Team 2: Business Logic (High Priority)
**Agent 2A: Photographer Features**
- All photographer APIs (21 endpoints)
- **Files to create:** `app/api/photographers/`, `lib/models/Photographer.ts` (exists)

**Agent 2B: Booking System**
- Booking APIs (14 endpoints)
- **Files to create:** `app/api/bookings/`, `lib/models/Booking.ts`

---

### Team 3: Content & Media (Medium Priority)
**Agent 3A: Photo Management**
- Photo upload & management APIs
- **Files to create:** `app/api/photos/`, `lib/models/Photo.ts`

**Agent 3B: Collections**
- Collection APIs
- **Files to create:** `app/api/collections/`, `lib/models/Collection.ts`

---

### Team 4: Communication (Medium Priority)
**Agent 4A: Messaging**
- Conversation & message APIs
- **Files to create:** `app/api/conversations/`, `app/api/messages/`

**Agent 4B: Notifications**
- Notification APIs
- **Files to create:** `app/api/notifications/`, `lib/models/Notification.ts`

---

### Team 5: Financial & Reviews (Medium Priority)
**Agent 5A: Reviews**
- Review APIs
- **Files to create:** `app/api/reviews/`, `lib/models/Review.ts`

**Agent 5B: Transactions & Earnings**
- Transaction & earning APIs
- **Files to create:** `app/api/transactions/`, `app/api/earnings/`

---

### Team 6: Infrastructure (Lower Priority)
**Agent 6A: Payment Integration**
- Payment method APIs
- **Files to create:** `app/api/users/me/payment-methods/`

**Agent 6B: Admin Panel**
- Admin APIs
- **Files to create:** `app/api/admin/`

---

## 📋 Work Assignment Template

When assigning work to an agent, provide:

```markdown
## Agent Assignment: [Agent Name]

### Task: [API Category]
### Priority: [High/Medium/Low]
### Estimated Time: [X hours/days]

### Specific APIs to Build:
1. [ ] Endpoint 1
2. [ ] Endpoint 2
3. [ ] Endpoint 3

### Files to Create/Modify:
- `app/api/[category]/[endpoint]/route.ts`
- `lib/schemas/[category].schema.ts` (if needed)
- `lib/models/[Model].ts` (if needed)

### Dependencies:
- Requires: [What needs to be done first]
- Blocks: [What this unblocks]

### Reference Files:
- Example API: `app/api/auth/login/route.ts`
- Example Schema: `lib/schemas/auth.schema.ts`
- Example Model: `lib/models/User.ts`

### Testing Requirements:
- [ ] Manual testing guide
- [ ] Test script
- [ ] Edge cases covered
```

---

## 🔄 Workflow Process

### 1. Agent Receives Assignment
- Read `PROJECT_STATUS_REPORT.md`
- Review `API_STRUCTURE.md` for specifications
- Check `API_PROGRESS_TRACKER.md` for what's done
- Review example files in codebase

### 2. Agent Starts Work
- Create feature branch: `feature/[agent-name]-[feature]`
- Follow existing code patterns
- Write code with TypeScript
- Add Zod validation
- Include error handling

### 3. Agent Completes Work
- Test the API manually
- Update `API_PROGRESS_TRACKER.md`
- Create test guide (if new category)
- Submit for review

### 4. Code Review
- Another agent reviews code
- Check for consistency
- Verify security
- Test the API

### 5. Merge & Update
- Merge to main branch
- Update status documents
- Mark as complete

---

## 📐 Code Standards (All Agents Must Follow)

### API Route Structure:
```typescript
/**
 * [API Name]
 * [Method] /api/[path]
 * 
 * [Description]
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { [Model] } from '@/lib/models';
import { [Schema] } from '@/lib/schemas/[category].schema';
import { getAuthenticatedUserDocument } from '@/lib/utils/auth';

export async function [METHOD](request: NextRequest) {
  try {
    await connectDB();
    // Implementation
  } catch (error: any) {
    // Error handling
  }
}
```

### Validation:
- Always use Zod schemas
- Validate all inputs
- Return detailed error messages

### Error Handling:
- Consistent error format
- Proper HTTP status codes
- Don't expose sensitive info

### Response Format:
```typescript
// Success
{
  success: true,
  data: { ... },
  message: "..." // optional
}

// Error
{
  success: false,
  error: "Error message",
  details: [...] // optional
}
```

---

## 🚫 Common Mistakes to Avoid

1. ❌ **Don't skip validation** - Always validate inputs
2. ❌ **Don't expose passwords** - Never return password fields
3. ❌ **Don't forget error handling** - Handle all error cases
4. ❌ **Don't skip authentication** - Check auth for protected routes
5. ❌ **Don't ignore TypeScript** - Use proper types
6. ❌ **Don't skip testing** - Test before submitting

---

## ✅ Quality Checklist (Before Submission)

- [ ] Code follows existing patterns
- [ ] TypeScript types are correct
- [ ] Zod validation is implemented
- [ ] Error handling is comprehensive
- [ ] Authentication is checked (if needed)
- [ ] Sensitive data is excluded from responses
- [ ] Code is documented
- [ ] Manual testing is done
- [ ] `API_PROGRESS_TRACKER.md` is updated
- [ ] No linter errors

---

## 📞 Communication Protocol

### Daily Updates:
- What you completed today
- What you're working on next
- Any blockers or questions

### When Stuck:
1. Check existing code for examples
2. Review documentation
3. Ask other agents
4. Update status with blocker

### When Completing:
1. Update progress tracker
2. Create test guide (if new)
3. Notify team
4. Submit for review

---

## 🎯 Priority Matrix

### 🔴 High Priority (Do First):
1. Complete User Management APIs
2. Complete Authentication APIs
3. Photographer Profile APIs
4. Booking System APIs

### 🟡 Medium Priority (Do Next):
1. Photo Management
2. Reviews
3. Transactions
4. Messaging
5. Notifications

### 🟢 Low Priority (Do Last):
1. Collections
2. Earnings
3. Admin APIs
4. Payment Methods (after Stripe setup)

---

## 📚 Essential Reading for All Agents

1. **API_STRUCTURE.md** - Complete API specifications
2. **PROJECT_STATUS_REPORT.md** - Current status
3. **IMPLEMENTATION_GUIDE.md** - How to build APIs
4. **ERD.md** - Database schema
5. **Example files** - See existing implementations

---

## 🔗 Quick Reference

**Example API:** `app/api/auth/login/route.ts`  
**Example Schema:** `lib/schemas/auth.schema.ts`  
**Example Model:** `lib/models/User.ts`  
**Auth Helper:** `lib/utils/auth.ts`  
**JWT Helper:** `lib/utils/jwt.ts`

---

**Remember:** Consistency, Security, Testing, Documentation! 🚀
