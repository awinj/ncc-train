
# 使用方式

# 设置免密登陆服务器
# 在命令行执行：ssh-copy-id root@172.20.54.184
# 输入密码：ufida123
# 以上两步骤只需要执行一次就可以了

# 日常部署测试服务器
# 执行脚本：npm run publish hrhi
# windows 下执行：./publish hrhi
# hrhi是src下代表模块的文件夹名称，可不添加
# 如果没有添加 hrhi 类似的参数，会将所有模块都部署到服务端，
# 如果添加了，就只部署相关模块。

# 比如：我开发的是 src/hrhi 模块下的某页面，现在需要部署到测试服务器上
# 我已经设置过免密登陆
# 在项目根目录执行命令：npm run publish，即可完成

# 复制原来的dist，部署完毕后在放回来，为了解决，部署编译脚本加了hash，部署后本地无法读取js的问题
mv ./dist ./dist.bak

# 更新每个包里的最新代码
./update.sh

# 执行构建编译
npm run build $1

# 服务器ip
server=172.20.54.184
#server=172.20.9.80
# 压缩文件名
tarFileName="ncc-web.tar.gz"
# 服务端存储临时目录
serverDir=static-temp
# 本地目录
localDir=./dist/*
# 远程目标目录
remotePath=/data/nchome/hrncc1909/hotwebs/nccloud/resources/
# remotePath= /data/nchome/hrncc_190214_jzk/hotwebs/nccloud/resources/
# remotePath=/static-temp/test
# 参数是src下的代表模块的文件夹名称
# if [ $1 ];then
# localDir="./dist/"$1
# fi
# if [ "$2" == '9020' ];then
# remotePath=/data/nchome/hrncc1903_test/hotwebs/nccloud/resources/
# fi
# if [ "$2" == '9021' ];then
# remotePath=/data/nchome/hrncc1906_zhize/hotwebs/nccloud/resources/
# fi
# 压缩编译后的文件
tar -czf ./${tarFileName} ${localDir}



# 先把压缩文件发送到服务器，在登陆服务器，进到服务器存储目录，解压缩，删除压缩文件，复制文件到静态文件目录下
scp ./${tarFileName} root@${server}:/${serverDir} && ssh root@${server} "cd /"${serverDir}" && tar xmzvf ./"${tarFileName}" && rm -rf ./"${tarFileName}" && cp -rf "${localDir}" "${remotePath}


# 删除本地的压缩文件
rm -rf ./ncc-web.tar.gz

rm -rf ./dist
mv ./dist.bak ./dist

echo " "
echo "==================================="
echo "部署"$1"完成, 服务器IP: "$server
echo "发布路径："$remotePath
echo "发布端口："$2
echo "部署模块："$1
echo "==================================="
echo " "
