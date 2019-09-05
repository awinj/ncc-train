/**
 * @desc 判断是否拥有制定class名
 * @param {ele} dom元素 
 * @param {cls} className名
 * @return {Boolean}
 */
export const hasClass = (ele, cls) => {
    return (new RegExp('(\\s|^)' + cls + '(\\s|$)')).test(ele.className);
}

/**
 * @desc 添加指定的className名
 * @param {ele} dom元素 
 * @param {cls} className名
 * @return {String}
 */
export const addClass = (ele, cls) => {
    if (!hasClass(ele, cls)) {
        ele.className += ' ' + cls;
    }
}

/**
 * @desc 移除指定的className名
 * @param {ele} dom元素 
 * @param {cls} className名
 * @return {String}
 */
export const removeClass = (ele, cls) => {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}
 