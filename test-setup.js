const browserEnv = require('browser-env');
const babel = require('@babel/register');

browserEnv();
babel({
  extensions: [ '.js', '.ts', '.tsx' ],
});
