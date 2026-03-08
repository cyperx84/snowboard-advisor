import { buildAffiliateSearchUrl, buildAffiliateLinkUrl, getAffiliateUrl } from "@/lib/avantlink";

describe("avantlink", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe("buildAffiliateSearchUrl", () => {
    it("returns null when env vars are not configured", () => {
      delete process.env.AVANTLINK_WEBSITE_ID;
      delete process.env.AVANTLINK_MERCHANT_ID;
      expect(buildAffiliateSearchUrl("Burton Custom")).toBeNull();
    });

    it("builds a valid search URL when env vars are set", () => {
      process.env.AVANTLINK_WEBSITE_ID = "12345";
      process.env.AVANTLINK_MERCHANT_ID = "9876";
      const url = buildAffiliateSearchUrl("Burton Custom snowboard");
      expect(url).toContain("avantlink.com");
      expect(url).toContain("12345");
    });
  });

  describe("buildAffiliateLinkUrl", () => {
    it("returns null when AVANTLINK_WEBSITE_ID is not set", () => {
      delete process.env.AVANTLINK_WEBSITE_ID;
      expect(buildAffiliateLinkUrl("https://example.com/board")).toBeNull();
    });

    it("wraps a destination URL in the affiliate click URL", () => {
      process.env.AVANTLINK_WEBSITE_ID = "12345";
      const url = buildAffiliateLinkUrl("https://example.com/board");
      expect(url).toContain("classic.avantlink.com/click.php");
      expect(url).toContain("tt=cl");
    });
  });

  describe("getAffiliateUrl", () => {
    it("falls back to a Google search URL when not configured", () => {
      delete process.env.AVANTLINK_WEBSITE_ID;
      delete process.env.AVANTLINK_MERCHANT_ID;
      const url = getAffiliateUrl("Burton Custom snowboard");
      expect(url).toContain("google.com/search");
    });

    it("returns an AvantLink URL when configured", () => {
      process.env.AVANTLINK_WEBSITE_ID = "12345";
      process.env.AVANTLINK_MERCHANT_ID = "9876";
      const url = getAffiliateUrl("Burton Custom snowboard");
      expect(url).toContain("avantlink.com");
    });
  });
});
