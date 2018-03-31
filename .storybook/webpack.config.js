const path = require('path');
module.exports = {
	module: {
		rules: [
			{
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"],
				include: path.resolve(__dirname, '../')
			},
			{
				test: /\.css/,
				loaders: ["style-loader", "css-loader"],
				include: path.resolve(__dirname, '../')
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: "source-map-loader",
				exclude: [
					/node_modules\//
				]
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				loader: "file-loader"
			},
			{
				test: /\.story\.tsx?$/,
				loaders: [{
					loader: require.resolve('@storybook/addon-storysource/loader'),
					options: { parser: 'typescript' }
				}],
				enforce: 'pre',
			},
		]
	},
	resolve: {
		alias: {
			'@projectstorm/react-canvas': path.join(__dirname, "..", "src", "main")
		},
		extensions: [".tsx", ".ts", ".js"]
	}
};
