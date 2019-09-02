const path = require('path');

// 缓存已读取过的数据
let cache = {};

const createHtml = require('./createHtml');
const getTemplate = require('./getTemplate');

class CreateHtmlPlugin {
    constructor({templateMap, beforeAppendCss, beforeAppendJs}) {
        // 存储静态文件相关信息， 包含css和js信息
        this.assetsMap = {};
        // 存储已经更新过的文件路径，并且标记是否需要更新
        this.updated = {};
        // 入口对应的html文件绝对路径
        this.templateMap = getTemplate(templateMap);
        // 在插入css前需要处理的函数
        this.beforeAppendCss = beforeAppendCss;
        // 在插入js前需要处理的函数
        this.beforeAppendJs = beforeAppendJs;

        this.apply = this.apply.bind(this);
    }

    apply(compiler) {
        const {output} = compiler.options;
        compiler.hooks.done.tapAsync('CreateHtmlPlugin', (stat, callback) => {
            // 取到生成的静态文件路径
            let assetsList = Object.keys(stat.compilation.assets);

            assetsList.map((item) => {
                // 解析路径信息成一个对象
                let fileInfo = path.parse(item);
                
                // 只对css和js文件进行处理
                if(fileInfo.ext === '.js' || fileInfo.ext === '.css') {
                    if(!this.assetsMap[fileInfo.dir]) {
                        this.assetsMap[fileInfo.dir] = {};
                    }
                    let currentFile = this.assetsMap[fileInfo.dir];

                    // 当assetsMap没有存储过当前文件信息，或者当前存储的文件名字改变了
                    // 就说明有更新，需要重新进行编译
                    // 文件名字改变针对的是文件名带有hash值
                    if(
                        !this.assetsMap[fileInfo.dir][fileInfo.ext] || 
                        this.assetsMap[fileInfo.dir][fileInfo.ext].name !== fileInfo.name
                    ) {
                        // 将需要更新标记置为true
                        this.updated[fileInfo.dir] = true;
                        // 并且将存储的信息更新成当前信息
                        currentFile[fileInfo.ext] = fileInfo;
                    }

                    // 判断是否需要更新html
                    if(this.updated[fileInfo.dir]) {
                        // 更新前提是js和css都要有
                        if(
                            this.assetsMap[fileInfo.dir]['.css'] && 
                            this.assetsMap[fileInfo.dir]['.js']
                        ) {
                            // 更新过的文件需要将标记置否
                            this.updated[fileInfo.dir] = false;
                            // 拿到默认的模版内容
                            let content = this.templateMap['default'].content;
                            // 拿到默认模版的文件名
                            let templateName = path.basename(this.templateMap['default'].templatePath);

                            // 将静态文件路径和模版一一对应起来，缓存起来
                            // 如果有缓存，直接读取缓存
                            if(cache[item]) {
                                content = cache[item]
                            }
                            else {
                                for(let key in this.templateMap) {
                                    // 如果静态文件路径和模版定义的入口路径匹配，则取匹配模版
                                    if(item.indexOf(key) >= 0) {
                                        // 缓存模版
                                        cache[item] = this.templateMap[key];
                                        // 取出对应模版内容
                                        content = this.templateMap[key].content;
                                        // 取出对应模版名字
                                        templateName = path.basename(this.templateMap[key].templatePath);
                                        break;
                                    }
                                    else {
                                        // 没有对应模版的入口文件，则取默认模版
                                        cache[item] = this.templateMap['default'].content;
                                    }
                                }
                            }

                            // 生成html文件
                            createHtml(this.assetsMap[fileInfo.dir], content, templateName, output.publicPath, output.path, this.beforeAppendCss, this.beforeAppendJs);
                        }
                    }
                    
                }
            });
            callback();
        })
    }
}


module.exports = CreateHtmlPlugin;