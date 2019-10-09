const path = require('path');
const babel = require('rollup-plugin-babel');
const localResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');

const pkg = require(path.resolve('./package.json'));
const external = Object.keys(pkg.dependencies || {})
  .concat(Object.keys(pkg.peerDependencies || {}))
  // native node modules
  .concat([ 'child_process', 'os', 'path' ]);

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/reins.js',
      format: 'cjs',
    },
  ],
  plugins: [
    localResolve({
      extensions: [ '.js', '.ts', '.tsx' ],
    }),
    typescript(),
    babel({
      exclude: 'node_modules/**',
      extensions: [ '.js', '.ts', '.tsx' ],
    }),
  ],
  external,
  onwarn: (warning, warn) => {
    if (warning.code === 'UNRESOLVED_IMPORT') {
      throw new Error(warning.message);
    }
    warn(warning);
  },
};
