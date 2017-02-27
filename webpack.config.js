var path = require("path"),
	_ = require("lodash"),
	webpack = require("webpack"),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

	const vendor = [
		"lodash",
		"react",
		"react-dom",
		"react-router",
		"socket.io-client",
		"rxjs"
	];

//we use this approach instead of the typical module.export to have more control via gulp
function createConfig(isDebug) {

  //if we use cheap-source-map, we have trouble when trying to debug line-by-line in chrome dev tools
	const devtool = isDebug ? "eval-source-map" : null;

	const plugins = [
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: `"${process.env.NODE_ENV || "development"}"`
			},
			IS_PRODUCTION: !isDebug,
			IS_DEVELOPMENT: isDebug
		})
	];

	const loaders = {
		js:		{ test: /\.jsx?$/, loader: "babel", exclude: /node_modules/ },
		eslint:	{ test: /\.jsx?$/, loader: "eslint", exclude: /node_modules/ },
		json:	{ test: /\.json$/, loader: "json" },
		css:	{ test: /\.css$/, loader: "style!css?sourceMap" },
		sass:	{ test: /\.scss$/, loader: "style!css?sourceMap!sass?sourceMap" },
		files:	{ test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=5000" }
	};

	const clientEntry = ["babel-polyfill", "./src/client/client.js"];

	let publicPath = "/build/";

	if (isDebug) {
		plugins.push(new webpack.HotModuleReplacementPlugin());
		clientEntry.unshift(
			//these are links to the node_modules folder

			//the next one adds hot loader functionality in React so components are not fully reload, just updated
			//that whay componentDidMount is only called once.
			//it is a complement to the line added in .babelrc
			"react-hot-loader/patch",

			//we use localhost:8080 because that is what we defined in gulpfile.babel.js when we set webpack-dev-server
			"webpack-dev-server/client?http://localhost:8080/",
			"webpack/hot/only-dev-server");

		publicPath = "http://localhost:8080/build/";
	} else {
		plugins.push(
			new webpack.optimize.DedupePlugin(),
			new ExtractTextPlugin("[name].css"),
			new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
		);

		loaders.css.loader = ExtractTextPlugin.extract("style", "css");
		loaders.sass.loader = ExtractTextPlugin.extract("style", "css!sass");
	}

	return {
		name: "client",
		devtool,
		entry: {
			app: clientEntry,
			vendor
		},
		output: {
			path: path.join(__dirname, "public", "build"),
			filename: "[name].js",
			publicPath
		},
		resolve: {
			extensions: ["", ".js", ".jsx"],
			alias: {
				shared: path.join(__dirname, "src", "server", "shared")
			}
		},
		module: {
			loaders: _.values(loaders)
		},
		plugins
	};
}

module.exports = createConfig(process.env.NODE_ENV !== "production");
module.exports.create = createConfig;
