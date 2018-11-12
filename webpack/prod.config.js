const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")
const baseConfig = require("./base.config.js")

module.exports = merge(baseConfig, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  output: {
    publicPath: "/",
    filename: "js/[name].[contenthash].js",
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
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new OptimizeCssAssetsPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[id].[contenthash].css",
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
    new WorkboxPlugin.GenerateSW({
      swDest: "service-worker.js",
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{
        urlPattern: /^https:\/\/api\.gazatu\.xyz/,
        handler: "networkFirst",
        options: {
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }],
      importScripts: ["/push-notifications.js"],
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
})
