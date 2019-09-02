# 远程目标目录
remotePath=/data/nchome/hrncc_LD_1201/hotwebs/nccloud/resources

if [ $1 == 'hrhi' ];then
rm -rf /${remotePath}/$1
fi

if [ "$1" == 'hrjf' ];then
rm -rf /${remotePath}/$1
fi

if [ "$1" == 'hrwa' ];then
rm -rf /${remotePath}/$1
fi

if [ "$1" == 'hrcm' ];then
rm -rf /${remotePath}/$1
fi

if [ "$1" == 'done' ];then
rm -rf ./dist
fi

if [ $1 ];then
echo "删除"${1}"成功了！！"
fi