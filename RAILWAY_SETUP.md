# Setup cu Railway PostgreSQL

## Pasul 1: Creează baza de date pe Railway

1. Mergi la [https://railway.app](https://railway.app) și loghează-te
2. Click pe **"New Project"** sau intră în proiectul tău existent
3. Click pe **"New"** → **"Database"** → **"Add PostgreSQL"**
4. Așteaptă ~30 secunde să se provisioneze baza de date

## Pasul 2: Obține DATABASE_URL

1. Click pe baza de date PostgreSQL creată
2. Mergi la tab-ul **"Connect"**
3. Copiază **"Postgres Connection URL"**
   - Arată cam așa: `postgresql://postgres:abc123@roundhouse.proxy.rlwy.net:45678/railway`

## Pasul 3: Configurează .env.local

1. Copiază `.env.local.railway` în `.env.local`
2. Înlocuiește `DATABASE_URL` cu URL-ul copiat de la Railway
3. Adaugă API-urile tale KIMI și Runway

```bash
DATABASE_URL="postgresql://postgres:PAROLA_TA@host.railway.app:PORT/railway"
KIMI_API_KEY="sk-ta..."
RUNWAY_API_KEY="key_..."
NEXTAUTH_SECRET="un-secret-generat-aleatoriu"
```

## Pasul 4: Setup Local (fără Docker!)

```bash
# 1. Instalează dependențele
npm install

# 2. Generează Prisma client
npx prisma generate

# 3. Aplică migrările în baza de date Railway
npx prisma migrate dev --name init

# 4. Populează cu date inițiale
npx tsx prisma/seed.ts
```

## Pasul 5: Testează conexiunea

```bash
# Verifică dacă poți conecta la Railway DB
npx prisma studio
```

Ar trebui să se deschidă Prisma Studio în browser la `http://localhost:5555`

## Pasul 6: Pornește aplicația

```bash
npm run dev
```

## Deploy pe Railway (Opțional)

Dacă vrei să deploy-ui și aplicația Next.js pe Railway:

1. Creează un **New Service** → **GitHub Repo**
2. Selecteză repo-ul cu proiectul
3. În **Variables**, adaugă toate variabilele din `.env.local`
4. Railway va detecta automat că e Next.js și va face deploy

### Pentru deploy, mai ai nevoie de:

```bash
# Crează un fișier railway.json în root
```

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Troubleshooting

### Eroare: "Connection refused"
- Verifică dacă baza de date e pornită în Railway Dashboard
- Verifică dacă URL-ul e corect copiat

### Eroare: "SSL/TLS required"
Adaugă `?sslmode=require` la finalul DATABASE_URL:
```
DATABASE_URL="postgresql://.../railway?sslmode=require"
```

### Eroare: "P1001: Can't reach database"
- Railway poate să schimbe hostname-ul. Mergi din nou în Connect și copiază URL-ul proaspăt.

## Avantaje Railway vs Local:

| | Local PostgreSQL | Railway PostgreSQL |
|---|---|---|
| **Setup** | Trebuie instalat | Click, gata |
| **Backup** | Manual | Automat |
| **Acces** | Doar local | De oriunde |
| **Deploy** | Nu merge pe Vercel | Merge peste tot |
| **Preț** | Gratis | ~5$/lună (sau free tier) |

**Recomandare:** Folosește Railway și pentru DB și pentru deploy! 🚀
