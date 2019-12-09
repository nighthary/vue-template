const nodeExternals = require('webpack-node-externals');
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: '#source-map',
  entry: './start.js',

  externals: [nodeExternals()],
  output: {
    // libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'node-dist'),
    filename: 'bundle.js'
  },
  target: 'node',
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        // 3.使用babel-loader编译js代码
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
              plugins: [
                '@babel/plugin-transform-modules-commonjs'
              ]
            }
          }
        ]
      }
    ]
  }
}
