/**
 * 生产环境配置
 */
const webpack = require('webpack');
const common = require('./webpack.common');
const path = require('path');
const merge = require('webpack-merge');
const configJSON = require('../config.json');
const buildEntry = require('./buildEntry');

module.exports = function(env, argv) {
	let { mode, hash } = env;
	let buildPath = env.buildPath || configJSON.buildEntryPath || './src/*/*/*/*/index.js';
	let buildWithoutHTML = configJSON.buildWithoutHTML;
	buildWithoutHTML && typeof buildWithoutHTML === 'string' && (buildWithoutHTML = [ buildWithoutHTML ]);
	let prodConfig = {
		mode: 'production',
		entry: {},
		output: {
			path: path.resolve(__dirname, '../dist'),
			publicPath: '../../../../',
			library: '[name]',
			libraryTarget: 'umd',
			chunkFilename: '[name].js'
		},
		devtool: false,
		plugins: [
			new webpack.DefinePlugin({
				NODE_ENV: JSON.stringify(mode)
			})
		],
		optimization: {
			minimize: true // 是否启用压缩
		}
	};
	if (hash === 'false') {
		hash = false;
	} else if (hash === 'true') {
		hash = true;
	}

	// test模式，加source-map调试
	mode === 'test' && (prodConfig.devtool = 'source-map');
	// 节点加hash，参照不加hash
	prodConfig.output.filename = hash ? '[name].[hash:8].js' : '[name].js';
	// 获取入口
	let { entries, plugins, externals } = buildEntry({ buildPath, buildWithoutHTML, hash });
	Object.assign(common.externals, externals);
	Object.assign(prodConfig.entry, entries);
	prodConfig.plugins.push(...plugins);

	prodConfig = merge(common, prodConfig);
	return prodConfig;
};
