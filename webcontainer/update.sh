
basepath=$(cd `dirname $0`; pwd)

module=('hrhi hrwa hrcm hrzz hrpub hrp hrjf hryf hrkq hrjq hrtrn hrjx hrys')
branchName=develop-ncc1.0

for m in $module;
do
mPath=${basepath}'/src/'${m}
cd $mPath
echo 'entry: '${mPath}
git checkout $branchName
echo $m' 切换分支'
git pull
echo 'git pull'
done