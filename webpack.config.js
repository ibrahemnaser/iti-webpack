const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	// mode of the bundling [ by default='production','development']
	mode: "production",
	// require absolute path of the root file of the project
	entry: {
		bundle: path.resolve(__dirname, "./src/index.js"),
	},
	// require the absolute path of the output file
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "final.[name].[contenthash].js", // [name] refers to entry name => bundle
		clean: true, // ensure that there will be only one file if i update the original file
		assetModuleFilename: "[name][ext]",
	},
	// add a source map to facilate debugging
	devtool: "source-map",
	// webpack-dev-server configuration
	devServer: {
		static: {
			directory: path.resolve(__dirname, "./dist"),
		},
		port: 3000, // specify the port number
		open: true, // open directly on the browser when i run dev
		hot: true, // hot reload is turned on
		compress: true, // enable zip compression
		historyApiFallback: true,
	},
	// handle loaders
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
			{
				test: /\.(png|jpg|jpeg|svg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		// html plugin to create bundle html file from template
		new HtmlWebpackPlugin({
			title: "webpack",
			filename: "index.html",
			template: "./src/index.html",
		}),
		new MiniCssExtractPlugin(),
	],
	// img-optimization plugin
	optimization: {
		minimizer: [
			"...",
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						// Lossless optimization with custom option
						// Feel free to experiment with options for better result for you
						plugins: [
							["gifsicle", { interlaced: true }],
							["jpegtran", { progressive: true }],
							["optipng", { optimizationLevel: 5 }],
							// Svgo configuration here https://github.com/svg/svgo#configuration
							[
								"svgo",
								{
									name: "preset-default",
									params: {
										overrides: {
											// customize plugin options
											convertShapeToPath: {
												convertArcs: true,
											},
											// disable plugins
											convertPathData: false,
										},
									},
								},
							],
						],
					},
				},
			}),
			new CssMinimizerPlugin(),
		],
		minimize: true,
	},
};
