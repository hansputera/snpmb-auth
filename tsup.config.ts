import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['./src/SnpmbClient.ts', './src/@types/index.ts'],
  outDir: './dist',
  bundle: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  target: ['node16', 'node18'],
  platform: 'node',
  dts: true,
  tsconfig: './tsconfig.json',
  format: ['cjs', 'esm'],
});
