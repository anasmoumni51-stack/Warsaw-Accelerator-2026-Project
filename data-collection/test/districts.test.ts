import { getDistrict, WARSAW_DISTRICTS } from "../src/utils/districts.js";
import type { DistrictCenter } from "../src/utils/types.js";

describe("districts", () => {
  describe("getDistrict", () => {
    it("should return correct district for central Warsaw coordinates", () => {
      // Śródmieście center
      const district = getDistrict(52.2297, 21.0122);
      expect(district).toBe("Śródmieście");
    });

    it("should return correct district for Mokotów coordinates", () => {
      const district = getDistrict(52.1922, 21.0083);
      expect(district).toBe("Mokotów");
    });

    it("should return correct district for Wilanów coordinates", () => {
      const district = getDistrict(52.1700, 21.0900);
      expect(district).toBe("Wilanów");
    });

    it("should return nearest district for coordinates between two districts", () => {
      // Between Śródmieście and Ochota
      const district = getDistrict(52.2200, 20.9960);
      expect(district).toBe("Śródmieście");
    });

    it("should return a valid district for coordinates outside Warsaw", () => {
      // Coordinates far from Warsaw (Berlin)
      const district = getDistrict(52.5200, 13.4050);
      expect(WARSAW_DISTRICTS.map((d: DistrictCenter) => d.name)).toContain(district);
    });

    it("should return a valid district for coordinates at Warsaw edge", () => {
      // Edge of Warsaw
      const district = getDistrict(52.1500, 20.8800);
      expect(WARSAW_DISTRICTS.map((d: DistrictCenter) => d.name)).toContain(district);
    });

    it("should always return a district name from the list", () => {
      const district = getDistrict(52.20, 21.00);
      expect(WARSAW_DISTRICTS.some((d: DistrictCenter) => d.name === district)).toBe(true);
    });
  });

  describe("WARSAW_DISTRICTS", () => {
    it("should have 18 districts", () => {
      expect(WARSAW_DISTRICTS).toHaveLength(18);
    });

    it("should have unique district names", () => {
      const names = WARSAW_DISTRICTS.map((d: DistrictCenter) => d.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it("should have valid coordinates for each district", () => {
      for (const district of WARSAW_DISTRICTS) {
        expect(district.lat).toBeGreaterThan(50);
        expect(district.lat).toBeLessThan(55);
        expect(district.lng).toBeGreaterThan(18);
        expect(district.lng).toBeLessThan(24);
      }
    });
  });
});
