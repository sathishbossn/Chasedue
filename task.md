### Phase 1: Project & Stack Setup

- [ ] **Initialize Expo app & routing** — **Touches**: `package.json`, `app.json`, `eas.json`, `app/_layout.tsx`, `app/(auth)/`, `app/(app)/` — **Tag**: **must-have**
- [ ] **Configure Expo for Web + Android** — **Touches**: `app.json`, `tsconfig.json`, `babel.config.js` — **Tag**: **must-have**
- [ ] **Add NativeWind + Tailwind (carrot theme)** — **Touches**: `tailwind.config.js`, `global.css`, `app/_layout.tsx` — **Tag**: **must-have**
- [ ] **Base UI components (Button, Input, Card)** — **Touches**: `components/ui/Button.tsx`, `components/ui/Input.tsx`, `components/ui/Card.tsx` — **Tag**: **must-have**
- [ ] **App shell & navigation (auth / app stacks)** — **Touches**: `app/(auth)/_layout.tsx`, `app/(app)/_layout.tsx`, `components/NavBar.tsx` — **Tag**: **must-have**
- [ ] **Config management for env vars** — **Touches**: `.env`, `.env.example`, `app.config.ts` or `lib/config.ts` — **Tag**: **must-have**

---

### Phase 2: Supabase Setup (DB + RLS)

- [ ] **Create Supabase project & client helper** — **Touches**: `lib/supabase.ts` — **Tag**: **must-have**
- [ ] **Define `profiles` table** (user_id PK, name, phone, `is_pro`, timestamps) — **Touches**: `supabase/migrations/xxxx_profiles.sql` — **Tag**: **must-have**
- [ ] **Define `clients` table** (id, user_id, name, phone, email?, notes, timestamps) — **Touches**: `supabase/migrations/xxxx_clients.sql` — **Tag**: **must-have**
- [ ] **Define `invoices` table** (id, user_id, client_id, amount, currency, due_date, status, reminder_count, last_chased_at, created_at) — **Touches**: `supabase/migrations/xxxx_invoices.sql` — **Tag**: **must-have**
- [ ] **Add indexes & FKs** (user_id, client_id, due_date, status) — **Touches**: `supabase/migrations/xxxx_indexes.sql` — **Tag**: **must-have**
- [ ] **Enable RLS on all tables** — **Touches**: `supabase/migrations/xxxx_rls_enable.sql` — **Tag**: **must-have**
- [ ] **Owner-only RLS policies** (`auth.uid()` matches `user_id`) — **Touches**: `supabase/migrations/xxxx_rls_policies.sql` — **Tag**: **must-have**
- [ ] **Optional dashboard view / RPC for totals** — **Touches**: `supabase/migrations/xxxx_dashboard_view.sql` — **Tag**: **nice-to-have**

---

### Phase 3: Auth & Profile

- [ ] **Implement Supabase email/OTP sign-in screen** — **Touches**: `app/(auth)/login.tsx`, `lib/auth.ts` — **Tag**: **must-have**
- [ ] **Auth context + session provider** — **Touches**: `context/AuthContext.tsx`, `app/_layout.tsx`, `app/(app)/_layout.tsx` — **Tag**: **must-have**
- [ ] **Route guards (redirect unauthenticated → login)** — **Touches**: `app/(app)/_layout.tsx`, `context/AuthContext.tsx` — **Tag**: **must-have**
- [ ] **Profile bootstrap on first login (`profiles` insert)** — **Touches**: `lib/profile.ts`, `lib/auth.ts` — **Tag**: **must-have**
- [ ] **Profile settings screen (name, WhatsApp phone)** — **Touches**: `app/(app)/settings/profile.tsx`, `components/forms/ProfileForm.tsx` — **Tag**: **must-have**
- [ ] **Display plan status (`Free` / `Pro`)** — **Touches**: `app/(app)/settings/profile.tsx`, `lib/profile.ts` — **Tag**: **must-have**
- [ ] **Logout action** — **Touches**: `components/NavBar.tsx`, `lib/auth.ts` — **Tag**: **must-have**

---

### Phase 4: Core Entities (Clients, Invoices)

- [ ] **Clients list screen** (table/card view with search) — **Touches**: `app/(app)/clients/index.tsx`, `lib/clients.ts`, `components/clients/ClientList.tsx` — **Tag**: **must-have**
- [ ] **Create / edit client form** — **Touches**: `app/(app)/clients/new.tsx`, `app/(app)/clients/[id].tsx`, `components/clients/ClientForm.tsx` — **Tag**: **must-have**
- [ ] **Client deletion (soft or hard) with confirm** — **Touches**: `components/clients/ClientActions.tsx`, `lib/clients.ts` — **Tag**: **nice-to-have**
- [ ] **Invoices list screen** (filter by status/client) — **Touches**: `app/(app)/invoices/index.tsx`, `lib/invoices.ts`, `components/invoices/InvoiceList.tsx` — **Tag**: **must-have**
- [ ] **Create invoice form** (select client, amount, due_date, status default `pending`) — **Touches**: `app/(app)/invoices/new.tsx`, `components/invoices/InvoiceForm.tsx` — **Tag**: **must-have**
- [ ] **Invoice detail screen** (status toggle, edit fields) — **Touches**: `app/(app)/invoices/[id].tsx`, `lib/invoices.ts` — **Tag**: **must-have**
- [ ] **Mark invoice as paid / unpaid** — **Touches**: `app/(app)/invoices/[id].tsx`, `lib/invoices.ts` — **Tag**: **must-have**
- [ ] **Form validation (amount, dates, phone)** — **Touches**: `lib/validation.ts`, `components/forms/*` — **Tag**: **must-have**

---

### Phase 5: Dashboard & Chaser Feature

- [ ] **Dashboard summary cards** (total due, total collected, overdue count) — **Touches**: `app/(app)/index.tsx`, `lib/dashboard.ts`, `components/dashboard/SummaryCards.tsx` — **Tag**: **must-have**
- [ ] **Overdue invoices list on dashboard** — **Touches**: `app/(app)/index.tsx`, `lib/invoices.ts`, `components/dashboard/OverdueList.tsx` — **Tag**: **must-have**
- [ ] **WhatsApp “Chase” button on invoice detail** — **Touches**: `components/chase/ChaseButton.tsx`, `app/(app)/invoices/[id].tsx`, `lib/whatsapp.ts` — **Tag**: **must-have**
- [ ] **WhatsApp deeplink builder** (prefill message with client name, invoice amount, due date, status) — **Touches**: `lib/whatsapp.ts` — **Tag**: **must-have**
- [ ] **Update `reminder_count` and `last_chased_at` on chase** — **Touches**: `lib/invoices.ts`, `app/(app)/invoices/[id].tsx` — **Tag**: **must-have**
- [ ] **Basic chase history snippet on invoice detail** — **Touches**: `components/chase/ChaseInfo.tsx`, `lib/invoices.ts` — **Tag**: **nice-to-have**

---

### Phase 6: Free vs Pro Limits

- [ ] **Plan model in profile (`is_pro` boolean)** — **Touches**: `supabase/migrations/xxxx_profiles_add_is_pro.sql`, `lib/profile.ts` — **Tag**: **must-have**
- [ ] **Compute active invoices count for current user** — **Touches**: `lib/usage.ts`, `lib/invoices.ts` — **Tag**: **must-have**
- [ ] **Enforce Free limit: max 3 active invoices (UI guard)** — **Touches**: `app/(app)/invoices/new.tsx`, `components/invoices/InvoiceForm.tsx`, `components/paywall/LimitBanner.tsx` — **Tag**: **must-have**
- [ ] **Server-side enforcement of Free limit** (check in insert RPC or trigger) — **Touches**: `supabase/migrations/xxxx_invoice_limit_rpc.sql`, `lib/invoices.ts` — **Tag**: **must-have**
- [ ] **Upgrade CTA surfaces when hitting limit** — **Touches**: `app/(app)/invoices/index.tsx`, `components/paywall/UpgradeCTA.tsx` — **Tag**: **must-have**
- [ ] **Pro users bypass limit** — **Touches**: `lib/usage.ts`, `lib/profile.ts` — **Tag**: **must-have**

---

### Phase 7: Razorpay Integration (basic)

- [ ] **Upgrade/Plans screen (₹99/mo Pro details)** — **Touches**: `app/(app)/upgrade.tsx`, `components/paywall/Plans.tsx` — **Tag**: **must-have**
- [ ] **Manual Pro activation flow (for early users)** — **Touches**: `supabase/migrations/xxxx_profiles_seed_pro.sql` or admin note, `lib/profile.ts` — **Tag**: **must-have**
- [ ] **Razorpay order creation Edge Function (skeleton)** — **Touches**: `supabase/functions/create-razorpay-order/index.ts`, `lib/billing.ts` — **Tag**: **nice-to-have**
- [ ] **Razorpay webhook handler (mark `is_pro` on payment success)** — **Touches**: `supabase/functions/razorpay-webhook/index.ts`, `supabase/migrations/xxxx_billing_events.sql` — **Tag**: **nice-to-have**
- [ ] **Client-side Razorpay checkout trigger from Upgrade screen** — **Touches**: `app/(app)/upgrade.tsx`, `lib/billing.ts` — **Tag**: **nice-to-have**

---

### Phase 8: Testing & Deployment

- [ ] **Manual test script for core flow** (login → add client → add invoice → chase → mark paid) — **Touches**: `docs/testing.md` or `README.md` — **Tag**: **must-have**
- [ ] **Quick validation tests for WhatsApp message builder & limits** — **Touches**: `lib/whatsapp.ts`, `lib/usage.ts`, `__tests__/*` — **Tag**: **nice-to-have**
- [ ] **RLS sanity checks (no cross-user data)** — **Touches**: `supabase/migrations/test_queries.sql`, `docs/security.md` — **Tag**: **must-have**
- [ ] **Configure and deploy web (Expo web → Vercel/Netlify)** — **Touches**: `vercel.json` or `netlify.toml`, `.env.production`, `README.md` — **Tag**: **must-have**
- [ ] **Configure Android build via EAS (icon, splash, package name)** — **Touches**: `app.json`, `assets/icon.png`, `assets/splash.png`, `eas.json` — **Tag**: **must-have**
- [ ] **Production config checklist** (Supabase keys, redirect URLs, WhatsApp behavior docs, Razorpay keys later) — **Touches**: `docs/release-checklist.md` — **Tag**: **must-have**