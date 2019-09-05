/**
 * @desc 判断对象是否为空
 * @param {Object} obj 
 * @return {Boolean}
 */
export const isEmptyObj = (obj = {}) => {
    return Object.keys(obj).length ? false : true
}

/**
 * @desc 判断数组是否为空
 * @param {Array} arr 
 * @return {Boolean}
 */
export const isEmptyArr = (arr = []) => {
    return arr.length ? false : true
}









