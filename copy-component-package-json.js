const fs = require('fs');
const pkg = require('./package.json');

const {
  version, author, keywords, license, homepage, repository, bugs, dependencies, engines
} = pkg;
const peerDependencies = {
  mobx: undefined,
  "mobx-react-lite": undefined,
  react: "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0"
};
Object.keys(peerDependencies).forEach(key => {
  if (!peerDependencies[key]) peerDependencies[key] = dependencies[key];
  delete dependencies[key];
});
const newPkg = {
  name: 'vosviewer-online',
  version,
  description: "React component package for integrating VOSviewer Online into your site or application.",
  author,
  keywords,
  license,
  homepage,
  repository,
  bugs,
  type: "module",
  main: "./index.js",
  dependencies,
  peerDependencies,
  engines
};

fs.writeFileSync(`lib/package.json`, JSON.stringify(newPkg, null, 2));
