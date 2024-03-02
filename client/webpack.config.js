import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import TerserWebpackPlugin from "terser-webpack-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"

const babelLoader = {
  loader: "babel-loader",
  options: {
    presets: [
      ["@babel/preset-react", { runtime: "automatic" }]
    ]
  }
}
const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: ["tailwindcss"]
    }
  }
}
const splitChunks = {
  cacheGroups: {
    styles: {
      test: /\.css$/,
      enforce: true
    }
  }
}

export default {
  stats: "minimal",
  devtool: "source-map",
  performance: {
    maxEntrypointSize: Math.pow(1024, 2),
    maxAssetSize: Math.pow(1024, 2)
  },
  entry: {
    index: "./src/index.jsx"
  },
  output: {
    clean: true,
    path: path.resolve(process.cwd(), "../dist/client"),
    filename: "js/[name].[contenthash:8].js",
    chunkFilename: "js/[name].[contenthash:8].chunk.js",
    assetModuleFilename: "media/[name][ext]"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].[contenthash:8].chunk.css"
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: "./public",
        globOptions: { ignore: ["**/index.html"] }
      }]
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", postcssLoader]
      },

      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: { fullySpecified: false },
        use: babelLoader
      },

      {
        test: /\.(png|svg)$/i,
        type: "asset/resource"
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: splitChunks
  },
  devServer: {
    port: 3000,
    historyApiFallback: true
  }
}