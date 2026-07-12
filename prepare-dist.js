const fs = require('fs');
const path = require('path');

console.log('[Prepare-Dist] Bundling standalone dist/ directory for HeavenCloud deployment...');

const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 1. Copy .env file
const envSrc = path.resolve(__dirname, '.env');
const envDest = path.resolve(distDir, '.env');
if (fs.existsSync(envSrc)) {
    fs.copyFileSync(envSrc, envDest);
    console.log('[Prepare-Dist] ✅ Copied .env -> dist/.env');
} else {
    console.warn('[Prepare-Dist] ⚠️ No .env file found at root. Please ensure .env is present in dist/ on HeavenCloud.');
}

// 2. Copy prisma directory recursively
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

const prismaSrc = path.resolve(__dirname, 'prisma');
const prismaDest = path.resolve(distDir, 'prisma');
if (fs.existsSync(prismaSrc)) {
    copyRecursiveSync(prismaSrc, prismaDest);
    console.log('[Prepare-Dist] ✅ Copied prisma/ schema -> dist/prisma/');
}

// 3. Generate standalone package.json for HeavenCloud inside dist/
const rootPkgPath = path.resolve(__dirname, 'package.json');
if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    
    const distPkg = {
        name: rootPkg.name + '-dist',
        version: rootPkg.version || '1.0.0',
        private: true,
        engines: rootPkg.engines || { node: '>=20.0.0' },
        main: 'src/bot/index.js',
        scripts: {
            start: 'node src/bot/index.js',
            postinstall: 'prisma generate'
        },
        dependencies: {
            ...rootPkg.dependencies,
            prisma: rootPkg.devDependencies?.prisma || '5.19.1'
        }
    };

    fs.writeFileSync(path.resolve(distDir, 'package.json'), JSON.stringify(distPkg, null, 2), 'utf8');
    console.log('[Prepare-Dist] ✅ Generated standalone package.json -> dist/package.json');
}

console.log('[Prepare-Dist] 🎉 dist/ folder is now 100% self-contained and ready for direct upload to HeavenCloud!');
