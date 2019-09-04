const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

module.exports = function buildEntry({ buildPath, buildWithoutHTML, hash, mode }) {
	Array.isArray(buildWithoutHTML) && buildWithoutHTML.unshift('refer');
	let projects = [],
		plugins = [],
		entries = {},
		externals = {};
	// 遍历src下的js
	if (Array.isArray(buildPath)) {
		buildPath.forEach((_buildPath) => {
			getFiles(_buildPath);
			plugins.push(
				new CleanWebpackPlugin([`../dist/${getBuildPath(_buildPath)}`], {
					root: __dirname,
					exclude: ['shared.js'],
					allowExternal: true,
					verbose: true,
					dry: false
				})
			);
		});
	} else {
		getFiles(buildPath);
		plugins.push(
			new CleanWebpackPlugin([`../dist/${getBuildPath(buildPath)}`], {
				root: __dirname,
				exclude: ['shared.js'],
				allowExternal: true,
				verbose: true,
				dry: false
			})
		);
	}

	projects.forEach((e) => {
		plugins.push(
			new CopyWebpackPlugin([
				// {output}/to/file.txt
				{ from: `./src/${e}/public`, to: `./${e}/public` }
			])
		);
	});

	function getFiles(buildPath) {
		glob.sync(buildPath).forEach((path) => {
			//  path ---为加载的每个index.js文件：./src/reva_demo/module/apply/list/index.js
			// chunk = 节点+list/card  ：reva_demo/module/apply/list
			const chunk = path.split('./src/')[1].split('/index.js')[0],
				project = chunk.split('/')[0]; // reva_demo

			projects.includes(project) || projects.push(project);
			// 生成webpack.config.js的入口
			let cUrl = './src/' + chunk + '/config.json',
				isExists = fs.existsSync(cUrl),
				_hash;
			if (isExists) {
				// 特殊处理的
				_hash = require('.' + cUrl).hash;
			}

			if (hash === 'false') {
				hash = false;
			} else if (hash === 'true') {
				hash = true;
			}

			let _chunk = ('/' + chunk + '/').toLowerCase();
			if (mode === 'development') {
				entries[`${chunk}/index`] = [path];
			} else {
				if (hash) {
					if (_hash) {
						entries[`${chunk}/index`] = [path];
					} else if (_hash !== false) {
						// 非参照页面生成hash
						!(_chunk.includes('/refer/') || _chunk.includes('/ref/') || _chunk.includes('/refers/')) &&
							(entries[`${chunk}/index`] = [path]);
					}
				} else {
					if (_hash === false) {
						entries[`${chunk}/index`] = [path];
					} else if (_hash !== true) {
						// 参照页面不生成hash
						(_chunk.includes('/refer/') ||
							_chunk.includes('/ref/') ||
							_chunk.includes('/refers/') ||
							_hash === false) &&
							(entries[`${chunk}/index`] = [path]);
					}
				}
			}

			// entries[`${chunk}/index`] = [ path ];

			// if (!(buildWithoutHTML || []).some((e) => path.includes(e))) {
			if (entries[`${chunk}/index`] && !(buildWithoutHTML || []).some((e) => path.includes(e))) {
				// HtmlWebpackPlugin的参数
				// const htmlConf = {
				// 	filename: `${chunk}/index.html`, // 生成的html文件名，可加目录/.../.../index.html
				// 	template: './index.html', // 模板html路径
				// 	chunks: [ `${chunk}/index` ], // 生成的html文件引入哪些js，不传的话引入所有js
				// 	cache: true
				// };
				let t = './index.html';

				let configjs = ''; //额外配置的js文件
				let configcss = ''; //额外配置的css文件
				if (isExists) {
					let temp = require('.' + cUrl).template;
					if (temp) {
						t = temp; //-----指定模板
					}

					//单独输出的文件配置
					let outputPath = require('.' + cUrl).output; //----打包文件输出路径
					if (outputPath) {
						//entries[`${outputPath}/index`] = [path];
						//不排除引用时会报错
						//externals[`${outputPath}/index`] = `${outputPath}/index`;

						entries[`${outputPath}/index`] = [path];
						externals[`${outputPath}`] = `${outputPath}/index`;
					}
					let report = require('.' + cUrl).report; //-----模板另外的依赖

					//单独引入的js文件配置
					let dependjs = require('.' + cUrl).dependjs;
					if (Array.isArray(dependjs) && dependjs.length) {
						for (let item of dependjs) {
							configjs = configjs + `<script src=${item}?v=${Date.now()}></script>`;
						}
					}

					let dependModuleName= require('.' + cUrl).dependModuleName;
					if (Array.isArray(dependModuleName) && dependModuleName.length) {
						for (let item of dependModuleName) {
							//不排除引用时会报错
							externals[`${item}`] = `${item}/index`;
						}
					}


					if (report) {
						configjs = configjs + `<script src=../../../../lappreportrt/nc-report/index.js></script>`;
					}
					//单独引入的css文件配置
					let dependcss = require('.' + cUrl).dependcss;
					if (Array.isArray(dependcss) && dependcss.length) {
						for (let item of dependcss) {
							configcss = configcss + `<link rel="stylesheet" href=${item}?v=${Date.now()}>`;
						}
					}
					if (report) {
						configcss =
							configcss + `<link rel="stylesheet" href="../../../../lappreportrt/nc-report/index.css" />`;
					}
				}

				const htmlConf = {
					filename: `${chunk}/index.html`, // 生成的html文件名，可加目录/.../.../index.html
					template: `${t}`, // 模板html路径
					inject: true, //允许插件修改哪些内容，包括head与body
					chunks: [`${chunk}/index`], // 生成的html文件引入哪些js，不传的话引入所有js
					//chunks: dependFile,  //只能加载编译的js文件
					cache: true,
					templateParameters: {
						configjs: configjs, //为模板添加js
						configcss: configcss //为模板添加css
					}
				};
				plugins.push(new HtmlWebpackPlugin(htmlConf));
			}
		});
	}

	function getBuildPath(buildPath) {
		let paths = buildPath.split('/').slice(2);
		for (var i = 0, l = paths.length; i < l; i++) {
			if (paths[i] === '*' || paths[i] === 'index.js') {
				break;
			}
		}
		paths = paths.slice(0, i).join('/');
		return paths;
	}
	return {
		plugins,
		entries,
		externals
	};
};
