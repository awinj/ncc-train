/** 
 * @desc   url参数转对象
 * @param  {String} url  default: window.location.href
 * @return {Object} 
 */
export const parseQueryString = (url) => {
    let name, value;
    let str = location.href; //取得整个地址栏
    let num = str.indexOf("?");
    str = str.substr(num + 1); //取得所有参数
    var arr = str.split("&"); //各个参数放到数组里
    for ( let i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
        if (pname === name)
            return decodeURIComponent(value);
        }
    }
    return "";
}

/** 
 * @desc   localhost【主机+端口】  
 * @return str
 */
export const urlHost = () => {
    return location.host;
}

/** 
 * @desc   localhost【主机名】  
 * @return str
 */
export const urlHostName = () => {
    return location.hostName;
}

/** 
 * @desc   【端口】
 * @return str
 */
export const urlPost = () => {
    return location.post;
}

/**
 * @desc   http【协议】
 * @return str
 * **/
export const urlProtocol = () => {
    return location.protocol;
}

/**
 * 浏览器全屏
 */
export const fullScreen = () => {
    const docElm = document.documentElement;
    if(docElm.requestFullscreen) {
      docElm.requestFullscreen();
    }else if (docElm.mozRequestFullScreen) {//FireFox
      docElm.mozRequestFullScreen();
    }else if (docElm.webkitRequestFullScreen) {//Chrome等
      docElm.webkitRequestFullScreen();
    }else if (elem.msRequestFullscreen) {//IE11
      elem.msRequestFullscreen();
    }
  }
  
  /**
   * 浏览器退出全屏
   */
  export const exitFullScreen = () => {
    const docElm = document.documentElement;
    if(docElm.requestFullscreen) {
      docElm.exitFullscreen();
    }else if (docElm.mozRequestFullScreen) {//FireFox
      document.mozCancelFullScreen();
    }else if (docElm.webkitRequestFullScreen) {//Chrome等
      document.webkitCancelFullScreen();
    }else if (elem.msRequestFullscreen) {//IE11
      document.msExitFullscreen();
    }
  }


















