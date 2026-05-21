import {
  normalizePhone,
  normalizeWebsite,
  clampRating,
  mapServices,
  isSalon,
  dedup,
} from "../src/validate.js";

// Export functions from validate.ts for testing
// Note: We need to make these functions exportable
// For now, we'll test the public API through the module

describe("validate", () => {
  // These tests assume the functions are exported
  // If they're not exported, we need to refactor validate.ts to export them

  describe("normalizePhone", () => {
    it("should return null for undefined", () => {
      expect(normalizePhone(undefined)).toBeNull();
    });

    it("should return null for empty string", () => {
      expect(normalizePhone("")).toBeNull();
    });

    it("should return null for short numbers", () => {
      expect(normalizePhone("123")).toBeNull();
    });

    it("should format 9-digit Polish number", () => {
      expect(normalizePhone("725365304")).toBe("+48 725 365 304");
    });

    it("should format 11-digit Polish number with country code", () => {
      expect(normalizePhone("48725365304")).toBe("+48 725 365 304");
    });

    it("should format international number", () => {
      expect(normalizePhone("+49 30 12345678")).toBe("+493012345678");
    });

    it("should handle phone with spaces and dashes", () => {
      expect(normalizePhone("+48 725-365-304")).toBe("+48 725 365 304");
    });
  });

  describe("normalizeWebsite", () => {
    it("should return null for undefined", () => {
      expect(normalizeWebsite(undefined)).toBeNull();
    });

    it("should return null for empty string", () => {
      expect(normalizeWebsite("")).toBeNull();
    });

    it("should add https:// if missing", () => {
      expect(normalizeWebsite("example.com")).toBe("https://example.com");
    });

    it("should keep existing https://", () => {
      expect(normalizeWebsite("https://example.com")).toBe(
        "https://example.com"
      );
    });

    it("should keep existing http://", () => {
      expect(normalizeWebsite("http://example.com")).toBe(
        "http://example.com"
      );
    });

    it("should return null for invalid URL", () => {
      expect(normalizeWebsite("not a url")).toBeNull();
    });
  });

  describe("clampRating", () => {
    it("should return null for undefined", () => {
      expect(clampRating(undefined)).toBeNull();
    });

    it("should return null for null", () => {
      expect(clampRating(null as any)).toBeNull();
    });

    it("should return null for negative rating", () => {
      expect(clampRating(-1)).toBeNull();
    });

    it("should return null for rating > 5", () => {
      expect(clampRating(6)).toBeNull();
    });

    it("should return valid rating", () => {
      expect(clampRating(4.5)).toBe(4.5);
    });

    it("should round to 1 decimal place", () => {
      expect(clampRating(4.567)).toBe(4.6);
    });

    it("should handle 0 rating", () => {
      expect(clampRating(0)).toBe(0);
    });

    it("should handle 5 rating", () => {
      expect(clampRating(5)).toBe(5);
    });
  });

  describe("mapServices", () => {
    it("should return empty array for undefined", () => {
      expect(mapServices(undefined)).toEqual([]);
    });

    it("should return empty array for empty types", () => {
      expect(mapServices([])).toEqual([]);
    });

    it("should map known types to services", () => {
      expect(mapServices(["hair_salon", "beauty_salon"])).toEqual([
        "Hair Styling",
        "Beauty Treatment",
      ]);
    });

    it("should not duplicate services", () => {
      expect(mapServices(["hair_salon", "hair_care"])).toEqual(["Hair Styling"]);
    });

    it("should ignore unknown types", () => {
      expect(mapServices(["restaurant", "gym"])).toEqual([]);
    });

    it("should handle mix of known and unknown types", () => {
      expect(mapServices(["hair_salon", "restaurant", "nail_salon"])).toEqual([
        "Hair Styling",
        "Nail Care",
      ]);
    });
  });

  describe("isSalon", () => {
    it("should return true for hair_salon type", () => {
      expect(isSalon(["hair_salon"], "Test Salon")).toBe(true);
    });

    it("should return true for beauty_salon type", () => {
      expect(isSalon(["beauty_salon"], "Test Salon")).toBe(true);
    });

    it("should return true for salon keyword in name", () => {
      expect(isSalon([], "Hair Salon Warsaw")).toBe(true);
    });

    it("should return true for fryzjer keyword in name", () => {
      expect(isSalon([], "Fryzjer Męski")).toBe(true);
    });

    it("should return false for non-salon business", () => {
      expect(isSalon(["restaurant"], "Pizza Place")).toBe(false);
    });

    it("should return false for empty types and no keywords", () => {
      expect(isSalon([], "Random Business")).toBe(false);
    });

    it("should return true for barber_shop type", () => {
      expect(isSalon(["barber_shop"], "Test")).toBe(true);
    });

    it("should return true for nail_salon type", () => {
      expect(isSalon(["nail_salon"], "Test")).toBe(true);
    });
  });

  describe("dedup", () => {
    it("should remove duplicates with same name and address", () => {
      const places = [
        {
          id: "1",
          displayName: { text: "Salon A" },
          formattedAddress: "Address 1",
        },
        {
          id: "2",
          displayName: { text: "Salon A" },
          formattedAddress: "Address 1",
        },
      ];
      expect(dedup(places)).toHaveLength(1);
    });

    it("should keep different salons", () => {
      const places = [
        {
          id: "1",
          displayName: { text: "Salon A" },
          formattedAddress: "Address 1",
        },
        {
          id: "2",
          displayName: { text: "Salon B" },
          formattedAddress: "Address 2",
        },
      ];
      expect(dedup(places)).toHaveLength(2);
    });

    it("should keep the one with more data when duplicate", () => {
      const places = [
        {
          id: "1",
          displayName: { text: "Salon A" },
          formattedAddress: "Address 1",
        },
        {
          id: "2",
          displayName: { text: "Salon A" },
          formattedAddress: "Address 1",
          rating: 4.5,
          websiteUri: "https://example.com",
        },
      ];
      const result = dedup(places);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2");
    });

    it("should skip entries with empty name", () => {
      const places = [
        { id: "1", displayName: { text: "" }, formattedAddress: "Address 1" },
        {
          id: "2",
          displayName: { text: "Salon B" },
          formattedAddress: "Address 2",
        },
      ];
      expect(dedup(places)).toHaveLength(1);
    });

    it("should normalize names before comparing", () => {
      const places = [
        {
          id: "1",
          displayName: { text: "  Salon  A  " },
          formattedAddress: "Address 1",
        },
        {
          id: "2",
          displayName: { text: "salon a" },
          formattedAddress: "address 1",
        },
      ];
      expect(dedup(places)).toHaveLength(1);
    });
  });
});
