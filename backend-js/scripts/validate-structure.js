import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Standard way to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_STRUCTURE = {
  srcFolders: ["config", "constants", "cron", "events", "jobs", "middleware", "models", "modules", "storage", "tests", "types", "utils"],
};

// path.resolve ensures we get an absolute path
const srcPath = path.resolve(__dirname, '../src');

function validate() {
  console.log("🚀 HUSKY IS RUNNING VALIDATION...");
  console.log(`\n🔍 Checking: ${srcPath}`);

  if (!fs.existsSync(srcPath)) {
    console.error(`\x1b[31m❌ Error: 'src' folder not found at ${srcPath}\x1b[0m`);
    process.exit(1);
  }

  const currentItems = fs.readdirSync(srcPath);
  const currentFolders = currentItems.filter(item => 
    fs.statSync(path.join(srcPath, item)).isDirectory()
  );

  let forbidden = [];

  currentFolders.forEach(folder => {
    if (!VALID_STRUCTURE.srcFolders.includes(folder)) {
      forbidden.push(folder);
    }
  });

  if (forbidden.length > 0) {
    console.error(`\x1b[31m❌ FOLDER STRUCTURE VIOLATION\x1b[0m`);
    forbidden.forEach(f => console.error(`   - src/${f} is not allowed.`));
    console.log(`\x1b[33mAllowed: ${VALID_STRUCTURE.srcFolders.join(', ')}\x1b[0m`);
    process.exit(1);
  }

  console.log("\x1b[32m✅ Folder structure is valid!\x1b[0m\n");
}

validate();