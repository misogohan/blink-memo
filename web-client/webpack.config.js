const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => {
  const is_dev = process.env.NODE_ENV !== 'production';

  return {
    name        : 'web-client',
    mode        : is_dev ? 'development' : 'production',
    devtool     : is_dev && 'eval',
    entry       : {
      app: path.resolve(__dirname, 'src/index.tsx'),
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
      path      : path.resolve(__dirname, '../dist'),
      filename  : is_dev ? '[id].js' : '[contenthash].js',
      publicPath: '/',
      clean     : true,
    },
    resolve     : {
      extensions: ['.ts', '.tsx', '.js'],
      alias     : {
        '~': path.resolve(__dirname, 'src'),
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
        template: path.resolve(__dirname, 'src/template.html'),
        filename: './index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from:  path.resolve(__dirname, '../service-worker/dist'), to: '.'}
        ]
      })
    ],
    devServer   : {
      static: {
        directory: path.resolve(__dirname, '../dist'),
      },
      port  : 8080,
    },
  };
};
