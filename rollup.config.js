import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import cleaner from 'rollup-plugin-cleaner';
import builtins from 'rollup-plugin-node-builtins';

//typescript
// import ts from 'rollup-plugin-ts';
import typescript from '@rollup/plugin-typescript';

import * as meta from './package.json';

const globals = {
  fs: 'fs',
  path: 'path',
  util: 'util',
  crypto: 'crypto',
  events: 'events',
  jszip: 'JSZip',
  xmlbuilder2: 'xmlbuilder2',
  'color-name': 'colorNames',
  'html-to-vdom': 'HTMLToVDOM',
  'virtual-dom': 'virtual-dom',
  'virtual-dom/vnode/is-vnode': 'virtual-dom',
  'virtual-dom/vnode/vnode': 'VNode',
  'virtual-dom/vnode/vtext': 'VText',
};

//['color-name', 'escape-html', 'html-to-vdom', 'jszip', 'virtual-dom', 'xmlbuilder2']

export default {
  //input: './out-tsc/index.js',
  input: './src/index.ts',
  external: [
    'color-name',
    'escape-html',
    'html-to-vdom',
    'jszip',
    'virtual-dom',
    'xmlbuilder2',
    // 'virtual-dom/vnode/is-vnode',
    // 'virtual-dom/vnode/is-vtext',
    // 'virtual-dom/vnode/vnode',
    // 'virtual-dom/vnode/vtext',
    // 'image-size',
  ],
  plugins: [
    typescript(), // config: https://github.com/rollup/plugins/tree/master/packages/typescript
    // ts(),
    resolve(), //A Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in node_modules
    json({ include: 'package.json', preferConst: true }),
    commonjs({ extensions: ['.js', '.ts'] }), //import CommonJS files, see note about using with typescript --> https://github.com/rollup/plugins/tree/master/packages/typescript
    builtins(), //Allows the node builtins to be required/imported. Doing so gives the proper shims to support modules that were designed for Browserify, some modules require rollup-plugin-node-globals.
    // terser({  //minifier
    //   mangle: false,
    // }),
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
};
