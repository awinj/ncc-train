/**
 * @desc 获取浏览器类型和版本
 * @return {String} 
 */
export const getExplore = () => {
    var sys = {},
        ua = navigator.userAgent.toLowerCase(),
        s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1]:
        (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] :
        (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] :
        (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0;
    // 根据关系进行判断
    if (sys.ie) return ('IE: ' + sys.ie)
    if (sys.edge) return ('EDGE: ' + sys.edge)
    if (sys.firefox) return ('Firefox: ' + sys.firefox)
    if (sys.chrome) return ('Chrome: ' + sys.chrome)
    if (sys.opera) return ('Opera: ' + sys.opera)
    if (sys.safari) return ('Safari: ' + sys.safari)
    return 'Unkonwn'
}

/**
 * @desc 获取操作系统类型
 * @return {String} 
 */
export const getOS = () => {
    var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
    var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
    var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

    if (/mac/i.test(appVersion)) return 'MacOSX'
    if (/win/i.test(appVersion)) return 'windows'
    if (/linux/i.test(appVersion)) return 'linux'
    if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) 'ios'
    if (/android/i.test(userAgent)) return 'android'
    if (/win/i.test(appVersion) && /phone/i.test(userAgent)) return 'windowsPhone'
}

/**
 * @desc 判断android,ios,winphone手机机型
 * @return {String} 
 */
export const phoneModules = () => {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        return 'Android'
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        return 'Ios'
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
        return 'Winphone'
    }
}

/**
 * @desc 判断浏览器是否是移动端设备
 * @return  {Boolean}
 */
export const isPhoneDevice = () => {
    return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? true : false
}
  
/**
 * @desc 判断是否是ipad
 * @return  {Boolean}
 */
export const isIpad = () => {
    return navigator.userAgent.toLowerCase().match(/iPad/i)=="ipad" ? true : false
}

/**
 * @desc 判断手机端是否安装了某个客户端APP
 * @param {String} url app链接地址
 * @return  {Boolean}
 */
export const testApp = (url) => {
    var timeout, t = 1000, hasApp = true;
    setTimeout(function () {
        if (hasApp) {
            return true //安装了
        } else {
            return false //未安装
        }
        document.body.removeChild(ifr);
    }, 2000)
  
    var t1 = Date.now();
    var ifr = document.createElement("iframe");
    ifr.setAttribute('src', url);
    ifr.setAttribute('style', 'display:none');
    document.body.appendChild(ifr);
    timeout = setTimeout(function () {
        var t2 = Date.now();
        if (!t1 || t2 - t1 < t + 100) {
            hasApp = false;
        }
    }, t);
}
  
  /**
   * @desc 判断手机是否安装了某个APP,如果安装了就打开，没安装就下载//判断手机是否安装了某个APP,如果安装了就打开，没安装就下载
   * @param {String} url app链接地址
   * @return  {Boolean}
   */
  export const openApp = (url) => {//
        var ua = window.navigator.userAgent.toLowerCase();
        //微信
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        window.location.href='downLoadForPhone';
        }else{//非微信浏览器
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            var loadDateTime = new Date();
            window.setTimeout(function() {
            var timeOutDateTime = new Date();
            if (timeOutDateTime - loadDateTime < 5000) {
                window.location = "";//ios下载地址
            } else {
                window.close();
            }
            },25);
            window.location = "schema://";
        }else if (navigator.userAgent.match(/android/i)) {
            var state = null;
            try {
            window.location = 'schema://';
            setTimeout(function(){
                window.location= ""; //android下载地址
  
            },500);
            } catch(e) {}
        }
    }
}

/**
   * @desc 生成指定字节长度的唯一标志uuid
   * @param {Number} len 字节长度
   * @param {Number} radix 进制 2/4/8/16
   * @return  {String}
   */
export const uuid = (len, radix) => {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;
   
    if (len) {
     // Compact form
     for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
     // rfc4122, version 4 form
     let r;
   
     // rfc4122 requires these characters
     uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
     uuid[14] = '4';
   
     // Fill in random data. At i==19 set the high bits of clock sequence as
     // per rfc4122, sec. 4.1.5
     for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
       r = 0 | Math.random()*16;
       uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
     }
    }
   
    return uuid.join('').toLowerCase();
  }

//获取当前浏览器分辨率
const getDPI = () => {
    return document.documentElement.clientHeight;
}

export const getDifferHeiByDPI = (hei = 100) => {
    const setviceHei = getDPI();
    let transHei = hei;
    if(setviceHei < 789 && setviceHei >= 657) {
        transHei = hei-20;
    }else if(setviceHei < 657 && setviceHei >= 609) {
        transHei = hei-40;
    }
    return transHei;
} 





