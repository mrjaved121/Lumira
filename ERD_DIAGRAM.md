# Lumira ERD - Visual Diagram

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER                                     │
├─────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                              │
│ name: String                                                    │
│ firstName: String                                               │
│ lastName: String                                                │
│ email: String (UNIQUE)                                          │
│ password: String (hashed)                                       │
│ googleId: String (UNIQUE, sparse)                               │
│ phone: String                                                   │
│ role: Enum [photographer, customer, admin]                      │
│ specialties: [String]                                           │
│ profilePicture: String                                          │
│ avatar: String                                                  │
│ location: {city, province, country}                              │
│ paymentMethods: [{type, stripeId, last4, ...}]                  │
│ settings: {emailNotifications, ...}                             │
│ isActive: Boolean                                               │
│ createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │ 1:1                │ 1:N                │ 1:N
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  PHOTOGRAPHER    │  │     BOOKING     │  │   TRANSACTION    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ _id: ObjectId (PK)│  │ _id: ObjectId (PK)│  │ _id: ObjectId (PK)│
│ user: ObjectId (FK)│ │ client: ObjectId │  │ user: ObjectId   │
│ bio: String       │  │ photographer: FK │  │ type: Enum       │
│ location: Object  │  │ date: Date       │  │ amount: Number   │
│ specialties: []  │  │ startTime: String│  │ status: Enum     │
│ portfolio: [FK]  │  │ duration: Number │  │ booking: ObjectId│
│ rating: Number   │  │ status: Enum     │  │ transactionId    │
│ totalReviews: N  │  │ pricing: Object  │  │ createdAt, ...   │
│ totalBookings: N │  │ payment: Object  │  └──────────────────┘
│ followers: [FK]  │  │ photos: [FK]     │
│ following: [FK]  │  │ review: ObjectId│
│ availability: {} │  │ createdAt, ...  │
│ pricing: {}      │  └──────────────────┘
│ isVerified: Bool │         │
│ createdAt, ...   │         │ 1:1
└──────────────────┘         │
         │                   ▼
         │ 1:N        ┌──────────────────┐
         │            │     REVIEW       │
         ▼            ├──────────────────┤
┌──────────────────┐  │ _id: ObjectId (PK)│
│      PHOTO       │  │ booking: ObjectId │
├──────────────────┤  │ photographer: FK │
│ _id: ObjectId (PK)│  │ customer: ObjectId│
│ photographer: FK │  │ rating: Number   │
│ title: String    │  │ comment: String │
│ imageUrl: String │  │ categories: {}  │
│ category: String │  │ isPublic: Bool  │
│ tags: [String]   │  │ createdAt, ...  │
│ favorites: [FK]  │  └──────────────────┘
│ likes: Number    │
│ views: Number    │
│ collection: FK   │
│ booking: FK      │
│ isPublic: Bool   │
│ createdAt, ...   │
└──────────────────┘
         │
         │ N:1
         ▼
┌──────────────────┐
│   COLLECTION     │
├──────────────────┤
│ _id: ObjectId (PK)│
│ user: ObjectId   │
│ name: String     │
│ photos: [FK]     │
│ coverPhoto: FK   │
│ isPublic: Bool   │
│ createdAt, ...   │
└──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CONVERSATION                                  │
├─────────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PK)                                              │
│ participants: [ObjectId] (FK to User)                            │
│ booking: ObjectId (FK, optional)                                 │
│ lastMessage: ObjectId (FK)                                       │
│ lastMessageAt: Date                                              │
│ unreadCount: Map                                                 │
│ createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│     MESSAGE      │
├──────────────────┤
│ _id: ObjectId (PK)│
│ conversation: FK │
│ sender: ObjectId │
│ text: String     │
│ status: Enum     │
│ attachments: []  │
│ createdAt, ...   │
└──────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   EARNING        │         │  NOTIFICATION    │
├──────────────────┤         ├──────────────────┤
│ _id: ObjectId (PK)│         │ _id: ObjectId (PK)│
│ photographer: FK │         │ user: ObjectId   │
│ booking: ObjectId│         │ type: Enum      │
│ month: Number    │         │ title: String   │
│ year: Number     │         │ message: String │
│ totalAmount: Num │         │ isRead: Boolean │
│ commission: Num  │         │ actionUrl: String│
│ earnings: Number │         │ createdAt, ...  │
│ payoutStatus: E  │         └──────────────────┘
│ createdAt, ...   │
└──────────────────┘

┌──────────────────┐
│   ADMIN LOG      │
├──────────────────┤
│ _id: ObjectId (PK)│
│ admin: ObjectId  │
│ action: Enum     │
│ entityType: Enum │
│ entityId: ObjectId│
│ reason: String   │
│ metadata: Map    │
│ createdAt, ...   │
└──────────────────┘
```

## Relationship Cardinality

### One-to-One (1:1)
- User ↔ Photographer (if role is photographer)
- Booking ↔ Review
- Booking ↔ Earning
- Booking ↔ Conversation (optional)

### One-to-Many (1:N)
- User → Booking (as client)
- User → Review (as customer)
- User → Transaction
- User → Notification
- User → Collection
- User → Message (as sender)
- User → AdminLog (as admin)
- Photographer → Booking (as photographer)
- Photographer → Review (as photographer)
- Photographer → Photo
- Photographer → Earning
- Booking → Photo
- Booking → Transaction
- Collection → Photo
- Conversation → Message

### Many-to-Many (N:M)
- User ↔ User (through Photographer.followers/following)
- User ↔ Photo (through Photo.favorites)
- User ↔ Conversation (through Conversation.participants)

## Key Constraints

1. **Unique Constraints:**
   - User.email
   - User.googleId (sparse)
   - Photographer.user (one photographer per user)
   - Booking.review (one review per booking)
   - Booking.earning (one earning per booking)

2. **Required Fields:**
   - User: name, email, role
   - Photographer: user, specialties (min 1)
   - Booking: client, photographer, date, startTime, duration, location
   - Review: booking, photographer, customer, rating, comment
   - Photo: photographer, imageUrl
   - Message: conversation, sender, text

3. **Enums:**
   - User.role: `photographer`, `customer`, `admin`
   - Booking.status: `pending`, `confirmed`, `cancelled`, `completed`, `declined`
   - Transaction.type: `charge`, `refund`, `payout`, `commission`
   - Transaction.status: `pending`, `processing`, `completed`, `failed`, `cancelled`
   - Message.status: `sent`, `delivered`, `read`
