const path = require('path');
const glob = require('glob');
const entries = {};
const chunks = [];
let webpackPluginArr = [];
const HtmlWebpackPlugin = require('html-webpack-plugin');
//多页面读取文件
// const filesWidgets = glob.sync('./src/platform-widgets/*/index.js');//入口路径文件
// filesWidgets.forEach((path)=>{
//     const chunk = path.split('./src/platform-widgets/')[1].split('/index.js')[0];//"component1"
//     entries[`${chunk}/index`] = path;//entries["component1/index"] = "./src/platform-widgets/component1/index.js"
// });

function getEntriesPath(filesPathStr, entriesObj){
    // const filesWidgets = glob.sync(filesPathStr);//入口路径文件"./src/platform-widgets/component1/index.js"
    // const splitStr = filesPathStr.split("*");// ["./src/platform-widgets/", "/index.js"]
    // const folderName = splitStr[0].split('src/');//["./", "platform-widgets/"]
    // filesWidgets.forEach((path)=>{
    //     const chunk = path.split(splitStr[0])[1].split('/index.js')[0];//"component1"
    //     entriesObj[`${folderName[1]}${chunk}/index`] = path;//entries["component1/index"] = "./src/platform-widgets/component1/index.js"
    // });
    const filesWidgets = glob.sync(filesPathStr);//入口路径文件"./src/platform-widgets/component1/index.js"
    filesWidgets.forEach((path)=>{
        const splitStr = path.split('src/');//["./", "platform-widgets/component1/index.js"]
        const chunk = splitStr[1].split('/index.js')[0];//["platform-widgets/component1", ""]
        entriesObj[`${chunk}/index`] = path;//entries["platform-widgets/component1/index"] = "./src/platform-widgets/component1/index.js"
    });
};

getEntriesPath('./src/platform-widgets/*/index.js',entries);
getEntriesPath('./src/platform-apps/*/index.js',entries);
//
for (key in entries) {
	let tmpStr = entries[key].replace('index.js', 'index.html');
    let tmpTemplate = tmpStr.replace('./src',"");
	webpackPluginArr.push(
		new HtmlWebpackPlugin(
            {
			filename: tmpTemplate,
			template: tmpStr,
            inject: false,
            chunks:[key]
        }
    )
	);
}
//公共模块的配置
const commonExport ={
    entries:entries,
    webpackPluginArr: webpackPluginArr,
    commonConfig:{
        // 不要遵循打包这些模块，而是在运行时从环境中请求他们
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'echarts': 'echarts'
        },
        module: {
            //开发和生产中使用的loader
            rules: [
                {
                    test: /\.js[x]?$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    //css和js不进行代码分离，所以注释掉ExtractTextPlugin
                    // use: ExtractTextPlugin.extract({
                        use: ['style-loader', 'css-loader', {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('cssnano')
                                ]
                            }
                        }]
                    //     fallback: 'style-loader'
                    // })
                },
                {
                    test: /\.less$/,
                    // use: ExtractTextPlugin.extract({
                        use: ['style-loader', 'css-loader', {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('cssnano')
                                ]
                            }
                        }, 'less-loader' ]
                    //     fallback: 'style-loader'
                    // })
                },
                {
                    test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                    exclude: /favicon\.png$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                context: path.resolve(__dirname, 'src/'),//修改[path]为根目录下的src/
                                name: '[path][name].[hash:8].[ext]',
                                publicPath: function(url) {
                                    var urlArr = url.split("/");
                                    return urlArr[urlArr.length-1];
                                  },
                            }
                        }
                    ]
                }
            ]
        }
    }
} 

module.exports = commonExport;