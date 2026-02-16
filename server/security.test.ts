import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  sanitizeObject,
  validateContentType,
  validateFileExtension,
  capLimit,
  capOffset,
  isOwnerOrAdmin,
  isBookingParticipant,
  MAX_BASE64_SIZE,
  MAX_AVATAR_BASE64_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_UPLOAD_TYPES,
} from "./security";

describe("Security Utilities", () => {
  // ─── XSS Sanitization ────────────────────────────────────────────

  describe("sanitizeText", () => {
    it("escapes HTML script tags", () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeText(input);
      // Tags are escaped to entities, not raw HTML
      expect(result).not.toContain("<script");
      expect(result).toContain("&lt;");
    });

    it("escapes HTML entities", () => {
      expect(sanitizeText("<b>bold</b>")).toBe("&lt;b&gt;bold&lt;&#x2F;b&gt;");
    });

    it("escapes inline event handlers via entity encoding", () => {
      const input = '<img onerror="alert(1)" src="x">';
      const result = sanitizeText(input);
      // The < and > are escaped, so the tag can't be parsed as HTML
      expect(result).toContain("&lt;");
      expect(result).toContain("&gt;");
      expect(result).not.toContain("<img");
    });

    it("strips javascript: protocol", () => {
      const input = 'javascript:alert(1)';
      const result = sanitizeText(input);
      expect(result).not.toContain("javascript:");
    });

    it("handles empty string", () => {
      expect(sanitizeText("")).toBe("");
    });

    it("handles null/undefined gracefully", () => {
      expect(sanitizeText(null as any)).toBeFalsy();
      expect(sanitizeText(undefined as any)).toBeFalsy();
    });

    it("preserves safe text", () => {
      expect(sanitizeText("Hello World 123")).toBe("Hello World 123");
    });

    it("preserves Arabic text", () => {
      const arabic = "مرحبا بالعالم";
      expect(sanitizeText(arabic)).toBe(arabic);
    });

    it("escapes quotes", () => {
      expect(sanitizeText('"test"')).toBe("&quot;test&quot;");
      expect(sanitizeText("'test'")).toBe("&#x27;test&#x27;");
    });
  });

  describe("sanitizeObject", () => {
    it("sanitizes string values in object", () => {
      const obj = { name: "<script>xss</script>", age: 25 };
      const result = sanitizeObject(obj);
      expect(result.name).not.toContain("<script>");
      expect(result.age).toBe(25);
    });

    it("sanitizes arrays of strings", () => {
      const obj = { tags: ["<b>bold</b>", "safe"] };
      const result = sanitizeObject(obj);
      expect(result.tags[0]).not.toContain("<b>");
      expect(result.tags[1]).toBe("safe");
    });

    it("preserves non-string values", () => {
      const obj = { count: 42, active: true, data: null };
      const result = sanitizeObject(obj);
      expect(result).toEqual(obj);
    });
  });

  // ─── File Upload Validation ──────────────────────────────────────

  describe("validateContentType", () => {
    it("accepts valid image types", () => {
      expect(validateContentType("image/jpeg", ALLOWED_IMAGE_TYPES)).toBe(true);
      expect(validateContentType("image/png", ALLOWED_IMAGE_TYPES)).toBe(true);
      expect(validateContentType("image/webp", ALLOWED_IMAGE_TYPES)).toBe(true);
    });

    it("rejects invalid types against image whitelist", () => {
      expect(validateContentType("application/pdf", ALLOWED_IMAGE_TYPES)).toBe(false);
      expect(validateContentType("text/html", ALLOWED_IMAGE_TYPES)).toBe(false);
      expect(validateContentType("application/javascript", ALLOWED_IMAGE_TYPES)).toBe(false);
    });

    it("accepts documents against full whitelist", () => {
      expect(validateContentType("application/pdf")).toBe(true);
      expect(validateContentType("video/mp4")).toBe(true);
    });

    it("rejects dangerous types", () => {
      expect(validateContentType("application/javascript")).toBe(false);
      expect(validateContentType("text/html")).toBe(false);
      expect(validateContentType("application/x-httpd-php")).toBe(false);
      expect(validateContentType("application/x-sh")).toBe(false);
    });

    it("handles trimmed input", () => {
      // trim() is applied, so leading/trailing spaces are handled
      expect(validateContentType("image/jpeg ", ALLOWED_IMAGE_TYPES)).toBe(true);
      expect(validateContentType(" image/jpeg", ALLOWED_IMAGE_TYPES)).toBe(true);
    });

    it("handles case with toLowerCase", () => {
      // toLowerCase is applied so mixed case is accepted
      expect(validateContentType("Image/JPEG", ALLOWED_IMAGE_TYPES)).toBe(true);
    });
  });

  describe("validateFileExtension", () => {
    it("validates matching extension and content type", () => {
      expect(validateFileExtension("photo.jpg", "image/jpeg")).toBe(true);
      expect(validateFileExtension("doc.pdf", "application/pdf")).toBe(true);
      expect(validateFileExtension("video.mp4", "video/mp4")).toBe(true);
    });

    it("rejects mismatched extension and content type", () => {
      expect(validateFileExtension("photo.jpg", "application/javascript")).toBe(false);
      expect(validateFileExtension("script.js", "image/jpeg")).toBe(false);
    });

    it("rejects unknown extensions", () => {
      expect(validateFileExtension("file.xyz", "image/jpeg")).toBe(false);
      expect(validateFileExtension("file", "image/jpeg")).toBe(false);
    });
  });

  describe("File size constants", () => {
    it("MAX_BASE64_SIZE allows ~10MB files", () => {
      expect(MAX_BASE64_SIZE).toBe(14_000_000);
    });

    it("MAX_AVATAR_BASE64_SIZE allows ~2MB files", () => {
      expect(MAX_AVATAR_BASE64_SIZE).toBe(3_000_000);
    });
  });

  // ─── Pagination ──────────────────────────────────────────────────

  describe("capLimit", () => {
    it("returns default for undefined/zero/negative", () => {
      expect(capLimit(undefined)).toBe(20);
      expect(capLimit(0)).toBe(20);
      expect(capLimit(-5)).toBe(20);
    });

    it("caps at max limit", () => {
      expect(capLimit(500)).toBe(100);
      expect(capLimit(1000000)).toBe(100);
    });

    it("passes through valid values", () => {
      expect(capLimit(50)).toBe(50);
      expect(capLimit(1)).toBe(1);
      expect(capLimit(100)).toBe(100);
    });

    it("respects custom defaults and max", () => {
      expect(capLimit(undefined, 10, 50)).toBe(10);
      expect(capLimit(75, 10, 50)).toBe(50);
    });
  });

  describe("capOffset", () => {
    it("returns 0 for undefined/negative", () => {
      expect(capOffset(undefined)).toBe(0);
      expect(capOffset(-10)).toBe(0);
    });

    it("caps at max offset", () => {
      expect(capOffset(200000)).toBe(100000);
    });

    it("passes through valid values", () => {
      expect(capOffset(500)).toBe(500);
    });
  });

  // ─── Authorization Helpers ───────────────────────────────────────

  describe("isOwnerOrAdmin", () => {
    it("returns true for owner", () => {
      expect(isOwnerOrAdmin({ id: 1, role: "user" }, 1)).toBe(true);
    });

    it("returns true for admin", () => {
      expect(isOwnerOrAdmin({ id: 2, role: "admin" }, 1)).toBe(true);
    });

    it("returns false for non-owner non-admin", () => {
      expect(isOwnerOrAdmin({ id: 3, role: "user" }, 1)).toBe(false);
    });
  });

  describe("isBookingParticipant", () => {
    const booking = { tenantId: 10, landlordId: 20 };

    it("returns true for tenant", () => {
      expect(isBookingParticipant({ id: 10, role: "user" }, booking)).toBe(true);
    });

    it("returns true for landlord", () => {
      expect(isBookingParticipant({ id: 20, role: "user" }, booking)).toBe(true);
    });

    it("returns true for admin", () => {
      expect(isBookingParticipant({ id: 99, role: "admin" }, booking)).toBe(true);
    });

    it("returns false for unrelated user", () => {
      expect(isBookingParticipant({ id: 99, role: "user" }, booking)).toBe(false);
    });
  });
});
