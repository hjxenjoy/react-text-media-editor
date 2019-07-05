const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './example/index.jsx',
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].[hash:10].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ErrorOverlayPlugin(),
    new HtmlWebpackPlugin({
      template: './example/index.html',
      inject: true,
    }),
    new webpack.WatchIgnorePlugin([path.join(__dirname, '../node_modules')]),
  ],
  devServer: {
    // Display only errors to reduce the amount of output.
    stats: 'errors-only',
    // Parse host and port from env to allow customization.
    //
    // If you use Docker, Vagrant or Cloud9, set
    // host: "0.0.0.0";
    //
    // 0.0.0.0 is available to all network devices
    // unlike default `localhost`.
    // host: process.env.HOST, // Defaults to `localhost`
    port: 2019, // Defaults to 8080
    open: true, // Open the page in browser
    hot: true,
    overlay: true,
  },
}
