```json
// config.json
{
	"buildEntryPath": "./src/pages/*/*/*/*/index.js",
	"proxy": "http://10.6.240.46:8888/",
	"buildWithoutHTML": "uapbd/refer",
	"devPort": 3007
}
```

属性 | 说明
---|---
buildEntryPath | 业务组代码编译路径，可以是Array/String<br>1. 编译所有项目："./src/\*/\*/\*/\*/index.js"<br>2. 编译某项目："./src/project\_name/\*/\*/\*/index.js"<br>3. 编译某项目下某模块："./src/project\_name/module\_name/\*/\*/index.js"<br>4. 编译某项目下某模块下某节点："./src/project\_name/pages/module\_name/node\_name/\*/index.js"<br>5. 编译某项目下某模块下某节点下某页面："./src/project\_name/pages/module\_name/node\_name/page\_name/index.js"
buildWithoutHTML | 路径中含有某些字符串的目录，在开发/打包时不生成html文件，主要用于参照/其他公共组件，因为对于组件来说html没有用。例：'uapbd/refer'或['uapbd/refer','uapbd/refer1']
proxy | 请求代理路径
devPort | 开发环境端口号

## 新的编译配置

根目录下的new-config.json
- entry 是入口，根据glob的规则
- lib 是refer这类模块的入口，这种入口不需要生成html，也不经常改动，所以不需要监听， 通过script标签引用
- proxy 是代理
- copy 是需要直接复制的目录

启动编译仍然运行  `npm run dev`

启动编译可以执行 `npm run devs` 命令， 后面可以加参数例如：`npm run devs hrhi hrpub`，速度是全部编译的一半


## 部署到测试环境(172.20.9.80), 使用脚本部署的方式如下：
> 使用环境：- node 8.11.2  macOS, windows下待测试

### 使用方式

#### 设置免密登陆服务器
- 在命令行执行：ssh-copy-id root@172.20.54.184
- 输入密码：ufida123
- 以上两步骤只需要执行一次就可以了

#### 日常部署测试服务器
- 执行脚本：npm run publish hrhi
- windows 下执行：./publish.sh hrhi
- hrhi是src下代表模块的文件夹名称，可不添加
- 如果没有添加 hrhi 类似的参数，会将所有模块都部署到服务端测试环境
- 如果添加了，就只部署相关模块

#### 举例说明
- 比如：我开发的是 src/hrhi 模块下的某页面，现在需要部署到测试服务器上
- 我已经设置过免密登陆
- 在项目根目录执行命令：npm run publish hrhi 即可完成部署 hrhi 模块代码
- 如果执行 `npm run publish`，即可部署全部的模块

> windows下在`git bash`里执行：`./publish.sh`


#### 同时更新 hrhi hrjf hrwa hrpub
- mac下执行 `npm run update` 可以同步更新四个模块代码
- window下，需要在 `git bash`里执行 `./update.sh` 可以同步更新四个模块代码

#### 从6606服务器上更新platform代码
- mac 执行 `npm run updatePlatform`
- window下，需要在`git bash`里执行 `./updatePlatform.sh`


## 2019年3月14日更新
1、可以进行 npm run devs hrwa/wapayment/bankoffer 这种只编译某节点的方式执行

2、由于在第一次编译的时候，如果dist目录下没有平台的包，会进行复制，事件大概会持续几分钟，如果嫌时间长，可以手动把src目录下的平台包，复制到dist目录下

3、npm run devs 不加参数是编译全部入口，由于入口文件较多，会导致监听编译的时候速度较慢，所以建议按照模块或者节点进行编译开发，

## 2019年4月25日更新
注意事项：在项目里不要直接引用tinper-bee 的组件，tinper-bee 的组件在nc-lightapp-front的base里都封装了，可以从base里引用，在组件前加上 NC即可引用到，因为我们构建工具的脚手架没有包含tinper-bee 的安装，所以构建的时候会报错