import {
  normalize,
  cleanName,
  normalizePhone,
  normalizeWebsite,
  clampRating,
  mapServices,
  dedup,
  assignPriceRange,
} from "../src/validate.js";

describe("validate", () => {
  describe("normalize", () => {
    it("should lowercase, trim, and collapse spaces", () => {
      expect(normalize("  Hello   World  ")).toBe("hello world");
      expect(normalize("TEST")).toBe("test");
      expect(normalize("")).toBe("");
    });
  });

  describe("cleanName", () => {
    it("should remove decorative symbols", () => {
      expect(cleanName("★ Salon Bella ★")).toBe("Salon Bella");
      expect(cleanName("✦ Hair Studio ✦")).toBe("Hair Studio");
      expect(cleanName("✂️ Barber Shop")).toBe("Barber Shop");
    });

    it("should remove Warszawa/Warsaw suffixes", () => {
      expect(cleanName("Salon Bella Warszawa")).toBe("Salon Bella");
      expect(cleanName("Hair Studio, Warsaw")).toBe("Hair Studio");
      expect(cleanName("Barber Shop - Warszawa")).toBe("Barber Shop");
    });

    it("should trim to 80 characters", () => {
      const longName = "A".repeat(100);
      expect(cleanName(longName).length).toBe(80);
    });

    it("should collapse multiple spaces", () => {
      expect(cleanName("Salon    Bella")).toBe("Salon Bella");
    });

    it("should handle combined cleaning", () => {
      expect(cleanName("★ Salon  Bella ✦ Warszawa")).toBe("Salon Bella");
    });
  });

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

    it("should handle 12+ digit numbers correctly", () => {
      expect(normalizePhone("4872536530412")).toBe("+48 725 365 304");
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

    it("should dedupe using cleanName (city suffix)", () => {
      const places = [
        {
          id: "1",
          displayName: { text: "Salon Bella Warszawa" },
          formattedAddress: "Address 1",
        },
        {
          id: "2",
          displayName: { text: "Salon Bella" },
          formattedAddress: "Address 1",
        },
      ];
      expect(dedup(places)).toHaveLength(1);
    });

    it("should dedupe using cleanName (symbols)", () => {
      const places = [
        {
          id: "1",
          displayName: { text: "★ Salon Bella ★" },
          formattedAddress: "Address 1",
        },
        {
          id: "2",
          displayName: { text: "Salon Bella" },
          formattedAddress: "Address 1",
        },
      ];
      expect(dedup(places)).toHaveLength(1);
    });
  });

  describe("assignPriceRange", () => {
    it("should assign zł zł zł to premium district + multiple services", () => {
      expect(assignPriceRange("Śródmieście", ["Hair Styling", "Beauty Treatment"])).toBe("zł zł zł");
      expect(assignPriceRange("Wola", ["Nail Care", "Hair Styling"])).toBe("zł zł zł");
      expect(assignPriceRange("Mokotów", ["Barber", "Beauty Treatment"])).toBe("zł zł zł");
    });

    it("should assign zł zł zł to premium district + premium service (even if single)", () => {
      expect(assignPriceRange("Śródmieście", ["Skin Care"])).toBe("zł zł zł");
      expect(assignPriceRange("Wola", ["Beauty Treatment"])).toBe("zł zł zł");
      expect(assignPriceRange("Mokotów", ["Makeup"])).toBe("zł zł zł");
    });

    it("should assign zł zł to premium district with single budget service", () => {
      expect(assignPriceRange("Śródmieście", ["Barber"])).toBe("zł zł");
      expect(assignPriceRange("Wola", ["Nail Care"])).toBe("zł zł");
      expect(assignPriceRange("Mokotów", ["Hair Styling"])).toBe("zł zł");
    });

    it("should assign zł zł to mid district with 2+ services", () => {
      expect(assignPriceRange("Żoliborz", ["Hair Styling", "Nail Care"])).toBe("zł zł");
      expect(assignPriceRange("Ochota", ["Barber", "Beauty Treatment"])).toBe("zł zł");
      expect(assignPriceRange("Ursynów", ["Nail Care", "Hair Styling"])).toBe("zł zł");
    });

    it("should assign zł to mid district with single service", () => {
      expect(assignPriceRange("Żoliborz", ["Hair Styling"])).toBe("zł");
      expect(assignPriceRange("Ochota", ["Barber"])).toBe("zł");
      expect(assignPriceRange("Bielany", ["Nail Care"])).toBe("zł");
    });

    it("should assign zł to budget districts regardless of services", () => {
      expect(assignPriceRange("Targówek", ["Hair Styling", "Beauty Treatment"])).toBe("zł");
      expect(assignPriceRange("Bemowo", ["Skin Care", "Makeup"])).toBe("zł");
      expect(assignPriceRange("Białołęka", ["Barber"])).toBe("zł");
    });

    it("should assign zł to unknown districts", () => {
      expect(assignPriceRange("Unknown", ["Hair Styling"])).toBe("zł");
      expect(assignPriceRange("Some Random District", ["Beauty Treatment", "Skin Care"])).toBe("zł");
    });
  });
});
