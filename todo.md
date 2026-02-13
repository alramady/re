# Ijar - Monthly Rental Platform TODO

## Foundation
- [x] Database schema (users, properties, bookings, messages, maintenance, payments)
- [x] i18n system with Arabic/English translations
- [x] RTL-first layout system with LTR toggle
- [x] Saudi-inspired design system (colors, typography, theming)
- [x] Google Fonts setup (Tajawal + Inter)

## Property Listings
- [x] Property listing CRUD (create, read, update, delete)
- [x] Photo upload with S3 storage
- [x] Amenities checklist with icons
- [x] Pricing configuration (monthly rent, deposit, utilities)
- [x] Availability calendar (backend)
- [x] Location mapping with Google Maps integration
- [x] Property types (apartment, villa, studio, duplex, furnished room, compound, hotel apartment)

## Search & Discovery
- [x] Advanced search filters (location, price, type, amenities, date)
- [x] Grid/list view toggle
- [x] Map-based search view
- [x] Save favorites
- [x] Saved searches (backend)

## Tenant Dashboard
- [x] Bookings tab with status tracking
- [x] Payment history
- [x] Favorites tab
- [x] Maintenance requests tab
- [x] Notifications tab

## Landlord Dashboard
- [x] Property portfolio overview with stats
- [x] Listing management (create, view, edit)
- [x] Booking request management (approve/reject with reasons)
- [x] Tenant communication link
- [x] Revenue stats
- [x] Maintenance request management (acknowledge, start work, complete)

## Admin Dashboard
- [x] Platform overview (users, properties, bookings, revenue)
- [x] User management with role badges
- [x] Property moderation (approve/reject listings)
- [x] Booking overview

## Booking Flow
- [x] 4-step booking process (details, cost review, confirm, success)
- [x] Duration selection with min/max stay
- [x] Cost breakdown (rent, deposit, service fee)
- [x] Booking confirmation workflow

## Messaging System
- [x] Conversation list with chat interface
- [x] Message sending and receiving
- [x] Auto-refresh polling
- [x] Mobile-responsive layout

## Maintenance Requests
- [x] Request submission with photo uploads
- [x] Priority levels (low, medium, high, emergency)
- [x] Category selection (plumbing, electrical, HVAC, etc.)
- [x] Status tracking (submitted, acknowledged, in-progress, completed)
- [x] Landlord response workflow

## Payments
- [ ] Stripe integration setup
- [ ] Rent payment processing
- [ ] Security deposit handling
- [ ] Service fee collection
- [x] Payment tracking (backend)

## Landing Page
- [x] Hero section with search
- [x] Stats section
- [x] How it works section
- [x] Popular cities section
- [x] Footer with links

## Testing
- [x] Vitest tests for all routers (25 tests passing)

## Navigation & Routes
- [x] All routes registered in App.tsx
- [x] Navbar with all navigation links
- [x] Language toggle (AR/EN)
- [x] User profile dropdown

## Integration Tests (Real DB)
- [x] Real integration tests connecting to actual database (78 tests)
- [x] Test property CRUD lifecycle (create → read → update → delete)
- [x] Test booking lifecycle (create → approve → complete)
- [x] Test messaging lifecycle (create conversation → send messages → read)
- [x] Test maintenance request lifecycle (create → acknowledge → complete)
- [x] Test favorites (add → check → remove)
- [x] Test notifications (create → read → mark read)
- [x] Test user profile update
- [x] Test admin operations (stats, user management, property approval)
- [x] Test reviews and saved searches

## Local Authentication System
- [x] Remove Manus OAuth completely
- [x] Add userId/passwordHash columns to users table with bcrypt
- [x] Build login API endpoint (/api/auth/login with JWT cookie session)
- [x] Build register API endpoint (/api/auth/register)
- [x] Build login page UI (Arabic/English)
- [x] Build register page UI (Arabic/English)
- [x] Update useAuth hook for local auth
- [x] Seed admin account (Hobart / 15001500)
- [x] Update Navbar with login/register links
- [x] All 103 tests passing (78 integration + 24 unit + 1 auth)
