import { build } from 'esbuild'

// Build the library
await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  format: 'esm',
  outfile: 'dist/index.js',
  external: ['js-yaml'],
  minify: true,
  sourcemap: true,
})

// Build the CLI
await build({
  entryPoints: ['src/main.ts', 'src/cli.ts'],
  bundle: false,
  platform: 'node',
  target: 'node16',
  format: 'esm',
  outdir: 'dist',
  sourcemap: true,
})

console.log('Build completed!')
