# VOSviewer Online

[![Build master branch](https://github.com/neesjanvaneck/VOSviewer-Online/workflows/Build%20master%20branch/badge.svg?branch=master)](https://github.com/neesjanvaneck/VOSviewer-Online/actions)
[![License: MIT](https://badgen.net/github/license/neesjanvaneck/VOSviewer-Online?label=License&color=yellow)](https://github.com/neesjanvaneck/VOSviewer-Online/blob/master/LICENSE)
[![Latest release](https://badgen.net/github/release/neesjanvaneck/VOSviewer-Online?label=Release)](https://github.com/neesjanvaneck/VOSviewer-Online/releases)

[VOSviewer Online](https://app.vosviewer.com) is a tool for network visualization. It is a web-based version of [VOSviewer](https://www.vosviewer.com), a popular tool for constructing and visualizing bibliometric networks.

VOSviewer Online has been developed by [Nees Jan van Eck](https://orcid.org/0000-0001-8448-4521) and [Ludo Waltman](https://orcid.org/0000-0001-8249-1752) at the [Centre for Science and Technology Studies (CWTS)](https://www.cwts.nl) at [Leiden University](https://www.universiteitleiden.nl/en).

The development of VOSviewer Online has benefited from contributions by [Olya Stukova](https://github.com/Stukova) and [Nikita Rokotyan](https://github.com/Rokotyan) from [Interacta](https://interacta.io).

The development of VOSviewer Online has been supported financially by [Digital Science](https://www.digital-science.com) and [Zeta Alpha](https://www.zeta-alpha.com).

VOSviewer Online has been developed in JavaScript using [React](https://github.com/facebook/react), [Material-UI](https://github.com/mui-org/material-ui), [D3](https://github.com/d3/d3), and a few other open source libraries.

<img src="https://github.com/neesjanvaneck/VOSviewer-Online/blob/master/src/assets/images/vosviewer-online-thumbnail.png?raw=true" alt="VOSviewer Online" style="width: 100%; max-width: 800px; height: auto;">

## Documentation

Documentation of VOSviewer Online is available [here](https://app.vosviewer.com/docs).

## License

VOSviewer Online is distributed under the [MIT license](LICENSE).

## Issues

If you encounter any issues, please report them using the [issue tracker](https://github.com/neesjanvaneck/VOSviewer-Online/issues) on GitHub.

## Contribution

You are welcome to contribute to the development of VOSviewer Online. Please follow the typical GitHub workflow: Fork from this repository and make a pull request to submit your changes. Make sure that your pull request has a clear description and that the code has been properly tested.

## Development and deployment

The latest stable version of the code is available from the [`master`](https://github.com/neesjanvaneck/VOSviewer-Online/tree/master) branch on GitHub. The most recent code, which may be under development, is available from the [`develop`](https://github.com/neesjanvaneck/VOSviewer-Online/tree/develop) branch.

### Requirements

To run VOSviewer Online locally and to build production-ready bundles, [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) need to be installed on your system.

### Setup

Run
```
npm install
```
to install all required Node.js packages.

### Development

Run
```
npm run dev
```
to build a development version and serve it with hot reload at [http://localhost:8600](http://localhost:8600).

### Deployment

Run
```
npm run build
```
to build a deployment version. The production-ready minified bundle is stored in the `dist/` folder.
