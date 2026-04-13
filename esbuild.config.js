const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure vendor directory exists
const vendorDir = path.join(__dirname, 'vendor');
if (!fs.existsSync(vendorDir)) {
    fs.mkdirSync(vendorDir, { recursive: true });
}

// Build GSAP bundle
async function build() {
    try {
        // Bundle GSAP with plugins
        await esbuild.build({
            entryPoints: ['src/gsap-entry.js'],
            bundle: true,
            minify: true,
            sourcemap: false,
            outfile: 'vendor/gsap.bundle.min.js',
            format: 'iife',
            target: ['es2018'],
            legalComments: 'none',
        });
        console.log('✓ GSAP bundle created: vendor/gsap.bundle.min.js');

        // Copy Lenis from node_modules
        const lenisSource = path.join(__dirname, 'node_modules', 'lenis', 'dist', 'lenis.min.js');
        const lenisDest = path.join(vendorDir, 'lenis.min.js');

        if (fs.existsSync(lenisSource)) {
            fs.copyFileSync(lenisSource, lenisDest);
            console.log('✓ Lenis copied: vendor/lenis.min.js');
        } else {
            console.error('✗ Lenis source not found at:', lenisSource);
        }

        // Print bundle sizes
        const gsapSize = fs.statSync('vendor/gsap.bundle.min.js').size;
        const lenisSize = fs.existsSync(lenisDest) ? fs.statSync(lenisDest).size : 0;

        console.log('\nBundle sizes:');
        console.log(`  gsap.bundle.min.js: ${(gsapSize / 1024).toFixed(1)} KB`);
        console.log(`  lenis.min.js: ${(lenisSize / 1024).toFixed(1)} KB`);
        console.log(`  Total: ${((gsapSize + lenisSize) / 1024).toFixed(1)} KB`);

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();
