const path = require("path");
const webpack = require("webpack");
require('dotenv').config();

module.exports = {
  mode: process.env.ENV,
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "handler",
    libraryTarget: "umd",
    globalObject: "this",
  },
  target: "node",
  plugins: [
    // force unused dialects to resolve to the only one we use
    // and for whom we have the dependencies installed
    new webpack.ContextReplacementPlugin(
      /knex\/lib\/dialects/,
      /postgres\/index.js/
    ),
    // pg optionally tries to require pg-native
    // replace it by a noop (real module from npm)
    new webpack.NormalModuleReplacementPlugin(/pg-(native|query)/, "noop2"),
  ],
};
