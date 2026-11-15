# Batch 1 — Setup Instructions

## What's in this batch
| File | Purpose |
|---|---|
| `package.json` | All dependencies |
| `tsconfig.json` | TypeScript config |
| `next.config.js` | Next.js config |
| `postcss.config.js` | PostCSS for Tailwind |
| `tailwind.config.ts` | Maroon + gold theme |
| `constants/theme.ts` | Design tokens + business rules |
| `types/index.ts` | Every TypeScript type |
| `lib/mockData.ts` | Seed data for all modules |
| `lib/utils.ts` | Shared helper functions |

---

## Step 1 — Create the project folder

Open your terminal and run:

```bash
mkdir TrustDoc-admin
cd TrustDoc-admin
```

---

## Step 2 — Copy all batch 1 files

Copy every file from this batch into the project root,
keeping the folder structure exactly as shown:

```
TrustDoc-admin/
├── package.json
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.ts
├── constants/
│   └── theme.ts
├── types/
│   └── index.ts
└── lib/
    ├── mockData.ts
    └── utils.ts
```

---

## Step 3 — Install dependencies

```bash
npm install
```

Expected output: something like "added 400 packages".
If you see errors, run: `npm install --legacy-peer-deps`

---

## Step 4 — Verify

Run this to check TypeScript has no errors in the files so far:

```bash
npx tsc --noEmit
```

Expected: no output (no errors).

> If you see "Cannot find module 'date-fns'" or similar,
> it means npm install didn't finish — run it again.

---

## Step 5 — Tell me you're done

Just reply **"Batch 1 done"** and I'll send Batch 2:
- Root layout
- Sidebar navigation
- Topbar
- Login page with 2FA
- Auth protection middleware

---

## Notes
- Do NOT create `app/` folder yet — that comes in Batch 2
- Do NOT run `npm run dev` yet — it will error without the app folder
- The `mockData.ts` is temporary — in Batch 10 we replace it with real Firebase calls
