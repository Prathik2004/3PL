import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This ensures it finds the /src folder correctly regardless of where git is running from
const srcPath = path.resolve(__dirname, '../src'); 

const VALID_STRUCTURE = {
  srcFolders: ["config", "constants", "cron", "events", "jobs", "middleware", "models", "modules", "storage", "tests", "types", "utils"],
};

function validate() {
  console.log(`\n🔍 Scanning: ${srcPath}`);

  if (!fs.existsSync(srcPath)) {
    console.error(`\x1b[31m❌ Error: 'src' folder not found at ${srcPath}\x1b[0m`);
    process.exit(1);
  }

  const currentFolders = fs.readdirSync(srcPath).filter(f => 
    fs.statSync(path.join(srcPath, f)).isDirectory()
  );

  let forbidden = currentFolders.filter(f => !VALID_STRUCTURE.srcFolders.includes(f));

  if (forbidden.length > 0) {
    console.error(`\x1b[31m❌ STOP! Forbidden folders found: ${forbidden.join(', ')}\x1b[0m`);
    process.exit(1); 
  }

  console.log("\x1b[32m✅ Folder structure is valid!\x1b[0m\n");
}

validate();