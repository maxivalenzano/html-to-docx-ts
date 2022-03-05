import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import cleaner from 'rollup-plugin-cleaner';
import builtins from 'rollup-plugin-node-builtins';
import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
// import typescript from '@rollup/plugin-typescript';
import ts from 'rollup-plugin-ts';

import * as meta from './package.json';

const baseConfig = createBasicConfig();

const globals = {
  fs: 'fs',
  path: 'path',
  util: 'util',
  events: 'events',
  lodash: 'lodash',
  'html-to-vdom': 'HTMLToVDOM',
  'virtual-dom': 'virtual-dom',
  'virtual-dom/vnode/is-vnode': 'virtual-dom',
  'virtual-dom/vnode/vnode': 'VNode',
  'virtual-dom/vnode/vtext': 'VText',
};

export default merge(baseConfig, {
  //input: './out-tsc/index.js',
  input: './src/index.ts',
  external: [
    'color-name',
    'escape-html',
    'html-to-vdom',
    'jszip',
    'virtual-dom',
    'virtual-dom/vnode/is-vnode',
    'virtual-dom/vnode/is-vtext',
    'virtual-dom/vnode/vnode',
    'virtual-dom/vnode/vtext',
    'xmlbuilder2',
    'image-size',
    'lodash',
  ],
  plugins: [
    // typescript(),
    ts(),
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
      globals: globals,
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
      globals: globals,
    },
  ],
});
