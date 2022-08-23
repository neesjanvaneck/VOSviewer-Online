const fs = require('fs');
const pkg = require('./package.json');

const peerDependenciesList = [
  'mobx',
  'mobx-react-lite',
  'react',
  'react-dom',
];
const {
  version, author, keywords, license, homepage, repository, bugs, dependencies, engines
} = pkg;
const peerDependencies = {};
peerDependenciesList.forEach(d => {
  peerDependencies[d] = dependencies[d];
  delete dependencies[d];
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
