// cwebpack.config.js
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
module.exports = {
  entry: {
    index: './src/index.js',
    lib: ['three', 'three-orbitcontrols']
  },
  output: {
    path: path.resolve('dist'), // 设置输出目录
    filename: '[name].bundle.[hash:4].js', // 输出文件名
  },
  resolve: {
    extensions: ['.js', '.jsx', '.coffee'], // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
    alias: {
      public: path.resolve(__dirname, './public'),
      assets: path.resolve(__dirname, './public/assets'),
      models: path.resolve(__dirname, './public/models'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: 'images/'   // 图片打包后存放的目录
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|svg)$/,
        use: 'file-loader'
      },
      {
        test: /\.css$/,     // 解析css
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: /src/,          // 只转化src目录下的js
        exclude: /node_modules/  // 排除掉node_modules，优化打包速度
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new HtmlWebpackPlugin({
      template: './index.html',
      hash: true,
    }),
    new ExtractTextWebpackPlugin('css/style.css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      THREE: 'three',
      'window.THREE': 'three',
      'OrbitControls': 'three-orbitcontrols',
      // 'OBJLoader': 'three-obj-loader',
      // 'MTLLoader': 'three-mtl-loader',
    }),
    new UglifyjsWebpackPlugin()
  ],
  devServer: {
    // contentBase: './public',
    contentBase: './src',
    host: 'localhost',      // 默认是localhost
    port: 3000,             // 端口
    open: true,             // 自动打开浏览器
    hot: true               // 开启热更新
  },
  mode: mode,
  optimization: {
    splitChunks: {
      cacheGroups: {
        lib: {
          chunks: 'initial',
          name: 'lib',
          enforce: true,
        }
      }
    }
  },
  watch: true,
}
