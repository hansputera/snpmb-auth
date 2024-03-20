import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  outDir: './dist',
  bundle: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  target: ['node16', 'node18'],
  platform: 'node',
  dts: false,
  tsconfig: './tsconfig.json',
  format: 'esm',
});
