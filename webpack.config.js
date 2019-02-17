const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/main.js',
    './src/main.scss'
  ],
  output: { 
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
					{
						loader: 'file-loader',
						options: {
							name: 'bundle.css',
						}
					},
					{
						loader: 'extract-loader'
					},
					{
						loader: 'css-loader?-url'
					},
					{
						loader: 'sass-loader'
					}
				]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    open: true,
    stats: "errors-only"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'infotechs-task',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      template: './src/index.html',
    })
  ]
};