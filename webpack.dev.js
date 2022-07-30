const { merge } = require("webpack-merge"); //webpack-mergeの読み込み
const commonConfig = require("./webpack.common"); //webpackのcommon設定ファイルの読み
const path = require("path"); //Nodeのpathモジュールの使用
const WebpackDevServer = require("webpack-dev-server");

module.exports = merge(commonConfig, {
  mode: "development", //webpackの出力モードを設定
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
    port: 9000,
    open: true,
    client: {
      overlay: true,
    },
  },
});
