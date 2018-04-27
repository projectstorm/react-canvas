const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

const production = process.env.NODE_ENV === "production";
let plugins = [];

if (production) {
	console.log("creating production build");
	plugins.push(
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": '"production"'
		})
	);
}

module.exports = {
	entry: "./src/main.ts",
	output: {
		filename: "main.js",
		path: __dirname + "/dist",
		libraryTarget: "umd",
		library: "storm-react-canvas"
	},
	externals: [nodeExternals()],
	plugins: plugins,
	module: {
		rules: [
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	devtool: production ? "source-map" : "cheap-module-source-map",
	mode: production ? "production" : "development",
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: false,
					ecma: 5,
					mangle: false
				},
				sourceMap: true
			})
		]
	}
};
