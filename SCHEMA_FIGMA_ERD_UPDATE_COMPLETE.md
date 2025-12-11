# ✅ Schema Update Complete - Figma ERD Alignment

**Date:** Current  
**Status:** ✅ **ALL MODELS UPDATED TO MATCH FIGMA ERD**

---

## 🎉 Summary

All database models have been successfully updated to match the Figma ERD specifications. The schemas now follow the normalized structure with separate tables for related entities.

---

## ✅ New Models Created (8 models)

### 1. **PhotographyType** ✅
- Master list of 28 professional photography categories
- Fields: `name` (required, unique), `description`, `icon`
- File: `lib/models/PhotographyType.ts`

### 2. **PhotographerSpecialty** ✅
- Junction table linking photographers to photography types
- Fields: `photographer`, `photographyType`
- Unique constraint: (photographer, photographyType)
- File: `lib/models/PhotographerSpecialty.ts`

### 3. **Payment** ✅
- Separate payment table (one-to-one with booking)
- Fields: `booking` (unique), `amount`, `commission`, `paymentMethod`, `paymentStatus`, `stripePaymentId`, `paidAt`, `refundedAt`
- File: `lib/models/Payment.ts`

### 4. **Refund** ✅
- Refund processing with tiered policy
- Fields: `payment`, `booking`, `refundAmount`, `refundPercentage`, `refundPolicyTier`, `reason`, `status`, `processedAt`
- Refund tiers: full_refund, partial_refund_75, partial_refund_50, no_refund
- File: `lib/models/Refund.ts`

### 5. **Availability** ✅
- Photographer weekly availability schedule
- Fields: `photographer`, `dayOfWeek` (0-6), `startTime`, `endTime`, `isAvailable`
- Unique constraint: (photographer, dayOfWeek, startTime)
- File: `lib/models/Availability.ts`

### 6. **BlockedDate** ✅
- Specific dates when photographer is unavailable
- Fields: `photographer`, `date`, `reason`
- Unique constraint: (photographer, date)
- File: `lib/models/BlockedDate.ts`

### 7. **CollectionItem** ✅
- Junction table linking media to collections
- Fields: `collectionId`, `media`, `order`, `addedAt`
- Unique constraint: (collectionId, media)
- File: `lib/models/CollectionItem.ts`

### 8. **Media** ✅
- Photos and videos from bookings and portfolios (replaces Photo)
- Fields: `booking` (optional), `photographer` (required), `url` (required), `thumbnailUrl`, `type` (photo/video), `title`, `description`, `isPortfolio`
- File: `lib/models/Media.ts`

---

## 🔄 Updated Models (7 models)

### 1. **User** ✅
**Changes:**
- ✅ Made `firstName` and `lastName` **required** (max 100 chars)
- ✅ Added `emailVerified` field (required, default: false)
- ❌ Removed `specialties` (moved to PhotographerSpecialties)

### 2. **Photographer** ✅
**Changes:**
- ✅ Added `businessName` (max 255 chars)
- ✅ Added `yearsExperience` (INTEGER)
- ✅ Added `portfolioUrl` (TEXT)
- ✅ Added `instagramHandle` (max 100 chars)
- ✅ Made `locationCity` and `locationRegion` **required**
- ✅ Moved `hourlyRate` to top-level (from pricing object)
- ✅ Renamed `rating` to `averageRating` (DECIMAL(3,2))
- ❌ Removed `specialties` array (use PhotographerSpecialties junction table)
- ❌ Removed `availability` object (use Availability table)
- ❌ Removed `pricing` object (keep only hourlyRate)
- ❌ Removed `followers`, `following`, `totalEarnings`, `totalReviews`

### 3. **Booking** ✅
**Changes:**
- ✅ Added `photographyType` (required, FK to PhotographyType)
- ✅ Added `endTime` (required, TIME format)
- ✅ Added `locationCity` (required, max 100 chars)
- ✅ Renamed `location` to `locationAddress`
- ✅ Renamed `date` to `bookingDate`
- ✅ Changed pricing structure:
  - `totalAmount` (required)
  - `commissionAmount` (required, auto-calculated)
  - `photographerPayout` (required, auto-calculated)
- ✅ Renamed `notes` to `specialRequests`
- ✅ Updated status enum: added `in_progress`, `delivered`, `refunded`
- ❌ Removed embedded `payment` object (use separate Payment table)
- ❌ Removed `photos` array (use Media table)
- ❌ Removed `review` reference (handled separately)

### 4. **Review** ✅
**Changes:**
- ✅ Renamed `customer` to `client`
- ✅ Renamed `isPublic` to `isVisible`
- ✅ Made `comment` optional (was required)
- ❌ Removed `title` field
- ❌ Removed `categories` object (professionalism, communication, quality, punctuality)
- ❌ Removed `isVerified` field

### 5. **Collection** ✅
**Changes:**
- ✅ Renamed `user` to `client`
- ✅ Changed `coverPhoto` from ObjectId to String (TEXT/URL)
- ✅ Increased `name` max length to 255 chars
- ❌ Removed `photos` array (use CollectionItems junction table)

### 6. **Conversation** ✅
**Changes:**
- ✅ Added explicit `client` field (required)
- ✅ Added explicit `photographer` field (required)
- ❌ Removed `participants` array
- ❌ Removed `unreadCount` Map

### 7. **Message** ✅
**Changes:**
- ✅ Renamed `text` to `content`
- ✅ Changed `status` enum to `isRead` boolean
- ❌ Removed `attachments` array

---

## 📊 Updated Enums

### BookingStatus ✅
Added new statuses:
- `IN_PROGRESS` - Shoot is currently happening
- `DELIVERED` - Photos delivered to client
- `REFUNDED` - Payment refunded to client

### PaymentStatus ✅
Updated to match Figma ERD:
- `PENDING` - Payment initiated but not completed
- `PROCESSING` - Payment being processed by Stripe
- `SUCCEEDED` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded
- `PARTIALLY_REFUNDED` - Partial refund issued

### PaymentMethodType ✅
Added new methods:
- `APPLE_PAY`
- `GOOGLE_PAY`

### NotificationType ✅
Updated to match Figma ERD:
- `BOOKING_CONFIRMED` - Booking confirmed by photographer
- `MESSAGE_RECEIVED` - New message in conversation
- `PAYMENT_RECEIVED` - Payment processed successfully
- `REVIEW_RECEIVED` - New review posted
- `MEDIA_UPLOADED` - Photos/videos uploaded by photographer
- `SYSTEM_ANNOUNCEMENT` - Admin announcements

---

## 📁 Files Created/Updated

### New Model Files (8):
1. ✅ `lib/models/PhotographyType.ts`
2. ✅ `lib/models/PhotographerSpecialty.ts`
3. ✅ `lib/models/Payment.ts`
4. ✅ `lib/models/Refund.ts`
5. ✅ `lib/models/Availability.ts`
6. ✅ `lib/models/BlockedDate.ts`
7. ✅ `lib/models/CollectionItem.ts`
8. ✅ `lib/models/Media.ts`

### Updated Model Files (7):
1. ✅ `lib/models/User.ts`
2. ✅ `lib/models/Photographer.ts`
3. ✅ `lib/models/Booking.ts`
4. ✅ `lib/models/Review.ts`
5. ✅ `lib/models/Collection.ts`
6. ✅ `lib/models/Conversation.ts`
7. ✅ `lib/models/Message.ts`

### Updated Configuration Files:
1. ✅ `lib/constants/enums.ts` - Updated enums
2. ✅ `lib/models/index.ts` - Added new model exports

---

## 🔍 Key Structural Changes

### Normalization
- **Before:** Embedded objects (payment in Booking, availability in Photographer)
- **After:** Separate tables (Payment, Availability, BlockedDate)

### Junction Tables
- **PhotographerSpecialties:** Links photographers to photography types
- **CollectionItems:** Links media to collections with ordering

### Field Naming
- Updated to match Figma ERD conventions
- Some fields renamed for clarity (e.g., `customer` → `client`)

### Required Fields
- Made several optional fields required per ERD:
  - User: `firstName`, `lastName`
  - Photographer: `locationCity`, `locationRegion`
  - Booking: `photographyType`, `endTime`, `locationCity`

---

## ⚠️ Breaking Changes

### Models Removed/Replaced:
- `Photo` → `Media` (new structure)
- Embedded `payment` in Booking → Separate `Payment` table
- Embedded `availability` in Photographer → Separate `Availability` and `BlockedDate` tables
- `specialties` array in Photographer → `PhotographerSpecialties` junction table

### Field Changes:
- `User.specialties` - Removed
- `Photographer.specialties` - Removed (use PhotographerSpecialties)
- `Photographer.availability` - Removed (use Availability table)
- `Photographer.pricing` - Removed (keep only hourlyRate)
- `Booking.payment` - Removed (use Payment table)
- `Review.title` - Removed
- `Review.categories` - Removed
- `Collection.photos` - Removed (use CollectionItems)
- `Message.attachments` - Removed
- `Message.status` - Changed to `isRead` boolean

---

## ✅ Verification Checklist

- ✅ All 8 new models created
- ✅ All 7 existing models updated
- ✅ All enums updated
- ✅ All models exported from index.ts
- ✅ No linting errors
- ✅ All TypeScript interfaces defined
- ✅ All indexes created
- ✅ All unique constraints implemented
- ✅ All validation rules applied

---

## 🎯 Next Steps

1. **Update Validation Schemas** (TODO #17)
   - Create schemas for new models
   - Update existing schemas to match new structure

2. **Update API Routes**
   - Update existing routes to use new models
   - Create routes for new models

3. **Database Migration**
   - Plan migration strategy for existing data
   - Handle data transformation for breaking changes

4. **Testing**
   - Test all model operations
   - Verify relationships work correctly
   - Test business logic (commission calculation, rating updates)

---

## 📊 Model Statistics

**Total Models:** 20 models
- **New Models:** 8
- **Updated Models:** 7
- **Legacy Models:** 5 (kept for backward compatibility)

**Total Relationships:** All properly defined with references

**Total Indexes:** ~50+ indexes for performance

---

**Status:** ✅ **ALL MODELS UPDATED TO MATCH FIGMA ERD**

**Ready for:** Validation schema updates and API development


