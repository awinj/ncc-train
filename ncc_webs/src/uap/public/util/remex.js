
/**
 * 获取变量类型
 * @param  {Object} variable 任意类型变量
 * @return {String}     {} => Object, "" => String
 */
export const getVariableType = (variable) => {
  return /\[\w+\s(\w+)\]/.exec(Object.prototype.toString.call(variable))[1]
}

/**
 * 判断变量是不是函数
 * @param  {Object}  variable 待验证的函数
 * @return {Boolean}
 */
export const isFunc = (variable) => {
  return getVariableType(variable) === 'Function'
}

/**
 * 判断变量是不是对象
 * @param  {Object}  variable 待验证的对象
 * @return {Boolean}
 */
export const isObject = (variable) => {
  return getVariableType(variable) === 'Object'
}

/**
 * 判断变量是不是数组
 * @param  {Object}  variable 待验证的数组
 * @return {Boolean}
 */
export const isArray = (variable) => {
  return getVariableType(variable) === 'Array'
}

/**
 * 判断变量是不是字符串
 * @param  {Object}  variable 待验证的字符串
 * @return {Boolean}
 */
export function isString(variable) {
  return getVariableType(variable) === 'String'
}

/**
 * 判断变量是不是正则
 * @param  {Object}  variable 待验证的正则
 * @return {Boolean}
 */
export const isRegExp = (variable) => {
  return getVariableType(variable) === 'RegExp'
}

/**
 * 判断变量是不是函数
 * @param  {Object}  variable 待验证的函数
 * @return {Boolean}
 */
export const isFunction = (variable) => {
  return getVariableType(variable) === 'Function'
}

/**
 * 动态设置ios设备上微信的title名字
 * @param  {String}  title 当前页面title名字
 */
export const setTitle = (title = '阳光健康') => {
  if (currentTitle === title) {
    return
  } else {
    currentTitle = title
  }
  document.title = title
  let i = document.createElement('iframe')
  i.src = '//m.baidu.com/favicon.ico'
  i.style.display = 'none'
  i.onload = () => {
    setTimeout(() => {
      i.remove()
    }, 9)
  }
  document.body.appendChild(i)
}

/**
 *
 * @param  {String}  title 当前页面title名字
 * @return  {String}  title 当前页面title名字
 */
export const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 计算给出的给定的距离1970 年 1 月 1日午夜秒数和当前时间的间隔并给出区间范围
 * @param  {Number}  time 距离1970 年 1 月 1日午夜的毫秒数
 * @return  {String}  title 当前页面title名字
 */
export  const formatTime = (time, option) => {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
export const getQueryObject = (url)  => {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 计算ASCII 编码不在0-255的字符长度
 * @param  {String}  val ASCII码值
 * @return  {Number}  字节长度
 */
export const getByteLen = (val = '') => {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else { len += 0.5 }
  }
  return Math.floor(len)
}

/**
 * 清除数组中Boolean值为false的值，并返回新数组
 * @param  {Array}  actual 数组值
 * @return  {Array}  值为true的新数组
 */
export const cleanArray = (actual = []) => {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * 去除json数据中的空项并将项之间用&拼接起来
 * @param  {json}  json对象
 * @return  {String}  y用&拼接起来的字符串
 */
export const param = (json = {}) => {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

/**
 * 获取url中prams值并组装成对象
 * @param  {Sting}  url地址
 * @return  {Object}  prams键值对组装成的对象
 */
export const param2Obj = (url) => {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

/**
 * 创建新dom节点并将传入的参数设置为text值
 * @param  {Sting}  val 需要写入的字段
 * @return  {String}  成功写入div的数据
 */
export const html2Text = (val) => {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * 队象合并，同es6 Object.assign()
 * @param  {Object}  目标对象
 * @param  {Object}  原对象
 * @return  {Object}  对象内容复制成功后的目标对象
 */
export const objectMerge = (target, source)  => {
  /* Merges two  objects,
   giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

/**
 * 方法检查每个元素中指定的类。如果不存在则添加类，如果已设置则删除之。 效果类似Jquery中的toggleClass
 * @param  {String}  element 主体使用元素
 * @return {String} className 待切换类名
 */
export const toggleClass = (element, className) => {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * 选择时间的选项及方法绑定
 */
export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

/**
 * 将object转为json并编码
 * @param  {Object}  obj 待转码对象
 */
export function stringifyJSONCode(obj = {}) {
  return encodeURIComponent(JSON.stringify(obj)).replace(/'/g, "%27")
}

/**
 * 将object转为json对象
 * @param  {Object}  obj 待转码对象
 */
export function stringifyJSON(obj = {}) {
  return JSON.stringify(obj)
}

/**
 * 将string解析为obj
 *  @param  {str}  对象格式的字符串 eg: '{"name":"gafish"}'
 */
export function parseJSON(str = '') {
  return JSON.parse(decodeURIComponent(str))
}

/**
 * 从数组中根据key获取对象
 * @param  {String}  key 用于对象比较的key，如果不存在，则默认取为'id'
 */
export const getObjectByArray = (arr = [], val = '', key = 'id') => {
  let res = null
  if (key && isArray(arr)) {
    arr.forEach((item) => {
      if (item[key] === val) {
        res = item
        return false
      }
    })
  }
  return res
}

/**
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次   主要应用的场景比如：鼠标移动，mousemove 事件DOM 元素动态定位，window对象的resize和scroll 事件
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
export const throttle = (fn,delay, immediate, debounce) => {
  let curr = +new Date(),//当前事件
    last_call = 0,
    last_exec = 0,
    timer = null,
    diff, //时间差
    context,//上下文
    args,
    exec = function () {
      last_exec = curr;
      fn.apply(context, args);
    };
  return function () {
    curr= +new Date();
    context = this,
      args = arguments,
      diff = curr - (debounce ? last_call : last_exec) - delay;
    clearTimeout(timer);
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay);
      } else if (diff >= 0) {
        exec();
      }
    } else {
      if (diff >= 0) {
        exec();
      } else if (immediate) {
        timer = setTimeout(exec, -diff);
      }
    }
    last_call = curr;
  }
}

/**
 * 空闲时间必须大于或等于 一定值的时候，才会执行调用方法 debounce主要应用的场景比如：文本输入keydown 事件，keyup 事件，例如做autocomplete
 * @param  {Object}  目标对象
 * @param  {Object}  原对象
 * @return  {Object}  对象内容复制成功后的目标对象
 */
export const debounce = (func, wait, options) => {
  var lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime,
    lastInvokeTime = 0,
    leading = false,
    maxing = false,
    trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
      thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
    (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
      isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * 对象内容深克隆，包含原型链中数据和方法
 * @param  {source}  原对象
 * @return  {Object}  克隆后对象
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

/**
 * 是否是空对象
 * @param  {[type]}  obj = {}
 * @return {Boolean}
 */
export function isEmptyObject(obj = {}) {
  return Object.keys(obj).length === 0
}

/**
 * 是否是空数组
 * @param  {[type]}  arr = []
 * @return {Boolean}
 */
export function isEmptyArray(arr = []) {
  return arr.length === 0
}

/**
 * 格式化需要分享出去的链接地址
 * @param  {url}  String 当前路由路径
 * @param  {url}  apiHost 网址域名
 * @return {String} url
 */
export function formatShareURL(url = '', apiHost='http://www.baidu.com') {
  if (url && !/^https?/.test(url)) {
    url = apiHost + url
  }
  return url
}

/**
 * 格式化金额数目，自动补零
 * @param  {Number}  price
 * @return {Number} price
 */
export function formatPrice(price = '') {
  price = String(price)
  if (price.indexOf('.') === -1) {
    price += '.00'
  } else if (/\.\d$/.test(price)) {
    price += '0'
  }
  return price
}

/**
 * 获取UUID
 * @returns {string}
 */
export function getUUID() {
  let len = 32 // 32长度
  let radix = 16 // 16进制
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix]
    }
  } else {
    var r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('').toLowerCase()
}

/**
 * 校验当前url格式是否正确并返回带有特定字段的url的router地址
 * @param  {String}  http地址
 * @param {String} 标签文本
 * @return {String} http content
 */
export const obtainUrlContext = (url,flag) => {
  const uc = new RegExp(/^[a-zA-z]+:\/\/[a-zA-Z0-9\-\.]+(:[0-9]{1,}){0,1}(\/[^\/]+)([\/\-\w .?%&#=:]*)+$/);
  if(uc.test(url)) {
    let capUri = uc.exec(url)[3];//从url中获取到的context路径
    return flag && capUri.endsWith(flag) ? "" : capUri;
  }else{
    return "";
  }
}

/**
 * 获得当前http地址中所有params并返回指定key值对应的value
 * @param  {String}  pname 指定params对应的key值
 * @return {String} value 指定params对应的value值
 */
export const getUrlParam = (pname) => {
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
 * url地址中加入随机数加密
 * @param  {String}  url
 * @return {String}
 */
export const putRandomToUrl = (url) => {
  if (url.indexOf("?") < 0){
    return url + "?mid=" + Math.random();
  } else {
    return url + "&mid=" + Math.random();
  }
}

/**
 * 重构json保障其内部的有效性。把含有json字符串的string都转义为object
 * @param  {String}  url
 * @return {String}
 */
export const evalWholeJson = (json,evalProp) => {
  try{
    if (json instanceof Array|| json instanceof Object) {
      json.forEach( (o, n) => {
        if (typeof (o) == "string") {//根节点json如果为字符串可以没有{}开头和结束，但是如果对Object 评估，则要求属性中必须包含{}开头和结束，否则根本不知道是字符串还是需要评估的json字符
          if (o.charAt(0) == "{" && o.charAt(o.length - 1) == "}")
            json[n] = eval("(" + json[n] + ")");
        } else if(o instanceof Array || o instanceof Object) {
          evalWholeJson(o,evalProp);//评估对象是可以不用返回值的，评估字符和数组是必须返回值的。
        }

        //将属性也评估了
        evalProp && typeof n ==='string' && (n.indexOf('.')>0 || n.indexOf("[")>0) && flatVal(n,o,json) && (delete json[n])
      })
    } else if(typeof (json) == "string"){//根节点json如果为字符串可以没有{}开头和结束，但是如果对Object 评估，则要求属性中必须包含{}开头和结束，否则根本不知道是字符串还是需要评估的json字符
      return json.charAt(0) == "{"? eval("(" + json + ")"): eval("({" + json + "})");
    }
  }catch(e){
    console.error("evalWholeJson 错误，json=", json, e);
    return null;
  }
}

/*
 * 函数作用：此方法将返回保证其没有null的属性obj，并转换string的"ture"、"false"为对应的boolean
 * 实例：
 * 参数含义：
 * */
export const getValidPropsObj = (obj) => {
  if (obj instanceof Array) {
    var i = obj.length;
    while (i--) {
      obj[i] = getValidPropsObj(obj[i]);
    }
    return obj;
  } else if (obj instanceof Object) {
    var newObj = {};
    for ( var i in obj) {
      if (obj[i]) {
        if (obj[i] instanceof Array)
          newObj[i] = getValidPropsObj(obj[i]);
        else {
          newObj[i] = obj[i];
          if (obj[i] == "true")
            newObj[i] = true;
          else if (obj[i] == "false")
            newObj[i] = false;
        }
      } else {
      }//不填写则删除了空属性
    }
    return newObj;
  }
}

/**
 * 返回1-100000之间的随机整数
 * @return {Number}
 */
export const getRoandomInt = () => {
  let r = Math.random();
  return Math.round(r * 1000000);
}

/*
 * 函数作用：功能函数 对象写入属性
 * 实例：
 * @param obj  普通JS对象
 * @param selector JQUERY ID选择器 例如传入 "#elementid" 选择的就是页面中ID=elementid的DOM对象
 * */
export const writeObj2val = (obj, selector,pres) => {
  //tarArea 范围性结果集
  var tarArea = jQuery(selector);
  for ( var prop in obj) {
    var value =obj[prop];
    var propLowerFirstChar=prop.replace(/^\w/g,function(s){	return s.toUpperCase();	});
    if(!!value)
      if(!pres){
//					var t = document.getElementById(prop);
//					if(t) t.value=value;
        tarArea.find("#" + prop).val(value);
      }else{
        //	var presProps ="#" + pres[0] + propLowerFirstChar;
        for(var i=0,c=pres.length;i<c;i++){
          tarArea.find(pres[i] + propLowerFirstChar).val(value);
//						var t =	document.getElementById(pres[i] + propLowerFirstChar);
//						if(t) t.value=value;
        }
        //	presProps+=",#" + pres[i] + propLowerFirstChar;
        //	tarArea.find(presProps).val(value);
      }
  }
}

/*
 * 函数作用：访问链必须符合js规则。
 * 实例：
 * */
export const flatVal = (flatStr,value,context/*inner*/,reg) => {
  const paramNameReg = reg || (/^([A-Za-z_]\w*)|(\.([A-Za-z_]\w*))|(\[(\d+)\])|(\[(\"[^\"]*\")])|(\[(\'[^\']*\')])/g);
  let b=n=e=0,ec,ctx=context, // i是正则本次匹配的开始，e是匹配的末尾,ec是末尾的下一个字符，c是总长度，n是上次匹配末尾的位置
    g=0,//匹配上的组号
    s=flatStr,c=s.length,mr,idx;
  let doFlatVal = false;
  while((mr=paramNameReg.exec(flatStr))){
    if(n!=(b=mr.index)){
      throw {name:'格式异常',message:'链式访问格式异常，字符串中间有非法字符'}
    }

    doFlatVal = true;
    if((idx=mr[(g=1)]||mr[(g=3)]||mr[(g=5)]||mr[(g=7)]||mr[(g=9)]) && (e=b+mr[0].length)===c){
      idx=g==5?parseInt(idx):idx;
      ctx[idx]=value;
      break;
    }

    if(!ctx[idx])
      ctx[idx]= ((ec=s.charAt(e))=='.')?{} // 新增{}
        : (ec=='['?[] //新增[]
        :undefined); //抛出异常

    if(!ctx[idx])
      throw {name:'格式异常',message:'链式访问格式异常，此处应该为.或['};

    n=e;
    ctx=ctx[idx];
  }
  return doFlatVal;
}

/**
 * 函数作用：
 * 实例：
 * */
export const flat2tree = (flatDatas,treeSettings) => {
  let dnode = {fields: [], subNodes: {}};
  let createSettings = function(data,nodeSettings){
    var ns = Object.assign({},dnode,nodeSettings);
    data.forEach( (v, key) => {
      if (key.indexOf(".") < 0 && key.indexOf("[") < 0) {
        ns.fields.push(key);
      }else{//进到这里面来的要么有符号. 要么有符号[
        var ctx=ns;//设置根节点
        var paramNameReg = (/^([A-Za-z_][A-Za-z\d_]*)|(\.([A-Za-z_][A-Za-z\d_]*))|(\[([\d\w]+)\])|(\[(\"[^\"]*\")])|(\[(\'[^\']*\')])/g);
        var b=n=e=0,ec, // i是正则本次匹配的开始，e是匹配的末尾,ec是末尾的下一个字符，c是总长度，n是上次匹配末尾的位置
          g=0,//匹配上的组号
          s=key,c=s.length,mr,idx;
        while((mr=paramNameReg.exec(key))){
          if(n!=(b=mr.index)){
            throw {name:'格式异常',message:'链式访问格式异常，字符串中间有非法字符'}
          }

          if((idx=mr[(g=1)]||mr[(g=3)]||mr[(g=5)]||mr[(g=7)]||mr[(g=9)]||mr[(g=10)]) && (e=b+mr[0].length)===c){
            ctx.type = g>3?'list':'object';
            ctx.fields.push({indexName:key,fieldName:idx});
            break;
          }

          //因为还没有到末尾，所以还是要新建一个节点
          if(g<=9){
            ctx = ctx.subNodes[idx]= ctx.subNodes[idx]?ctx.subNodes[idx]:dep$.extend(true,{},dnode);//新建一个空子节点,并向子节点移动一层。
          }else
            throw {name:'格式异常',message:'链式访问格式异常，此处应该为.或['};

          n=e;
        }
      }
    })
    return ns;
  };
  let _ret=[];
  let _pick =function(data,pickFields,target){
    let _r = target||{};
    pickFields.forEach( (p ,k) => {
      if(typeof p == 'string')
        _r[p]=data[p];
      else
        _r[p.fieldName]=data[p.indexName];
    })
    return _r;
  };

  let creatNode = function(root,data,nodeSettings){
    var ns = nodeSettings = dep$.extend(true,nodeSettings||{},{nodeName:'id'});
    var findNode = function(r) {return r[ns.nodeName]==data[ns.nodeName]};

    var curNode= _.find(root,findNode);

    //处理当前节点
    if(!curNode) { // 如果当前节点不存在，则根据配置指定的属性建立一个
      if (isArray(root))
        root.push(curNode = _pick(data, ns.fields));
      else
        curNode = _pick(data, ns.fields, root);//取出值放到root里面
    }
    ns.subNodes.forEach( (sn,idx) => {
      !!idx && !_.isArray(curNode[idx]) && (curNode[idx]=(sn.type=='list'?[]:{}));//递归处理List子节点 初始化子数组节点 递归处理Object子节点
      creatNode(curNode[idx], data, sn);
    })
  };

  let doCreateSettings =false;
  flatDatas.forEach( (data,idx) => {
    //根据数据自动完善field,subField,subList参数
    if(!doCreateSettings){
      doCreateSettings = true;
      treeSettings = createSettings(data,treeSettings);
    }
    creatNode(_ret,data, treeSettings);
  })

  return _ret;
}

/**
 * cookie设置
 * @return {}
 */
export const setCookies = function (key,value,path,domain,expires,secure) {
  /**设置cookies*/
  /*cookie对象的api = {
   key:""//不能使用分号（;）、逗号（,）、等号（=）以及空格
   value:""任意字符串
   expires: // Date 不设置则当前会话结束后，则失效。
   path://可访问的目录，不设置则以/为准的所有子页面（含子目录都可以访问）
   secure: //是否使用https或者其他安全协议进行加密。
   }

   两种使用方法:key和value时普通的string，则保存为当前页面路径目录下的k-v cookies

   当key为对象时，则按如上结构，设置cookie
   */
  var k,v,e,p,s,d;
  if(typeof key == "object"){
    k = key.key;
    v = key.value;
    e = key.expires;
    p = key.path||"/";
    s = key.secure;
    d = key.domain;
  }else if(typeof key == "string"){
    k = key;
    v = value;
    p = path||"/";
    e = expires;
    s = secure;
    d = domain;
  }

  if(!k || k.indexOf(";")>=0|| k.indexOf(",")>=0|| k.indexOf("=")>=0)
    console.warn("cookie的key设置有误，不能包含;,=及空格。key="+k);

  var str =k+"="+escape(v);

  if(e && e instanceof Date) str = str+";expires="+e.toGMTString();
  if(p && (typeof p == "string")) str = str+";path="+p;
  if(s) str = str+";secure="+(!!e);
  if(d) str = str+";domain="+d;

  document.cookie=str;
}

/**
 * cookie获取
 * @return {}
 */
export const getCookies = (key) => {
  /**根据key来获取cookie
   key可以是
   ①一个字符串，直接返回一个value值
   ②以;分割的字符串；返回一个包含kes和value的对象
   ③一个对象；填充该对象，如果cookies不存在，则该对象的属性为undefined
   */
  var cookies = document.cookie.split("; ");
  var _t={};
  //_t作缓存，遍历查询
  var findCookie=function(key){
    if(!_t[key]){
      _.find(cookies,function(i){
        var cp = i.split("=");
        _t[cp[0]] = unescape(cp[1]);
        return cp[0] == key;
      });
    }
    return _t[key];
  };

  if(typeof key =="string"){
    if(key.indexOf(";")>=0){
      var ret={};
      _.each(key.split(";"),function(k){
        ret[k]=findCookie(k);
      });
      return ret;
    }else{
      return findCookie(key);
    }
  }else if(typeof key == "object"){
    _.each(key,function(v,k){
      key[k]=findCookie(k);
    });
    return key;
  }
}

/**
 * cookie判断
 * @return {}
 */
export const hasCookie = () => {
  return !(!this.getCookies(key) || this.getCookies(key) == 'undefined');
}

/**
 * cookie删除
 * @return {}
 */
export const delCookies = (key,path) => {
  /**删除cookies*/
  path=path||"/";
  var d = new Date();
  d.setDate(d.getDate()-1);
  var ds = d.toGMTString();
  document.cookie=key+"=null;path="+path+";expires="+ds;
  document.cookie=key+"=null;domain=."+domain+";path="+path+";expires="+ds;
}

export const insertAtCursor = (html) => {
  var str = html instanceof jQuery?html[0].outerHTML:html;
  //if (dep$.browser.msie) {
  //	var range = document.selection.createRange();
  //	txt = range.htmlText + "&nbsp;" + str + "&nbsp;";
  //	range.pasteHTML(txt);
  //}
  //else {
  var sel = window.getSelection();
  if($(sel.anchorNode).parents("[contenteditable]").length==0)
    return;
  var iEnd = sel.anchorOffset;
  var htmldata = sel.anchorNode.data;
  var finaldata =
    ((htmldata && htmldata.substring(0, iEnd))||"")
    + str
    +((htmldata && htmldata.substring(iEnd))||"&nbsp;");
  $(sel.anchorNode).replaceWith(finaldata);
  $(sel.anchorNode).parents("[contenteditable]").focus();
}

export const isWeixin = () => {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf("micromessenger") >-1 ) {
    return true;
  } else {
    return false;
  }
}

/**
 * PC端获取浏览器名称
 * @param
 * @return  {String}  浏览器名称
 */
export const browserName = () => {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

  if (userAgent.indexOf("Opera") > -1) {
    return "Opera"
  } //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  } //判断是否Firefox浏览器
  if (userAgent.indexOf("Chrome") > -1){
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    return "IE";
  } //判断是否IE浏览器
}

export const decorator = () => {
  var decoratorFn = function () {
    beforeFn && beforeFn.apply(this,arguments);
    wrappedFn && wrappedFn.apply(this,arguments);
    afterFn && afterFn.apply(this,arguments);
  };
  decoratorFn._isDecorator = true;
  return decoratorFn;
}

export const fillFilterData = () => {
  if(curFilter){
    curFilter._hasData = true;
    curFilter.rules.forEach( (rule) => {
      rule.data = data;
    })

    curFilter.groups.forEach( (group) => {
      fillFilterData(group, data);
    })
  }
}

export const defaults = (target) => {
  [].shift(arguments);//移除target
  _.each(arguments,function (_defaults) {
    //_.isObject(d)) //数组，对象，日期都是对象。除了基本类型以外都是对象
    _.each(_defaults,function (d,k) {
      if(!_.has(_defaults,k))return;
      var t = target[k];
      if(_.isUndefined(t)){ //如果不存在直接赋值

        if(!_.isObject(d) || _.isFunction(d)){
          target[k] = d;
        }else if(_.isArray(d)){
          target[k]=[];
          _.each(d,function (di,idx) {
            target[k][idx] = (!_.isObject(di) ? di : RMX.defaults(_.isArray(di) ? [] : {}, di));
          })
        }else if(_.isObject(d)){
          target[k]=RMX.defaults({},d);
        }

      }else if(_.isObject(t)){//注意：此处如果是Date function 等内置对象，也会进行直接属性的拷贝
        RMX.defaults(t, d);
      }
    })
  });
  return target;
}

export const phoneModules = () => {//判断android,ios,winphone手机机型
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
 * //判断浏览器是否是移动端设备
 * @param
 * @return  {Boolean}
 */
export const isPhoneDevice = () => {
  return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? true : false
}

/**
 * 判断是否是ipad
 * @param
 * @return  {Boolean}
 */
export const isIpad = () => {
  return navigator.userAgent.toLowerCase().match(/iPad/i)=="ipad" ? true : false
}

/**
 * 判断手机端是否安装了某个客户端APP
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
 * 判断手机是否安装了某个APP,如果安装了就打开，没安装就下载//判断手机是否安装了某个APP,如果安装了就打开，没安装就下载
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
 * F5重新刷新页面
 */
export const refresh = () => {
  window.location.reload();
}

/**
 * 搜索词搜索并进行储存历史存储
 * @param {String} sessionItems session对应Key值
 * @param {String} keyword 搜索字段
 * @param {Number} maxNum 最多存储字段数目
 * @return  {Boolean}
 */
export const setHistoryItems = (keyword, sessionItems = 'historyItems', maxNum = 8) => {
  keyword = keyword.trim()
  let historyItems = localStorage.getItem(sessionItems)
  debugger
  if (historyItems == '') {
    debugger
    localStorage.setItem(sessionItems, keyword)
  } else if(!!keyword){
    const onlyItem = historyItems.split('|').filter(e => e != keyword)
    if (onlyItem.length > 0 && onlyItem.length <= maxNum ){
      historyItems = keyword + '|' + onlyItem.join('|')
    }else if(onlyItem.length > maxNum){
      onlyItem.pop()
      historyItems = keyword + '|' + onlyItem.join('|')
    }
    debugger
    localStorage.setItem(sessionItems, historyItems)
  }
}

/**
 * 浏览器是否支持sticky
 * @return  {Boolean}
 */
export const isSupportSticky = () => {
  var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
  var stickyText = '';
  for (var i = 0; i < prefixTestList.length; i++ ) {
    stickyText += 'position:' + prefixTestList[i] + 'sticky;';
  }
  // 创建一个dom来检查
  var div = document.createElement('div');
  var body = document.body;
  div.style.cssText = 'display:none;' + stickyText;
  body.appendChild(div);
  var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
  body.removeChild(div);
  div = null;
  return isSupport;
}

/**
 * 判断当前手机正在使用的是苹果6.0系统
 * @return  {Boolean}
 */
export const isIOS6 = () => {//
  var userAgent = window.navigator.userAgent;
  var ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/);
  return ios && ios[2] && (parseInt(ios[2].replace(/_/g, '.'), 10) >= 6);
}

/**
 * 数字金额大写转换(可以处理整数,小数,负数)
 * @param {Number} n 想要转换的数字
 * @return  {String}
 */
export const smalltoBIG = (n = 0) => {
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [ ['元', '万', '亿','兆'], ['', '拾', '佰', '仟','万']  ];
  var head = n < 0? '欠': '';
  n = Math.abs(n);

  var s = '';

  for (var i = 0; i < fraction.length; i++)
  {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);

  for (var i = 0; i < unit[0].length && n > 0; i++)
  {
    var p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++)
    {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

export const formatMonet = (s, n) => {
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
  t = "";
  for(i = 0; i < l.length; i ++ )
  {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}

export const obtainVerticalPosition = (sesseion) => {
  let realHei = document.body.scrollTop;
  sessionStorage.setItem(sesseion,realHei)
}

export const scrollCurrPostion = (session) => {//滚动到原始位置
  if(sessionStorage.getItem(session)) {
    let scrollHei = sessionStorage.getItem(session);
    document.body.scrollTop = scrollHei;
  }
  sessionStorage.removeItem(session);
}

/**
 * 判断是否是整数
 * @param {Number} value 需要校验的数字
 * @return  {Boolean}
 */
export const isInteger = (value = 0) => {//是整数
  return (new RegExp(/^\d+$/).test(value))
}

/**
 * 判断是否是数字(含隐式的情况)
 * @param {Number} value 需要校验的值
 * @return  {Boolean}
 */
export const isNumber = (value) => {
  return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(value));
}

/**
 * 转换字符串中包含的特殊字符
 * @param {String} value 包含特殊字符的字符，左右箭头，双引号
 * @return  {String} 转成中文形式
 */
export const transStr = (value) => {
  return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}


export const replaceAll = (value ,os, ns) => {
  return value.replace(new RegExp(os, "gm"), ns);
}

/**
 * 是空白字符串
 * @param {String} value 字符串
 * @return  {Boolean}
 */
export const isSpaces = (value) => {
  for ( var i = 0; i < value.length; i += 1) {
    var ch = value.charAt(i);
    if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
      return false;
    }
  }
  return true;
}

/**
 * 是手机号
 * @param {String} value 手机号码
 * @return  {Boolean}
 */
export const isPhone = (value) => {//
  return (new RegExp(/^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/).test(value))
}

/**
 * 是Email
 * @param {String} value Email
 * @return  {Boolean}
 */
export const isEmail = (value) => {//
  return (new RegExp(/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/).test(value))
}

/**
 * 是http地址
 * @param {String} value url
 * @return  {Boolean}
 */
export const isUrl = (value) => {//
  return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(value))
}

/**
 * 是站外链接
 * @param {String} value url
 * @return  {Boolean}
 */
export const isExternalUrl = (value) => {
  return value.isUrl() && value.indexOf("://" + document.domain) == -1;
}

export const parseDate = (format) => {//字符串与日期的转化1
  nd = new Date(this.replaceAll("[年月-]", "/").replaceAll("日","").replaceAll("T"," "));
  return nd;
}

export const formatDate = (format) => {//字符串与日期的转化1
  return parseDate(format).format(format)
}

export const simpleDateParse = (format) => {//字符串与日期的转化1
  return parseDate("yyyy/MM/dd");
}

export const simpleTimeParse = (format) => {//根据本字符串生成对应的时间
  return parseDate("hh:mm:ss");
}

export const removeHtml = (format) => {//移除本字符串的html标签
  return this.replace(/<[^>].*?>/g,"");
}

export const omit = (len) => {//根据长度省略字符串。超过长度的后补"…"
  var s = trim();
  if (s.length > len) {
    return s.substring(0, len - 3) + "…";
  } else {
    return s;
  }
}

/**
 * 身份证号码格式校验
 * @param {Number} value 身份证号码
 * @return  {Boolean}
 */
export const isCertNo = (value) => {//
  var idNo = this;
  // 错误码
  var errorCodes =[true,"身份证号码位数错误!","身份证出生日期不合法!","身份证地区不合法!","身份证号码校验错误!"	];
  var area = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
    33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",
    46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
    65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
  var idNoArray = idNo.split("");

// 地区校验
  if(null == area[parseInt(idNo.substr(0,2))]){
    return errorCodes[3];}

  var reg,checkCode;// 正则表达式,校验码
  var sum,re;// 校验总和，余数
// 身份证位数及格式校验
  switch(idNo.length){
    // 15位校验
    case 15:
      if((parseInt(idNo.substr(6,2))+1900)%4 == 0 || ((parseInt(idNo.substr(6,2))+1900)%100 == 0 && (parseInt(idNo.substr(6,2))+1900)% 4 == 0)){
        reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
      }else{
        reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
      }
      if(reg.test(idNo)){return errorCodes[0];}else{return errorCodes[2];}
      break;
    case 18:
      // 18位校验
      // 出生日期合法性校验
      // 闰年((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
      // 平年((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
      if(parseInt(idNo.substr(6,4))%4 == 0 || (parseInt(idNo.substr(6,4))%100 == 0&&parseInt(idNo.substr(6,4))%4 == 0)){
        reg = /^[1-9][0-9]{5}((19[0-9]{2})|(200[0-9]{2})|(201[0-3]{2}))((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年校验
      }else{
        reg = /^[1-9][0-9]{5}((19[0-9]{2})|(200[0-9]{2})|(201[0-3]{2}))((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年
      }
      if(reg.test(idNo)){
        // 校验位
        sum = (parseInt(idNoArray[0])+parseInt(idNoArray[10]))*7
          + (parseInt(idNoArray[1])+parseInt(idNoArray[11]))*9
          + (parseInt(idNoArray[2])+parseInt(idNoArray[12]))*10
          + (parseInt(idNoArray[3])+parseInt(idNoArray[13]))*5
          + (parseInt(idNoArray[4])+parseInt(idNoArray[14]))*8
          + (parseInt(idNoArray[5])+parseInt(idNoArray[15]))*4
          + (parseInt(idNoArray[6])+parseInt(idNoArray[16]))*2
          + parseInt(idNoArray[7])*1
          + parseInt(idNoArray[8])*6
          + parseInt(idNoArray[9])*3;
        re = sum % 11;		// 余数
        checkCode = "10X98765432";			// 校验码
        var checkNo = checkCode.substr(re,1);			// 校验位
        if(checkNo == idNoArray[17])
          return errorCodes[0];
        else
          return errorCodes[4];

      }else{
        return errorCodes[2];
      }
      break;
    default:
      return errorCodes[1];
      break;
  }
}

/**
 * 银行卡号格式校验
 * @param {Number} bankno 银行卡号
 * @return  {Boolean}
 */
export const lunCheck = (bankno) => {
  var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhn进行比较）

  var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
  var newArr=new Array();
  for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
    newArr.push(first15Num.substr(i,1));
  }
  var arrJiShu=new Array();  //奇数位*2的积 <9
  var arrJiShu2=new Array(); //奇数位*2的积 >9

  var arrOuShu=new Array();  //偶数位数组
  for(var j=0;j<newArr.length;j++){
    if((j+1)%2==1){//奇数位
      if(parseInt(newArr[j])*2<9)
        arrJiShu.push(parseInt(newArr[j])*2);
      else
        arrJiShu2.push(parseInt(newArr[j])*2);
    }
    else //偶数位
      arrOuShu.push(newArr[j]);
  }

  var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
  var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
  for(var h=0;h<arrJiShu2.length;h++){
    jishu_child1.push(parseInt(arrJiShu2[h])%10);
    jishu_child2.push(parseInt(arrJiShu2[h])/10);
  }

  var sumJiShu=0; //奇数位*2 < 9 的数组之和
  var sumOuShu=0; //偶数位数组之和
  var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
  var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
  var sumTotal=0;
  for(var m=0;m<arrJiShu.length;m++){
    sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
  }

  for(var n=0;n<arrOuShu.length;n++){
    sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
  }

  for(var p=0;p<jishu_child1.length;p++){
    sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
    sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
  }
  //计算总和
  sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);

  //计算luhn值
  var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
  var luhn= 10-k;

  if(lastNum==luhn){
    return true;
  }
  else{
    return false;
  }
}


//日期区域
export const formateDate = () => {
  format = format ||"yyyy-MM-dd";
  var o = {
    "M+" : this.getMonth() + 1, // month
    "d+" : this.getDate(), // day
    "h+" : this.getHours(), // hour
    "m+" : this.getMinutes(), // minute
    "s+" : this.getSeconds(), // second
    "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
    "S" : this.getMilliseconds()
    // millisecond
  };
  var week = {
    "0" : "日",
    "1" : "一",
    "2" : "二",
    "3" : "三",
    "4" : "四",
    "5" : "五",
    "6" : "六"
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  if(/(E+)/.test(format)){
    format=format.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "/u5468") : "")+week[this.getDay()+""]);
  }
  for ( var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}

export const simpleDate = (splitString) => {
  var sd = splitString?this.format("yyyy"+splitString+"MM"+splitString+"dd"):this.format("yyyy-MM-dd");
  return sd=="NaN-aN-aN"?"":sd;
}

export const simpleTime = (splitString) => {
  var sd = splitString?this.format("yyyy"+splitString+"MM"+splitString+"dd"):this.format("hh-mm-ss");
  return sd=="NaN-aN-aN"?"":sd;
}

export const moveDate = (oper,format) => {
  var m;
  if(m=/([yMdh])([\+\-])([\dse]+)/.exec(oper))
    switch (m[1]) {
      case "h":
        if(m[3]=="e") {//h末
          this.setHours(this.getMinutes() + 1);
          this.setMinutes(1);
          this.setMinutes(this.getMinutes()-1);
        }else if(m[3]=='s') {//h初
          this.setMinutes(0);
        }else if(m[2]=="+")
          this.setHours(this.getHours()+parseInt(m[3]));
        else
          this.setHours(this.getHours()-parseInt(m[3]));
        break;
      case "d":
        if(m[2]=="+")
          this.setDate(this.getDate()+parseInt(m[3]));
        else
          this.setDate(this.getDate()-parseInt(m[3]));
        break;
      case "M":
        if(m[3]=="e") {//月末
          this.setMonth(this.getMonth() + 1);
          this.setDate(1);
          this.setDate(this.getDate()-1);
        }else if(m[3]=='s') {//月初
          this.setDate(1);
        }else if(m[2]=="+")
          this.setMonth(this.getMonth()+parseInt(m[3]));
        else
          this.setMonth(this.getMonth()-parseInt(m[3]));
        break;
      case "y":
        if(m[2]=="+")
          this.setYear(this.getFullYear()+parseInt(m[3]));
        else
          this.setYear(this.getFullYear()-parseInt(m[3]));
        break;

      default:
        throw "未实现的操作"+oper;
    }
  return this;
}

export const toChineseDate = (value) => {
  //日期转中文
  // 数字时间转化为汉字时间
// 1、获取中文年
  var myDate=value;
  var cnDate = [["0","〇"],["1","一"],["2","二"],["3","三"],["4","四"],["5","五"],["6","六"],["7","七"],["8","八"],["9","九"],["10","十"],["11",'十一'],["12","十二"]];
  function getCFullYear(){
    myFullYear=myDate.getFullYear().toString().split("");
    for(var i=0;i<myFullYear.length;i++){
      j=parseInt(myFullYear[i]);
      myFullYear[i]=cnDate[j][1];
    }
    myFullYear=myFullYear.join("");
    return myFullYear;
  }
// 2、获取中文月
  function getCMonth(){
    myMonth=myDate.getMonth().toString();
    j=parseInt(myMonth)+1;
    myMonth=cnDate[j][1];
    return myMonth;
  }
// 3、获取中文日
  function getCToday(){
    myToday=parseInt(myDate.getDate());
    if(myToday<=10){
      myToday=cnDate[myToday][1];
    }else if(myToday>10&&myToday<20){
      myToday='十'+cnDate[myToday%10][1];
    }else if(myToday==20){
      myToday='二十';
    }else if(myToday>20&&myToday<30){
      myToday='二十'+cnDate[myToday%10][1];
    }else if(myToday==30){
      myToday='三十';
    }else{
      myToday='三十'+cnDate[myToday%10][1];
    }
    return myToday;
  }

// 4、获取中文年月日(单次获得)
  var myCFullYear=getCFullYear()+'年';
  var myCMonth=getCMonth()+'月';
  var myCToday=getCToday()+'日';
  return myCFullYear+myCMonth+myCToday;
}

//Array专属
export const removeArr = (ele) => {
  var ctx = this;
  //rmx 添加的方法，删除指定的数组item
  _.each(_.isArray(ele)?ele:[ele],function (ele) {
    var idx = ctx.indexOf(ele);
    if(idx>=0)
      ctx.splice(idx,1);
  });
}

export const togglePush = (ele,predicateField) => {
  var idx = predicateField?_.findIndex(this,function(i){return i[predicateField]==ele[predicateField]}):this.indexOf(ele);
  if(idx>=0){
    this.splice(idx,1);
  }else{
    this.push(ele);
  }
}

export const last = (ele,predicateField) => {
  if(this.length > 0){
    return this[this.length - 1]
  }
  else{
    return undefined
  }
}

export const contains = (ele,predicateField) => {
  var idx = predicateField?_.findIndex(this,function(i){return i[predicateField]==ele[predicateField]}):this.indexOf(ele);
  return idx>=0;
}

export const aggregateFunctions = {
  get:function (aggrFun) {
    if(typeof aggrFun ==='string'){
      return this[aggrFun];
    }else{
      return aggrFun;
    }
  },
  SUM:function (aggrResult, val) {
    return parseFloat(aggrResult||0)+parseFloat(val||0);
  }
}

export const part = (start, count, stop) => {
  var stop = start + count;
  _.partition(this,function (i, idx) {
    return idx >= idx && idx < stop;
  })
}

export const aggregateBy = (aggrFun,opt) => {
  var _aggrFun=this.aggregateFunctions.get(aggrFun),aggrResult;

  if(typeof  opt === 'string')
    _.each(this,function (item) {
      aggrResult = _aggrFun.call(this, aggrResult, item[opt]);
    });
  return aggrResult;
}

export const ceil = (aggrFun,opt) => {
  return Math.ceil(this);
}

let uid = 0

/**
 * 获取Uid
 * @return {Int}
 */
export const getUid = () => {
  return `v_${uid++}`
}

/**
 * JS 有父子关系的数组转Tree结构函数
 * @return {Array} Tree结构数组
 */
export const convert = (rows) => {
  function exists(rows, parentId){
    for(var i=0; i<rows.length; i++){
      if (rows[i].id == parentId) return true;
    }
    return false;
  }

  let nodes = [];
  // get the top level nodes
  for(let i=0; i<rows.length; i++){
    let row = rows[i];
    if (!exists(rows, row.parentId)){
      nodes.push({
        id:row.id,
        text:row.name
      });
    }
  }

  let toDo = [];
  for(let i=0; i<nodes.length; i++){
    toDo.push(nodes[i]);
  }
  while(toDo.length){
    let node = toDo.shift();    // the parent node
    // get the children nodes
    for(let i=0; i<rows.length; i++){
      let row = rows[i];
      if (row.parentId == node.id){
        let child = {id:row.id,text:row.name};
        if (node.children){
          node.children.push(child);
        } else {
          node.children = [child];
        }
        toDo.push(child);
      }
    }
  }
  return nodes;
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

/**
 * 数组去重
 */
export const dedupe = (array = []) => {
  return Array.from(new Set(array));
}

/**
 * 记忆函数
 * 调用实例：阶乘
 * const factorial = emorizer([1 , 1], function(recur, n) {
 *  return n*recur(n-1)
 * })
 * **/
export const memoizer = function (memo, formula) {
  let recur = function (n) {
    var result = memo[n];
    if(typeof result !== 'number') {
      result = formula (recur, n);
      memo[n] = result;
    }
    return result
  }
  return recur;
}

/**
 * 利用input/textarea复制文本至剪切板实现复制
 * **/
export const copyToClipboard = (elem) => {
  var targetId = "_hiddenCopyText_";
  var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
    target = elem;
    origSelectionStart = elem.selectionStart;
    origSelectionEnd = elem.selectionEnd;
  } else {
    target = document.getElementById(targetId);
    if (!target) {
      var target = document.createElement("textarea");
      target.style.position = "absolute";
      target.style.left = "-9999px";
      target.style.top = "0";
      target.id = targetId;
      document.body.appendChild(target);
    }
    target.textContent = elem.textContent;
  }
  // select the content
  var currentFocus = document.activeElement;
  target.focus();
  target.setSelectionRange(0, target.value.length);
  
  // copy the selection
  var succeed;
  try {
    succeed = document.execCommand("copy");
    //successPromptsuccessPrompt('复制成功', 'middle', 1000)
  } catch(e) {
    succeed = false;
    //errorPrompt('请手动复制', 'middle', 1000)
  }
  // restore original focus
  if (currentFocus && typeof currentFocus.focus === "function") {
    currentFocus.focus();
  }
  
  if (isInput) {
    // restore prior selection
    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
    // clear temporary content
    target.textContent = "";
  }
  return succeed;
}






