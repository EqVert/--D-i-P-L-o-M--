import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import run from '@rollup/plugin-run';

const dev = process.env.ROLLUP_WATCH === 'true'

export default {
  logLevel: 'silent',
  input: 'src/index.js',
  output: {
    file: '../dist/server.mjs',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs({
      strictRequires: true
    }),
    json(),
    dev && run()
  ]
};