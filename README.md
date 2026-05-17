# 🌱 SeedShelter

**Nutritional Survival Seed Vaults — Engineered for Complete Family Sustenance**

A zero-cost MVP landing page for market validation. Static site hosted on GitHub Pages with a Google Apps Script backend for waitlist capture.

---

## Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Static Site | GitHub Pages | Free |
| Waitlist Backend | Google Apps Script → Google Sheets | Free |
| Checkout (Phase 2) | Stripe Payment Links | 2.9% + 30¢/txn |
| CDN/SSL | GitHub Pages (built-in) | Free |

## Quick Start (Local Preview)

1. Clone the repo
2. Open `index.html` in your browser — or use VS Code Live Server extension for hot-reload

```bash
git clone https://github.com/YOUR_USERNAME/seedshelter.git
cd seedshelter
# Open in VS Code → right-click index.html → "Open with Live Server"
```

## Deployment

### 1. GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` → `/ (root)`
4. Your site is live at `https://YOUR_USERNAME.github.io/seedshelter/`

### 2. Google Apps Script (Waitlist Backend)

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Paste the contents of `scripts/waitlist.gs` into `Code.gs`
4. Click **Deploy → New Deployment**
5. Type: **Web app** | Execute as: **Me** | Access: **Anyone**
6. Copy the Web App URL
7. Open `js/main.js` and replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your URL
8. Push the update to GitHub

Emails will automatically appear in a Google Sheet called **"SeedShelter Waitlist"** in your Google Drive.

### 3. Stripe Payment Links (Phase 2 — Post-Launch)

When ready to accept payments:

1. Create a [Stripe account](https://stripe.com) (free)
2. Go to **Payment Links** in the Stripe Dashboard
3. Create 4 links:
   - **Go-Bag Pouch** — $35.00
   - **90-Day Starter Kit** — $89.00
   - **Family Vault** — $179.00
   - **Homestead Vault** — $349.00
4. Set the success redirect URL to: `https://YOUR_DOMAIN/success.html`
5. Open `index.html` and replace the `href="#waitlist"` on each product's CTA button with the corresponding Stripe Payment Link URL
6. Update button text from "Join Waitlist" back to "Pre-Order"

### 4. Custom Domain (Optional)

1. Purchase `seedshelter.com` from your preferred registrar
2. Create a `CNAME` file in the repo root containing `seedshelter.com`
3. Configure DNS per [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Project Structure

```
seedshelter/
├── index.html                  # Main landing page (10+ sections)
├── success.html                # Post-checkout confirmation
├── waitlist-confirmed.html     # Waitlist confirmation
├── css/
│   └── style.css               # Earth aesthetic design system
├── js/
│   └── main.js                 # Nav, animations, form, table sorting
├── images/
│   ├── go-bag-mockup.png       # Go-Bag product image
│   ├── starter-kit-mockup.png  # 90-Day Kit product image
│   ├── family-vault-mockup.png # Family Vault product image
│   ├── homestead-vault-mockup.png # Homestead Vault product image
│   └── about-hero.png          # About section hero image
├── scripts/
│   └── waitlist.gs             # Google Apps Script (copy to GAS)
├── .gitignore
├── .nojekyll                   # Disable Jekyll on GitHub Pages
└── README.md
```

## Page Sections

| Section | Anchor | Description |
|---------|--------|-------------|
| Hero | `#top` | Animated particle canvas, brand tagline, dual CTA |
| Trust Bar | — | 5 trust signals (Non-GMO, Heirloom, Replantable, USA, Mylar) |
| Products | `#products` | 4-tier product grid with expandable Field Guide panels |
| About | `#about` | Brand mission, macronutrient philosophy |
| Seed Chart | `#seed-chart` | Sortable 18-variety reference table |
| Why SeedShelter | `#why` | 3 feature cards (Caloric Math, Storage, Heirloom) |
| Comparison | `#compare` | vs. My Patriot Supply, Seed Armory, Amazon |
| FAQ | `#faq` | 5 accordion items addressing key objections |
| Seed Saving | `#seed-saving` | 4-step visual guide (Plant → Harvest → Save → Replant) |
| Waitlist | `#waitlist` | Email capture form → Google Sheets |

## Product Tiers

| Product | Price | Target | Description |
|---------|-------|--------|-------------|
| Go-Bag Pouch | $35 | Impulse / Tripwire | 72-hour fast-germinating seeds, 14-day harvest |
| 90-Day Starter Kit | $89 | Bridge tier | 1-person, 90-day balanced nutrition |
| Family Vault | $179 | Anchor product | Family of 5, full year, 3-gal Gamma-sealed bucket |
| Homestead Vault | $349 | Premium tier | Multi-year seed bank, 5-gal bucket, includes grain seeds |

## License

All rights reserved © 2026 SeedShelter
