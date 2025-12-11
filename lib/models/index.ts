/**
 * Central export file for all models
 * Import models from here to avoid circular dependencies
 * Based on Figma ERD
 */

// Core models
export { default as User } from './User';
export { default as Photographer } from './Photographer';
export { default as PhotographyType } from './PhotographyType';
export { default as PhotographerSpecialty } from './PhotographerSpecialty';

// Booking and payment models
export { default as Booking } from './Booking';
export { default as Payment } from './Payment';
export { default as Refund } from './Refund';

// Media and collection models
export { default as Media } from './Media';
export { default as Collection } from './Collection';
export { default as CollectionItem } from './CollectionItem';

// Availability models
export { default as Availability } from './Availability';
export { default as BlockedDate } from './BlockedDate';

// Communication models
export { default as Conversation } from './Conversation';
export { default as Message } from './Message';

// Review and notification models
export { default as Review } from './Review';
export { default as Notification } from './Notification';

// Legacy models (for backward compatibility)
export { default as Photo } from './Photo';
export { default as Transaction } from './Transaction';
export { default as Earning } from './Earning';
export { default as AdminLog } from './AdminLog';

