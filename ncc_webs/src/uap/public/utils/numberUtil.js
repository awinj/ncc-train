/**
 * @desc 数字加千分位功能（将阿拉伯数字每3位1逗号分隔）
 * @param  {str} 
 * @return {str}     
 */
export const cutStr = (str) => {
    let newStr = new Array(str.length + parseInt(str.length/3));
    newStr[newStr.length-1] = str[str.length-1];
    let currentIndex=str.length-1; 
    for(let i=newStr.length-1;i>0;i--) {
        if((newStr.length-1)%4 == 0) {
            newStr[i]=",";
        }else {
            newStr[i] = str[currentIndex-1]
        }
    }
    return newStr.join("");
}

/**
 * @desc 生成指定位数的随机整数
 * @param  {num} 
 * @return {num}     
 */
export const getRandomNum = (count) => {
    let arr = new Array;
	let reNum = "";
	for(let i=0;i<count;i++){
		arr[i] = parseInt(Math.random()*10);
		reNum += String(arr[i]);
	}
	return reNum;
}

/**
 * @desc 生成指定区间随机整数
 * @param  {num} 
 * @return {num}     
 */
export const random = (min,max) => {
	return Math.floor(min+Math.random()*(max-min));
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