# VOSviewer Online React component

[![Build master branch](https://github.com/neesjanvaneck/VOSviewer-Online/workflows/Build%20master%20branch/badge.svg?branch=master)](https://github.com/neesjanvaneck/VOSviewer-Online/actions)
[![License: MIT](https://badgen.net/github/license/neesjanvaneck/VOSviewer-Online?label=License&color=yellow)](https://github.com/neesjanvaneck/VOSviewer-Online/blob/master/LICENSE)
[![Latest release](https://badgen.net/github/release/neesjanvaneck/VOSviewer-Online?label=Release)](https://github.com/neesjanvaneck/VOSviewer-Online/releases)
[![npm version](https://badgen.net/npm/v/vosviewer-online)](https://www.npmjs.com/package/vosviewer-online)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.7248010.svg)](https://doi.org/10.5281/zenodo.7248010)

This is a [React](https://github.com/facebook/react) component package that offers an easy way to integrate [VOSviewer Online](https://github.com/neesjanvaneck/VOSviewer-Online) into your site or application.

## Installation

```sh
npm install vosviewer-online
```

## Usage

The following code snippet illustrates the use of the VOSviewer Online React component:

```js
import { VOSviewerOnline } from 'vosviewer-online'

<VOSviewerOnline data={{ ... }} parameters={{ ... }} />
```

The `data` and `parameters` props are optional. The `data` prop can be used to provide network data to the VOSviewer Online React component. The data must be in the [VOSviewer JSON format](https://app.vosviewer.com/docs/file-types/json-file-type/). The `parameters` prop can be used to adjust the visualization of a network. The available parameters can be found [here](https://app.vosviewer.com/docs/file-types/json-file-type/#parameters-object).

## License

The VOSviewer Online React component package is distributed under the [MIT license](LICENSE).
