/**
 * 开发环境配置
 */
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const configJSON = require('../config.json');
const buildEntry = require('./buildEntry');
const port = configJSON.devPort || 3006;
const host = 'localhost';

module.exports = function (env, argv) {
	let mode = env.mode;
	let buildPath = env.buildPath || configJSON.buildEntryPath || './src/*/*/*/*/index.js';
	let buildWithoutHTML = configJSON.buildWithoutHTML;
	buildWithoutHTML && typeof buildWithoutHTML === 'string' && (buildWithoutHTML = [buildWithoutHTML]);
	let devConfig = {
		mode: 'development',
		entry: {},
		output: {
			// path: path.resolve(__dirname, './dist'),
			filename: '[name].js',
			// library: '[name]',
			// libraryTarget: 'umd'
			path: path.resolve(__dirname, './dist'),
			publicPath: '/',
			library: '[name]',
			libraryTarget: 'umd',
			//  filename: '[name][hash:8].js',
			chunkFilename: '[name].js'
		},
		devtool: 'source-map',
		devServer: {
			port, // 端口号
			host: '0.0.0.0', // 主机地址
			inline: false, // 控制台是否显示构建信息
			clientLogLevel: 'error', // 控制台显示什么log信息
			open: false, // 开始构建时是否打开浏览器，使用OpenBrowserPlugin在构建完成时打开浏览器
			hot: true, // 是否启用热替换
			lazy: false, // 是否请求时才编译包
			historyApiFallback: {
				// 404时的页面
				rewrites: { from: /./, to: '/404.html' }
			},
			overlay: {
				// 报错时浏览器是否显示错误信息
				warnings: true,
				errors: true
			},
			stats: 'errors-only', // 开启报错提示
			proxy: {
				// 请求代理
				'/nccloud': {
					target: configJSON.proxy
				},
                '/lappreportrt': {
                    target: configJSON.proxy+'/nccloud/resources'
                } ,
                '/uap': {
                    target: configJSON.proxy+'/nccloud/resources'
                },
                '/uapbd': {
                    target: configJSON.proxy+'/nccloud/resources'
                }
			}
		},
		plugins: [
			new webpack.DefinePlugin({
				NODE_ENV: JSON.stringify(mode)
			}),
			new webpack.NamedModulesPlugin(), // 当开启 HMR 的时候使用该插件会显示模块的相对路径
			new webpack.HotModuleReplacementPlugin(), // 模块热替换插件
			new OpenBrowserPlugin({ url: `http://${host}:${port}` }), // 构建完成打开浏览器插件
			new CopyWebpackPlugin([
				{ from: './src', to: './' },
				{ from: './src/platform', to: './platform' },
				{ from: './src/lappreportrt', to: './lappreportrt' }
			])
		]
	};

	let { entries, plugins, externals } = buildEntry({ buildPath, buildWithoutHTML, hash: true, mode: 'development' });
	Object.assign(common.externals, externals);
	Object.assign(devConfig.entry, entries);
	devConfig.plugins.push(...plugins);
	devConfig = merge(common, devConfig);
	return devConfig;
};
