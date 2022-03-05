import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import cleaner from 'rollup-plugin-cleaner';
import builtins from 'rollup-plugin-node-builtins';
import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
// import typescript from '@rollup/plugin-typescript';

import * as meta from './package.json';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: './out-tsc/index.js',
  external: ['color-name', 'escape-html', 'html-to-vdom', 'jszip', 'virtual-dom', 'xmlbuilder2'],
  plugins: [
    // typescript(),
    resolve(),
    json({ include: 'package.json', preferConst: true }),
    commonjs(),
    builtins(),
    terser({
      mangle: false,
    }),
    cleaner({
      targets: ['./dist/'],
    }),
  ],
  output: [
    {
      file: 'dist/html-to-docx.esm.js',
      format: 'es',
      globals: {
        fs: 'fs',
        path: 'path',
        util: 'util',
        events: 'events',
        'html-to-vdom': 'HTMLToVDOM',
      },
      sourcemap: true,
      banner: `// ${meta.homepage} v${meta.version} Copyright ${new Date().getFullYear()} ${
        meta.author
      }`,
    },
    {
      file: 'dist/html-to-docx.umd.js',
      format: 'umd',
      name: 'HTMLToDOCX',
      sourcemap: true,
      banner: `// ${meta.homepage} v${meta.version} Copyright ${new Date().getFullYear()} ${
        meta.author
      }`,
      globals: {
        fs: 'fs',
        path: 'path',
        util: 'util',
        events: 'events',
        'html-to-vdom': 'HTMLToVDOM',
      },
    },
  ],
});
