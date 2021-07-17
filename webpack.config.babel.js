import { join, resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

function absolute(...args) {
  return join(__dirname, ...args);
}

const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  },
  {
    test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
    exclude: [/images/],
    loader: 'file-loader?name=./fonts/[name].[ext]'
  },
  {
    test: /\.(jpg|jpeg|gif|png|svg)$/,
    exclude: [/fonts/],
    loader: 'file-loader?name=./images/[name].[ext]'
  },
  {
    test: /\.txt$/,
    use: 'raw-loader',
  },
  {
    test: /\.worker\.js$/,
    use: {
      loader: 'worker-loader',
      options: {
        name: '[name]:[hash:8].js'
      }
    }
  },
];

const config = {
  entry: ['@babel/polyfill', './src'],
  module: {
    rules,
  },
  resolve: {
    alias: {
      assets: resolve(__dirname, 'src/assets/'),
      utils: resolve(__dirname, 'src/utils/'),
      components: resolve(__dirname, 'src/components/'),
      data: resolve(__dirname, 'data/'),
      store: resolve(__dirname, 'src/store/'),
      logos: resolve(__dirname, 'src/logos/'),
      workers: resolve(__dirname, 'src/workers/'),
      pages: resolve(__dirname, 'src/pages/'),

      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: true
  }
};

const defaultEnv = { dev: false };

export default (env = defaultEnv) => {
  const appMode = env.mode || 'vosviewer';
  const bundleName = appMode === 'vosviewer' ? 'vosviewer-online' : `vosviewer-online-${appMode}`;

  const copyPatternsImages = [
    {
      from: resolve(__dirname, 'src/assets/images/vosviewer-favicon.png'),
      to: absolute('dist', bundleName, 'images/vosviewer-favicon.png'),
    },
    {
      from: resolve(__dirname, 'src/assets/images/vosviewer-online-thumbnail.png'),
      to: absolute('dist', bundleName, 'images/vosviewer-online-thumbnail.png'),
    },
    {
      from: resolve(__dirname, 'src/assets/images/vosviewer-online-thumbnail-twitter.png'),
      to: absolute('dist', bundleName, 'images/vosviewer-online-thumbnail-twitter.png'),
    }
  ];

  config.mode = env.dev ? 'development' : 'production';
  config.devtool = env.dev ? 'cheap-module-eval-source-map' : undefined; // Use 'source-map' for production to create map file
  config.output = {
    path: absolute('dist', bundleName),
    library: appMode,
    filename: env.dev ? `demo/dist/${bundleName}.bundle.js` : `${bundleName}.[contenthash].bundle.js`,
    publicPath: env.dev ? '/' : undefined,
    globalObject: 'this'
  };

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  };

  let jsonConfig;
  try {
    jsonConfig = require(resolve(__dirname, env.config));
  } catch (ex) {
    jsonConfig = {};
  }

  config.plugins = [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.dev ? 'development' : 'production'),
      NODE_ENV: JSON.stringify(env.dev ? 'development' : 'production'),
      MODE: JSON.stringify(appMode),
      CONFIG: JSON.stringify(jsonConfig),
    }),

    // new BundleAnalyzerPlugin(),
  ];

  if (appMode === 'vosviewer') {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          ...copyPatternsImages,
          {
            from: resolve(__dirname, 'data', 'JOI_2007-2016_co-authorship_map.txt'),
            to: absolute('dist', bundleName, 'data/JOI_2007-2016_co-authorship_map.txt'),
          },
          {
            from: resolve(__dirname, 'data', 'JOI_2007-2016_co-authorship_network.txt'),
            to: absolute('dist', bundleName, 'data/JOI_2007-2016_co-authorship_network.txt'),
          },
          {
            from: resolve(__dirname, 'data', 'JOI_2007-2016_co-authorship_network.json'),
            to: absolute('dist', bundleName, 'data/JOI_2007-2016_co-authorship_network.json'),
          },
        ],
      }),
    );
  } else if (appMode === 'dimensions') {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          ...copyPatternsImages,
          {
            from: resolve(__dirname, 'data', 'Dimensions_COVID19_research_organization_co-authorship_network.json'),
            to: absolute('dist', bundleName, 'data/Dimensions_COVID19_research_organization_co-authorship_network.json'),
          },
          {
            from: resolve(__dirname, 'data', 'Dimensions_obesity_journal_bibliographic_coupling_network.json'),
            to: absolute('dist', bundleName, 'data/Dimensions_obesity_journal_bibliographic_coupling_network.json'),
          },
          {
            from: resolve(__dirname, 'data', 'Dimensions_scientometrics_researcher_co-authorship_network.json'),
            to: absolute('dist', bundleName, 'data/Dimensions_scientometrics_researcher_co-authorship_network.json'),
          },
        ],
      }),
    );
  } else if (appMode === 'zetaalpha') {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          ...copyPatternsImages,
          {
            from: resolve(__dirname, 'data', 'Zeta-Alpha_ICLR2021.json'),
            to: absolute('dist', bundleName, 'data/Zeta-Alpha_ICLR2021.json'),
          }
        ],
      }),
    );
  } else if (appMode === 'rori') {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          ...copyPatternsImages,
          {
            from: resolve(__dirname, 'data', 'RoRI_research_funding_landscape_2019jun_global.txt'),
            to: absolute('dist', bundleName, 'data/RoRI_research_funding_landscape_2019jun_global.txt'),
          },
          {
            from: resolve(__dirname, 'data', 'RoRI_research_funding_landscape_2019jun_health.txt'),
            to: absolute('dist', bundleName, 'data/RoRI_research_funding_landscape_2019jun_health.txt'),
          },
        ],
      }),
    );
  }

  return config;
};
