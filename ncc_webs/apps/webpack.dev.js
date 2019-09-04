const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ncWebpackConfig = require('../config.json');
//开发输出路径变量
const outputPath = '/dist';

//开发模式下的配置
module.exports = merge(common.commonConfig, {
    devtool: 'source-map',
    entry: common.entries,
    devServer: {
        contentBase: __dirname + '/src',
        compress: true,// 一切服务都启用gzip 压缩
        port: ncWebpackConfig['appDevPort'], //开发服务器端口
        proxy: {
			'/nccloud': {
				// 代理地址
                target: ncWebpackConfig['appDevProxy']
			}
		}
    },
    output: {
        path: __dirname + outputPath,
        filename: '[name].js',
        libraryTarget: 'umd', //将你的 library 暴露为所有的模块定义下都可运行的方式,https://github.com/umdjs/umd
    },
    plugins: common.webpackPluginArr,
    performance: {
        hints: "warning" //将展示一条警告，通知这是体积大的资源。
    }
});