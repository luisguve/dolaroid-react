module.exports = {
  entry: {
    main: "./src/index.jsx",
    vendor: "./src/vendor.js"
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {loader: "html-loader"}
        ]
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: "asset/resource"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: [".js", ".jsx"]
        }
      }
    ]
  }
}
