const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new CopyPlugin([
      {
        from: './src/serviceworker.js',
        to: './[name].[ext]',
        toType: 'template'
      },
      { from: './src/*.ico', to: './[name].[ext]', toType: 'template' },
      { from: './src/manifest.json', to: './[name].[ext]', toType: 'template' },
      { from: './src/icons/*', to: './[name].[ext]', toType: 'template' }
    ])
  ]
}
