const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const rootDir = path.resolve(__dirname, '../');
const webDir = path.join(rootDir, 'web');

const PORT = 3000;

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  context: webDir,

  mode: isDev ? 'development' : 'production',

  devtool: isDev ? 'source-map' : undefined,

  entry: {
    index: [path.join(webDir, 'index.tsx')],
  },

  output: {
    path: path.join(webDir, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: isDev ? [ReactRefreshTypeScript()] : [],
              }),
              transpileOnly: true,
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [webDir, path.join(rootDir, 'node_modules')],
  },

  devServer: isDev
    ? {
        devMiddleware: { publicPath: '/' }, // URL path where the webpack files are served from
        port: PORT,
        hot: true,
        historyApiFallback: true,
      }
    : undefined,

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(webDir, 'index.html'),
      inject: true,
    }),
    isDev ? new ReactRefreshWebpackPlugin() : undefined,
  ].filter(Boolean),
};
