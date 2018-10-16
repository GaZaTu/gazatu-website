const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WriteFileWebpackPlugin = require("write-file-webpack-plugin")
const baseConfig = require("./base.config.js")

module.exports = merge(baseConfig, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "../dist/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true,
    index: path.resolve(__dirname, "../dist/index.html"),
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new CleanWebpackPlugin([path.resolve(__dirname, "../dist/")], {
      allowExternal: true,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../public/"),
        to: path.resolve(__dirname, "../dist/"),
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new WriteFileWebpackPlugin(),
  ],
})
