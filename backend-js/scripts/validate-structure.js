const fs = require('fs');
const path = require('path');

// Your defined schema
const VALID_STRUCTURE = {
  srcFolders: ["config", "components", "cron", "events", "jobs", "middleware", "models", "modules", "storage", "tests", "types", "utils"],
};

const srcPath = path.join(process.cwd(), 'src');

function validate() {
  if (!fs.existsSync(srcPath)) {
    console.error("❌ Error: 'src' folder not found.");
    process.exit(1);
  }

  const currentSrcFolders = fs.readdirSync(srcPath).filter(f => 
    fs.statSync(path.join(srcPath, f)).isDirectory()
  );

  // 1. Validate top-level src folders
  currentSrcFolders.forEach(folder => {
    if (!VALID_STRUCTURE.srcFolders.includes(folder)) {
      console.error(`\x1b[31m❌ Folder Structure Error: "src/${folder}" is not allowed.\x1b[0m`);
      console.log(`Allowed: ${VALID_STRUCTURE.srcFolders.join(', ')}`);
      process.exit(1);
    }
  });

  console.log("\x1b[32m✅ Folder structure validation passed!\x1b[0m");
}

validate();