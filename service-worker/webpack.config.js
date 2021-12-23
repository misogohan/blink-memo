const path = require('path');

module.exports = () => {
  const is_dev = process.env.NODE_ENV !== 'production';

  return {
    mode        : is_dev ? 'development' : 'production',
    devtool     : is_dev && 'eval',
    watch       : is_dev,
    entry       : {
      sw : path.resolve(__dirname, 'src/index.ts'),
    },
    output      : {
      path      : path.resolve(__dirname, 'dist'),
      filename  : 'sw.js',
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
            { loader: 'ts-loader' },
          ],
        },
      ],
    },
  };
};
