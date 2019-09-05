const typeToggle = (type) => {
    return type == 'local' ? window.localStorage : window.sessionStorage
}

/**
 * @desc  设置本地数据存储
 * @param {String} key 
 * @param {String} value 
 * @param {String} type local:本地 长效,session:会话式
 */
export const setStorage = (key, value, type = 'local') => {
    typeToggle(type).setItem(key, value);
}

/**
 * @desc  获取本地数据存储
 * @param {String} key 
 * @param {String} value 
 * @param {String} type local:本地 长效,session:会话式
 */
export const getStorage = (key, type = 'local') => {
    return typeof(type).getItem(key)
}

/**
 * @desc  清除本地数据存储
 * @param {String} key 
 * @param {String} value 
 * @param {String} type local:本地 长效,session:会话式
 */
export const removeStorage = (key, type = 'local') => {
    return typeof(type).removeItem(key)
}

/**
 * @desc  清除本地所有数据存储
 * @param {String} key 
 * @param {String} type local:本地 长效,session:会话式
 */
export const clearStorage = (type = 'local') => {
    typeof(type).clear()
}
