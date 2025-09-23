const { exec } = require('child_process');
const fs = require('fs-extra');

// Clean output directory
fs.removeSync('out');
fs.ensureDirSync('out');

console.log('Building with esbuild (ignoring TypeScript errors)...');

// Build with esbuild directly (bypasses TypeScript compiler)
exec('npx esbuild src/extension.ts --bundle --outfile=out/extension.js --platform=node --external:vscode --external:fs-extra --external:markdown-it --external:html-pdf --format=cjs --sourcemap', (error, stdout, stderr) => {
    if (error) {
        console.error('Build failed:', error);
        return;
    }
    
    console.log('Build completed!');
    
    // Copy templates and media
    fs.copySync('templates', 'out/templates');
    fs.copySync('media', 'out/media');
    
    console.log('Files copied to out/ directory');
});