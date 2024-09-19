import path from 'path';
import GoogleFontsPlugin from '@beyonk/google-fonts-webpack-plugin';

// Using ESModules __filename and __dirname are not available by default and must be imported.

import { fileURLToPath } from 'url';

// we can then extract the __dirname to a variable
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './client/src/js/index.ts',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
  devServer: {
    watchFiles: ['src/*.html'],
    static: {
      directory: path.join(__dirname, 'build'),
    },
    client: {
      logging: 'info',
      webSocketURL: 'ws://localhost:9000/ws',
      webSocketTransport: 'ws',
    },
    webSocketServer: 'ws',
    hot: false,
    port: 9000,
    compress: true,
  },
  plugins: [
    new GoogleFontsPlugin({
      fonts: [{ family: 'Poppins', variants: ['300', '400', '500', '600'] }],

      // Add more fonts if needed
      local: false, // Use Google fonts CDN instead of downloading
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(svg|jpg|png)$/,
        type: 'asset/resource',
      },
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
