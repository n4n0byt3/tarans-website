# AZAD BLACK — online store

A beard oil store built with Next.js. Customers browse products, add them to a
basket, and pay by card through Stripe. Order emails are sent with Resend.

**If you are taking this site over, read [HANDOVER.md](./HANDOVER.md) first.**
It walks through putting the site live on Vercel step by step.

---

## Running it on your own computer

You need [Node.js](https://nodejs.org) 20 or newer installed.

```bash
npm install          # install dependencies (first time only)
npm run dev          # start the site at http://localhost:3000
```

Other commands:

```bash
npm run build        # make a production build (checks everything compiles)
npm start            # run that production build locally
npm run lint         # check code style
```

## Environment variables

Copy `.env.local.example` to `.env.local` and fill it in. That file is
deliberately **never committed to git** — it holds secrets.

| Variable | What it's for | Where to get it |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Taking payments | Stripe → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe's public key | Same page as above |
| `STRIPE_WEBHOOK_SECRET` | Verifies order notifications are really from Stripe | Stripe → Developers → Webhooks |
| `NEXT_PUBLIC_SITE_URL` | The site's real web address | Your domain, e.g. `https://azadblack.co.uk` |
| `RESEND_API_KEY` | Sending order emails | resend.com → API Keys |
| `EMAIL_FROM` | The "from" address on emails | Must use a domain verified in Resend |
| `OWNER_EMAIL` | Where new-order alerts go | Your own inbox |
| `ADMIN_PASSWORD` | Password for the `/admin` orders page | Choose a strong one |
| `ADMIN_SESSION_SECRET` | Keeps the admin login secure | Run `openssl rand -hex 32` |

## How the shop works

AZAD BLACK is set up as a new brand taking **pre-orders** for its first
product, a beard oil. The site's job is to turn visitors into an email list and
pre-orders. Everything below can be changed without touching page layouts.

### The settings you'll actually change

**`src/lib/site-config.js`**:

| Setting | What it does |
| --- | --- |
| `preorder.shipEstimate` | `null` = "ship date to be confirmed" everywhere. Set it to e.g. `"in early December 2026"` and every page, the basket, checkout and emails say "Expected to ship in early December 2026." |
| `offer.percentOff` / `offer.validHours` | The pop-up discount (10%, valid 24 hours). If you change `percentOff`, also change `couponId` — Stripe coupons can't be edited, so a new one is created. |
| `tagline`, `description` | The homepage headline and the philosophy line. |
| `flatShippingCents`, `freeShippingThresholdCents` | Delivery price and free-delivery threshold. |
| `instagram`, `tiktok`, `supportEmail` | Contact details. Empty social links are hidden. |

**`src/lib/products.js`**: the bottle size (`BOTTLE_SIZE`), the three packs and
their prices (in **pence** — `1399` is £13.99), what the oil does, and the
ingredients. The crossed-out prices are worked out automatically from the
single-bottle price, so they're always genuine.

**Brand images**:

| File | What it is |
| --- | --- |
| `public/brand/logo.png` | The AZAD BLACK wordmark on a transparent background — nav, footer, pop-up, share image |
| `src/app/apple-icon.png` | The square logo, used when someone saves the site to their phone's home screen |
| `public/products/beard-oil.png` | The labelled bottle — homepage card and first product photo |
| `public/products/bottle-*.png` | The other product page photos, padded out to squares. The list and order is `gallery` in `src/lib/products.js` |
| `public/products/feature-*.png` | The three small tiles under the product photos |

The labelled bottle and the feature tiles are cut from the brand's product
mock-up, so the tiles are small (about 90px). Replace any of them with a
real photo under the same file name.

After changing the logo, run `node scripts/og-image.mjs` to rebuild the share
image.

**`src/lib/faqs.js`**: the FAQ. The same answers also feed Google and
`/llms.txt`.

### Pages

- `/` — hero → our story → badges → the beard oil (pre-order) → FAQ
- `/beard-oil` — the product page: photos, the 1/2/3-bottle options,
  pre-order button, and product details. Old `/products/...` links redirect
  here
- `/shipping`, `/returns`, `/terms`, `/privacy` — the legal pages
- `/admin` — orders, the ship-date email, and the sign-up export
- `/llms.txt` — a plain summary of the shop for AI assistants

### The discount pop-up

Shows once, 6 seconds after someone lands (or a third of the way down the
page), only on the homepage and the product page. Close it and it stays away for a
week. On a phone it slides up from the bottom rather than covering the page.

Entering an email gives that person their **own** Stripe code: 10% off, single
use, expiring 24 hours later. Stripe enforces both limits. The same email
always gets the same code, so signing up again can't restart the clock. The
code is applied automatically at checkout on that device, emailed to them,
and can be typed in at checkout on any other device.

### What happens when someone pre-orders

1. They open the beard oil, choose 1, 2 or 3 bottles and click **Pre-order**,
   then **Pre-order securely** in the basket. Their discount is applied if they unlocked one.
2. They pay on Stripe's secure page, which shows the pre-order terms next to
   the pay button. Card details never touch this site.
3. Stripe notifies `/api/webhooks/stripe`, which emails the customer a
   pre-order confirmation and emails **you** the order and delivery address.
4. When you know the ship date: update `preorder.shipEstimate`, then on
   `/admin` use **Email the ship date** to tell everyone who's waiting.
5. When stock arrives and you post each parcel, click **Mark as out for
   delivery** on `/admin` (add a tracking number if you have one).

Customers can cancel any time before their order ships — refund them in the
Stripe dashboard (Payments → the payment → Refund).

There is no separate database. Stripe holds the orders and the sign-ups, and
the site reads them back.

### The admin page

Go to `https://your-domain.co.uk/admin` and enter your `ADMIN_PASSWORD`.

- **Email sign-ups** — how many people have joined, and a **Download CSV** of
  every email address. This is your mailing list, and it works even if Resend
  isn't set up to store contacts.
- **Tell customers the ship date** — emails every unshipped pre-order. Safe to
  re-run: nobody gets the same date twice.
- **Orders** — each paid order with its items, address and email, and the
  **Mark as out for delivery** button. Clicking twice won't double-email.

## Sending order emails

Emails go out through [Resend](https://resend.com).

**Important:** until you verify a domain in Resend, it will only deliver email
to the address that owns the Resend account. Real customers will not receive
anything. To fix that:

1. Go to resend.com → **Domains** → **Add Domain** and enter `azadblack.co.uk`.
2. Resend shows you a few DNS records (usually `MX`, `TXT`/SPF and DKIM).
3. Add those records wherever your domain is registered (e.g. GoDaddy,
   Namecheap, Cloudflare).
4. Wait for Resend to show the domain as **Verified** — usually minutes, but
   it can take a few hours.
5. Set `EMAIL_FROM` to something on that domain, e.g.
   `AZAD BLACK <orders@azadblack.co.uk>`, and redeploy.

Until that's done the site still works and still takes payments — only the
customer emails are held back.

## Security notes

- Prices are always recalculated on the server from `products.js`, so a
  customer editing the page in their browser cannot pay less than the real
  price.
- The Stripe webhook verifies Stripe's signature, so nobody can fake an order.
- The thank-you page asks Stripe whether the payment really succeeded before
  confirming anything.
- The `/admin` page is password protected, its login cookie is signed and
  cannot be read by JavaScript, and search engines are told not to index it.
- Security headers (HSTS, clickjacking and MIME-sniffing protection) are set
  in `next.config.mjs`.
- Never commit `.env.local`, and never paste secret keys into chat or email.
  If a key leaks, roll it in the Stripe/Resend dashboard straight away.
