/**
 * @desc 判断字符串包含
 * @param  {string} 原始字符串
 * @param {substr} 子字符串
 * @param {isIgnoreCase} 忽略大小写 
 * @return {Booelan}  
 */
export const strContains = (string, substr, isIgnoreCase) => {
	if(isIgnoreCase) {
        string = string.toLowerCase();
        substr = substr.toLowerCase();
    }
    let startChar = substr.substring(0,1);
    const strLen = substr.length;
    for(let j=0; j< string.length-strLen+1; j++) {
        if(string.charAt(j) == startChar) {
            if(string.substring(j, j+strLen == substr)) {
                return true;
            }
        }
    }
    return false;
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
      target.textContent = elem//elem.textContent;
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


 /**
 * 获取字符在指定字符串中存在的个数
 * **/ 
export const getStrNum = (str, papStr) => {
  if(!str || !papStr) return false;
  const regex = new RegExp(papStr, 'g'); // 使用g表示整个字符串都要匹配
  const result = str.match(regex);
  const count = !result ? 0 : result.length;
  return count;
}
