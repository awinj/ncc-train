# 从6606服务器上拉取最新的platform

basepath=$(cd `dirname $0`; pwd)

scp -r root@172.20.9.80:/data/nchome/hrncc_LD_1201/hotwebs/nccloud/resources/platform/ ${basepath}/src/