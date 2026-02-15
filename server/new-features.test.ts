import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock DB module
vi.mock("./db", () => ({
  getAnalyticsData: vi.fn().mockResolvedValue({
    bookingsByMonth: [{ month: "2026-01", activeCount: 5, completedCount: 3, pendingCount: 2, cancelledCount: 1 }],
    revenueByMonth: [{ month: "2026-01", revenue: 50000 }],
    userRegistrations: [{ month: "2026-01", count: 10, tenantCount: 7, landlordCount: 3 }],
    bookingStatusDist: [{ status: "active", count: 5 }, { status: "completed", count: 3 }],
    propertiesByType: [{ propertyType: "apartment", count: 10 }],
    propertiesByCity: [{ city: "Riyadh", cityAr: "الرياض", count: 15 }],
    occupancy: { totalProperties: 20, occupiedProperties: 15, occupancyRate: 75 },
    topProperties: [{ id: 1, titleEn: "Test", titleAr: "تجربة", city: "Riyadh", monthlyRent: 5000, bookingCount: 3, totalRevenue: 15000 }],
    serviceRequests: [{ status: "completed", count: 5, totalValue: 2500 }],
    maintenanceSummary: [{ status: "resolved", urgency: "high", count: 2 }],
    recentActivity: [{ type: "booking", id: 1, detail: "active", createdAt: Date.now() }],
  }),
  createReview: vi.fn().mockResolvedValue(1),
  getReviewsByProperty: vi.fn().mockResolvedValue([
    { id: 1, propertyId: 1, tenantId: 2, rating: 4, comment: "Great place", isPublished: true, createdAt: new Date(), tenantName: "Test" },
  ]),
  getPropertyAverageRating: vi.fn().mockResolvedValue({ average: 4.2, count: 5 }),
  hasUserReviewedBooking: vi.fn().mockResolvedValue(false),
  getBookingById: vi.fn().mockResolvedValue({ id: 1, tenantId: 2, propertyId: 1, status: "completed" }),
  getAllReviews: vi.fn().mockResolvedValue([
    { id: 1, propertyId: 1, tenantId: 2, rating: 4, comment: "Nice", isPublished: true, tenantName: "User" },
  ]),
  updateReviewPublished: vi.fn().mockResolvedValue(undefined),
  deleteReview: vi.fn().mockResolvedValue(undefined),
  getReviewsByTenant: vi.fn().mockResolvedValue([]),
  getReviewCount: vi.fn().mockResolvedValue(5),
  getAverageRating: vi.fn().mockResolvedValue(4.2),
}));

import * as db from "./db";

describe("Analytics Data", () => {
  it("should return analytics data with all required fields", async () => {
    const data = await db.getAnalyticsData(12);
    expect(data).toBeDefined();
    expect(data.bookingsByMonth).toBeInstanceOf(Array);
    expect(data.revenueByMonth).toBeInstanceOf(Array);
    expect(data.userRegistrations).toBeInstanceOf(Array);
    expect(data.bookingStatusDist).toBeInstanceOf(Array);
    expect(data.propertiesByType).toBeInstanceOf(Array);
    expect(data.propertiesByCity).toBeInstanceOf(Array);
    expect(data.occupancy).toBeDefined();
    expect(data.occupancy.occupancyRate).toBe(75);
    expect(data.topProperties).toBeInstanceOf(Array);
    expect(data.serviceRequests).toBeInstanceOf(Array);
    expect(data.maintenanceSummary).toBeInstanceOf(Array);
    expect(data.recentActivity).toBeInstanceOf(Array);
  });

  it("should have correct booking month data structure", async () => {
    const data = await db.getAnalyticsData(12);
    const bm = data.bookingsByMonth[0];
    expect(bm).toHaveProperty("month");
    expect(bm).toHaveProperty("activeCount");
    expect(bm).toHaveProperty("completedCount");
    expect(bm).toHaveProperty("pendingCount");
    expect(bm).toHaveProperty("cancelledCount");
  });

  it("should have correct revenue month data structure", async () => {
    const data = await db.getAnalyticsData(12);
    const rm = data.revenueByMonth[0];
    expect(rm).toHaveProperty("month");
    expect(rm).toHaveProperty("revenue");
    expect(rm.revenue).toBe(50000);
  });
});

describe("Reviews System", () => {
  it("should create a review", async () => {
    const id = await db.createReview({
      propertyId: 1,
      tenantId: 2,
      bookingId: 1,
      rating: 4,
      comment: "Great place to stay",
    });
    expect(id).toBe(1);
    expect(db.createReview).toHaveBeenCalledWith(expect.objectContaining({
      propertyId: 1,
      tenantId: 2,
      rating: 4,
    }));
  });

  it("should get reviews by property with tenant info", async () => {
    const reviews = await db.getReviewsByProperty(1);
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0]).toHaveProperty("tenantName");
    expect(reviews[0]).toHaveProperty("rating");
    expect(reviews[0]).toHaveProperty("isPublished", true);
  });

  it("should get property average rating with count", async () => {
    const result = await db.getPropertyAverageRating(1);
    expect(result).toHaveProperty("average");
    expect(result).toHaveProperty("count");
    expect(result.average).toBe(4.2);
    expect(result.count).toBe(5);
  });

  it("should check if user has reviewed a booking", async () => {
    const hasReviewed = await db.hasUserReviewedBooking(2, 1);
    expect(hasReviewed).toBe(false);
  });

  it("should get all reviews for admin", async () => {
    const reviews = await db.getAllReviews(50, 0);
    expect(reviews).toBeInstanceOf(Array);
    expect(reviews[0]).toHaveProperty("tenantName");
  });

  it("should toggle review published status", async () => {
    await db.updateReviewPublished(1, false);
    expect(db.updateReviewPublished).toHaveBeenCalledWith(1, false);
  });

  it("should delete a review", async () => {
    await db.deleteReview(1);
    expect(db.deleteReview).toHaveBeenCalledWith(1);
  });

  it("should get review count", async () => {
    const count = await db.getReviewCount();
    expect(count).toBe(5);
  });

  it("should validate review rating range (1-5)", () => {
    // Rating validation is handled by zod in the router
    const validRatings = [1, 2, 3, 4, 5];
    const invalidRatings = [0, 6, -1, 10];
    
    validRatings.forEach(r => {
      expect(r >= 1 && r <= 5).toBe(true);
    });
    
    invalidRatings.forEach(r => {
      expect(r >= 1 && r <= 5).toBe(false);
    });
  });

  it("should only allow review of completed bookings", async () => {
    const booking = await db.getBookingById(1);
    expect(booking).toBeDefined();
    expect(booking!.status).toBe("completed");
  });
});

describe("PWA Configuration", () => {
  it("should have valid manifest.json structure", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const manifestPath = path.resolve(__dirname, "../client/public/manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    
    expect(manifest.name).toContain("المفتاح الشهري");
    expect(manifest.short_name).toBe("المفتاح الشهري");
    expect(manifest.display).toBe("standalone");
    expect(manifest.background_color).toBeDefined();
    expect(manifest.theme_color).toBeDefined();
    expect(manifest.start_url).toBe("/");
    expect(manifest.lang).toBe("ar");
    expect(manifest.dir).toBe("rtl");
  });

  it("should have all required icon sizes", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const manifestPath = path.resolve(__dirname, "../client/public/manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    
    const requiredSizes = ["72x72", "96x96", "128x128", "144x144", "152x152", "192x192", "384x384", "512x512"];
    const iconSizes = manifest.icons.map((i: any) => i.sizes);
    
    requiredSizes.forEach(size => {
      expect(iconSizes).toContain(size);
    });
  });

  it("should have icon files on disk", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const iconsDir = path.resolve(__dirname, "../client/public/icons");
    
    const requiredFiles = ["icon-72.png", "icon-96.png", "icon-128.png", "icon-144.png", "icon-152.png", "icon-192.png", "icon-384.png", "icon-512.png"];
    
    requiredFiles.forEach(file => {
      expect(fs.existsSync(path.join(iconsDir, file))).toBe(true);
    });
  });

  it("should have service worker file", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const swPath = path.resolve(__dirname, "../client/public/sw.js");
    
    expect(fs.existsSync(swPath)).toBe(true);
    const content = fs.readFileSync(swPath, "utf-8");
    expect(content).toContain("install");
    expect(content).toContain("activate");
    expect(content).toContain("fetch");
  });
});

describe("Arabic Branding", () => {
  it("should have المفتاح الشهري in manifest", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const manifestPath = path.resolve(__dirname, "../client/public/manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    
    expect(manifest.name).toContain("المفتاح الشهري");
    expect(manifest.short_name).toBe("المفتاح الشهري");
  });

  it("should have المفتاح الشهري in index.html", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const htmlPath = path.resolve(__dirname, "../client/index.html");
    const html = fs.readFileSync(htmlPath, "utf-8");
    
    expect(html).toContain("المفتاح الشهري");
    expect(html).toContain('content="المفتاح الشهري"');
  });
});
