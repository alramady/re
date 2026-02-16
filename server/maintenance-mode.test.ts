import { describe, expect, it, vi, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock permissions to always allow in tests
vi.mock("./permissions", () => ({
  hasPermission: vi.fn().mockResolvedValue(true),
  hasAnyPermission: vi.fn().mockResolvedValue(true),
  getUserPermissions: vi.fn().mockResolvedValue({
    permissions: [
      "manage_cities", "manage_users", "manage_properties", "manage_bookings",
      "manage_payments", "manage_services", "manage_maintenance", "manage_settings",
      "manage_ai", "view_analytics", "manage_roles", "manage_cms",
      "manage_knowledge", "send_notifications",
    ],
    isRoot: true,
  }),
  clearPermissionCache: vi.fn(),
  PERMISSIONS: {
    MANAGE_USERS: "manage_users", MANAGE_PROPERTIES: "manage_properties",
    MANAGE_BOOKINGS: "manage_bookings", MANAGE_PAYMENTS: "manage_payments",
    MANAGE_SERVICES: "manage_services", MANAGE_MAINTENANCE: "manage_maintenance",
    MANAGE_CITIES: "manage_cities", MANAGE_CMS: "manage_cms",
    MANAGE_ROLES: "manage_roles", MANAGE_KNOWLEDGE: "manage_knowledge",
    VIEW_ANALYTICS: "view_analytics", MANAGE_SETTINGS: "manage_settings",
    SEND_NOTIFICATIONS: "send_notifications", MANAGE_AI: "manage_ai",
  },
  PERMISSION_CATEGORIES: [],
}));

// ── Context Helpers ──────────────────────────────────────────────────

function createAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-test",
      userId: "Hobart",
      email: "hobarti@protonmail.com",
      name: "Admin",
      displayName: "Admin",
      loginMethod: "local",
      role: "admin",
      phone: "+966504466528",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as any,
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  };
}

function createUserCtx(id = 2): TrpcContext {
  return {
    user: {
      id,
      openId: `user-${id}`,
      userId: `user${id}`,
      email: `user${id}@test.com`,
      name: `User ${id}`,
      displayName: `User ${id}`,
      loginMethod: "local",
      role: "user",
      phone: "+966500000000",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as any,
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  };
}

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  };
}

// ── Tests ────────────────────────────────────────────────────────────

describe("Maintenance Mode — Complete Logic", () => {
  const adminCaller = appRouter.createCaller(createAdminCtx());
  const userCaller = appRouter.createCaller(createUserCtx());
  const publicCaller = appRouter.createCaller(createPublicCtx());

  // ── 1. Seed & Default Settings ──

  describe("Default Settings Seeding", () => {
    it("maintenance.enabled exists in settings after seed", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings).toHaveProperty("maintenance.enabled");
    });

    it("maintenance.enabled defaults to a string value (true or false)", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      const val = settings["maintenance.enabled"];
      expect(["true", "false"]).toContain(val);
    });

    it("all maintenance keys are present after seed", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      const requiredKeys = [
        "maintenance.enabled",
        "maintenance.titleAr",
        "maintenance.titleEn",
        "maintenance.subtitleAr",
        "maintenance.subtitleEn",
        "maintenance.messageAr",
        "maintenance.messageEn",
        "maintenance.imageUrl",
        "maintenance.countdownDate",
        "maintenance.showCountdown",
      ];
      for (const key of requiredKeys) {
        expect(settings).toHaveProperty(key);
      }
    });

    it("all social keys are present after seed", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      const socialKeys = [
        "social.twitter", "social.instagram", "social.snapchat",
        "social.tiktok", "social.linkedin", "social.youtube",
      ];
      for (const key of socialKeys) {
        expect(settings).toHaveProperty(key);
      }
    });

    it("all AI keys are present after seed", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      const aiKeys = [
        "ai.enabled", "ai.name", "ai.nameEn", "ai.personality",
        "ai.welcomeMessage", "ai.welcomeMessageEn",
        "ai.customInstructions", "ai.maxResponseLength",
      ];
      for (const key of aiKeys) {
        expect(settings).toHaveProperty(key);
      }
    });

    it("settings count is at least 80 (comprehensive seed)", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(Object.keys(settings).length).toBeGreaterThanOrEqual(80);
    });
  });

  // ── 2. Toggle ON/OFF Cycle ──

  describe("Maintenance Toggle — Save & Read Cycle", () => {
    it("admin can enable maintenance mode (set to true)", async () => {
      const result = await adminCaller.siteSettings.update({
        settings: { "maintenance.enabled": "true" },
      });
      expect(result.success).toBe(true);
    });

    it("maintenance.enabled reads back as true after enabling", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.enabled"]).toBe("true");
    });

    it("admin can disable maintenance mode (set to false)", async () => {
      const result = await adminCaller.siteSettings.update({
        settings: { "maintenance.enabled": "false" },
      });
      expect(result.success).toBe(true);
    });

    it("maintenance.enabled reads back as false after disabling", async () => {
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.enabled"]).toBe("false");
    });

    it("rapid toggle: enable → disable → enable persists correctly", async () => {
      await adminCaller.siteSettings.update({ settings: { "maintenance.enabled": "true" } });
      await adminCaller.siteSettings.update({ settings: { "maintenance.enabled": "false" } });
      await adminCaller.siteSettings.update({ settings: { "maintenance.enabled": "true" } });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.enabled"]).toBe("true");
    });
  });

  // ── 3. Maintenance Content Updates ──

  describe("Maintenance Content — Save & Read", () => {
    it("admin can update maintenance title (Arabic)", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.titleAr": "الموقع تحت الصيانة" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.titleAr"]).toBe("الموقع تحت الصيانة");
    });

    it("admin can update maintenance title (English)", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.titleEn": "Under Maintenance" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.titleEn"]).toBe("Under Maintenance");
    });

    it("admin can update maintenance message (Arabic)", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.messageAr": "نعتذر عن الإزعاج" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.messageAr"]).toBe("نعتذر عن الإزعاج");
    });

    it("admin can update countdown date", async () => {
      const futureDate = "2026-03-01T00:00:00Z";
      await adminCaller.siteSettings.update({
        settings: { "maintenance.countdownDate": futureDate },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.countdownDate"]).toBe(futureDate);
    });

    it("admin can enable countdown", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.showCountdown": "true" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.showCountdown"]).toBe("true");
    });

    it("admin can update social links", async () => {
      await adminCaller.siteSettings.update({
        settings: {
          "social.twitter": "https://twitter.com/monthlykey",
          "social.instagram": "https://instagram.com/monthlykey",
        },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["social.twitter"]).toBe("https://twitter.com/monthlykey");
      expect(settings["social.instagram"]).toBe("https://instagram.com/monthlykey");
    });

    it("admin can batch-update multiple maintenance settings at once", async () => {
      const batch = {
        "maintenance.titleAr": "قريباً",
        "maintenance.titleEn": "Coming Soon",
        "maintenance.subtitleAr": "جاري التحضير",
        "maintenance.subtitleEn": "Preparing",
        "maintenance.enabled": "false",
      };
      const result = await adminCaller.siteSettings.update({ settings: batch });
      expect(result.success).toBe(true);

      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.titleAr"]).toBe("قريباً");
      expect(settings["maintenance.titleEn"]).toBe("Coming Soon");
      expect(settings["maintenance.subtitleAr"]).toBe("جاري التحضير");
      expect(settings["maintenance.subtitleEn"]).toBe("Preparing");
      expect(settings["maintenance.enabled"]).toBe("false");
    });
  });

  // ── 4. Access Control ──

  describe("Access Control — Who Can Toggle", () => {
    it("non-admin user CANNOT update maintenance settings", async () => {
      await expect(
        userCaller.siteSettings.update({
          settings: { "maintenance.enabled": "true" },
        })
      ).rejects.toThrow();
    });

    it("public (unauthenticated) user CANNOT update maintenance settings", async () => {
      await expect(
        publicCaller.siteSettings.update({
          settings: { "maintenance.enabled": "true" },
        })
      ).rejects.toThrow();
    });

    it("public user CAN read settings (needed for MaintenanceGate)", async () => {
      const settings = await publicCaller.siteSettings.getAll();
      expect(typeof settings).toBe("object");
      expect(settings).not.toBeNull();
    });

    it("non-admin user CAN read settings (needed for MaintenanceGate)", async () => {
      const settings = await userCaller.siteSettings.getAll();
      expect(typeof settings).toBe("object");
      expect(settings).not.toBeNull();
    });
  });

  // ── 5. Settings Format Validation ──

  describe("Settings Format — Record<string, string>", () => {
    it("getAll returns a plain object (not an array)", async () => {
      const settings = await publicCaller.siteSettings.getAll();
      expect(Array.isArray(settings)).toBe(false);
      expect(typeof settings).toBe("object");
    });

    it("all values are strings", async () => {
      const settings = (await publicCaller.siteSettings.getAll()) as Record<string, string>;
      for (const [key, value] of Object.entries(settings)) {
        expect(typeof value).toBe("string");
      }
    });

    it("maintenance.enabled is exactly 'true' or 'false' string, not boolean", async () => {
      const settings = (await publicCaller.siteSettings.getAll()) as Record<string, string>;
      const val = settings["maintenance.enabled"];
      expect(typeof val).toBe("string");
      expect(["true", "false"]).toContain(val);
    });
  });

  // ── 6. Seed Idempotency ──

  describe("Seed Idempotency — Does NOT Overwrite Existing", () => {
    it("updating a setting then re-seeding preserves the updated value", async () => {
      // Set a custom value
      await adminCaller.siteSettings.update({
        settings: { "maintenance.titleAr": "عنوان مخصص" },
      });

      // Re-run seed (import and call)
      const { seedDefaultSettings } = await import("./seed-settings");
      await seedDefaultSettings();

      // Verify custom value was NOT overwritten
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.titleAr"]).toBe("عنوان مخصص");
    });
  });

  // ── 7. Edge Cases ──

  describe("Edge Cases", () => {
    it("setting maintenance.enabled to empty string is treated as falsy", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.enabled": "" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      // Empty string should be stored as-is
      expect(settings["maintenance.enabled"]).toBe("");
      // MaintenanceGate checks === "true", so empty string = not enabled
    });

    it("setting maintenance.enabled to 'TRUE' (uppercase) is not equal to 'true'", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.enabled": "TRUE" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.enabled"]).toBe("TRUE");
      // MaintenanceGate checks === "true" (lowercase), so "TRUE" would NOT trigger maintenance
    });

    it("restore maintenance.enabled to false for clean state", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.enabled": "false" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.enabled"]).toBe("false");
    });

    it("individual get endpoint returns correct maintenance value", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.enabled": "true" },
      });
      const result = await publicCaller.siteSettings.get({ key: "maintenance.enabled" });
      expect(result.value).toBe("true");
    });

    it("individual get endpoint returns null for non-existent key", async () => {
      const result = await publicCaller.siteSettings.get({ key: "maintenance.nonexistent.key.xyz" });
      expect(result.value).toBeNull();
    });

    it("cleanup: set maintenance.enabled back to true for browser tests", async () => {
      await adminCaller.siteSettings.update({
        settings: { "maintenance.enabled": "true" },
      });
      const settings = (await adminCaller.siteSettings.getAll()) as Record<string, string>;
      expect(settings["maintenance.enabled"]).toBe("true");
    });
  });
});
