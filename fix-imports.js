const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    for (const [from, to] of replacements) {
        content = content.replaceAll(from, to);
    }
    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated ' + filePath);
    }
}

function walk(dir, replacements) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath, replacements);
        } else if (fullPath.endsWith('.ts')) {
            replaceInFile(fullPath, replacements);
        }
    }
}

// Commands replacements
walk('src/bot/commands', [
    ['../../lib/', '../../core/'],
    ['../tracker', '../../jobs/tracker']
]);

// Bot index replacements
replaceInFile('src/bot/index.ts', [
    ['../lib/', '../core/'],
    ['./contests', '../jobs/contests']
]);

// Jobs replacements
walk('src/jobs', [
    ['../lib/', '../core/']
]);

// Scrapers replacements
walk('src/scrapers', [
    ['../lib/', '../core/'],
    ['../bot/tracker', '../jobs/tracker']
]);

// Prisma seed
replaceInFile('prisma/seed.ts', [
    ['../lib/', '../src/core/']
]);

console.log('Done replacing imports!');
