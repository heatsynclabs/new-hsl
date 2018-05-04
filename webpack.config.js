const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    main: path.join(__dirname, './src/index.js'),
    live: path.join(__dirname, './src/live.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './dist/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
