# 📡 Complete API Structure - Lumira Platform

## Overview
This document outlines all API endpoints that will be built for the Lumira platform. APIs are organized by feature groups for systematic development.

**Base URL:** `/api`

---

## 🔐 1. Authentication APIs
**Base Path:** `/api/auth`

### 1.1 User Registration
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "customer" | "photographer",
    "phone": "string (optional)"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "user": { ... },
      "token": "string",
      "refreshToken": "string"
    }
  }
  ```

### 1.2 User Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Login with email and password
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": { ... },
      "token": "string",
      "refreshToken": "string"
    }
  }
  ```

### 1.3 Google OAuth Login
- **Endpoint:** `POST /api/auth/google`
- **Description:** Login/Register with Google OAuth
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "googleId": "string",
    "email": "string",
    "name": "string",
    "profilePicture": "string (optional)"
  }
  ```
- **Response:** `200 OK` (same as login)

### 1.4 Refresh Access Token
- **Endpoint:** `POST /api/auth/refresh`
- **Description:** Get new access token using refresh token
- **Auth Required:** No (but needs refresh token in body)
- **Request Body:**
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "token": "string",
      "refreshToken": "string"
    }
  }
  ```

### 1.5 Logout
- **Endpoint:** `POST /api/auth/logout`
- **Description:** Logout user (invalidate refresh token)
- **Auth Required:** Yes
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### 1.6 Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Description:** Get authenticated user's profile
- **Auth Required:** Yes
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": { ... }
    }
  }
  ```

### 1.7 Forgot Password
- **Endpoint:** `POST /api/auth/forgot-password`
- **Description:** Request password reset email
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```

### 1.8 Reset Password
- **Endpoint:** `POST /api/auth/reset-password`
- **Description:** Reset password using token
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "token": "string",
    "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

---

## 👤 2. User Management APIs
**Base Path:** `/api/users`

### 2.1 Get Current User Profile
- **Endpoint:** `GET /api/users/me`
- **Description:** Get authenticated user's full profile
- **Auth Required:** Yes
- **Response:** `200 OK`

### 2.2 Update User Profile
- **Endpoint:** `PUT /api/users/me`
- **Description:** Update user profile information
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "location": {
      "city": "string",
      "province": "string",
      "country": "string"
    }
  }
  ```
- **Response:** `200 OK`

### 2.3 Change Password
- **Endpoint:** `PATCH /api/users/me/password`
- **Description:** Change user password
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response:** `200 OK`

### 2.4 Update Avatar
- **Endpoint:** `PUT /api/users/me/avatar`
- **Description:** Update user avatar/profile picture
- **Auth Required:** Yes
- **Request Body:** FormData with image file
- **Response:** `200 OK`

### 2.5 Get User by ID (Public)
- **Endpoint:** `GET /api/users/:id`
- **Description:** Get public user profile
- **Auth Required:** No
- **Response:** `200 OK`

### 2.6 Get User Settings
- **Endpoint:** `GET /api/users/me/settings`
- **Description:** Get user settings
- **Auth Required:** Yes
- **Response:** `200 OK`

### 2.7 Update User Settings
- **Endpoint:** `PUT /api/users/me/settings`
- **Description:** Update user settings
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "emailNotifications": true,
    "messageNotifications": true,
    "promotionalEmails": false,
    "pushNotifications": true,
    "publicProfile": true,
    "showLocation": true,
    "showBookingHistory": true
  }
  ```
- **Response:** `200 OK`

---

## 💳 3. Payment Methods APIs
**Base Path:** `/api/users/me/payment-methods`

### 3.1 Get Payment Methods
- **Endpoint:** `GET /api/users/me/payment-methods`
- **Description:** Get user's saved payment methods
- **Auth Required:** Yes
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "paymentMethods": [...]
    }
  }
  ```

### 3.2 Add Payment Method
- **Endpoint:** `POST /api/users/me/payment-methods`
- **Description:** Add new payment method (Stripe integration)
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "paymentMethodId": "string (Stripe payment method ID)",
    "type": "credit_card" | "debit_card" | "bank_account",
    "isDefault": false
  }
  ```
- **Response:** `201 Created`

### 3.3 Remove Payment Method
- **Endpoint:** `DELETE /api/users/me/payment-methods/:id`
- **Description:** Remove payment method
- **Auth Required:** Yes
- **Response:** `200 OK`

### 3.4 Set Default Payment Method
- **Endpoint:** `PUT /api/users/me/payment-methods/:id/default`
- **Description:** Set payment method as default
- **Auth Required:** Yes
- **Response:** `200 OK`

---

## 📸 4. Photographer APIs
**Base Path:** `/api/photographers`

### 4.1 Create Photographer Profile
- **Endpoint:** `POST /api/photographers`
- **Description:** Create photographer profile (user must have photographer role)
- **Auth Required:** Yes (photographer role)
- **Request Body:**
  ```json
  {
    "bio": "string",
    "specialties": ["wedding", "portrait", ...],
    "location": {
      "city": "string",
      "province": "string",
      "address": "string"
    },
    "pricing": {
      "basePrice": 100,
      "hourlyRate": 50,
      "currency": "CAD"
    }
  }
  ```
- **Response:** `201 Created`

### 4.2 Get My Photographer Profile
- **Endpoint:** `GET /api/photographers/me`
- **Description:** Get authenticated photographer's profile
- **Auth Required:** Yes (photographer role)
- **Response:** `200 OK`

### 4.3 Update Photographer Profile
- **Endpoint:** `PUT /api/photographers/me`
- **Description:** Update photographer profile
- **Auth Required:** Yes (photographer role)
- **Request Body:** (same as create)
- **Response:** `200 OK`

### 4.4 Get Photographer by ID (Public)
- **Endpoint:** `GET /api/photographers/:id`
- **Description:** Get public photographer profile
- **Auth Required:** No
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "photographer": { ... },
      "user": { ... },
      "portfolio": [...],
      "reviews": [...],
      "rating": 4.5,
      "totalReviews": 25
    }
  }
  ```

### 4.5 Search/List Photographers
- **Endpoint:** `GET /api/photographers`
- **Description:** Search and filter photographers
- **Auth Required:** No
- **Query Parameters:**
  - `city` - Filter by city
  - `province` - Filter by province
  - `specialty` - Filter by specialty
  - `minRating` - Minimum rating
  - `maxPrice` - Maximum base price
  - `minPrice` - Minimum base price
  - `sortBy` - "rating" | "bookings" | "newest" | "price"
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "photographers": [...],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 50,
        "pages": 5
      }
    }
  }
  ```

### 4.6 Get Photographer Portfolio
- **Endpoint:** `GET /api/photographers/:id/portfolio`
- **Description:** Get photographer's portfolio photos
- **Auth Required:** No
- **Query Parameters:**
  - `limit` - Number of photos (default: 20)
  - `page` - Page number
- **Response:** `200 OK`

### 4.7 Add Photo to Portfolio
- **Endpoint:** `POST /api/photographers/me/portfolio`
- **Description:** Add photo to photographer's portfolio
- **Auth Required:** Yes (photographer role)
- **Request Body:** FormData with image file
- **Response:** `201 Created`

### 4.8 Remove Photo from Portfolio
- **Endpoint:** `DELETE /api/photographers/me/portfolio/:photoId`
- **Description:** Remove photo from portfolio
- **Auth Required:** Yes (photographer role)
- **Response:** `200 OK`

### 4.9 Get Photographer Availability
- **Endpoint:** `GET /api/photographers/:id/availability`
- **Description:** Get photographer's availability
- **Auth Required:** No
- **Query Parameters:**
  - `startDate` - Start date for availability check
  - `endDate` - End date for availability check
- **Response:** `200 OK`

### 4.10 Update Photographer Availability
- **Endpoint:** `PUT /api/photographers/me/availability`
- **Description:** Update working hours and availability
- **Auth Required:** Yes (photographer role)
- **Request Body:**
  ```json
  {
    "workingHours": {
      "monday": { "start": "09:00", "end": "17:00", "available": true },
      "tuesday": { "start": "09:00", "end": "17:00", "available": true },
      ...
    },
    "timeZone": "America/Montreal"
  }
  ```
- **Response:** `200 OK`

### 4.11 Block Dates
- **Endpoint:** `POST /api/photographers/me/availability/block`
- **Description:** Block specific dates
- **Auth Required:** Yes (photographer role)
- **Request Body:**
  ```json
  {
    "date": "2024-12-25",
    "reason": "Holiday"
  }
  ```
- **Response:** `201 Created`

### 4.12 Unblock Date
- **Endpoint:** `DELETE /api/photographers/me/availability/block/:id`
- **Description:** Remove blocked date
- **Auth Required:** Yes (photographer role)
- **Response:** `200 OK`

### 4.13 Get Photographer Pricing
- **Endpoint:** `GET /api/photographers/:id/pricing`
- **Description:** Get photographer's pricing structure
- **Auth Required:** No
- **Response:** `200 OK`

### 4.14 Update Photographer Pricing
- **Endpoint:** `PUT /api/photographers/me/pricing`
- **Description:** Update pricing structure
- **Auth Required:** Yes (photographer role)
- **Request Body:**
  ```json
  {
    "basePrice": 100,
    "hourlyRate": 50,
    "currency": "CAD",
    "packages": [
      {
        "name": "Basic",
        "duration": 2,
        "price": 200,
        "description": "2 hour session"
      }
    ]
  }
  ```
- **Response:** `200 OK`

### 4.15 Add Pricing Package
- **Endpoint:** `POST /api/photographers/me/pricing/packages`
- **Description:** Add new pricing package
- **Auth Required:** Yes (photographer role)
- **Request Body:**
  ```json
  {
    "name": "string",
    "duration": 2,
    "price": 200,
    "description": "string"
  }
  ```
- **Response:** `201 Created`

### 4.16 Update Pricing Package
- **Endpoint:** `PUT /api/photographers/me/pricing/packages/:id`
- **Description:** Update pricing package
- **Auth Required:** Yes (photographer role)
- **Response:** `200 OK`

### 4.17 Delete Pricing Package
- **Endpoint:** `DELETE /api/photographers/me/pricing/packages/:id`
- **Description:** Delete pricing package
- **Auth Required:** Yes (photographer role)
- **Response:** `200 OK`

### 4.18 Follow Photographer
- **Endpoint:** `POST /api/photographers/:id/follow`
- **Description:** Follow a photographer
- **Auth Required:** Yes
- **Response:** `200 OK`

### 4.19 Unfollow Photographer
- **Endpoint:** `DELETE /api/photographers/:id/follow`
- **Description:** Unfollow a photographer
- **Auth Required:** Yes
- **Response:** `200 OK`

### 4.20 Get Photographer Followers
- **Endpoint:** `GET /api/photographers/:id/followers`
- **Description:** Get photographer's followers list
- **Auth Required:** No
- **Response:** `200 OK`

### 4.21 Get Photographer Following
- **Endpoint:** `GET /api/photographers/:id/following`
- **Description:** Get photographers that this photographer follows
- **Auth Required:** No
- **Response:** `200 OK`

---

## 🖼️ 5. Photo APIs
**Base Path:** `/api/photos`

### 5.1 Upload Photo
- **Endpoint:** `POST /api/photos`
- **Description:** Upload a single photo
- **Auth Required:** Yes (photographer role)
- **Request Body:** FormData
  - `image` - Image file
  - `title` - Photo title (optional)
  - `description` - Description (optional)
  - `category` - Category (optional)
  - `tags` - Comma-separated tags (optional)
  - `isPortfolio` - Boolean (default: true)
  - `isPublic` - Boolean (default: true)
- **Response:** `201 Created`

### 5.2 Upload Multiple Photos
- **Endpoint:** `POST /api/photos/multiple`
- **Description:** Upload multiple photos at once
- **Auth Required:** Yes (photographer role)
- **Request Body:** FormData with multiple image files
- **Response:** `201 Created`

### 5.3 Get Photo Details
- **Endpoint:** `GET /api/photos/:id`
- **Description:** Get photo details
- **Auth Required:** No
- **Response:** `200 OK`

### 5.4 Update Photo
- **Endpoint:** `PUT /api/photos/:id`
- **Description:** Update photo details
- **Auth Required:** Yes (photo owner)
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "string",
    "tags": ["tag1", "tag2"],
    "isPublic": true
  }
  ```
- **Response:** `200 OK`

### 5.5 Delete Photo
- **Endpoint:** `DELETE /api/photos/:id`
- **Description:** Delete photo
- **Auth Required:** Yes (photo owner)
- **Response:** `200 OK`

### 5.6 List Photos
- **Endpoint:** `GET /api/photos`
- **Description:** List photos with filters
- **Auth Required:** No
- **Query Parameters:**
  - `photographer` - Filter by photographer ID
  - `category` - Filter by category
  - `tags` - Filter by tags
  - `isPublic` - Filter public photos only
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 5.7 Get Photographer's Photos
- **Endpoint:** `GET /api/photos/photographer/:photographerId`
- **Description:** Get all photos by a photographer
- **Auth Required:** No
- **Response:** `200 OK`

### 5.8 Favorite Photo
- **Endpoint:** `POST /api/photos/:id/favorite`
- **Description:** Add photo to favorites
- **Auth Required:** Yes
- **Response:** `200 OK`

### 5.9 Unfavorite Photo
- **Endpoint:** `DELETE /api/photos/:id/favorite`
- **Description:** Remove photo from favorites
- **Auth Required:** Yes
- **Response:** `200 OK`

### 5.10 Get My Favorites
- **Endpoint:** `GET /api/photos/me/favorites`
- **Description:** Get user's favorite photos
- **Auth Required:** Yes
- **Response:** `200 OK`

### 5.11 Like Photo
- **Endpoint:** `POST /api/photos/:id/like`
- **Description:** Like a photo
- **Auth Required:** Yes
- **Response:** `200 OK`

### 5.12 Unlike Photo
- **Endpoint:** `DELETE /api/photos/:id/like`
- **Description:** Unlike a photo
- **Auth Required:** Yes
- **Response:** `200 OK`

---

## 📅 6. Booking APIs
**Base Path:** `/api/bookings`

### 6.1 Create Booking
- **Endpoint:** `POST /api/bookings`
- **Description:** Create a new booking request
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "photographer": "ObjectId",
    "date": "2024-12-25",
    "startTime": "10:00",
    "duration": 2,
    "location": "123 Main St, Montreal, QC",
    "notes": "Outdoor shoot"
  }
  ```
- **Response:** `201 Created`

### 6.2 Get Booking Details
- **Endpoint:** `GET /api/bookings/:id`
- **Description:** Get booking details
- **Auth Required:** Yes (client or photographer)
- **Response:** `200 OK`

### 6.3 List Bookings
- **Endpoint:** `GET /api/bookings`
- **Description:** List bookings with filters
- **Auth Required:** Yes
- **Query Parameters:**
  - `status` - Filter by status
  - `photographer` - Filter by photographer
  - `client` - Filter by client
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 6.4 Get My Bookings
- **Endpoint:** `GET /api/bookings/me`
- **Description:** Get authenticated user's bookings
- **Auth Required:** Yes
- **Query Parameters:**
  - `status` - Filter by status
  - `role` - "client" | "photographer"
- **Response:** `200 OK`

### 6.5 Get Upcoming Bookings
- **Endpoint:** `GET /api/bookings/me/upcoming`
- **Description:** Get user's upcoming bookings
- **Auth Required:** Yes
- **Response:** `200 OK`

### 6.6 Get Past Bookings
- **Endpoint:** `GET /api/bookings/me/past`
- **Description:** Get user's past bookings
- **Auth Required:** Yes
- **Response:** `200 OK`

### 6.7 Get Photographer's Bookings
- **Endpoint:** `GET /api/bookings/photographer/:id`
- **Description:** Get all bookings for a photographer
- **Auth Required:** Yes (photographer or admin)
- **Response:** `200 OK`

### 6.8 Update Booking
- **Endpoint:** `PUT /api/bookings/:id`
- **Description:** Update booking details
- **Auth Required:** Yes (client or photographer)
- **Request Body:** (same as create, all fields optional)
- **Response:** `200 OK`

### 6.9 Accept Booking
- **Endpoint:** `POST /api/bookings/:id/accept`
- **Description:** Photographer accepts booking
- **Auth Required:** Yes (photographer)
- **Response:** `200 OK`

### 6.10 Decline Booking
- **Endpoint:** `POST /api/bookings/:id/decline`
- **Description:** Photographer declines booking
- **Auth Required:** Yes (photographer)
- **Request Body:**
  ```json
  {
    "reason": "string (optional)"
  }
  ```
- **Response:** `200 OK`

### 6.11 Cancel Booking
- **Endpoint:** `POST /api/bookings/:id/cancel`
- **Description:** Cancel booking (client or photographer)
- **Auth Required:** Yes (client or photographer)
- **Request Body:**
  ```json
  {
    "reason": "string (optional)"
  }
  ```
- **Response:** `200 OK`

### 6.12 Complete Booking
- **Endpoint:** `POST /api/bookings/:id/complete`
- **Description:** Mark booking as completed
- **Auth Required:** Yes (photographer)
- **Response:** `200 OK`

### 6.13 Calculate Booking Price
- **Endpoint:** `POST /api/bookings/calculate-price`
- **Description:** Calculate booking price before creating
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "photographer": "ObjectId",
    "duration": 2,
    "packageId": "ObjectId (optional)"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "subtotal": 200,
      "commission": 20,
      "total": 220,
      "photographerEarnings": 180
    }
  }
  ```

### 6.14 Get Booking Pricing
- **Endpoint:** `GET /api/bookings/:id/pricing`
- **Description:** Get booking pricing breakdown
- **Auth Required:** Yes (client or photographer)
- **Response:** `200 OK`

---

## ⭐ 7. Review APIs
**Base Path:** `/api/reviews`

### 7.1 Create Review
- **Endpoint:** `POST /api/reviews`
- **Description:** Create review for completed booking
- **Auth Required:** Yes (client)
- **Request Body:**
  ```json
  {
    "booking": "ObjectId",
    "rating": 5,
    "title": "string (optional)",
    "comment": "string",
    "categories": {
      "professionalism": 5,
      "communication": 5,
      "quality": 5,
      "punctuality": 5
    }
  }
  ```
- **Response:** `201 Created`

### 7.2 Get Review Details
- **Endpoint:** `GET /api/reviews/:id`
- **Description:** Get review details
- **Auth Required:** No
- **Response:** `200 OK`

### 7.3 Update Review
- **Endpoint:** `PUT /api/reviews/:id`
- **Description:** Update review (only by reviewer)
- **Auth Required:** Yes (reviewer)
- **Request Body:** (same as create, all fields optional)
- **Response:** `200 OK`

### 7.4 Delete Review
- **Endpoint:** `DELETE /api/reviews/:id`
- **Description:** Delete review
- **Auth Required:** Yes (reviewer or admin)
- **Response:** `200 OK`

### 7.5 Get Photographer Reviews
- **Endpoint:** `GET /api/reviews/photographer/:id`
- **Description:** Get all reviews for a photographer
- **Auth Required:** No
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 7.6 Get Booking Review
- **Endpoint:** `GET /api/reviews/booking/:id`
- **Description:** Get review for a specific booking
- **Auth Required:** No
- **Response:** `200 OK`

### 7.7 Get My Reviews
- **Endpoint:** `GET /api/reviews/me`
- **Description:** Get reviews written by authenticated user
- **Auth Required:** Yes
- **Response:** `200 OK`

---

## 💰 8. Transaction APIs
**Base Path:** `/api/transactions`

### 8.1 Create Transaction
- **Endpoint:** `POST /api/transactions`
- **Description:** Create a new transaction
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "type": "charge" | "refund" | "payout" | "commission",
    "amount": 220,
    "currency": "CAD",
    "description": "string",
    "booking": "ObjectId (optional)",
    "paymentMethod": "string"
  }
  ```
- **Response:** `201 Created`

### 8.2 Get Transaction Details
- **Endpoint:** `GET /api/transactions/:id`
- **Description:** Get transaction details
- **Auth Required:** Yes (owner or admin)
- **Response:** `200 OK`

### 8.3 List Transactions
- **Endpoint:** `GET /api/transactions`
- **Description:** List transactions with filters
- **Auth Required:** Yes (admin)
- **Query Parameters:**
  - `type` - Filter by type
  - `status` - Filter by status
  - `user` - Filter by user
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 8.4 Get My Transactions
- **Endpoint:** `GET /api/transactions/me`
- **Description:** Get authenticated user's transactions
- **Auth Required:** Yes
- **Response:** `200 OK`

### 8.5 Get Booking Transactions
- **Endpoint:** `GET /api/transactions/booking/:id`
- **Description:** Get transactions for a booking
- **Auth Required:** Yes (client or photographer)
- **Response:** `200 OK`

### 8.6 Process Refund
- **Endpoint:** `POST /api/transactions/:id/refund`
- **Description:** Process refund for a transaction
- **Auth Required:** Yes (admin or transaction owner)
- **Request Body:**
  ```json
  {
    "amount": 220,
    "reason": "string"
  }
  ```
- **Response:** `200 OK`

---

## 💵 9. Earning APIs
**Base Path:** `/api/earnings`

### 9.1 Get My Earnings
- **Endpoint:** `GET /api/earnings/me`
- **Description:** Get authenticated photographer's earnings
- **Auth Required:** Yes (photographer)
- **Query Parameters:**
  - `year` - Filter by year
  - `month` - Filter by month
- **Response:** `200 OK`

### 9.2 Get Monthly Earnings
- **Endpoint:** `GET /api/earnings/me/monthly`
- **Description:** Get monthly earnings breakdown
- **Auth Required:** Yes (photographer)
- **Query Parameters:**
  - `year` - Year (default: current year)
- **Response:** `200 OK`

### 9.3 Get Earnings Statistics
- **Endpoint:** `GET /api/earnings/me/stats`
- **Description:** Get earnings statistics
- **Auth Required:** Yes (photographer)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "totalEarnings": 5000,
      "totalCommission": 500,
      "pendingPayouts": 1000,
      "paidPayouts": 4000,
      "thisMonth": 500,
      "lastMonth": 600
    }
  }
  ```

---

## 💬 10. Messaging APIs
**Base Path:** `/api/conversations` and `/api/messages`

### 10.1 Create Conversation
- **Endpoint:** `POST /api/conversations`
- **Description:** Create or get existing conversation
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "participant": "ObjectId",
    "booking": "ObjectId (optional)"
  }
  ```
- **Response:** `201 Created` or `200 OK`

### 10.2 Get My Conversations
- **Endpoint:** `GET /api/conversations`
- **Description:** Get user's conversations
- **Auth Required:** Yes
- **Response:** `200 OK`

### 10.3 Get Conversation Details
- **Endpoint:** `GET /api/conversations/:id`
- **Description:** Get conversation with messages
- **Auth Required:** Yes (participant)
- **Response:** `200 OK`

### 10.4 Mark Conversation as Read
- **Endpoint:** `PUT /api/conversations/:id/read`
- **Description:** Mark all messages in conversation as read
- **Auth Required:** Yes (participant)
- **Response:** `200 OK`

### 10.5 Send Message
- **Endpoint:** `POST /api/conversations/:id/messages`
- **Description:** Send message in conversation
- **Auth Required:** Yes (participant)
- **Request Body:**
  ```json
  {
    "text": "string",
    "attachments": [
      {
        "type": "image" | "file" | "link",
        "url": "string",
        "filename": "string (optional)"
      }
    ]
  }
  ```
- **Response:** `201 Created`

### 10.6 Get Messages
- **Endpoint:** `GET /api/conversations/:id/messages`
- **Description:** Get messages in conversation
- **Auth Required:** Yes (participant)
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 10.7 Mark Message as Read
- **Endpoint:** `PUT /api/messages/:id/read`
- **Description:** Mark message as read
- **Auth Required:** Yes (recipient)
- **Response:** `200 OK`

---

## 🔔 11. Notification APIs
**Base Path:** `/api/notifications`

### 11.1 Get My Notifications
- **Endpoint:** `GET /api/notifications`
- **Description:** Get user's notifications
- **Auth Required:** Yes
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 11.2 Get Unread Notifications
- **Endpoint:** `GET /api/notifications/unread`
- **Description:** Get unread notifications count and list
- **Auth Required:** Yes
- **Response:** `200 OK`

### 11.3 Mark Notification as Read
- **Endpoint:** `PUT /api/notifications/:id/read`
- **Description:** Mark notification as read
- **Auth Required:** Yes
- **Response:** `200 OK`

### 11.4 Mark All as Read
- **Endpoint:** `PUT /api/notifications/read-all`
- **Description:** Mark all notifications as read
- **Auth Required:** Yes
- **Response:** `200 OK`

### 11.5 Delete Notification
- **Endpoint:** `DELETE /api/notifications/:id`
- **Description:** Delete notification
- **Auth Required:** Yes
- **Response:** `200 OK`

---

## 📚 12. Collection APIs
**Base Path:** `/api/collections`

### 12.1 Create Collection
- **Endpoint:** `POST /api/collections`
- **Description:** Create a new photo collection
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string (optional)",
    "isPublic": false
  }
  ```
- **Response:** `201 Created`

### 12.2 Get My Collections
- **Endpoint:** `GET /api/collections`
- **Description:** Get user's collections
- **Auth Required:** Yes
- **Response:** `200 OK`

### 12.3 Get Collection Details
- **Endpoint:** `GET /api/collections/:id`
- **Description:** Get collection with photos
- **Auth Required:** No (if public) or Yes (if private)
- **Response:** `200 OK`

### 12.4 Update Collection
- **Endpoint:** `PUT /api/collections/:id`
- **Description:** Update collection details
- **Auth Required:** Yes (owner)
- **Request Body:** (same as create)
- **Response:** `200 OK`

### 12.5 Delete Collection
- **Endpoint:** `DELETE /api/collections/:id`
- **Description:** Delete collection
- **Auth Required:** Yes (owner)
- **Response:** `200 OK`

### 12.6 Add Photo to Collection
- **Endpoint:** `POST /api/collections/:id/photos`
- **Description:** Add photo to collection
- **Auth Required:** Yes (owner)
- **Request Body:**
  ```json
  {
    "photo": "ObjectId"
  }
  ```
- **Response:** `200 OK`

### 12.7 Remove Photo from Collection
- **Endpoint:** `DELETE /api/collections/:id/photos/:photoId`
- **Description:** Remove photo from collection
- **Auth Required:** Yes (owner)
- **Response:** `200 OK`

### 12.8 Set Collection Cover Photo
- **Endpoint:** `PUT /api/collections/:id/cover`
- **Description:** Set cover photo for collection
- **Auth Required:** Yes (owner)
- **Request Body:**
  ```json
  {
    "photo": "ObjectId"
  }
  ```
- **Response:** `200 OK`

---

## 👨‍💼 13. Admin APIs
**Base Path:** `/api/admin`

### 13.1 List All Users
- **Endpoint:** `GET /api/admin/users`
- **Description:** Get all users with filters
- **Auth Required:** Yes (admin)
- **Query Parameters:**
  - `role` - Filter by role
  - `isActive` - Filter by active status
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 13.2 Get User Details (Admin)
- **Endpoint:** `GET /api/admin/users/:id`
- **Description:** Get full user details (admin view)
- **Auth Required:** Yes (admin)
- **Response:** `200 OK`

### 13.3 Suspend User
- **Endpoint:** `PUT /api/admin/users/:id/suspend`
- **Description:** Suspend user account
- **Auth Required:** Yes (admin)
- **Request Body:**
  ```json
  {
    "reason": "string"
  }
  ```
- **Response:** `200 OK`

### 13.4 Activate User
- **Endpoint:** `PUT /api/admin/users/:id/activate`
- **Description:** Activate suspended user
- **Auth Required:** Yes (admin)
- **Response:** `200 OK`

### 13.5 Delete User
- **Endpoint:** `DELETE /api/admin/users/:id`
- **Description:** Delete user account
- **Auth Required:** Yes (admin)
- **Response:** `200 OK`

### 13.6 List All Bookings
- **Endpoint:** `GET /api/admin/bookings`
- **Description:** Get all bookings
- **Auth Required:** Yes (admin)
- **Query Parameters:**
  - `status` - Filter by status
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 13.7 Process Refund (Admin)
- **Endpoint:** `POST /api/admin/bookings/:id/refund`
- **Description:** Process refund for booking
- **Auth Required:** Yes (admin)
- **Request Body:**
  ```json
  {
    "amount": 220,
    "reason": "string"
  }
  ```
- **Response:** `200 OK`

### 13.8 Get Admin Logs
- **Endpoint:** `GET /api/admin/logs`
- **Description:** Get admin action logs
- **Auth Required:** Yes (admin)
- **Query Parameters:**
  - `admin` - Filter by admin
  - `action` - Filter by action type
  - `page` - Page number
  - `limit` - Items per page
- **Response:** `200 OK`

### 13.9 Create Admin Log
- **Endpoint:** `POST /api/admin/logs`
- **Description:** Create admin action log
- **Auth Required:** Yes (admin)
- **Request Body:**
  ```json
  {
    "action": "user_suspended",
    "entityType": "user",
    "entityId": "ObjectId",
    "reason": "string"
  }
  ```
- **Response:** `201 Created`

---

## 📊 API Response Standards

### Success Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "string (optional)"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

### Pagination Format
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 🔒 Authentication & Authorization

### Authentication
- Most endpoints require JWT token in `Authorization` header
- Format: `Authorization: Bearer <token>`
- Token obtained from `/api/auth/login` or `/api/auth/register`

### Authorization Levels
1. **Public** - No authentication required
2. **User** - Any authenticated user
3. **Photographer** - User with photographer role
4. **Admin** - User with admin role
5. **Owner** - User owns the resource

---

## 📝 Implementation Order

### Phase 1: Core Authentication (Week 1)
1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/auth/me
4. POST /api/auth/refresh
5. POST /api/auth/logout

### Phase 2: User Management (Week 1-2)
6. GET /api/users/me
7. PUT /api/users/me
8. PATCH /api/users/me/password
9. GET /api/users/me/settings
10. PUT /api/users/me/settings

### Phase 3: Photographer Features (Week 2-3)
11. POST /api/photographers
12. GET /api/photographers/me
13. PUT /api/photographers/me
14. GET /api/photographers/:id
15. GET /api/photographers (search)

### Phase 4: Booking System (Week 3-4)
16. POST /api/bookings
17. GET /api/bookings/me
18. POST /api/bookings/:id/accept
19. POST /api/bookings/:id/decline
20. POST /api/bookings/:id/complete

### Phase 5: Reviews & Transactions (Week 4)
21. POST /api/reviews
22. GET /api/reviews/photographer/:id
23. POST /api/transactions
24. GET /api/transactions/me

### Phase 6: Additional Features (Week 5+)
25. Photo upload APIs
26. Messaging APIs
27. Notification APIs
28. Collection APIs
29. Admin APIs

---

## 🧪 Testing Strategy

### For Each API:
1. ✅ Test successful request
2. ✅ Test validation errors
3. ✅ Test authentication errors
4. ✅ Test authorization errors
5. ✅ Test edge cases
6. ✅ Test pagination (if applicable)

### Testing Tools:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Automated tests (Jest)

---

## 📌 Notes

- All dates should be in ISO 8601 format
- All ObjectIds should be valid MongoDB ObjectIds
- File uploads use FormData (multipart/form-data)
- Pagination defaults: page=1, limit=10
- All timestamps are in UTC
- Rate limiting should be implemented for production

---

**Total APIs:** ~100+ endpoints  
**Estimated Development Time:** 2-3 weeks for all APIs

