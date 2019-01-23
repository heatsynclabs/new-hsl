const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    main: path.join(__dirname, './src/index.js'),
    live: path.join(__dirname, './src/live.js'),
    sw: path.join(__dirname, './src/sw.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './')
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
