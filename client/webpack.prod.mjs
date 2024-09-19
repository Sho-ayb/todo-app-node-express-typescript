import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// Using ESModules __filename and __dirname are not available by default and must be imported.

import { fileURLToPath } from 'url';

import { merge } from 'webpack-merge';
import common from './webpack.common.mjs';

// we can then extract the __dirname to a variable
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: './',
    filename: 'bundle.[contenthash].js',
    assetModuleFilename: 'assets/img/[name].[hash][ext]',
    clean: true, // Cleans the output directory before emit
  },
  optimization: {
    minimizer: [
      new CSSMinimizerPlugin(),
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          format: {
            comments: 'false',
          },
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
});
