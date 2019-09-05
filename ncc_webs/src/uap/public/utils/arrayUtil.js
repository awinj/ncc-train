/**
 * @desc 按照给定长度，将数组截成2段
 * chunk(['a', 'b', 'c', 'd'], 3) => [['a', 'b', 'c'], ['d']]
 * @param  {array} 
 * @param  {size} 
 * @return {array} 
 */
export const chunk = (array, size) => {
    size = Math.max(size, 0);
    const length = array == null ? 0 : array.length;
    if(!length || size < 1) {
        return []
    }
    let index = 0;
    let resIndex = 0;
    const result = new Array(Math.ceil(length/size));
    while(index < length) {
        result[resIndex++] = array.slice(index, index += size)
    }
    return result;
}

/**
 * @desc 去除数组中隐式转为为false的字段
 * compact([0, 1, false, 2, '', 3]) => [1, 2, 3]
 * @param  {array} 
 * @return {array} 
 */
export const compact = (array) => {
    if(array == null) return ;
    const transArr = array.filter( (item) => {
        return !!item
    });
    return transArr;
}

/**
 * @desc 数组去重
 */
export const dedupe = (array = []) => {
    return Array.from(new Set(array));
}

/**
 * @desc 数组排序
 * @param  {array} 
 * @param  {sortFlag}  正序倒序
 * @return   {array} 
 */
const _numAscSort = (a, b) => {
    return a - b;
}

const _numDescSort = (a, b) => {
    return b-a;
}

export const orderBy = (arr = [], sortFlag) => {
    let $arr = arr;
    if(sortFlag === 'asc') {
        $arr.sort(_numDescSort);
    }else {
        $arr.sort(_numAscSort);
    }
    return $arr;
}

/**
 * @desc 取两个数组并集
 * @param  {array} 
 * @param  {array}
 * @return   {array} 
 */
export const union = (a, b) => {
    let newArr = a.concat(b);
    return dedupe(newArr);
}

/**
 * @desc 取两个数组补集
 */
export const complement = (a, b) => {
    return minus(union(a, b), intersect(a, b));
}

 /**
 * @desc 取两个数组交集
 */
export const interset = (a, b) => {
    a = dedupe(a);
    return a.map( (item) => {
        return b.includes(item) ? item : null;
    })
}

 /**
 * @desc 取两个数组差集
 */
export const minus = (a, b) => {
    a = dedupe(a);
    return a.map( (item) => {
        return b.includes(item) ? null : item;
    })
}

 /**
 * @desc 数组去重复
 */
export const unique = (arr=[]) => {
    for(let i=0;i<arr.length;i++) {
        for(let j=i+1;j<arr.length;) {
            if(arr[j] === arr[i]) {
                arr.splice(i, 1);
            }else {
                j++;
            }
        }
    }
    return arr;
}

 /**
 * @desc 数组去重复(根据对象)
 */
export const uniqueByObj = (arr = []) => {
    let result = [],
        hash = {};
    for(let i=0, elem; (elem = arr[i]) != null; i++) {
        if(!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

 /**
 * @desc 获取数组下标
 */
export const indexof = (arr = [], val) => {
    return arr.indexOf(val)
}

 /**
 * @desc 删除一个元素
 */
export const removeEle = (arr = [], indexs) => {
    let index = indexof(arr, indexs);
    if(index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

 /**
 * @desc 删除一个对象
 */
export const removeObj = (arr = [], item) => {
    for(let i=0; i< arr.length; i++) {
        let jsonData = arr[i];
        for(let key in jsonData) {
            if(jsonData[key] == item) {
                
            }
        }
    }
}

