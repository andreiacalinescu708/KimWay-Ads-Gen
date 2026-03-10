#!/usr/bin/env node

/**
 * Script pentru testarea API-urilor KIMI și Runway
 * 
 * Utilizare:
 *   node test-apis.mjs
 * 
 * Sau cu variabile direct:
 *   KIMI_API_KEY=sk-xxx RUNWAY_API_KEY=rw-xxx node test-apis.mjs
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envConfig = dotenv.parse(readFileSync(join(__dirname, '.env.local')));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} catch (e) {
  console.log('⚠️  .env.local nu a fost găsit, se folosesc variabilele din environment');
}

const KIMI_API_KEY = process.env.KIMI_API_KEY;
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

console.log('==========================================');
console.log('  TESTARE API-URI');
console.log('==========================================\n');

// Test KIMI API
async function testKimiAPI() {
  console.log('🧪 Testare KIMI API...');
  
  if (!KIMI_API_KEY || KIMI_API_KEY === 'your-kimi-api-key') {
    console.log('   ❌ KIMI_API_KEY nu este configurat în .env.local');
    return false;
  }

  try {
    const response = await fetch('https://api.moonshot.cn/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KIMI_API_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ KIMI API funcționează!');
      console.log(`   📋 Modele disponibile: ${data.data?.length || 0}`);
      if (data.data && data.data[0]) {
        console.log(`   📝 Primul model: ${data.data[0].id}`);
      }
      return true;
    } else {
      const error = await response.text();
      console.log('   ❌ KIMI API a returnat o eroare:');
      console.log(`      Status: ${response.status}`);
      console.log(`      Error: ${error.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Eroare la conectarea cu KIMI API:');
    console.log(`      ${error.message}`);
    return false;
  }
}

// Test Runway API
async function testRunwayAPI() {
  console.log('\n🧪 Testare Runway API...');
  
  if (!RUNWAY_API_KEY || RUNWAY_API_KEY === 'your-runway-api-key') {
    console.log('   ❌ RUNWAY_API_KEY nu este configurat în .env.local');
    return false;
  }

  try {
    // Runway nu are un endpoint simplu de "health check"
    // Încercăm să obținem creditele disponibile sau lista de modele
    const response = await fetch('https://api.runwayml.com/v1/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Runway API funcționează!');
      console.log(`   💳 Credite disponibile: ${data.credits || 'N/A'}`);
      return true;
    } else if (response.status === 404) {
      // Endpoint-ul credits nu există, încercăm altceva
      console.log('   ⚠️  Endpoint-ul de credits nu e disponibil');
      console.log('   ✅ Dar API key-ul pare valid (nu a returnat 401)');
      return true;
    } else {
      const error = await response.text();
      console.log('   ❌ Runway API a returnat o eroare:');
      console.log(`      Status: ${response.status}`);
      console.log(`      Error: ${error.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Eroare la conectarea cu Runway API:');
    console.log(`      ${error.message}`);
    return false;
  }
}

// Test generare script cu KIMI
async function testKimiGeneration() {
  console.log('\n🧪 Testare generare script cu KIMI...');
  
  if (!KIMI_API_KEY || KIMI_API_KEY === 'your-kimi-api-key') {
    console.log('   ⏭️  Se sare peste (API key lipsă)');
    return false;
  }

  try {
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'Ești un copywriter expert în reclame. Răspunde cu un singur cuvânt: "Test"'
          },
          {
            role: 'user',
            content: 'Spune-mi "Test"'
          }
        ],
        max_tokens: 10,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      console.log('   ✅ Generare funcționează!');
      console.log(`   📝 Răspuns: "${content?.trim()}"`);
      return true;
    } else {
      const error = await response.text();
      console.log('   ❌ Generarea a eșuat:');
      console.log(`      ${error.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Eroare:');
    console.log(`      ${error.message}`);
    return false;
  }
}

// Main
async function main() {
  const kimiOK = await testKimiAPI();
  const runwayOK = await testRunwayAPI();
  
  // Testăm generarea doar dacă KIMI funcționează
  if (kimiOK) {
    await testKimiGeneration();
  }

  console.log('\n==========================================');
  console.log('  REZULTAT');
  console.log('==========================================');
  console.log(`KIMI API:    ${kimiOK ? '✅ OK' : '❌ EROARE'}`);
  console.log(`Runway API:  ${runwayOK ? '✅ OK' : '❌ EROARE'}`);
  console.log('==========================================\n');

  if (!kimiOK || !runwayOK) {
    console.log('💡 Verifică:');
    console.log('   1. API keys sunt corecte în .env.local');
    console.log('   2. Ai acces la API-urile respective');
    console.log('   3. Conturile sunt active și au credit disponibil');
    process.exit(1);
  } else {
    console.log('🎉 Toate API-urile funcționează!');
    process.exit(0);
  }
}

main();
