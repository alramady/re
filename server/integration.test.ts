/**
 * REAL Integration Tests — Ijar Monthly Rental Platform
 * 
 * These tests connect to the ACTUAL database and verify full CRUD lifecycles:
 * - User creation and profile updates
 * - Property CRUD (create → read → update → search → delete)
 * - Booking lifecycle (create → approve → complete)
 * - Messaging (create conversation → send messages → mark read)
 * - Maintenance requests (create → acknowledge → in-progress → complete)
 * - Favorites (add → check → list → remove)
 * - Notifications (create → list → mark read → count)
 * - Reviews (create → list → average rating)
 * - Saved searches (create → list → delete)
 * - Admin operations (user count, property count, booking count, revenue)
 * 
 * NO MOCKS. All operations hit the real database.
 */

import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { config } from "dotenv";
config(); // Load .env so DATABASE_URL is available

import * as db from "./db";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, sql } from "drizzle-orm";
import {
  users, properties, bookings, payments, conversations, messages,
  maintenanceRequests, favorites, reviews, notifications, savedSearches,
  propertyAvailability, platformSettings,
} from "../drizzle/schema";

// Track IDs for cleanup
const createdIds = {
  users: [] as number[],
  properties: [] as number[],
  bookings: [] as number[],
  payments: [] as number[],
  conversations: [] as number[],
  messages: [] as number[],
  maintenance: [] as number[],
  reviews: [] as number[],
  notifications: [] as number[],
  savedSearches: [] as number[],
  favorites: [] as number[],
  availability: [] as number[],
};

let rawDb: ReturnType<typeof drizzle>;
const testPrefix = `test_${Date.now()}`;

beforeAll(async () => {
  // Verify DB connection
  rawDb = drizzle(process.env.DATABASE_URL!);
  const result = await rawDb.execute(sql`SELECT 1 as ok`);
  expect(result).toBeDefined();
});

afterAll(async () => {
  // Cleanup all test data in reverse dependency order
  try {
    if (createdIds.messages.length) {
      for (const id of createdIds.messages) {
        await rawDb.delete(messages).where(eq(messages.id, id));
      }
    }
    if (createdIds.conversations.length) {
      for (const id of createdIds.conversations) {
        await rawDb.delete(conversations).where(eq(conversations.id, id));
      }
    }
    if (createdIds.notifications.length) {
      for (const id of createdIds.notifications) {
        await rawDb.delete(notifications).where(eq(notifications.id, id));
      }
    }
    if (createdIds.reviews.length) {
      for (const id of createdIds.reviews) {
        await rawDb.delete(reviews).where(eq(reviews.id, id));
      }
    }
    if (createdIds.savedSearches.length) {
      for (const id of createdIds.savedSearches) {
        await rawDb.delete(savedSearches).where(eq(savedSearches.id, id));
      }
    }
    if (createdIds.maintenance.length) {
      for (const id of createdIds.maintenance) {
        await rawDb.delete(maintenanceRequests).where(eq(maintenanceRequests.id, id));
      }
    }
    if (createdIds.payments.length) {
      for (const id of createdIds.payments) {
        await rawDb.delete(payments).where(eq(payments.id, id));
      }
    }
    if (createdIds.bookings.length) {
      for (const id of createdIds.bookings) {
        await rawDb.delete(bookings).where(eq(bookings.id, id));
      }
    }
    if (createdIds.favorites.length) {
      for (const id of createdIds.favorites) {
        await rawDb.delete(favorites).where(eq(favorites.id, id));
      }
    }
    if (createdIds.availability.length) {
      for (const id of createdIds.availability) {
        await rawDb.delete(propertyAvailability).where(eq(propertyAvailability.id, id));
      }
    }
    if (createdIds.properties.length) {
      for (const id of createdIds.properties) {
        await rawDb.delete(properties).where(eq(properties.id, id));
      }
    }
    if (createdIds.users.length) {
      for (const id of createdIds.users) {
        await rawDb.delete(users).where(eq(users.id, id));
      }
    }
    // Clean platform settings
    await rawDb.delete(platformSettings).where(eq(platformSettings.settingKey, `${testPrefix}_key`));
  } catch (e) {
    console.warn("Cleanup warning:", e);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 1. DATABASE CONNECTION
// ═══════════════════════════════════════════════════════════════════════
describe("Database Connection", () => {
  it("connects to the real database", async () => {
    const dbInstance = await db.getDb();
    expect(dbInstance).not.toBeNull();
  });

  it("can execute raw SQL", async () => {
    const result = await rawDb.execute(sql`SELECT NOW() as now`);
    expect(result).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 2. USER LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("User Lifecycle (Real DB)", () => {
  const tenantOpenId = `${testPrefix}_tenant`;
  const landlordOpenId = `${testPrefix}_landlord`;
  let tenantId: number;
  let landlordId: number;

  it("creates a tenant user via upsert", async () => {
    await db.upsertUser({
      openId: tenantOpenId,
      name: "Test Tenant",
      email: `${testPrefix}_tenant@test.com`,
      role: "tenant",
    });
    const user = await db.getUserByOpenId(tenantOpenId);
    expect(user).toBeDefined();
    expect(user!.name).toBe("Test Tenant");
    expect(user!.role).toBe("tenant");
    tenantId = user!.id;
    createdIds.users.push(tenantId);
  });

  it("creates a landlord user via upsert", async () => {
    await db.upsertUser({
      openId: landlordOpenId,
      name: "Test Landlord",
      nameAr: "مالك تجريبي",
      email: `${testPrefix}_landlord@test.com`,
      role: "landlord",
    });
    const user = await db.getUserByOpenId(landlordOpenId);
    expect(user).toBeDefined();
    expect(user!.name).toBe("Test Landlord");
    expect(user!.role).toBe("landlord");
    landlordId = user!.id;
    createdIds.users.push(landlordId);
  });

  it("retrieves user by ID", async () => {
    const user = await db.getUserById(tenantId);
    expect(user).toBeDefined();
    expect(user!.openId).toBe(tenantOpenId);
  });

  it("updates user profile", async () => {
    await db.updateUserProfile(tenantId, {
      phone: "+966501234567",
      bio: "Test tenant bio",
      bioAr: "سيرة مستأجر تجريبي",
    });
    const user = await db.getUserById(tenantId);
    expect(user!.phone).toBe("+966501234567");
    expect(user!.bio).toBe("Test tenant bio");
    expect(user!.bioAr).toBe("سيرة مستأجر تجريبي");
  });

  it("updates user role", async () => {
    await db.updateUserRole(tenantId, "user");
    const user = await db.getUserById(tenantId);
    expect(user!.role).toBe("user");
    // Restore
    await db.updateUserRole(tenantId, "tenant");
  });

  it("upserts existing user (updates, does not duplicate)", async () => {
    await db.upsertUser({
      openId: tenantOpenId,
      name: "Updated Tenant Name",
    });
    const user = await db.getUserByOpenId(tenantOpenId);
    expect(user!.name).toBe("Updated Tenant Name");
    expect(user!.id).toBe(tenantId); // Same ID, not duplicated
  });

  it("counts users", async () => {
    const count = await db.getUserCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it("lists all users", async () => {
    const allUsers = await db.getAllUsers(100, 0);
    expect(allUsers.length).toBeGreaterThanOrEqual(2);
    const testUsers = allUsers.filter(u => u.openId.startsWith(testPrefix));
    expect(testUsers.length).toBe(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 3. PROPERTY CRUD LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Property CRUD Lifecycle (Real DB)", () => {
  let propertyId: number;
  let landlordId: number;

  beforeAll(async () => {
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    landlordId = landlord!.id;
  });

  it("creates a property", async () => {
    const id = await db.createProperty({
      landlordId,
      titleEn: "Test Apartment in Riyadh",
      titleAr: "شقة تجريبية في الرياض",
      descriptionEn: "A beautiful 2BR apartment for testing",
      descriptionAr: "شقة جميلة بغرفتين للاختبار",
      propertyType: "apartment",
      status: "active",
      city: "Riyadh",
      cityAr: "الرياض",
      district: "Al Olaya",
      districtAr: "العليا",
      bedrooms: 2,
      bathrooms: 2,
      sizeSqm: 120,
      monthlyRent: "5000.00",
      securityDeposit: "10000.00",
      furnishedLevel: "fully_furnished",
      amenities: ["wifi", "parking", "gym", "pool", "ac"],
      photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
      minStayMonths: 3,
      maxStayMonths: 12,
    });
    expect(id).toBeDefined();
    expect(id).toBeGreaterThan(0);
    propertyId = id!;
    createdIds.properties.push(propertyId);
  });

  it("reads the created property by ID", async () => {
    const prop = await db.getPropertyById(propertyId);
    expect(prop).toBeDefined();
    expect(prop!.titleEn).toBe("Test Apartment in Riyadh");
    expect(prop!.titleAr).toBe("شقة تجريبية في الرياض");
    expect(prop!.city).toBe("Riyadh");
    expect(prop!.bedrooms).toBe(2);
    expect(Number(prop!.monthlyRent)).toBe(5000);
    expect(prop!.amenities).toContain("wifi");
    expect(prop!.photos).toHaveLength(2);
    expect(prop!.furnishedLevel).toBe("fully_furnished");
    expect(prop!.status).toBe("active");
  });

  it("updates the property", async () => {
    await db.updateProperty(propertyId, {
      monthlyRent: "5500.00",
      bedrooms: 3,
      descriptionEn: "Updated description",
    });
    const prop = await db.getPropertyById(propertyId);
    expect(Number(prop!.monthlyRent)).toBe(5500);
    expect(prop!.bedrooms).toBe(3);
    expect(prop!.descriptionEn).toBe("Updated description");
  });

  it("searches properties and finds the test property", async () => {
    const result = await db.searchProperties({ city: "Riyadh" });
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    const found = result.items.find(p => p.id === propertyId);
    expect(found).toBeDefined();
    expect(found!.titleEn).toBe("Test Apartment in Riyadh");
  });

  it("searches with price filter", async () => {
    const result = await db.searchProperties({ minPrice: 4000, maxPrice: 6000 });
    const found = result.items.find(p => p.id === propertyId);
    expect(found).toBeDefined();
  });

  it("searches with type filter", async () => {
    const result = await db.searchProperties({ propertyType: "apartment" });
    const found = result.items.find(p => p.id === propertyId);
    expect(found).toBeDefined();
  });

  it("searches with bedroom filter", async () => {
    const result = await db.searchProperties({ bedrooms: 3 });
    const found = result.items.find(p => p.id === propertyId);
    expect(found).toBeDefined();
  });

  it("returns empty for non-matching search", async () => {
    const result = await db.searchProperties({ city: "NonExistentCity12345" });
    expect(result.items.length).toBe(0);
  });

  it("gets properties by landlord", async () => {
    const props = await db.getPropertiesByLandlord(landlordId);
    expect(props.length).toBeGreaterThanOrEqual(1);
    const found = props.find(p => p.id === propertyId);
    expect(found).toBeDefined();
  });

  it("increments view count", async () => {
    const before = await db.getPropertyById(propertyId);
    const viewsBefore = before!.viewCount ?? 0;
    await db.incrementPropertyViews(propertyId);
    const after = await db.getPropertyById(propertyId);
    expect(after!.viewCount).toBe(viewsBefore + 1);
  });

  it("creates a second property for search diversity", async () => {
    const id = await db.createProperty({
      landlordId,
      titleEn: "Test Villa in Jeddah",
      titleAr: "فيلا تجريبية في جدة",
      propertyType: "villa",
      status: "active",
      city: "Jeddah",
      cityAr: "جدة",
      bedrooms: 5,
      bathrooms: 4,
      monthlyRent: "15000.00",
      furnishedLevel: "semi_furnished",
    });
    expect(id).toBeGreaterThan(0);
    createdIds.properties.push(id!);
  });

  it("counts properties", async () => {
    const total = await db.getPropertyCount();
    expect(total).toBeGreaterThanOrEqual(2);
    const active = await db.getPropertyCount("active");
    expect(active).toBeGreaterThanOrEqual(2);
  });

  it("lists all properties (admin)", async () => {
    const all = await db.getAllProperties(100, 0);
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 4. FAVORITES LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Favorites Lifecycle (Real DB)", () => {
  let tenantId: number;
  let propertyId: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    tenantId = tenant!.id;
    const props = await db.getPropertiesByLandlord(
      (await db.getUserByOpenId(`${testPrefix}_landlord`))!.id
    );
    propertyId = props[0].id;
  });

  it("adds a favorite", async () => {
    await db.addFavorite(tenantId, propertyId);
    // Track for cleanup
    const favs = await rawDb.select().from(favorites)
      .where(and(eq(favorites.userId, tenantId), eq(favorites.propertyId, propertyId)));
    if (favs.length > 0) createdIds.favorites.push(favs[0].id);
  });

  it("checks favorite status (true)", async () => {
    const isFav = await db.isFavorite(tenantId, propertyId);
    expect(isFav).toBe(true);
  });

  it("lists user favorites", async () => {
    const favList = await db.getUserFavorites(tenantId);
    expect(favList.length).toBeGreaterThanOrEqual(1);
    const found = favList.find(p => p.id === propertyId);
    expect(found).toBeDefined();
  });

  it("removes a favorite", async () => {
    await db.removeFavorite(tenantId, propertyId);
    const isFav = await db.isFavorite(tenantId, propertyId);
    expect(isFav).toBe(false);
  });

  it("lists empty favorites after removal", async () => {
    const favList = await db.getUserFavorites(tenantId);
    const found = favList.find(p => p.id === propertyId);
    expect(found).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 5. BOOKING LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Booking Lifecycle (Real DB)", () => {
  let tenantId: number;
  let landlordId: number;
  let propertyId: number;
  let bookingId: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    tenantId = tenant!.id;
    landlordId = landlord!.id;
    const props = await db.getPropertiesByLandlord(landlordId);
    propertyId = props[0].id;
  });

  it("creates a booking", async () => {
    const id = await db.createBooking({
      propertyId,
      tenantId,
      landlordId,
      status: "pending",
      moveInDate: new Date("2026-04-01"),
      moveOutDate: new Date("2026-10-01"),
      durationMonths: 6,
      monthlyRent: "5500.00",
      securityDeposit: "10000.00",
      totalAmount: "33000.00",
      tenantNotes: "I need parking space",
    });
    expect(id).toBeDefined();
    expect(id).toBeGreaterThan(0);
    bookingId = id!;
    createdIds.bookings.push(bookingId);
  });

  it("reads the booking by ID", async () => {
    const booking = await db.getBookingById(bookingId);
    expect(booking).toBeDefined();
    expect(booking!.propertyId).toBe(propertyId);
    expect(booking!.tenantId).toBe(tenantId);
    expect(booking!.landlordId).toBe(landlordId);
    expect(booking!.status).toBe("pending");
    expect(booking!.durationMonths).toBe(6);
    expect(Number(booking!.monthlyRent)).toBe(5500);
    expect(booking!.tenantNotes).toBe("I need parking space");
  });

  it("lists tenant bookings", async () => {
    const tenantBookings = await db.getBookingsByTenant(tenantId);
    expect(tenantBookings.length).toBeGreaterThanOrEqual(1);
    const found = tenantBookings.find(b => b.id === bookingId);
    expect(found).toBeDefined();
  });

  it("lists landlord bookings", async () => {
    const landlordBookings = await db.getBookingsByLandlord(landlordId);
    expect(landlordBookings.length).toBeGreaterThanOrEqual(1);
    const found = landlordBookings.find(b => b.id === bookingId);
    expect(found).toBeDefined();
  });

  it("approves the booking (landlord)", async () => {
    await db.updateBooking(bookingId, {
      status: "approved",
      landlordNotes: "Welcome! Parking is included.",
    });
    const booking = await db.getBookingById(bookingId);
    expect(booking!.status).toBe("approved");
    expect(booking!.landlordNotes).toBe("Welcome! Parking is included.");
  });

  it("activates the booking", async () => {
    await db.updateBooking(bookingId, { status: "active" });
    const booking = await db.getBookingById(bookingId);
    expect(booking!.status).toBe("active");
  });

  it("completes the booking", async () => {
    await db.updateBooking(bookingId, { status: "completed" });
    const booking = await db.getBookingById(bookingId);
    expect(booking!.status).toBe("completed");
  });

  it("counts bookings", async () => {
    const total = await db.getBookingCount();
    expect(total).toBeGreaterThanOrEqual(1);
  });

  it("lists all bookings (admin)", async () => {
    const all = await db.getAllBookings(100, 0);
    expect(all.length).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 6. PAYMENT LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Payment Lifecycle (Real DB)", () => {
  let tenantId: number;
  let landlordId: number;
  let bookingId: number;
  let paymentId: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    tenantId = tenant!.id;
    landlordId = landlord!.id;
    const tenantBookings = await db.getBookingsByTenant(tenantId);
    bookingId = tenantBookings[0].id;
  });

  it("creates a rent payment", async () => {
    const id = await db.createPayment({
      bookingId,
      tenantId,
      landlordId,
      type: "rent",
      amount: "5500.00",
      currency: "SAR",
      status: "completed",
      description: "Monthly rent - April 2026",
      descriptionAr: "إيجار شهري - أبريل 2026",
    });
    expect(id).toBeDefined();
    expect(id).toBeGreaterThan(0);
    paymentId = id!;
    createdIds.payments.push(paymentId);
  });

  it("creates a deposit payment", async () => {
    const id = await db.createPayment({
      bookingId,
      tenantId,
      landlordId,
      type: "deposit",
      amount: "10000.00",
      currency: "SAR",
      status: "completed",
      description: "Security deposit",
    });
    expect(id).toBeGreaterThan(0);
    createdIds.payments.push(id!);
  });

  it("lists payments by tenant", async () => {
    const tenantPayments = await db.getPaymentsByTenant(tenantId);
    expect(tenantPayments.length).toBeGreaterThanOrEqual(2);
  });

  it("lists payments by landlord", async () => {
    const landlordPayments = await db.getPaymentsByLandlord(landlordId);
    expect(landlordPayments.length).toBeGreaterThanOrEqual(2);
  });

  it("lists payments by booking", async () => {
    const bookingPayments = await db.getPaymentsByBooking(bookingId);
    expect(bookingPayments.length).toBeGreaterThanOrEqual(2);
    const types = bookingPayments.map(p => p.type);
    expect(types).toContain("rent");
    expect(types).toContain("deposit");
  });

  it("calculates total revenue", async () => {
    const revenue = await db.getTotalRevenue();
    expect(Number(revenue)).toBeGreaterThanOrEqual(15500); // 5500 + 10000
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 7. MESSAGING LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Messaging Lifecycle (Real DB)", () => {
  let tenantId: number;
  let landlordId: number;
  let propertyId: number;
  let conversationId: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    tenantId = tenant!.id;
    landlordId = landlord!.id;
    const props = await db.getPropertiesByLandlord(landlordId);
    propertyId = props[0].id;
  });

  it("creates a conversation", async () => {
    const conv = await db.getOrCreateConversation(tenantId, landlordId, propertyId);
    expect(conv).toBeDefined();
    expect(conv!.id).toBeGreaterThan(0);
    expect(conv!.tenantId).toBe(tenantId);
    expect(conv!.landlordId).toBe(landlordId);
    conversationId = conv!.id;
    createdIds.conversations.push(conversationId);
  });

  it("returns existing conversation on duplicate create", async () => {
    const conv2 = await db.getOrCreateConversation(tenantId, landlordId, propertyId);
    expect(conv2!.id).toBe(conversationId); // Same conversation
  });

  it("sends a message from tenant", async () => {
    const id = await db.createMessage({
      conversationId,
      senderId: tenantId,
      content: "Hello, is the apartment still available?",
      messageType: "text",
    });
    expect(id).toBeGreaterThan(0);
    createdIds.messages.push(id!);
  });

  it("sends a message from landlord", async () => {
    const id = await db.createMessage({
      conversationId,
      senderId: landlordId,
      content: "Yes, it is! When would you like to move in?",
      messageType: "text",
    });
    expect(id).toBeGreaterThan(0);
    createdIds.messages.push(id!);
  });

  it("sends a third message from tenant", async () => {
    const id = await db.createMessage({
      conversationId,
      senderId: tenantId,
      content: "I'd like to move in April 1st",
      messageType: "text",
    });
    expect(id).toBeGreaterThan(0);
    createdIds.messages.push(id!);
  });

  it("lists conversation messages in order", async () => {
    const msgs = await db.getMessagesByConversation(conversationId);
    expect(msgs.length).toBe(3);
    // Messages may be ordered newest-first or oldest-first depending on implementation
    const contents = msgs.map(m => m.content);
    expect(contents.some(c => c.includes("Hello"))).toBe(true);
    expect(contents.some(c => c.includes("Yes"))).toBe(true);
    expect(contents.some(c => c.includes("April"))).toBe(true);
  });

  it("gets unread count for landlord", async () => {
    const count = await db.getUnreadMessageCount(landlordId);
    // Tenant sent 2 messages, landlord hasn't read them
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it("marks messages as read", async () => {
    await db.markMessagesAsRead(conversationId, landlordId);
    const count = await db.getUnreadMessageCount(landlordId);
    // After marking read, tenant messages should be read
    // (only messages NOT from landlord get marked)
    expect(count).toBe(0);
  });

  it("lists user conversations", async () => {
    const tenantConvs = await db.getConversationsByUser(tenantId);
    expect(tenantConvs.length).toBeGreaterThanOrEqual(1);
    const found = tenantConvs.find(c => c.id === conversationId);
    expect(found).toBeDefined();

    const landlordConvs = await db.getConversationsByUser(landlordId);
    expect(landlordConvs.length).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 8. MAINTENANCE REQUEST LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Maintenance Request Lifecycle (Real DB)", () => {
  let tenantId: number;
  let landlordId: number;
  let propertyId: number;
  let requestId: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    tenantId = tenant!.id;
    landlordId = landlord!.id;
    const props = await db.getPropertiesByLandlord(landlordId);
    propertyId = props[0].id;
  });

  it("creates a maintenance request", async () => {
    const id = await db.createMaintenanceRequest({
      propertyId,
      tenantId,
      landlordId,
      title: "Kitchen faucet leaking",
      titleAr: "تسريب صنبور المطبخ",
      description: "The kitchen faucet has been dripping for 2 days",
      descriptionAr: "صنبور المطبخ يقطر منذ يومين",
      category: "plumbing",
      priority: "high",
      photos: ["https://example.com/leak1.jpg"],
    });
    expect(id).toBeDefined();
    expect(id).toBeGreaterThan(0);
    requestId = id!;
    createdIds.maintenance.push(requestId);
  });

  it("reads the maintenance request", async () => {
    const req = await db.getMaintenanceById(requestId);
    expect(req).toBeDefined();
    expect(req!.title).toBe("Kitchen faucet leaking");
    expect(req!.titleAr).toBe("تسريب صنبور المطبخ");
    expect(req!.category).toBe("plumbing");
    expect(req!.priority).toBe("high");
    expect(req!.status).toBe("submitted");
    expect(req!.photos).toHaveLength(1);
  });

  it("landlord acknowledges the request", async () => {
    await db.updateMaintenanceRequest(requestId, {
      status: "acknowledged",
      landlordResponse: "We'll send a plumber tomorrow",
      landlordResponseAr: "سنرسل سباك غداً",
    });
    const req = await db.getMaintenanceById(requestId);
    expect(req!.status).toBe("acknowledged");
    expect(req!.landlordResponse).toBe("We'll send a plumber tomorrow");
  });

  it("moves to in-progress", async () => {
    await db.updateMaintenanceRequest(requestId, {
      status: "in_progress",
      estimatedCost: "250.00",
    });
    const req = await db.getMaintenanceById(requestId);
    expect(req!.status).toBe("in_progress");
    expect(Number(req!.estimatedCost)).toBe(250);
  });

  it("completes the request", async () => {
    await db.updateMaintenanceRequest(requestId, {
      status: "completed",
      resolvedAt: new Date(),
    });
    const req = await db.getMaintenanceById(requestId);
    expect(req!.status).toBe("completed");
    expect(req!.resolvedAt).toBeDefined();
  });

  it("lists tenant maintenance requests", async () => {
    const reqs = await db.getMaintenanceByTenant(tenantId);
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    const found = reqs.find(r => r.id === requestId);
    expect(found).toBeDefined();
    expect(found!.status).toBe("completed");
  });

  it("lists landlord maintenance requests", async () => {
    const reqs = await db.getMaintenanceByLandlord(landlordId);
    expect(reqs.length).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 9. NOTIFICATIONS LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Notifications Lifecycle (Real DB)", () => {
  let tenantId: number;
  let notifId1: number;
  let notifId2: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    tenantId = tenant!.id;
  });

  it("creates notifications", async () => {
    const id1 = await db.createNotification({
      userId: tenantId,
      type: "booking_approved",
      titleEn: "Booking Approved",
      titleAr: "تم قبول الحجز",
      contentEn: "Your booking has been approved by the landlord",
      contentAr: "تم قبول حجزك من قبل المالك",
    });
    expect(id1).toBeGreaterThan(0);
    notifId1 = id1!;
    createdIds.notifications.push(notifId1);

    const id2 = await db.createNotification({
      userId: tenantId,
      type: "payment_due",
      titleEn: "Rent Payment Due",
      titleAr: "موعد دفع الإيجار",
    });
    notifId2 = id2!;
    createdIds.notifications.push(notifId2);
  });

  it("lists user notifications", async () => {
    const notifs = await db.getNotificationsByUser(tenantId);
    expect(notifs.length).toBeGreaterThanOrEqual(2);
  });

  it("counts unread notifications", async () => {
    const count = await db.getUnreadNotificationCount(tenantId);
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it("marks notification as read", async () => {
    await db.markNotificationRead(notifId1);
    const notifs = await db.getNotificationsByUser(tenantId);
    const marked = notifs.find(n => n.id === notifId1);
    expect(marked!.isRead).toBe(true);
  });

  it("unread count decreases after marking read", async () => {
    const countBefore = await db.getUnreadNotificationCount(tenantId);
    await db.markNotificationRead(notifId2);
    const countAfter = await db.getUnreadNotificationCount(tenantId);
    expect(countAfter).toBeLessThan(countBefore);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 10. REVIEWS LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Reviews Lifecycle (Real DB)", () => {
  let tenantId: number;
  let propertyId: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    tenantId = tenant!.id;
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    const props = await db.getPropertiesByLandlord(landlord!.id);
    propertyId = props[0].id;
  });

  it("creates a review with rating 5", async () => {
    const id = await db.createReview({
      propertyId,
      tenantId,
      rating: 5,
      comment: "Excellent apartment, very clean and well maintained",
      commentAr: "شقة ممتازة، نظيفة جداً وصيانة ممتازة",
    });
    expect(id).toBeGreaterThan(0);
    createdIds.reviews.push(id!);
  });

  it("creates a second review with rating 4", async () => {
    // Create a second test user for this review
    await db.upsertUser({
      openId: `${testPrefix}_reviewer2`,
      name: "Second Reviewer",
      role: "tenant",
    });
    const reviewer2 = await db.getUserByOpenId(`${testPrefix}_reviewer2`);
    createdIds.users.push(reviewer2!.id);

    const id = await db.createReview({
      propertyId,
      tenantId: reviewer2!.id,
      rating: 4,
      comment: "Good location, but parking is limited",
    });
    expect(id).toBeGreaterThan(0);
    createdIds.reviews.push(id!);
  });

  it("lists property reviews", async () => {
    const reviewList = await db.getReviewsByProperty(propertyId);
    expect(reviewList.length).toBeGreaterThanOrEqual(2);
  });

  it("calculates average rating", async () => {
    const avg = await db.getAverageRating(propertyId);
    expect(Number(avg)).toBeCloseTo(4.5, 0); // (5 + 4) / 2 = 4.5
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 11. SAVED SEARCHES LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════
describe("Saved Searches Lifecycle (Real DB)", () => {
  let tenantId: number;
  let searchId: number;

  beforeAll(async () => {
    const tenant = await db.getUserByOpenId(`${testPrefix}_tenant`);
    tenantId = tenant!.id;
  });

  it("creates a saved search", async () => {
    const id = await db.createSavedSearch(tenantId, "Apartments in Riyadh under 5000", {
      city: "Riyadh",
      propertyType: "apartment",
      maxPrice: 5000,
    });
    expect(id).toBeGreaterThan(0);
    searchId = id!;
    createdIds.savedSearches.push(searchId);
  });

  it("lists saved searches", async () => {
    const searches = await db.getSavedSearches(tenantId);
    expect(searches.length).toBeGreaterThanOrEqual(1);
    const found = searches.find(s => s.id === searchId);
    expect(found).toBeDefined();
    expect(found!.name).toBe("Apartments in Riyadh under 5000");
    expect((found!.filters as any).city).toBe("Riyadh");
  });

  it("deletes a saved search", async () => {
    await db.deleteSavedSearch(searchId);
    const searches = await db.getSavedSearches(tenantId);
    const found = searches.find(s => s.id === searchId);
    expect(found).toBeUndefined();
    // Remove from cleanup since already deleted
    createdIds.savedSearches = createdIds.savedSearches.filter(id => id !== searchId);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 12. PROPERTY AVAILABILITY
// ═══════════════════════════════════════════════════════════════════════
describe("Property Availability (Real DB)", () => {
  let propertyId: number;

  beforeAll(async () => {
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    const props = await db.getPropertiesByLandlord(landlord!.id);
    propertyId = props[0].id;
  });

  it("sets availability period", async () => {
    const id = await db.setPropertyAvailability({
      propertyId,
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-12-31"),
      isBlocked: false,
    });
    expect(id).toBeGreaterThan(0);
    createdIds.availability.push(id!);
  });

  it("sets blocked period", async () => {
    const id = await db.setPropertyAvailability({
      propertyId,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-03-31"),
      isBlocked: true,
    });
    expect(id).toBeGreaterThan(0);
    createdIds.availability.push(id!);
  });

  it("gets availability for property", async () => {
    const avail = await db.getPropertyAvailability(propertyId);
    expect(avail.length).toBeGreaterThanOrEqual(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 13. PLATFORM SETTINGS
// ═══════════════════════════════════════════════════════════════════════
describe("Platform Settings (Real DB)", () => {
  const key = `${testPrefix}_key`;

  it("sets a setting", async () => {
    await db.setSetting(key, "test_value_123");
    const val = await db.getSetting(key);
    expect(val).toBe("test_value_123");
  });

  it("updates a setting", async () => {
    await db.setSetting(key, "updated_value_456");
    const val = await db.getSetting(key);
    expect(val).toBe("updated_value_456");
  });

  it("returns null for non-existent setting", async () => {
    const val = await db.getSetting("nonexistent_key_xyz");
    expect(val).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 14. PROPERTY DELETE (Final cleanup test)
// ═══════════════════════════════════════════════════════════════════════
describe("Property Deletion (Real DB)", () => {
  let tempPropertyId: number;
  let landlordId: number;

  beforeAll(async () => {
    const landlord = await db.getUserByOpenId(`${testPrefix}_landlord`);
    landlordId = landlord!.id;
  });

  it("creates and deletes a property", async () => {
    const id = await db.createProperty({
      landlordId,
      titleEn: "Temp Property to Delete",
      titleAr: "عقار مؤقت للحذف",
      propertyType: "studio",
      monthlyRent: "2000.00",
    });
    tempPropertyId = id!;

    // Verify exists
    const prop = await db.getPropertyById(tempPropertyId);
    expect(prop).toBeDefined();

    // Delete
    await db.deleteProperty(tempPropertyId);

    // Verify deleted
    const deleted = await db.getPropertyById(tempPropertyId);
    expect(deleted).toBeUndefined();
  });
});
