/**
 * 获取当前时间时分秒
 * sign:'-,:'或':,:'
 * **/
const getYMDHMS = (date=new Date(),sign='') => {
    // const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateT = date.getDate();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    const day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
    let currentTime = null;
    if(sign.includes(',')) {
        signArr = sign.split(',');
        currentTime = `${year}${signArr[0]}${month}${signArr[0]}${dateT} ${hour}${signArr[1]}${minutes}${signArr[1]}${second}`
    }else {
        currentTime = `${year}${month}${dateT} ${hour}${minutes}${second}`
    }
    return currentTime;
}

export {
    getYMDHMS
}