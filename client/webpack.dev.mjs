import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

// Using ESModules __filename and __dirname are not available by default and must be imported.

import { fileURLToPath } from 'url';

import { merge } from 'webpack-merge';
import common from './webpack.common.mjs';

// we can then extract the __dirname to a variable
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',
    assetModuleFilename: 'assets/img/[name][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/template.html',
    }),
    new StylelintPlugin({
      configFile: path.resolve(__dirname, '.stylelintrc.json'),
      files: '**/*.scss',
      fix: true,
    }),
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, '../.eslintrc.json'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});
