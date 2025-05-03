import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color mappings for Tailwind
const colorMappings = {
    '#000000': 'bg-background',
    '#0F172A': 'bg-background',
    '#1E293B': 'bg-card',
    '#1a237e': 'bg-primary',
    'bg-black': 'bg-background',
    'bg-white': 'bg-card',
    'bg-gray-900': 'bg-background',
    'bg-gray-800': 'bg-card',
    '#7E57C2': 'bg-primary',
    '#6200EA': 'bg-primary',
    '#FF1744': 'bg-destructive',
    '#F44336': 'bg-destructive',
    '#FF9800': 'bg-accent',
    'text-black': 'text-foreground',
    'text-white': 'text-foreground',
    'text-gray-400': 'text-muted-foreground',
    'text-gray-300': 'text-muted-foreground',
    'text-purple-700': 'text-primary',
    'border-gray-700': 'border-border',
    'border-gray-800': 'border-border',
    '#1a237e': 'hsl(var(--primary))',
};

const colorPattern = /(#[0-9A-Fa-f]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|bg-(?:black|white|yellow|gray|purple|blue|green|red)|text-(?:black|white|gray|purple|blue|green|red)|border-(?:black|white|gray|purple|blue|green|red))/g;

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'];

function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let matches = [];
        let match;

        while ((match = colorPattern.exec(content)) !== null) {
            const color = match[0];
            if (colorMappings[color] || Object.keys(colorMappings).includes(color)) {
                matches.push({
                    color,
                    line: content.substring(0, match.index).split('\n').length,
                    position: match.index,
                    replacement: colorMappings[color] || 'NEEDS_MAPPING',
                });
            }
        }

        return matches.length > 0 ? { filePath, matches } : null;
    } catch (error) {
        console.error(`Error scanning ${filePath}:`, error.message);
        return null;
    }
}

function replaceColorsInFile(filePath, dryRun = true) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changes = 0;

        Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
            if (newColor === 'NEEDS_MAPPING') return;
            const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const oldContent = content;
            content = content.replace(regex, newColor);
            if (oldContent !== content) {
                changes += (oldContent.match(regex) || []).length;
            }
        });

        if (!dryRun && changes > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated ${filePath} (${changes} replacements)`);
        }

        return changes;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return 0;
    }
}

async function findHardcodedColors(directory, autoReplace = false) {
    const files = await glob(`${directory}/**/*+(${extensions.join('|')})`, {
        ignore: '**/node_modules/**',
    });


    console.log(`Scanning ${files.length} files for hardcoded colors...`);

    let allResults = [];
    let totalChanges = 0;

    for (const file of files) {
        if (autoReplace) {
            const changes = replaceColorsInFile(file, false);
            totalChanges += changes;
        } else {
            const result = scanFile(file);
            if (result) allResults.push(result);
        }
    }

    if (autoReplace) {
        console.log(`\nCompleted! Made ${totalChanges} color replacements across ${files.length} files.`);
    } else {
        console.log(`\nFound hardcoded colors in ${allResults.length} files:`);
        allResults.forEach((result) => {
            console.log(`\n📄 ${result.filePath}`);
            result.matches.forEach((match) => {
                console.log(`  Line ${match.line}: ${match.color} → ${match.replacement}`);
            });
        });

        console.log(`\nTo automatically replace these colors, run the script with --replace flag.`);
    }
}

// CLI
const args = process.argv.slice(2);
const directory = args[0] || '.';
const autoReplace = args.includes('--replace');

(async () => {
    await findHardcodedColors(directory, autoReplace);
})();
