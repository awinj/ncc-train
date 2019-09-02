const path = require('path');
const getEntry = require('./getEntry');
const webpack = require('webpack');
const webpackProdConfig = require('./webpack.prod.config.js');
const hammer = require('./hammer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../new-config.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// 项目根目录
const projectPath = path.join(__dirname, '../');

// 输入参数，hrhi  hrwa 什么的
const inputParam = [].slice.call(process.argv, 2);

// 参数拼装的正则，要是没有参数这个值为false

// 页面入口对象和模版集合
let entry = getEntry();
// 模块入口对象
let libEntry = getEntry('lib');
// 入口对象
let entryMap = entry.entry;
// 自定义模版map
let entryTemplateMap = entry.template;
// 模块入口对象
let libEntryMap = libEntry.entry;

//过滤lib
let libEntryMapModule = {};
if (inputParam && inputParam.length > 0) {
	let reg = new RegExp(`^(${inputParam})`);
	for (let key in libEntryMap) {
		if (reg.test(key)) {
			libEntryMapModule[key] = libEntryMap[key];
		}
	}
} else {
	libEntryMapModule = libEntryMap;
}

if(Object.keys(libEntryMapModule).length <= 0) {
	libEntryMapModule = libEntryMap;
}

// 临时中间变量，用于过滤参数选择的入口
let midTrans = {};
// 通过过滤入口的key值，找到对应的map
Object.keys(entryMap).map((key) => {
	if (inputParam && inputParam.length > 0) {
		let ifCurrentKeyIsEntry = false;
		for (let p of inputParam) {
			if (key.includes(p)) {
				ifCurrentKeyIsEntry = true;
				break;
			}
		}
		if (ifCurrentKeyIsEntry) {
			midTrans[key] = entryMap[key];
		}
	} else {
		midTrans[key] = entryMap[key];
	}
});
// console.log('==== 入口 ====');
if(Object.keys(midTrans).length > 0) {
	entryMap = midTrans;
}
// 拥有页面的入口的js对应的插件列表
let pagePlugins = [ ...webpackProdConfig.plugins ];
// 没有页面的入口的js的对应的插件列表
let libPlugins = [ ...webpackProdConfig.plugins ];

// 之后会切割入口文件以提升速度，这个变量就是存储切割后的入口数组
let entryList = [];
// 切割入口文件的时候用到的临时中转变量
let cache = {};

// 拿到所有入口的key值
let entryMapKeysList = Object.keys(entryMap);
// 所有的编译花费的时间数组
let costTime = [];
// 只运行一次的行为标志,主要用在了复制和clean插件上
let firstTime = true;

let allStartTime = Date.now();

// 通过遍历，将数据量很大的入口对象，切割成每30个入口文件为一个的数组
entryMapKeysList.map((key, index) => {
	cache[key] = entryMap[key];

	if (index % 30 === 0) {
		entryList.push(cache);
		cache = {};
		return;
	} else if (entryMapKeysList.length - 1 === index) {
		entryList.push(cache);
	}
});

// 运行链式的编译
runList(entryList.shift());

// 编译没有模板文件
function libCompile() {
	let arr = [];
	config['copy'].map((key, index) => {
		if (inputParam && inputParam.length > 0) {
			for (let p of inputParam) {
				if (key['from'].includes(p)) {
					hammer.isFileExist(key.from) && arr.push(key);
					break;
				}
			}
		} else {
			if (!key['exclude']) {
				hammer.isFileExist(key.from) && arr.push(key);
			}
		}
	});
	// 复制操作是在模块编译这里进行
	libPlugins.push(new CopyPlugin(arr));

	if(Object.keys(libEntryMapModule).length <= 0) {
		console.log('总耗时：', Date.now() - allStartTime);
		return;
	}

	webpackProdConfig.entry = libEntryMapModule;
	webpackProdConfig.plugins = libPlugins;

	webpackProdConfig.output.filename = '[name].js';

	webpack(webpackProdConfig, (err, stats) => {
		if (err) {
			// throw new Error(err);
			console.log(err);
			return;
		}
		console.log(stats.toString({
			chunks: false,  // Makes the build much quieter
			colors: true    // Shows colors in the console
		}));
		let t = stats.endTime - stats.startTime;
		costTime.push(t);
		console.log('总耗时：', Date.now() - allStartTime);
	});
}

// 链式运行入口组
function runList(entryMap) {
	compile(entryMap).then(() => {
		let entry = entryList.shift();
		if (entry) {
			runList(entry);
		} else {
			libCompile();
		}
	});
}

// 根据一个map执行编译
function compile(entryMap) {
	return new Promise((resolve, reject) => {
		let currentPlugin = [ ...pagePlugins ];
		if (firstTime) {
			firstTime = false;
			currentPlugin.unshift(
				new CleanWebpackPlugin([ 'dist' ], {
					root: path.join(__dirname, '../'),
					verbose: true,
					dry: false
				})
			);
		}

		// 根据入口配置添加html插件
		Object.keys(entryMap).map((key) => {
			let htmlWebpackOption = {
				filename: `${key}.html`,
				template: path.join(projectPath, config['default-template']),
				chunks: [ key ],
				inject: true
			};

			if (entryTemplateMap[key]) {
				htmlWebpackOption.template = path.join(projectPath, entryTemplateMap[key]);
			}

			currentPlugin.push(new HtmlWebpackPlugin(htmlWebpackOption));
		});

		webpackProdConfig.entry = entryMap;
		webpackProdConfig.plugins = currentPlugin;

		webpack(webpackProdConfig, (err, stats) => {
			if (err) {
				console.log(err);
				// throw new Error(err);
				return;
			}
			console.log(stats.toString({
				chunks: false,  // Makes the build much quieter
				colors: true    // Shows colors in the console
			}));
			let t = stats.endTime - stats.startTime;
			costTime.push(t);
			console.log('耗时：', t);
			resolve();
		});
	});
}
