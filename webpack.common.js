const path = require("path"); //Nodeのpathモジュールの使用
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    //バンドルされる出力元を設定
    app: "./src/app.tsx",
  },
  output: {
    path: path.resolve(__dirname, "public"), //出力されるファイル先の設定
    filename: "js/[name].js", //出力されるファイル名
    chunkFilename: "js/[name].js", //entryポイント以外から出力されるjsファイルに対してこちらの設定で出力する(splitChunksで分割したファイルなど)
  },
  optimization: {
    splitChunks: {
      //共通で読み込みたいjsを１ファイルにまとめている。ここにあるファイルは出力されるhtmlに共通して挿入される。
      cacheGroups: {
        //まとめたいファイルをグループ毎に設定
        vendor: {
          //任意の名前
          chunks: "initial", //分割の条件
          test: /node_modules/, //分割の対象ファイル
          name: "vendor", //出力されるファイル名(outputのchunkFilenameに送られる)
        },
        vendorsModules: {
          chunks: "initial",
          test: /src[\\/]js[\\/]modules/, //[\\/]はスラッシュ
          name: "vendor-modules",
          minSize: 0, //分割対象となる最小のファイルサイズの指定、0にすることでtest内の全てのファイルを対象にできる。
        },
      },
    },
  },
  module: {
    //利用するローダーの設定
    rules: [
      {
        test: /\.tsx?$/, //ローダーが適用するファイルの条件
        exclude: /node_modules/, //node_modules内のファイルをローダーの対象外に
        use: [
          //利用するローダー
          "ts-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg?g|gif|png|svg)/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext][query]",
        },
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    // 拡張子の省略を配列で指定
    extensions: [".ts", ".tsx", ".js", ".json", ".png"],
  },
  plugins: [
    //プラグインの使用設定
    new CleanWebpackPlugin(), //バンドルするたびにファイル内を一旦削除する
    new HtmlWebpackPlugin({
      //出力するファイル名。outputのpathで設定されている場所がルートとなる
      template: "./src/html/index.html", //出力元のファイル
      chunks: ["app"], //entryで指定しているjsで読み込みたいものを記述する、何も記述しないと全てが読み込まれる
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css", //出力されるファイル名
    }),
    new Dotenv(),
  ],
};
