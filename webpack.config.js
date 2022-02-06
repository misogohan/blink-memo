const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge }         = require('webpack-merge');

module.exports = (env, argv) => {
  const is_dev = argv.mode !== 'production';

  const base = {
    mode        : is_dev ? 'development' : 'production',
    devtool     : is_dev && 'eval',
    resolve     : {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '~': path.resolve(__dirname, './src'),
      }
    },
    module      : {
      rules: [
        {
          test  : /\.tsx?$/,
          use: [
            { loader: 'babel-loader' },
            { loader: 'ts-loader', options: {
              compilerOptions: { jsx: 'react-jsx' + (is_dev ? 'dev' : '') },
            } },
          ],
        },
      ],
    },
  };

  return [
    merge(base, {
      name        : 'web-client',
      dependencies: [ 'service-worker' ],
      target      : 'web',
      entry       : {
        app: path.resolve(__dirname, './src/web-client/index.tsx'),
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test   : /node_modules/,
              name   : 'vendor',
              chunks : 'initial',
              enforce: true,
            },
          },
        },
      },
      output      : {
        path      : path.resolve(__dirname, './dist'),
        filename  : is_dev ? '[id].js' : '[contenthash].js',
        publicPath: '/',
        clean     : true,
      },
      module      : {
        rules: [
          {
            test   : /\.(?:svg|png|jpe?g|webp|gif)$/i,
            loader : 'file-loader',
            options: {
              name: 'images/[name].[contenthash].[ext]',
            },
          },
        ],
      },
      plugins     : [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, './src/template.html'),
        }),
        new CopyWebpackPlugin({
          patterns: [
            { from:  path.resolve(__dirname, './src/service-worker/dist'), to: '.'}
          ]
        }),
      ],
      devServer   : {
        static: {
          directory: path.resolve(__dirname, './dist'),
        },
        historyApiFallback: true,
        port  : 8080,
      },
    }),
    merge(base, {
      name        : 'service-worker',
      target      : 'webworker',
      entry       : {
        sw : path.resolve(__dirname, './src/service-worker/index.ts'),
      },
      output      : {
        path      : path.resolve(__dirname, './src/service-worker/dist'),
        filename  : 'sw.js',
      },
    }),
  ];
};

