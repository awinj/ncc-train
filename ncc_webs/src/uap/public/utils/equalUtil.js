/**
 * @desc 判断两个数组是否相等
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @return {Boolean}
 */
export const arrayEqual = (arr1, arr2) => {
    if(arr1 === arr2) return true;
    if(arr1.length !== arr2.length) return false;
    for(let i=0; i< arr1.length; i++) {
        if(arr1[i] !== arr2[i]) return false; 
    }
    return true;
}

/**
 * @desc 判断两个对象是否相等
 * @param {Object} obj1 
 * @param {Object} obj2 
 * @return {Boolean}
 */
export const objectEqual = (obj1, obj2) => {
    let i, l, leftChain, rightChain;
    function compare2Objects(x, y) {
        let p;
        if(isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }
        if(x === y) {
            return true;
        }

        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
        }

        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        for(p in y) {
            if(y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }else if(typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for(p in x) {
            if(y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            }else if(typeof y[p] !== typeof x[p]) {
                return false;
            }
            switch (typeof(x[p])) {
                case 'object':
                case 'function':
                    leftChain.push(x);
                    rightChain.push(y);
                    if(!compare2Objects(x[p], y[p])) {
                        return false;
                    }
                    leftChain.pop();
                    rightChain.pop();
                    break;
                default:
                    if(x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        } 
        return true;    
    }

    if(arguments.length < 1) {
        return true;
    }

    for(i = 1, l =arguments.length; i < l; i++) {
        leftChain = [];
        rightChain = [];
        if(!compare2Objects(arguments[0], arguments[1])) {
            return false;
        }
    }

    return true;
}

/**
 * @desc 判断两个对象是否相等
 * @param {String} str1 
 * @param {String} str2 
 * @return {Boolean}
 */
export const strEqual = (str1, str2) => {
    if(!str1 instanceof String) return false;
    if(!str2 instanceof String) return false;
    if(str1 === str2) return true;
}









