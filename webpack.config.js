const path = require('path');
const vueConfig = require('./vue-loader.config');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: '#source-map',
    entry: {
      app: './src/app.js',
      vendor: ['vue', 'vue-router', 'vuex', 'vuex-router-sync', 'axios']
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      extensions: ['.js', '.vue'],
      alias: {
        'src': path.resolve(__dirname, '../src'),
        'assets': path.resolve(__dirname, '../src/assets'),
        'components': path.resolve(__dirname, '../src/components')
      }
    },
  
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      filename: 'client-bundle.[chunkhash].js'
    },

    optimization: {
        runtimeChunk: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true,
                    minChunks: 2
                }
            }
        }
    },

    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        new HtmlWebpackPlugin({
            templateParameters: (compilation, assets, options) => ({
                webpack: compilation.getStats().toJson(),
                compilation: compilation,
                webpack: compilation.getStats().toJson(),
                webpackConfig: compilation.options,
                htmlWebpackPlugin: {
                    files: assets,
                    options: options
                }
            }),
            template: 'src/index.template.html'
        })
    ],
  
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: { }
        },
        {
            test: /\.css$/,
            use: [ 'vue-style-loader','css-loader' ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    }
  }