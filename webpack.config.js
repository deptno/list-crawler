const path = require('path')
const externals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  externals: [externals()],
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
}