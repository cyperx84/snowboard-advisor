/**
 * AvantLink affiliate link integration.
 *
 * Builds search URLs through AvantLink's product search API so clicks
 * are tracked as affiliate referrals. Configure AVANTLINK_WEBSITE_ID
 * and AVANTLINK_MERCHANT_ID in environment variables.
 */

const WEBSITE_ID = process.env.AVANTLINK_WEBSITE_ID ?? "";
const MERCHANT_ID = process.env.AVANTLINK_MERCHANT_ID ?? "";

const AVANTLINK_BASE = "https://classic.avantlink.com/api.php";

export function buildAffiliateSearchUrl(searchQuery: string): string | null {
  if (!WEBSITE_ID || !MERCHANT_ID) return null;

  const params = new URLSearchParams({
    affiliate_id: WEBSITE_ID,
    website_id: WEBSITE_ID,
    merchant_id: MERCHANT_ID,
    module: "ProductSearch",
    output: "html",
    search_term: searchQuery,
  });

  return `${AVANTLINK_BASE}?${params.toString()}`;
}

export function buildAffiliateLinkUrl(destinationUrl: string): string | null {
  if (!WEBSITE_ID) return null;

  const params = new URLSearchParams({
    tt: "cl",
    si: WEBSITE_ID,
    url: destinationUrl,
  });

  return `https://classic.avantlink.com/click.php?${params.toString()}`;
}

export function getAffiliateUrl(searchQuery: string): string {
  // Return affiliate search URL if configured, otherwise a generic search URL
  const affiliateUrl = buildAffiliateSearchUrl(searchQuery);
  if (affiliateUrl) return affiliateUrl;

  const fallback = new URLSearchParams({ q: searchQuery });
  return `https://www.google.com/search?${fallback.toString()}`;
}
