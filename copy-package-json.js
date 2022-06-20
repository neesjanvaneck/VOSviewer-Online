const fs = require('fs');
const pkg = require('./package.json');

const { version, dependencies, peerDependencies } = pkg;
const appMode = process.env.mode || 'vosviewer';
const libName = appMode === 'vosviewer' ? 'vosviewer-component' : `vosviewer-component-${appMode}`;
const newPkg = {
  name: libName,
  version,
  dependencies,
  peerDependencies,
  type: "module",
  main: "./index.js",
};

fs.writeFileSync(`lib/${libName}/package.json`, JSON.stringify(newPkg, null, 2));
