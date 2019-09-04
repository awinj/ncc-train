const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ncWebpackConfig = require('../config.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//生产输出路径变量
const outputPath = ncWebpackConfig['appProdOutputPath'];
//console.log(outputPath); "../dist"
//console.log(__dirname);  "d:\abc\demo-item1"// "/Users/sunxinfei/demo-item1"

common.webpackPluginArr.push(
	new CleanWebpackPlugin(
		[
			`${outputPath}/platform-widgets`,
			`${outputPath}/platform-apps`,
			`${outputPath}/platform-assets`,
			`${outputPath}/platform-index.html`
		],
		{ allowExternal: true }
	)
);

// common.webpackPluginArr.push(
// 	new CopyWebpackPlugin([
// 		{ from: 'src/platform-assets/', to: `${outputPath}/platform-assets/`, ignore: [ 'images/*', 'iconfont/*' ] }
// 	])
// ); // to目录 ../prod-dist/platform-assets/

//生产模式下的配置
module.exports = merge(common.commonConfig, {
	devtool: 'eval',
	entry: common.entries,
	output: {
		path: path.resolve(__dirname, outputPath),
		filename: '[name].js',
		libraryTarget: 'umd', //将你的 library 暴露为所有的模块定义下都可运行的方式,https://github.com/umdjs/umd
	},
	plugins: common.webpackPluginArr,
	performance: {
		hints: 'warning' //将展示一条错误，通知体积大的资源，在生产环境构建时，防止把体积巨大的 bundle 部署到生产环境，从而影响网页的性能
	}
});