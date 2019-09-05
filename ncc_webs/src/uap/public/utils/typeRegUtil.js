/**
 * @desc 获取变量类型
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
 * @desc 银行卡号格式校验
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

/**
 * @desc 手机号号格式校验
 * @param {String} phone
 * @return  {Boolean}
 */
export const phoneChekc = (phone) => {
    return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str)
}

/**
 * @desc URL地址有效性校验
 * @param {String} url
 * @return  {Boolean}
 */
export const urlChekc = (url) => {
    return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(str);
}

/**
 * @desc 判断是否为是整数
 * @param {Number} url
 * @return  {Boolean}
 */
export const isInteger = (num) => {
    return Math.floor(num) == num;
}

/**
 * @desc 判断是否字符串全部由数组组成
 * @param {String} str
 * @return  {Boolean}
 * **/
export const checkNumber = (theObj) => {
    const reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
      return true;
    }
    return false;
}








