/**
 * 公共配置
 */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//优化配置，对于使用CDN作为包资源的引用从外到内的配置
const externals = {
	'nc-lightapp-front': 'nc-lightapp-front',
	'platform-workbench': 'platform-workbench',
	'platform-login': 'platform-login',
	'nc-report': 'nc-report',
	'babel-polyfill': 'babel-polyfill',
	axios: {
		root: 'axios',
		var: 'axios',
		commonjs: 'axios',
		commonjs2: 'axios',
		amd: 'axios'
	},
	react: {
		root: 'React',
		var: 'React',
		commonjs: 'react',
		commonjs2: 'react',
		amd: 'react'
	},
	redux: {
		root: 'Redux',
		var: 'Redux',
		commonjs: 'redux',
		commonjs2: 'redux',
		amd: 'redux'
	},
	'react-redux': {
		root: 'ReactRedux',
		var: 'ReactRedux',
		commonjs: 'react-redux',
		commonjs2: 'react-redux',
		amd: 'react-redux'
	},
	'@antv/g6': {
		root: 'G6',
		var: 'G6',
		commonjs: '@antv/g6',
		commonjs2: '@antv/g6',
		amd: '@antv/g6'
	},
	'react-router': {
		root: 'ReactRouter',
		var: 'ReactRouter',
		commonjs: 'react-router',
		commonjs2: 'react-router',
		amd: 'react-router'
	},
	'react-dom': {
		root: 'ReactDOM',
		var: 'ReactDOM',
		commonjs: 'react-dom',
		commonjs2: 'react-dom',
		amd: 'react-dom'
	}
};

//默认加载扩展名、相对JS路径模块的配置
const resolve = {
	extensions: [ '.jsx', '.js', '.less', '.css', '.json' ],
	alias: {
		src: path.resolve(__dirname, '../src/')
	}
};

//Loader
const rules = [
	{
		test: /\.js[x]?$/,
		include: /(node_modules\/.*nc\-lightapp\-front)|(src)/,
		use: [
			{
				loader: 'babel-loader'
			}
		]
	},
	{
		test: /\.css$/,
		exclude: /node_modules/,
		use: [
			'style-loader',
			{
				loader: 'css-loader',
				options: {
					mode: 'local',
					modules: true,
					localIdentName: '[name]--[local]--[hash:base64:5]'
				}
			},
			'postcss-loader'
		]
	},
	{
		test: /\.css$/,
		include: /node_modules/,
		use: [
			'style-loader',
			{
			loader: 'css-loader',
				options: {
					modules: false,
				}
			},
			'postcss-loader',
		]
	},
	{
		test: /\.less$/,
		// use: ExtractTextPlugin.extract({
		use: [ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader' ]
		// fallback: 'style-loader'
		// })
	},
	{
		test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
		exclude: /favicon\.png$/,
		use: [
			{
				loader: 'url-loader'
			}
		]
	}
];

//webpack通用配置
const commonConfig = {
	// 打包时排除
	externals,
	// loaders
	module: {
		rules
	},
	plugins: [
		// new ExtractTextPlugin({
		// 	filename: '[name].css',
		// 	allChunks: true
		// })
	],
	resolve
};

module.exports = commonConfig;
