# ERD Comparison: Current Schemas vs Figma ERD

**Date:** Current  
**Status:** ⚠️ **SIGNIFICANT DIFFERENCES FOUND**

---

## 🚨 Executive Summary

**Our current schemas do NOT fully match the Figma ERD.** There are significant structural differences:

1. **Missing Models:** 8 models are missing
2. **Different Structure:** More normalized in Figma ERD (separate tables vs embedded)
3. **Field Differences:** Different field names and requirements
4. **Different Status Values:** Booking and payment statuses differ

---

## 📊 Missing Models (8 models)

### ❌ 1. PhotographyTypes
**Figma ERD:** Separate master table with 28 photography categories  
**Current:** Embedded as `specialties: string[]` in Photographer

**Required Fields:**
- `id` (UUID)
- `name` (VARCHAR(100), required, unique)
- `description` (TEXT)
- `icon` (VARCHAR(50))
- `created_at` (TIMESTAMP)

**Action:** Create `PhotographyType` model

---

### ❌ 2. PhotographerSpecialties
**Figma ERD:** Junction table linking photographers to photography types  
**Current:** Embedded as array in Photographer

**Required Fields:**
- `id` (UUID)
- `photographer_id` (UUID, FK → photographers.id)
- `photography_type_id` (UUID, FK → photography_types.id)
- `created_at` (TIMESTAMP)
- **Unique constraint:** (photographer_id, photography_type_id)

**Action:** Create `PhotographerSpecialty` model

---

### ❌ 3. Payments
**Figma ERD:** Separate payment table (one-to-one with booking)  
**Current:** Embedded as `payment` object in Booking

**Required Fields:**
- `id` (UUID)
- `booking_id` (UUID, FK → bookings.id, unique)
- `amount` (DECIMAL(10,2), required)
- `commission` (DECIMAL(10,2), required)
- `payment_method` (VARCHAR(50), required)
- `payment_status` (ENUM, required, default: pending)
- `stripe_payment_id` (VARCHAR(255), unique)
- `paid_at` (TIMESTAMP)
- `refunded_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

**Payment Status Enum:**
- pending, processing, succeeded, failed, refunded, partially_refunded

**Payment Methods:**
- credit_card, debit_card, apple_pay, google_pay

**Action:** Create `Payment` model

---

### ❌ 4. Refunds
**Figma ERD:** Separate refund table with tiered policy  
**Current:** Embedded in Booking.payment

**Required Fields:**
- `id` (UUID)
- `payment_id` (UUID, FK → payments.id)
- `booking_id` (UUID, FK → bookings.id)
- `refund_amount` (DECIMAL(10,2), required)
- `refund_percentage` (DECIMAL(5,2), required)
- `refund_policy_tier` (ENUM, required)
- `reason` (TEXT, required)
- `status` (ENUM, required, default: pending)
- `processed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

**Refund Policy Tiers:**
- full_refund (100% - >7 days before)
- partial_refund_75 (75% - 4-7 days before)
- partial_refund_50 (50% - 2-3 days before)
- no_refund (0% - <2 days before)

**Refund Status Enum:**
- pending, approved, processing, completed, rejected

**Action:** Create `Refund` model

---

### ❌ 5. Media
**Figma ERD:** Separate media table (replaces Photo)  
**Current:** `Photo` model exists but structure differs

**Required Fields:**
- `id` (UUID)
- `booking_id` (UUID, FK → bookings.id, optional)
- `photographer_id` (UUID, FK → photographers.id, required)
- `url` (TEXT, required)
- `thumbnail_url` (TEXT, optional)
- `type` (ENUM, required) - photo or video
- `title` (VARCHAR(255), optional)
- `description` (TEXT, optional)
- `is_portfolio` (BOOLEAN, required, default: false)
- `created_at` (TIMESTAMP)

**Media Type Enum:**
- photo, video

**Action:** Rename/refactor `Photo` to `Media` or create new model

---

### ❌ 6. Availability
**Figma ERD:** Separate table for weekly availability  
**Current:** Embedded as `availability.workingHours` in Photographer

**Required Fields:**
- `id` (UUID)
- `photographer_id` (UUID, FK → photographers.id, required)
- `day_of_week` (INTEGER, required) - 0=Sunday, 6=Saturday
- `start_time` (TIME, required)
- `end_time` (TIME, required)
- `is_available` (BOOLEAN, required, default: true)
- `created_at` (TIMESTAMP)
- **Unique constraint:** (photographer_id, day_of_week, start_time)

**Action:** Create `Availability` model

---

### ❌ 7. BlockedDates
**Figma ERD:** Separate table for blocked dates  
**Current:** Embedded as `availability.blockedDates` in Photographer

**Required Fields:**
- `id` (UUID)
- `photographer_id` (UUID, FK → photographers.id, required)
- `date` (DATE, required)
- `reason` (VARCHAR(255), optional)
- `created_at` (TIMESTAMP)
- **Unique constraint:** (photographer_id, date)

**Action:** Create `BlockedDate` model

---

### ❌ 8. CollectionItems
**Figma ERD:** Junction table for collection-media relationship  
**Current:** Embedded as `photos: ObjectId[]` in Collection

**Required Fields:**
- `id` (UUID)
- `collection_id` (UUID, FK → collections.id, required)
- `media_id` (UUID, FK → media.id, required)
- `order` (INTEGER, required, default: 0)
- `added_at` (TIMESTAMP)
- **Unique constraint:** (collection_id, media_id)

**Action:** Create `CollectionItem` model

---

## 🔄 Structural Differences

### 1. User Model

| Field | Figma ERD | Current Schema | Status |
|-------|-----------|----------------|--------|
| `id` | UUID | ObjectId | ⚠️ Different type |
| `email` | VARCHAR(255), required | ✅ Matches | ✅ |
| `password_hash` | VARCHAR(255), required | `password` | ⚠️ Different name |
| `role` | ENUM (client, photographer, admin) | ✅ Matches | ✅ |
| `first_name` | VARCHAR(100), **required** | `firstName`, optional | ❌ Missing requirement |
| `last_name` | VARCHAR(100), **required** | `lastName`, optional | ❌ Missing requirement |
| `phone` | VARCHAR(20) | ✅ Matches | ✅ |
| `profile_photo` | TEXT | `profilePicture` | ⚠️ Different name |
| `is_active` | BOOLEAN, default: true | ✅ Matches | ✅ |
| `email_verified` | BOOLEAN, default: false | ❌ **MISSING** | ❌ |
| `specialties` | ❌ Not in User | ✅ Present | ⚠️ Should be removed |

**Issues:**
- ❌ `first_name` and `last_name` should be **required** (not optional)
- ❌ Missing `email_verified` field
- ⚠️ `specialties` should not be in User (moved to PhotographerSpecialties)

---

### 2. Photographer Model

| Field | Figma ERD | Current Schema | Status |
|-------|-----------|----------------|--------|
| `id` | UUID | ObjectId | ⚠️ Different type |
| `user_id` | UUID, required, unique | `user`, ObjectId | ✅ Matches |
| `business_name` | VARCHAR(255) | ❌ **MISSING** | ❌ |
| `bio` | TEXT | ✅ Matches | ✅ |
| `years_experience` | INTEGER | ❌ **MISSING** | ❌ |
| `hourly_rate` | DECIMAL(10,2) | In `pricing.hourlyRate` | ⚠️ Different location |
| `location_city` | VARCHAR(100), **required** | `location.city`, optional | ❌ Missing requirement |
| `location_region` | VARCHAR(100), **required** | `location.province`, optional | ❌ Missing requirement |
| `portfolio_url` | TEXT | ❌ **MISSING** | ❌ |
| `instagram_handle` | VARCHAR(100) | ❌ **MISSING** | ❌ |
| `is_verified` | BOOLEAN, default: false | ✅ Matches | ✅ |
| `average_rating` | DECIMAL(3,2), default: 0.00 | `rating`, Number | ✅ Matches |
| `total_bookings` | INTEGER, default: 0 | ✅ Matches | ✅ |
| `specialties` | ❌ Not here (in junction table) | ✅ Present as array | ⚠️ Should be removed |

**Issues:**
- ❌ Missing `business_name`
- ❌ Missing `years_experience`
- ❌ Missing `portfolio_url`
- ❌ Missing `instagram_handle`
- ❌ `location_city` and `location_region` should be **required**
- ⚠️ `specialties` should be moved to PhotographerSpecialties junction table
- ⚠️ `hourly_rate` should be top-level, not in pricing object

---

### 3. Booking Model

| Field | Figma ERD | Current Schema | Status |
|-------|-----------|----------------|--------|
| `id` | UUID | ObjectId | ⚠️ Different type |
| `client_id` | UUID, required | `client`, ObjectId | ✅ Matches |
| `photographer_id` | UUID, required | `photographer`, ObjectId | ✅ Matches |
| `photography_type_id` | UUID, required | ❌ **MISSING** | ❌ |
| `status` | ENUM (different values) | ✅ Present | ⚠️ Different values |
| `booking_date` | DATE, required | `date`, Date | ✅ Matches |
| `start_time` | TIME, required | `startTime`, String | ✅ Matches |
| `end_time` | TIME, required | ❌ **MISSING** | ❌ |
| `location_address` | TEXT, required | `location`, String | ✅ Matches |
| `location_city` | VARCHAR(100), required | ❌ **MISSING** | ❌ |
| `total_amount` | DECIMAL(10,2), required | In `pricing.total` | ⚠️ Different location |
| `commission_amount` | DECIMAL(10,2), required | In `pricing.commission` | ⚠️ Different location |
| `photographer_payout` | DECIMAL(10,2), required | In `pricing.photographerEarnings` | ⚠️ Different location |
| `special_requests` | TEXT | `notes`, String | ⚠️ Different name |
| `cancellation_reason` | TEXT | ✅ Matches | ✅ |

**Booking Status Differences:**

**Figma ERD:**
- pending, confirmed, in_progress, completed, delivered, cancelled, refunded

**Current:**
- pending, confirmed, cancelled, completed, declined

**Missing Statuses:**
- ❌ `in_progress`
- ❌ `delivered`
- ❌ `refunded`

**Issues:**
- ❌ Missing `photography_type_id` (required)
- ❌ Missing `end_time` (required)
- ❌ Missing `location_city` (required)
- ⚠️ Payment should be in separate Payments table, not embedded
- ⚠️ Status enum values don't match

---

### 4. Review Model

| Field | Figma ERD | Current Schema | Status |
|-------|-----------|----------------|--------|
| `id` | UUID | ObjectId | ⚠️ Different type |
| `booking_id` | UUID, required, unique | ✅ Matches | ✅ |
| `photographer_id` | UUID, required | ✅ Matches | ✅ |
| `client_id` | UUID, required | `customer`, ObjectId | ⚠️ Different name |
| `rating` | INTEGER, required (1-5) | ✅ Matches | ✅ |
| `comment` | TEXT | ✅ Matches | ✅ |
| `is_visible` | BOOLEAN, default: true | `isPublic`, Boolean | ⚠️ Different name |
| `title` | ❌ Not in ERD | ✅ Present | ⚠️ Extra field |
| `categories` | ❌ Not in ERD | ✅ Present | ⚠️ Extra field |

**Issues:**
- ⚠️ `title` and `categories` are extra (not in Figma ERD)
- ⚠️ `is_visible` vs `isPublic` naming difference

---

### 5. Collection Model

| Field | Figma ERD | Current Schema | Status |
|-------|-----------|----------------|--------|
| `id` | UUID | ObjectId | ⚠️ Different type |
| `client_id` | UUID, required | `user`, ObjectId | ⚠️ Different name |
| `name` | VARCHAR(255), required | ✅ Matches | ✅ |
| `description` | TEXT | ✅ Matches | ✅ |
| `cover_photo` | TEXT | `coverPhoto`, ObjectId | ⚠️ Different type |
| `is_public` | BOOLEAN, default: false | ✅ Matches | ✅ |
| `photos` | ❌ Not here (in junction table) | ✅ Present as array | ⚠️ Should be removed |

**Issues:**
- ⚠️ `cover_photo` should be TEXT (URL), not ObjectId
- ⚠️ `photos` should be in CollectionItems junction table

---

### 6. Conversation Model

| Field | Figma ERD | Current Schema | Status |
|-------|-----------|----------------|--------|
| `id` | UUID | ObjectId | ⚠️ Different type |
| `booking_id` | UUID, optional | ✅ Matches | ✅ |
| `client_id` | UUID, required | `participants`, ObjectId[] | ⚠️ Different structure |
| `photographer_id` | UUID, required | `participants`, ObjectId[] | ⚠️ Different structure |
| `last_message_at` | TIMESTAMP | ✅ Matches | ✅ |
| `participants` | ❌ Not in ERD | ✅ Present | ⚠️ Extra field |
| `unreadCount` | ❌ Not in ERD | ✅ Present | ⚠️ Extra field |

**Issues:**
- ⚠️ Should have explicit `client_id` and `photographer_id` instead of `participants` array
- ⚠️ `unreadCount` not in Figma ERD

---

### 7. Message Model

| Field | Figma ERD | Current Schema | Status |
|-------|-----------|----------------|--------|
| `id` | UUID | ObjectId | ⚠️ Different type |
| `conversation_id` | UUID, required | `conversation`, ObjectId | ✅ Matches |
| `sender_id` | UUID, required | `sender`, ObjectId | ✅ Matches |
| `content` | TEXT, required | `text`, String | ⚠️ Different name |
| `is_read` | BOOLEAN, default: false | `status`, Enum | ⚠️ Different structure |
| `read_at` | TIMESTAMP | ✅ Matches | ✅ |
| `attachments` | ❌ Not in ERD | ✅ Present | ⚠️ Extra field |
| `status` | ❌ Not in ERD | ✅ Present | ⚠️ Extra field |

**Issues:**
- ⚠️ Should use `is_read` boolean instead of `status` enum
- ⚠️ `attachments` not in Figma ERD

---

## 📋 Summary of Required Changes

### High Priority (Critical for ERD Compliance)

1. **Create Missing Models:**
   - ✅ PhotographyType
   - ✅ PhotographerSpecialty
   - ✅ Payment
   - ✅ Refund
   - ✅ Availability
   - ✅ BlockedDate
   - ✅ CollectionItem
   - ⚠️ Media (refactor Photo or create new)

2. **Update User Model:**
   - Make `first_name` and `last_name` **required**
   - Add `email_verified` field
   - Remove `specialties` (moved to PhotographerSpecialties)

3. **Update Photographer Model:**
   - Add `business_name`
   - Add `years_experience`
   - Add `portfolio_url`
   - Add `instagram_handle`
   - Make `location_city` and `location_region` **required**
   - Move `hourly_rate` to top-level
   - Remove `specialties` array (use junction table)

4. **Update Booking Model:**
   - Add `photography_type_id` (required)
   - Add `end_time` (required)
   - Add `location_city` (required)
   - Update status enum to include: `in_progress`, `delivered`, `refunded`
   - Remove embedded `payment` object (use separate Payment table)

5. **Update Review Model:**
   - Remove `title` field (not in ERD)
   - Remove `categories` object (not in ERD)
   - Rename `isPublic` to `is_visible`

6. **Update Collection Model:**
   - Change `coverPhoto` from ObjectId to TEXT (URL)
   - Remove `photos` array (use CollectionItems junction table)

7. **Update Conversation Model:**
   - Add explicit `client_id` and `photographer_id` fields
   - Remove `participants` array
   - Remove `unreadCount` (not in ERD)

8. **Update Message Model:**
   - Change `status` enum to `is_read` boolean
   - Remove `attachments` (not in ERD)

### Medium Priority

- Consider UUID vs ObjectId (MongoDB uses ObjectId, but ERD specifies UUID)
- Update field naming convention (snake_case vs camelCase)
- Add validation schemas for new models

---

## 🎯 Action Plan

### Phase 1: Create Missing Models
1. PhotographyType
2. PhotographerSpecialty
3. Payment
4. Refund
5. Availability
6. BlockedDate
7. CollectionItem
8. Media (refactor Photo)

### Phase 2: Update Existing Models
1. User (add email_verified, make first/last name required)
2. Photographer (add missing fields, make location required)
3. Booking (add missing fields, update status enum)
4. Review (remove extra fields)
5. Collection (update structure)
6. Conversation (update structure)
7. Message (update structure)

### Phase 3: Update Validation Schemas
- Create schemas for new models
- Update existing schemas to match new structure

---

## ⚠️ Important Notes

1. **Database Type:** Figma ERD specifies PostgreSQL with UUID, but we're using MongoDB with ObjectId. This is a fundamental difference that may require discussion.

2. **Normalization:** Figma ERD is more normalized (separate tables), while our current schemas use embedded objects. This affects:
   - Query performance
   - Data consistency
   - Scalability

3. **Field Naming:** Figma ERD uses snake_case, we use camelCase. This is a style choice but should be consistent.

4. **Status Values:** Booking statuses differ significantly - need to align.

---

**Status:** ⚠️ **REQUIRES SIGNIFICANT UPDATES TO MATCH FIGMA ERD**


