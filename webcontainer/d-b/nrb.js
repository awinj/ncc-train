const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const webpackDevServer = require('webpack-dev-server');
const webpackBaseConfig = require('./webpack.base.config');
const webpackDllConfig = require('./webpack.dll.config');

const getEntry = require('./getEntry');
const config = require('../new-config.json');

// 在编译之后打印文字的webpack插件
const LogAfterCompilePlugin = require('./LogAfterCompilePlugin');
const CreateHtmlPlugin = require('./create-html-webpack-plugin/CreateHtmlPlugin');

// 工具集
const h = require('./hammer');

// 入口对象集
let entryTmp = getEntry();
let libEntryTmp = getEntry('lib');

// 取出js入口路径
let entries = entryTmp.entry;
let libEntries = libEntryTmp.entry;

// 取出模版路径
let entryTmpMap = entryTmp.template;
let libEntryTmpMap = libEntryTmp.template;

// 目标路径
let targetPath = webpackBaseConfig.output.path

// 定义项目路径
let projectPath = path.join(__dirname, '../');

// 根据模版路径文件，取出模版
let templateMap = getTemplate(entryTmpMap);

module.exports = (m) => {
    copyDir();
    if(config['dll-entry'] && config['dll-entry'].length > 0) {
        runDllCompile()
            .then(() => {
                let manifestPath = getManifestPath();
                webpackBaseConfig.plugins.unshift(
                    new webpack.DllReferencePlugin({
                        manifest: require(manifestPath)
                    })
                )
                runCompile(m);
            });
    }
    else {
        runCompile(m);
    }
}

// 获取模板内容并且拼装模板
function getTemplate(templateMap) {

    let templateContentMap = {};
    templateContentMap['default'] = path.join(projectPath, config['default-template'])

    Object.keys(templateMap).map((item) => {
        let templatePath = templateMap[item];
        templateContentMap[item] = path.join(projectPath, templatePath)
    });

    return templateContentMap
}

// 获取dll生成得manifest文件
function getManifestPath() {
    let outputPath = webpackDllConfig.output.path;
    let fileList = fs.readdirSync(outputPath);
    let manifestPath = '../dist/hrpub/dll/vendor-manifest.json';

    for(let filename of fileList) {
        if(path.extname(filename) === '.json') {
            manifestPath = path.join(outputPath, filename);
            break;
        }
    }

    return manifestPath;
}

// 运行dll编译
function runDllCompile() {
    webpackDllConfig.plugins.push(new LogAfterCompilePlugin({
        word: 'note: dll has compiled'
    }));
    return new Promise((resolve, reject) => {
        webpack(webpackDllConfig, (err) => {
            if(err) {
                console.log(err);
            }
            resolve();
        });
    });
}

// 执行编译
function runCompile(m = []) {
    let pageCompiler = null;
    let nEntries = {};
    let reg = new RegExp(m.join('|'));

    Object.keys(entries).map((item) => {
        if(reg.test(item) || m.length === 0) {
            nEntries[item] = entries[item];
        }
    });

    entries = nEntries;

    let pageWBC = {
        ...webpackBaseConfig,
        plugins: [...webpackBaseConfig.plugins],
        entry: entries
    };
    pageWBC.plugins.push(new CreateHtmlPlugin({
        templateMap: templateMap,
        beforeAppendCss: ($) => {
            // 为了去掉平台对于console的影响
            $('head').prepend(`
                <script>
                    window.__console = {
                        ...window.console
                    };
                </script>
            `);
        },
        beforeAppendJs: ($) => {
            if(config['dll-entry'] && config['dll-entry'].length > 0) {
                $('body').append(`<script src="/hrpub/dll/vendor.js"></script>`);
            }
            $('body').append(`
                <script>
                    window.console = window.__console
                </script>
            `);
        }
    }));
    pageWBC.plugins.push(new LogAfterCompilePlugin());
    pageCompiler = webpack(pageWBC);

    let libCompiler = webpack({
        ...webpackBaseConfig,
        entry: libEntries
    });
    
    libCompiler.run(function(err, stat) {
        if(err) {
            console.log(err);
        }
        let server = new webpackDevServer(pageCompiler, {
            contentBase: path.join(__dirname, '../dist'),
            proxy: config.proxy,
            stats: 'errors-only',
            inline: config['dev-server']['refresh-immediately']
        });
        
        server.listen(3006, '', () => {
            console.log('open localhost:3006');
        });
    });
}

// 执行文件复制
function copyDir() {

    if(!h.isFileExist(targetPath)) {
        fs.mkdirSync(targetPath);
    }
    config.copy.map((obj) => {

        let absFrom = path.join(projectPath, obj.from);
        let absTo = path.join(targetPath, obj.to);

        if(!h.isFileExist(absTo)) {
            h.copyDirSync(targetPath, absFrom, absTo);
        }
    });
}