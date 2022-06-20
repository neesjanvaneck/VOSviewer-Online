import { join, resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
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
    type: 'asset/resource',
    generator: {
      filename: 'fonts/[name][ext]'
    }
  },
  {
    test: /\.(jpg|jpeg|gif|png|svg)$/,
    exclude: [/fonts/],
    type: 'asset/resource',
    generator: {
      filename: 'images/[name][ext]'
    }
  },
  {
    test: /\.txt$/,
    type: 'asset/source',
  }
];

const config = {
  entry: ['./src'],
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

  config.stats = {
    errorDetails: false,
    logging: 'verbose',
  };

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
  config.devtool = env.dev ? 'eval-cheap-module-source-map' : undefined; // Use 'source-map' for production to create map file
  config.output = {
    path: absolute('dist', bundleName),
    library: appMode,
    filename: env.dev ? `demo/dist/${bundleName}.bundle.js` : `${bundleName}.[contenthash].bundle.js`,
    publicPath: env.dev ? '/' : undefined,
    globalObject: 'this'
  };
  config.resolve.alias.component = resolve(__dirname, `src/${appMode}App.js`);

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
    new NodePolyfillPlugin(),
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
      DATA_MAP: (jsonConfig.parameters && jsonConfig.parameters.map) ? JSON.stringify(jsonConfig.parameters.map) : undefined,
      DATA_NETWORK: (jsonConfig.parameters && jsonConfig.parameters.network) ? JSON.stringify(jsonConfig.parameters.network) : undefined,
      DATA_JSON: (jsonConfig.parameters && jsonConfig.parameters.json) ? JSON.stringify(jsonConfig.parameters.json) : undefined
    }),

    // new BundleAnalyzerPlugin(),
  ];

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        ...copyPatternsImages,
      ],
    }),
  );

  return config;
};
