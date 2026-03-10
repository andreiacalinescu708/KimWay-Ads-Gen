# Kimiway Ads Generator

O platformă web pentru generarea de reclame video folosind inteligență artificială.

## Funcționalități

- **Generare Script AI**: Folosește API-ul KIMI (Moonshot AI) pentru a genera scripturi profesionale de reclamă
- **Generare Video**: Transformă scripturile în video folosind API-ul Runway ML
- **Sistem de Tokenuri**: Plătește doar pentru ce folosești
- **OAuth**: Conectare cu Google și GitHub
- **Stripe**: Plăți securizate pentru cumpărarea tokenurilor
- **Dashboard Admin**: Gestionează utilizatorii și pachetele

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **AI**: KIMI API, Runway ML API

## Configurare

### 1. Clonează repository-ul

```bash
git clone <repository-url>
cd kimiway-ads
```

### 2. Instalează dependențele

```bash
npm install
```

### 3. Configurează variabilele de mediu

Copiază fișierul `.env.local` și completează cu datele tale:

```bash
cp .env.local .env.local
```

Variabile necesare:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kimiway_ads?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# KIMI API
KIMI_API_KEY="your-kimi-api-key"

# Runway API
RUNWAY_API_KEY="your-runway-api-key"
```

### 4. Configurează baza de date

```bash
# Generează clientul Prisma
npx prisma generate

# Rulează migrările
npx prisma migrate dev --name init

# (Opțional) Deschide Prisma Studio
npx prisma studio
```

### 5. Configurează Stripe

1. Creează un cont pe [Stripe](https://stripe.com)
2. Creează produse și prețuri în Dashboard
3. Configurează webhook-ul pentru `checkout.session.completed`
4. Adaugă `stripe listen --forward-to localhost:3000/api/stripe/webhook` pentru testare locală

### 6. Configurează OAuth

**Google:**
1. Mergi la [Google Cloud Console](https://console.cloud.google.com)
2. Creează un proiect nou
3. Configurează OAuth 2.0 credentials
4. Adaugă `http://localhost:3000/api/auth/callback/google` în authorized redirect URIs

**GitHub:**
1. Mergi la Settings > Developer settings > OAuth Apps
2. Creează o nouă aplicație
3. Adaugă `http://localhost:3000/api/auth/callback/github` în Authorization callback URL

### 7. Obține API Keys

**KIMI API:**
- Mergi la [Moonshot AI](https://platform.moonshot.cn)
- Creează un cont și generează un API key

**Runway ML API:**
- Mergi la [Runway ML](https://runwayml.com)
- Creează un cont și obține API key

### 8. Populează baza de date cu pachete

```bash
# Deschide Prisma Studio
npx prisma studio

# Adaugă manual câteva pachete în tabela TokenPackage:
# - Starter: 50 tokenuri, 9.99€
# - Pro: 150 tokenuri, 24.99€
# - Enterprise: 700 tokenuri, 99.99€
```

### 9. Pornește aplicația

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:3000`

## Structura Costurilor

| Acțiune | Cost Tokenuri |
|---------|---------------|
| Generare video (prima dată, cu watermark) | Gratis |
| Generare video (fără watermark) | 10 |
| Regenerare video | 5 |
| Edit script + regenerare | 8 |

## Deploy

### Vercel

```bash
npm i -g vercel
vercel
```

### Variabile de mediu necesare în production

Asigură-te că toate variabilele din `.env.local` sunt setate în environment-ul de production.

### Webhook Stripe în production

1. Mergi la Stripe Dashboard > Developers > Webhooks
2. Adaugă endpoint-ul: `https://your-domain.com/api/stripe/webhook`
3. Selectează evenimentul `checkout.session.completed`

## Comenzi utile

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Database
npx prisma migrate dev      # Creează migrare
npx prisma migrate deploy   # Aplică migrări în production
npx prisma generate         # Generează client Prisma
npx prisma studio           # GUI pentru baza de date
npx prisma db seed          # Populează cu date de test
```

## Licență

MIT
