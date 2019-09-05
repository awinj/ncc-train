import {isObject} from './typeRegUtil';
import {isEmptyObj} from './emptyUtil';
/**
 * @desc 对象对应项合并
 * @param  {obj1} 
 * @param  {obj2} 
 * @return {obj}     
 */
export const merge = (obj1, obj2) => {
    if(!isObject(obj1) || !isEmptyObj(obj1)) return obj2;
    if(!isObject(obj2) || !isEmptyObj(obj2)) return obj1;
    for(let i in obj1) {
        //to do
    }
}