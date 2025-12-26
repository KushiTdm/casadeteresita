// scripts/minify-service-account.js
// Usage: node scripts/minify-service-account.js path/to/service-account.json

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('\n❌ Usage: node scripts/minify-service-account.js <path-to-json-file>\n');
  console.error('Example: node scripts/minify-service-account.js ~/Downloads/project-123-abc.json\n');
  process.exit(1);
}

const filePath = args[0];

try {
  // Vérifier que le fichier existe
  if (!fs.existsSync(filePath)) {
    console.error(`\n❌ File not found: ${filePath}\n`);
    process.exit(1);
  }

  // Lire le fichier
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parser et minifier
  const jsonData = JSON.parse(fileContent);
  const minified = JSON.stringify(jsonData);

  console.log('\n✅ Service Account JSON minified successfully!\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('📋 STEP 1: Add these to Netlify Environment Variables:\n');
  console.log('─────────────────────────────────────────────────────────────\n');
  
  // Property ID (à remplir manuellement)
  console.log('Variable 1:');
  console.log('  Name: GA4_PROPERTY_ID');
  console.log('  Value: [YOUR_GA4_PROPERTY_ID]  ← Get this from Google Analytics\n');
  
  // Service Account Key
  console.log('Variable 2:');
  console.log('  Name: GA4_SERVICE_ACCOUNT_KEY');
  console.log('  Value: (see below)\n');
  
  console.log('─────────────────────────────────────────────────────────────\n');
  console.log('📄 MINIFIED SERVICE ACCOUNT JSON (copy everything below):\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(minified);
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  
  // Sauvegarder dans un fichier temporaire
  const outputPath = path.join(process.cwd(), 'service-account-minified.txt');
  fs.writeFileSync(outputPath, minified);
  
  console.log(`\n💾 Also saved to: ${outputPath}\n`);
  
  // Instructions Netlify
  console.log('📋 STEP 2: Configure Netlify:\n');
  console.log('1. Go to: Netlify Dashboard → Site Settings → Environment Variables');
  console.log('2. Click "Add a variable"');
  console.log('3. Add GA4_PROPERTY_ID with your Property ID');
  console.log('4. Add GA4_SERVICE_ACCOUNT_KEY with the minified JSON above');
  console.log('5. Save and redeploy\n');
  
  // Info de sécurité
  console.log('⚠️  SECURITY REMINDERS:\n');
  console.log('- DELETE the original JSON file from Downloads');
  console.log('- DELETE service-account-minified.txt after copying');
  console.log('- NEVER commit these credentials to Git');
  console.log('- Add *.json to your .gitignore\n');

} catch (error) {
  console.error('\n❌ Error:', error.message, '\n');
  process.exit(1);
}