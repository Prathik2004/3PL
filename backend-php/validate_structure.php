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

function normalize(string $path): string {
    return rtrim(str_replace('\\', '/', $path), '/');
}

function ok(string $msg): void   { echo "\033[32m  ✔  {$msg}\033[0m\n"; }
function warn(string $msg): void { echo "\033[33m  ⚠  {$msg}\033[0m\n"; }
function fail(string $msg): void { echo "\033[31m  ✖  {$msg}\033[0m\n"; }
function info(string $msg): void { echo "\033[36m  ➜  {$msg}\033[0m\n"; }
function head(string $msg): void { echo "\n\033[1;37m{$msg}\033[0m\n" . str_repeat('-', 60) . "\n"; }

/* ── argument parsing ─────────────────────────────────────── */

$opts     = getopt('', ['base-path:', 'fix', 'strict']);
$basePath = normalize($opts['base-path'] ?? getcwd());
$autoFix  = isset($opts['fix']);
$strict   = isset($opts['strict']);

/* ── canonical structure definition ──────────────────────── */

$MODULE_SUBDIRS = [
    'Auth'      => ['Controllers', 'Repositories', 'Services', 'Validators'],
    'CsvUpload' => ['Controllers', 'Repositories', 'Services', 'Validators'],
    'Dashboard' => ['Controllers', 'Repositories', 'Services'],
    'Exception' => ['Controllers', 'Models',       'Repositories', 'Services'],
    'Shipment'  => ['Controllers', 'Models',       'Repositories', 'Services', 'Validators'],
    'User'      => ['Controllers', 'Repositories', 'Services', 'Validators'],
];

// ── WHITELISTS ────────────────────────────────────────────────────────────────
// These are the ONLY directories allowed to exist. Anything not on this list
// is an unauthorized directory and will be reported as an ERROR.

// Allowed root-level directories (relative to project root)
$allowedRootDirs = [
    'app', 'bootstrap', 'config', 'database', 'public',
    'resources', 'routes', 'storage', 'tests', 'vendor', '.git',
];

// Allowed directories inside app/ (relative to project root)
$allowedAppDirs = [
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

foreach ($MODULE_SUBDIRS as $module => $subdirs) {
    $allowedAppDirs[] = "app/Modules/{$module}";
    foreach ($subdirs as $sub) {
        $allowedAppDirs[] = "app/Modules/{$module}/{$sub}";
    }
}

// Required directories (subset of allowed — these must EXIST)
$requiredDirs = array_merge(
    ['app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'storage', 'tests'],
    $allowedAppDirs
);

// Required root files
$requiredFiles = [
    '.env.example', '.gitignore', 'artisan',
    'composer.json', 'composer.lock', 'phpunit.xml',
];

// ── PLACEMENT RULES ───────────────────────────────────────────────────────────

// Outside app/Modules: suffix => only allowed parent dir
$genericRules = [
    'Controller.php'      => 'app/Http/Controllers',
    'Middleware.php'      => 'app/Http/Middleware',
    'Request.php'         => 'app/Http/Requests',
    'ServiceProvider.php' => 'app/Providers',
    'Mail.php'            => 'app/Mail',
];

// Inside app/Modules/<Module>: suffix => required subfolder name
$moduleRules = [
    'Controller.php'  => 'Controllers',
    'Repository.php'  => 'Repositories',
    'Service.php'     => 'Services',
    'Validator.php'   => 'Validators',
];

$forbiddenPatterns = [
    ['pattern' => '/Service\.php$/',    'forbidden_in' => 'app/Http/Controllers'],
    ['pattern' => '/Repository\.php$/', 'forbidden_in' => 'app/Http/Controllers'],
    ['pattern' => '/Validator\.php$/',  'forbidden_in' => 'app/Http/Controllers'],
    ['pattern' => '/Controller\.php$/', 'forbidden_in' => 'app/Models'],
    ['pattern' => '/\.php$/',           'forbidden_in' => 'app/Modules', 'exact_depth' => true],
];

/* ============================================================
   HELPERS
   ============================================================ */

/** Collect all subdirectories (recursively) under $baseDir, returned as paths relative to $projectRoot */
function collectAllDirs(string $baseDir, string $projectRoot): array {
    $result = [];
    if (!is_dir($baseDir)) return $result;
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($baseDir, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($it as $item) {
        if ($item->isDir()) {
            $result[] = ltrim(substr(normalize($item->getPathname()), strlen($projectRoot)), '/');
        }
    }
    return $result;
}

/** Collect all .php files under $dir, paths normalized */
function collectPhpFiles(string $dir): array {
    $result = [];
    if (!is_dir($dir)) return $result;
    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($it as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $result[] = normalize($file->getPathname());
        }
    }
    return $result;
}

/* ============================================================
   VALIDATION RUNNER
   ============================================================ */

$errors   = 0;
$warnings = 0;
$fixed    = 0;

/* ── 1. REQUIRED DIRECTORIES ─────────────────────────────────────────────── */
head("1 / 5  Required Directories (must exist)");
foreach ($requiredDirs as $dir) {
    $full = "{$basePath}/{$dir}";
    if (is_dir($full)) {
        ok($dir);
    } else {
        fail("MISSING required directory: '{$dir}'");
        $errors++;
        if ($autoFix) {
            mkdir($full, 0755, true);
            info("Created: {$dir}");
            $fixed++;
        }
    }
}

/* ── 2. REQUIRED ROOT FILES ──────────────────────────────────────────────── */
head("2 / 5  Required Root Files");
foreach ($requiredFiles as $file) {
    if (file_exists("{$basePath}/{$file}")) {
        ok($file);
    } else {
        warn("Missing root file: {$file}");
        $warnings++;
    }
}

/* ── 3. UNAUTHORIZED ROOT DIRECTORIES ────────────────────────────────────── */
head("3 / 5  Unauthorized Root Directories");
$rootItems = array_diff(scandir($basePath) ?: [], ['.', '..']);
$rootClean = true;
foreach ($rootItems as $item) {
    if (!is_dir("{$basePath}/{$item}")) continue;
    if (in_array($item, $allowedRootDirs, true)) {
        ok("/{$item}");
    } else {
        fail("UNAUTHORIZED root directory: '/{$item}' — not allowed at project root. Remove it.");
        $errors++;
        $rootClean = false;
    }
}
if ($rootClean) info("No unauthorized root directories found.");

/* ── 4. UNAUTHORIZED DIRECTORIES INSIDE app/ ─────────────────────────────── */
head("4 / 5  Unauthorized Directories inside app/");

$allAppDirs = collectAllDirs("{$basePath}/app", $basePath);
$appClean   = true;

foreach ($allAppDirs as $relDir) {
    if (in_array($relDir, $allowedAppDirs, true)) {
        ok($relDir);
    } else {
        fail("UNAUTHORIZED directory: '{$relDir}' — this folder is not allowed. Remove it.");
        $errors++;
        $appClean = false;
    }
}

if (empty($allAppDirs)) {
    warn("No subdirectories found under app/ — is --base-path correct?");
    $warnings++;
} elseif ($appClean) {
    info("No unauthorized directories found inside app/.");
}

/* ── 5. PHP FILE PLACEMENT RULES ─────────────────────────────────────────── */
head("5 / 5  PHP File Placement Rules");

$phpFiles = collectPhpFiles("{$basePath}/app");

foreach ($phpFiles as $absPath) {
    $relPath  = ltrim(substr($absPath, strlen($basePath)), '/');
    $relDir   = normalize(dirname($relPath));
    $filename = basename($absPath);
    $violated = false;

    // Module placement rules
    if (preg_match('#^app/Modules/([^/]+)/([^/]+)/#', $relPath, $m)) {
        $module    = $m[1];
        $subfolder = $m[2];
        foreach ($moduleRules as $suffix => $expectedSub) {
            if (str_ends_with($filename, $suffix) && $subfolder !== $expectedSub) {
                fail("MISPLACED [{$filename}] -> found in '{$relDir}' but '{$suffix}' files belong in 'app/Modules/{$module}/{$expectedSub}'");
                $errors++;
                $violated = true;
                break;
            }
        }
    }

    // Generic placement rules
    if (!$violated) {
        foreach ($genericRules as $suffix => $expectedDir) {
            if (str_ends_with($filename, $suffix)) {
                if (str_starts_with($relDir, 'app/Modules')) continue;
                if (!str_starts_with($relDir, $expectedDir)) {
                    fail("MISPLACED [{$filename}] -> found in '{$relDir}' but should be under '{$expectedDir}'");
                    $errors++;
                    $violated = true;
                }
                break;
            }
        }
    }

    // Forbidden patterns
    if (!$violated) {
        foreach ($forbiddenPatterns as $rule) {
            $inBadDir = ($rule['exact_depth'] ?? false)
                ? ($relDir === $rule['forbidden_in'])
                : str_starts_with($relDir, $rule['forbidden_in']);
            if ($inBadDir && preg_match($rule['pattern'], $filename)) {
                warn("SUSPICIOUS [{$filename}] in '{$relDir}'");
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
    warn("No PHP files found under app/ — is --base-path correct?");
    $warnings++;
}

/* ── SUMMARY ─────────────────────────────────────────────────────────────── */
head("Summary");
echo "  Errors   : " . ($errors   ? "\033[31m{$errors}\033[0m"   : "\033[32m0\033[0m") . "\n";
echo "  Warnings : " . ($warnings ? "\033[33m{$warnings}\033[0m" : "\033[32m0\033[0m") . "\n";
if ($autoFix) {
    echo "  Auto-fixed: \033[36m{$fixed}\033[0m directories created\n";
}
echo "\n";

if ($errors === 0 && $warnings === 0) {
    echo "\033[1;32m  All checks passed — structure is clean!\033[0m\n\n";
    exit(0);
} elseif ($errors === 0) {
    echo "\033[1;33m  Structure OK with warnings. Review above.\033[0m\n\n";
    exit($strict ? 1 : 0);
} else {
    echo "\033[1;31m  Structure violations found. Fix errors before committing.\033[0m\n\n";
    exit(1);
}