#!/usr/bin/env php
<?php
 
/**
 * ============================================================
 *  3PL Backend-PHP — Folder Structure Validator
 * ============================================================
 *  Usage:
 *    php validate_structure.php [--base-path=/path/to/project] [--fix] [--strict]
 *
 *  Options:
 *    --base-path   Root of the Laravel project (default: current directory)
 *    --fix         Auto-create any missing required directories
 *    --strict      Exit with code 1 if ANY violation is found (useful in CI)
 * ============================================================
 */
 
/* ── helpers ──────────────────────────────────────────────── */
 
function ok(string $msg): void   { echo "\033[32m  ✔  {$msg}\033[0m\n"; }
function warn(string $msg): void { echo "\033[33m  ⚠  {$msg}\033[0m\n"; }
function fail(string $msg): void { echo "\033[31m  ✖  {$msg}\033[0m\n"; }
function info(string $msg): void { echo "\033[36m  ➜  {$msg}\033[0m\n"; }
function head(string $msg): void { echo "\n\033[1;37m{$msg}\033[0m\n" . str_repeat('─', 60) . "\n"; }
 
/* ── argument parsing ─────────────────────────────────────── */
 
$opts = getopt('', ['base-path:', 'fix', 'strict']);
$basePath = rtrim($opts['base-path'] ?? getcwd(), DIRECTORY_SEPARATOR);
$autoFix  = isset($opts['fix']);
$strict   = isset($opts['strict']);
 
/* ── canonical structure definition ──────────────────────── */
// Each entry is a path relative to $basePath.
// 'required'  → must exist (directory or file)
// 'forbidden' → must NOT exist (catches wrong placements)
// 'file_rules'→ per-directory filename / namespace conventions
 
$MODULES = ['Auth', 'CsvUpload', 'Dashboard', 'Exception', 'Shipment', 'User'];
 
$MODULE_SUBDIRS = [
    'Auth'      => ['Controllers', 'Repositories', 'Services', 'Validators'],
    'CsvUpload' => ['Controllers', 'Repositories', 'Services', 'Validators'],
    'Dashboard' => ['Controllers', 'Repositories', 'Services'],
    'Exception' => ['Controllers', 'Models',       'Repositories', 'Services'],
    'Shipment'  => ['Controllers', 'Models',       'Repositories', 'Services', 'Validators'],
    'User'      => ['Controllers', 'Repositories', 'Services', 'Validators'],
];
 
// Build required directory list
$requiredDirs = [
    // ── Top-level Laravel dirs ────────────────────────────
    'app',
    'bootstrap',
    'config',
    'database',
    'public',
    'resources',
    'routes',
    'storage',
    'tests',
 
    // ── app sub-dirs ──────────────────────────────────────
    'app/Constants',
    'app/Http',
    'app/Http/Controllers',
    'app/Http/Controllers/Auth',
    'app/Http/Middleware',
    'app/Http/Requests',
    'app/Http/Requests/Auth',
    'app/Mail',
    'app/Models',
    'app/Modules',
    'app/Providers',
    'app/Utils',
];
 
// Add each module's subdirs
foreach ($MODULE_SUBDIRS as $module => $subdirs) {
    $requiredDirs[] = "app/Modules/{$module}";
    foreach ($subdirs as $sub) {
        $requiredDirs[] = "app/Modules/{$module}/{$sub}";
    }
}
 
// Required root files
$requiredFiles = [
    '.env.example',
    '.gitignore',
    'artisan',
    'composer.json',
    'composer.lock',
    'phpunit.xml',
];
 
/* ── placement rules ──────────────────────────────────────── */
// Maps a PHP file suffix/pattern to the ONLY directory it may live in (relative).
// The validator will scan app/ and flag any file that breaks these rules.
 
$placementRules = [
    // Suffix           => allowed parent directory (relative to basePath)
    'Controller.php'    => 'app/Http/Controllers',   // generic controllers
    'Middleware.php'    => 'app/Http/Middleware',
    'Request.php'       => 'app/Http/Requests',
    'ServiceProvider.php' => 'app/Providers',
    'Mail.php'          => 'app/Mail',
    // Module-aware rules checked separately (see below)
];
 
// Module-specific suffix → subfolder name inside each module
$modulePlacementRules = [
    'Controller.php'  => 'Controllers',
    'Repository.php'  => 'Repositories',
    'Service.php'     => 'Services',
    'Validator.php'   => 'Validators',
];
 
/* ── forbidden patterns ───────────────────────────────────── */
// Files matching these patterns in these locations indicate misplacement.
 
$forbiddenPatterns = [
    // Controllers must NOT sit directly in app/Http/Controllers (except Auth sub) if they belong to a Module
    // Business logic must NOT live in Controllers (Service/Repository files in wrong place)
    ['pattern' => '/Service\.php$/',    'forbidden_in' => 'app/Http/Controllers'],
    ['pattern' => '/Repository\.php$/', 'forbidden_in' => 'app/Http/Controllers'],
    ['pattern' => '/Validator\.php$/',  'forbidden_in' => 'app/Http/Controllers'],
    ['pattern' => '/Controller\.php$/', 'forbidden_in' => 'app/Models'],
    ['pattern' => '/\.php$/',           'forbidden_in' => 'app/Modules',           'exact_depth' => true],  // no loose files directly in app/Modules
    ['pattern' => '/\.php$/',           'forbidden_in' => 'config',                'note' => 'PHP logic files should not be in config/'],
];
 
/* ═══════════════════════════════════════════════════════════
   VALIDATION RUNNER
   ═══════════════════════════════════════════════════════════ */
 
$errors   = 0;
$warnings = 0;
$fixed    = 0;
 
/* 1. Required directories */
head("1 / 4  Required Directories");
foreach ($requiredDirs as $dir) {
    $full = "{$basePath}/{$dir}";
    if (is_dir($full)) {
        ok($dir);
    } else {
        fail("Missing directory: {$dir}");
        $errors++;
        if ($autoFix) {
            mkdir($full, 0755, true);
            info("Created: {$dir}");
            $fixed++;
        }
    }
}
 
/* 2. Required files */
head("2 / 4  Required Root Files");
foreach ($requiredFiles as $file) {
    $full = "{$basePath}/{$file}";
    if (file_exists($full)) {
        ok($file);
    } else {
        warn("Missing root file: {$file}");
        $warnings++;
    }
}
 
/* 3. PHP file placement scan */
head("3 / 4  PHP File Placement Rules");
 
/**
 * Recursively collect all .php files under $dir.
 */
function collectPhpFiles(string $dir): array {
    $result = [];
    if (!is_dir($dir)) return $result;
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $result[] = $file->getPathname();
        }
    }
    return $result;
}
 
$appPath  = "{$basePath}/app";
$phpFiles = collectPhpFiles($appPath);
 
foreach ($phpFiles as $absPath) {
    // Normalize to forward slashes so comparisons work on both Windows and Unix
    $absPathN  = str_replace('\\', '/', $absPath);
    $basePathN = str_replace('\\', '/', $basePath);
 
    $relPath   = ltrim(str_replace($basePathN, '', $absPathN), '/');
    $relDir    = ltrim(str_replace($basePathN, '', str_replace('\\', '/', dirname($absPath))), '/');
    $filename  = basename($absPath);
    $violated  = false;
 
    // ── Module placement rules ────────────────────────────
    // If a file is inside app/Modules/<Module>/ it must be in the correct subfolder.
    if (preg_match('#^app/Modules/([^/]+)/([^/]+)/#', $relPath, $m)) {
        $module    = $m[1];
        $subfolder = $m[2];
 
        foreach ($modulePlacementRules as $suffix => $expectedSub) {
            if (str_ends_with($filename, $suffix) && $subfolder !== $expectedSub) {
                fail("MISPLACED [{$filename}] → found in '{$relDir}' but '{$suffix}' files belong in '{$m[1]}/{$expectedSub}'");
                $errors++;
                $violated = true;
                break;
            }
        }
    }
 
    // ── Generic placement rules ───────────────────────────
    if (!$violated) {
        foreach ($placementRules as $suffix => $expectedDir) {
            if (str_ends_with($filename, $suffix)) {
                // Allow files that are inside a Module (handled above)
                if (str_contains($relDir, 'app/Modules')) continue;
                if (!str_starts_with($relDir, $expectedDir)) {
                    fail("MISPLACED [{$filename}] → found in '{$relDir}' but should be under '{$expectedDir}'");
                    $errors++;
                    $violated = true;
                }
                break;
            }
        }
    }
 
    // ── Forbidden patterns ────────────────────────────────
    if (!$violated) {
        foreach ($forbiddenPatterns as $rule) {
            $forbiddenIn = $rule['forbidden_in'];
            $exactDepth  = $rule['exact_depth'] ?? false;
 
            $inForbiddenDir = $exactDepth
                ? ($relDir === $forbiddenIn)
                : str_starts_with($relDir, $forbiddenIn);
 
            if ($inForbiddenDir && preg_match($rule['pattern'], $filename)) {
                $note = isset($rule['note']) ? " — {$rule['note']}" : '';
                warn("SUSPICIOUS [{$filename}] in '{$relDir}'{$note}");
                $warnings++;
                $violated = true;
                break;
            }
        }
    }
 
    if (!$violated) {
        ok($relPath);
    }
}
 
if (empty($phpFiles)) {
    warn("No PHP files found under app/ — is --base-path set correctly?");
    $warnings++;
}
 
/* 4. Unknown top-level directories */
head("4 / 4  Unknown Top-Level Directories");
 
$knownTopDirs = [
    'app', 'bootstrap', 'config', 'database', 'public',
    'resources', 'routes', 'storage', 'tests', 'vendor',
    '.git',
];
 
$topItems = array_diff(scandir($basePath) ?: [], ['.', '..']);
foreach ($topItems as $item) {
    if (!is_dir("{$basePath}/{$item}")) continue;       // skip files
    if (in_array($item, $knownTopDirs, true)) {
        ok($item);
    } else {
        warn("Unknown top-level directory: '{$item}' (may be fine, but verify)");
        $warnings++;
    }
}
 
/* ── Summary ──────────────────────────────────────────────── */
head("Summary");
echo "  Errors   : " . ($errors   ? "\033[31m{$errors}\033[0m"   : "\033[32m0\033[0m") . "\n";
echo "  Warnings : " . ($warnings ? "\033[33m{$warnings}\033[0m" : "\033[32m0\033[0m") . "\n";
if ($autoFix) {
    echo "  Auto-fixed: \033[36m{$fixed}\033[0m directories created\n";
}
echo "\n";
 
if ($errors === 0 && $warnings === 0) {
    echo "\033[1;32m  ✔  Structure is clean!\033[0m\n\n";
    exit(0);
} elseif ($errors === 0) {
    echo "\033[1;33m  ⚠  Structure OK with warnings. Review above.\033[0m\n\n";
    exit($strict ? 1 : 0);
} else {
    echo "\033[1;31m  ✖  Structure violations found. Fix errors before committing.\033[0m\n\n";
    exit(1);
}