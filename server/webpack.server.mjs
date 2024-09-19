import path from 'path';

// Using ESModules __filename and __dirname are not available by default and must be imported.

import { fileURLToPath } from 'url';

// webpack-node-externals is a plugin that prevents bundling of Node.js node_modules and packages during runtime: https://www.npmjs.com/package/webpack-node-externals

import nodeExternals from 'webpack-node-externals';

// we can then extract the __dirname to a variable
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      main: path.resolve(__dirname, './src/index.ts'),
    },
    output: {
      path: path.resolve(__dirname, '../build/server'),
      filename: 'index.js',
    },
    mode: isProduction ? 'production' : 'development',
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@shared': path.resolve(__dirname, '../shared'),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
};
