import assert from "node:assert/strict";
import test from "node:test";
import { buildCspBannerHtml, CSP_BANNER_FORMATS, matchBannerMaterial } from "./banner-formats";

test("banner formats are exactly the four owner sizes", () => {
  assert.equal(CSP_BANNER_FORMATS.length, 4);
  assert.deepEqual(
    CSP_BANNER_FORMATS.map((f) => `${f.width}x${f.height}`),
    ["728x90", "300x250", "160x600", "1080x1080"],
  );
});

test("buildCspBannerHtml escapes and rejects unsafe URLs", () => {
  const ok = buildCspBannerHtml({
    imageUrl: "https://cdn.example.com/b.png",
    linkUrl: "/p/csp-0123456789ab/kompis_web?channel=referral_link&lang=en",
    width: 728,
    height: 90,
    alt: 'Kompis Web "banner"',
  });
  assert.ok(ok);
  assert.match(ok!, /href="\/p\/csp-0123456789ab\/kompis_web/);
  assert.match(ok!, /alt="Kompis Web &quot;banner&quot;"/);
  assert.equal(
    buildCspBannerHtml({
      imageUrl: "javascript:alert(1)",
      linkUrl: "https://example.com",
      width: 300,
      height: 250,
      alt: "x",
    }),
    null,
  );
  assert.equal(
    buildCspBannerHtml({
      imageUrl: "https://cdn.example.com/b.png",
      linkUrl: "http://insecure.example",
      width: 300,
      height: 250,
      alt: "x",
    }),
    null,
  );
});

test("matchBannerMaterial never invents assets", () => {
  assert.equal(matchBannerMaterial([], CSP_BANNER_FORMATS[0]), null);
  assert.equal(
    matchBannerMaterial([{ href: "/brand/kompis-web-product-visual.png", category: "product_images" }], CSP_BANNER_FORMATS[0]),
    null,
  );
  assert.deepEqual(
    matchBannerMaterial(
      [{ href: "/materials/kompis-web-728x90.png", category: "social" }],
      CSP_BANNER_FORMATS[0],
    ),
    { href: "/materials/kompis-web-728x90.png" },
  );
});
