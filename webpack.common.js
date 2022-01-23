/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		background: './src/background/background.ts',
		browser_popup: './src/browser_popup/index.ts',
		content_script: './src/content_script/contentScript.ts',
		options: './src/options_page/index.ts',
	},
	resolve: {
		// see below for an explanation
		alias: {
			svelte: path.resolve('node_modules', 'svelte'),
		},
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						preprocess: require('svelte-preprocess')(),
						onwarn: (warning, handler) => {
							const { code } = warning;
							if (code === 'css-unused-selector') return;
							handler(warning);
						},
					},
				},
			},
			{
				// required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false,
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/ui_template.html',
			minify: 'auto',
			filename: 'browser_popup.html',
			title: 'Overview | Sentio - Video-Bookmarker',
			chunks: ['browser_popup'],
		}),
		new HtmlWebpackPlugin({
			template: './src/ui_template.html',
			minify: 'auto',
			filename: 'options.html',
			title: 'Options | Sentio - Video-Bookmarker',
			chunks: ['options'],
		}),
		new CopyPlugin({
			patterns: [
				'src/manifest.json',
				{ from: './src/icons', to: 'icons' },
			],
		}),
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
};
