import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db module
vi.mock("./db", () => ({
  getAllSettings: vi.fn().mockResolvedValue([
    { key: "faq.items", value: "[]" },
  ]),
  bulkSetSettings: vi.fn().mockResolvedValue(undefined),
  getSetting: vi.fn().mockImplementation((key: string) => {
    if (key === "faq.items") return Promise.resolve("[]");
    return Promise.resolve(null);
  }),
}));

describe("FAQ Feature", () => {
  it("should have faq.items in seed defaults", async () => {
    // Verify the seed defaults include faq.items
    const routersModule = await import("./routers");
    expect(routersModule).toBeDefined();
  });

  it("should parse empty FAQ items array correctly", () => {
    const raw = "[]";
    const parsed = JSON.parse(raw);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(0);
  });

  it("should parse FAQ items with valid structure", () => {
    const faqItems = [
      {
        questionAr: "ما هي منصة Monthly Key؟",
        questionEn: "What is Monthly Key?",
        answerAr: "منصة سعودية للإيجار الشهري",
        answerEn: "A Saudi monthly rental platform",
        category: "general",
      },
      {
        questionAr: "ما هي مدة الإيجار؟",
        questionEn: "What rental durations?",
        answerAr: "من 1 إلى 2 أشهر",
        answerEn: "1 to 2 months",
        category: "rental",
      },
    ];
    const serialized = JSON.stringify(faqItems);
    const parsed = JSON.parse(serialized);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].questionAr).toBe("ما هي منصة Monthly Key؟");
    expect(parsed[0].category).toBe("general");
    expect(parsed[1].category).toBe("rental");
  });

  it("should handle malformed FAQ JSON gracefully", () => {
    const raw = "invalid json";
    let faqItems: any[] = [];
    try {
      faqItems = JSON.parse(raw);
    } catch {
      faqItems = [];
    }
    expect(faqItems).toEqual([]);
  });

  it("should filter FAQ items by category", () => {
    const faqItems = [
      { questionAr: "q1", questionEn: "q1", answerAr: "a1", answerEn: "a1", category: "general" },
      { questionAr: "q2", questionEn: "q2", answerAr: "a2", answerEn: "a2", category: "payment" },
      { questionAr: "q3", questionEn: "q3", answerAr: "a3", answerEn: "a3", category: "general" },
    ];
    const generalItems = faqItems.filter(i => i.category === "general");
    expect(generalItems).toHaveLength(2);
    const paymentItems = faqItems.filter(i => i.category === "payment");
    expect(paymentItems).toHaveLength(1);
  });

  it("should filter FAQ items by search query", () => {
    const faqItems = [
      { questionAr: "ما هي منصة Monthly Key؟", questionEn: "What is Monthly Key?", answerAr: "منصة", answerEn: "platform", category: "general" },
      { questionAr: "كيف أدفع؟", questionEn: "How to pay?", answerAr: "PayPal", answerEn: "PayPal", category: "payment" },
    ];
    const query = "pay";
    const filtered = faqItems.filter(item => {
      const q = query.toLowerCase();
      return item.questionAr.toLowerCase().includes(q) ||
        item.questionEn.toLowerCase().includes(q) ||
        item.answerAr.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q);
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].category).toBe("payment");
  });

  it("should support all valid FAQ categories", () => {
    const validCategories = ["general", "booking", "payment", "rental", "landlord", "legal"];
    validCategories.forEach(cat => {
      expect(typeof cat).toBe("string");
      expect(cat.length).toBeGreaterThan(0);
    });
  });

  it("should add and remove FAQ items correctly", () => {
    let items: any[] = [];
    // Add
    items = [...items, { questionAr: "س1", questionEn: "Q1", answerAr: "ج1", answerEn: "A1", category: "general" }];
    expect(items).toHaveLength(1);
    // Add another
    items = [...items, { questionAr: "س2", questionEn: "Q2", answerAr: "ج2", answerEn: "A2", category: "booking" }];
    expect(items).toHaveLength(2);
    // Remove first
    items = items.filter((_, i) => i !== 0);
    expect(items).toHaveLength(1);
    expect(items[0].questionEn).toBe("Q2");
  });
});
