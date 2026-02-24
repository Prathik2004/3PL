const fs = require("fs");
const path = require("path");
 
const standards = require("../project-standards.json");
 
const SRC_PATH = path.join(__dirname, "..", "src");
 
// Utility: get only directories
function getDirectories(sourcePath) {
  return fs
    .readdirSync(sourcePath)
    .filter(name =>
      fs.statSync(path.join(sourcePath, name)).isDirectory()
    );
}
 
// Validate top-level src folders
function checkSrcFolders() {
  const folders = getDirectories(SRC_PATH);
 
  const invalid = folders.filter(
    folder => !standards.srcFolders.includes(folder)
  );
 
  if (invalid.length) {
    console.error("❌ Invalid folders in src/:", invalid);
    process.exit(1);
  }
}
 
// Validate components subfolders
function checkComponentsSubfolders() {
  const componentsPath = path.join(SRC_PATH, "components");
 
  if (!fs.existsSync(componentsPath)) return;
 
  const subfolders = getDirectories(componentsPath);
 
  const allowed = [
    ...standards.componentsSubfolders,
    ...subfolders.filter(f => f.endsWith("-page")) // allow page-specific folders
  ];
 
  const invalid = subfolders.filter(f => !allowed.includes(f));
 
  if (invalid.length) {
    console.error("❌ Invalid subfolders in components/:", invalid);
    process.exit(1);
  }
}
 
// Run validations
checkSrcFolders();
checkComponentsSubfolders();
 
console.log("✅ Folder structure is valid");