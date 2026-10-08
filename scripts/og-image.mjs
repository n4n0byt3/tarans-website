import sharp from "sharp";

// Builds public/og.png, the 1200x630 preview shown when the site is shared on
// WhatsApp, iMessage, X, etc. Re-run with `node scripts/og-image.mjs` after
// changing the hero photo or tagline.
// Keep the size in the caption below in step with BOTTLE_SIZE in src/lib/products.js.
const W = 1200;
const H = 630;

// The bottle-and-smoke half of the homepage hero.
const hero = await sharp("public/hero-bg.webp")
  .extract({ left: 980, top: 0, width: 987, height: 799 })
  .resize({ height: H })
  .toBuffer();
const heroMeta = await sharp(hero).metadata();
const logo = await sharp("public/brand/logo.png").resize({ height: 56 }).toBuffer();

const text = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <g font-family="Helvetica, Arial, sans-serif" fill="#efe8e0">
    <text x="64" y="200" font-size="22" letter-spacing="6" fill="#e2a582" font-weight="700">PRE-ORDERS OPEN</text>
    <text x="64" y="275" font-size="52" font-weight="700">Grooming</text>
    <text x="64" y="340" font-size="52" font-weight="700">shouldn't feel like</text>
    <text x="64" y="405" font-size="52" font-weight="700">another job.</text>
    <text x="64" y="475" font-size="26" fill-opacity="0.7">Starting with beard oil.</text>
  </g>
</svg>`);

await sharp({
  create: { width: W, height: H, channels: 4, background: "#16130f" },
})
  .composite([
    { input: hero, left: W - heroMeta.width, top: 0 },
    { input: text, left: 0, top: 0 },
    { input: logo, left: 64, top: 80 },
  ])
  .png()
  .toFile("public/og.png");

console.log("wrote public/og.png");
