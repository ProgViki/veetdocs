const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');

// Clean output directory
fs.removeSync('out');
fs.ensureDirSync('out');

const buildOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'out/extension.js',
  external: [
    'vscode',
    'fs-extra', 
    'markdown-it',
    'html-pdf'
  ],
  platform: 'node',
  target: 'node14',
  format: 'cjs',
  sourcemap: true,
  minify: process.argv.includes('--minify')
};

async function build() {
  try {
    console.log('Building extension with esbuild...');
    
    await esbuild.build(buildOptions);
    
    // Copy static files if they exist
    const copyIfExists = (source, target) => {
      if (fs.existsSync(source)) {
        fs.copySync(source, target);
        console.log(`Copied ${source} to ${target}`);
      } else {
        console.log(`Warning: ${source} does not exist, skipping copy`);
      }
    };
    
    copyIfExists('templates', 'out/templates');
    copyIfExists('media', 'out/media');
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();