/**
 *  生成父选择关系节点条件的汉字名称
 * **/
const generateZhCondition = (logic, json) => {
    const conditionArr = [{display: json['1880000025-000005'], value: 'or'}];//或者
    let msg = json['1880000025-000004'];//并且
    conditionArr.map( (item) => {
        if(logic == item.value) {msg = item.display;}
    })
    return msg;
}

/**
 * 生成oprtype对应的汉字名称
 * **/
const generateDisplayZh = (oprtype, json) => {
    const displayArr = [{display: json['1880000025-000006'], value: '>'},{display: json['1880000025-000007'], value: '<'},{display: json['1880000025-000008'], value: '><'},
        {display: json['1880000025-000009'], value: '<>'},{display: json['1880000025-000010'], value: '>='},{display: json['1880000025-000011'], value: '<='},{display: json['1880000025-000013'], value: 'like'},
        {display: json['1880000025-000014'], value: 'left like'},{display: json['1880000025-000015'], value: 'right like'}];
    let msg = json['1880000025-000012'];
    displayArr.map( (item) => {
        if(oprtype == item.value) {msg = item.display;} 
    })
    return msg;
}

/**
 * 根据key查找子节点node
 * **/
const getNodeByKey = (tree, key, node) => {
    if(!node) {
        tree && tree.filter( (item, index) => {
            if(item.hasOwnProperty('extraParaVO') && item.extraParaVO.nodeTitleId === key) {
                node = item;
            }else if(item.hasOwnProperty('conditions')){
                node = getNodeByKey(item.conditions, key, node);
            }
        })
    }
    return node;
}
/**
 * 为选择性父节点生成唯一标记key(Number)
 * **/
const generateParNodeKey = (tree, key=1) => {
    const nodeLoop = (tree, key) => {
        tree && tree.map( (item, index, arr) => {
            if(item.hasOwnProperty('logic')) {
                key += 1;
                item.nodeKey = key;
                if(item.hasOwnProperty('conditions') && item.conditions.length) {
                    nodeLoop(item.conditions, key);
                }
            }
        })
    }
    nodeLoop(tree, key);
    
    return tree;
}

/**
 * 根据key查找选择性父节点及其所属数组
 * **/
const getChooseNodeAndArrByKey = (tree, key) => {
    let newTree = generateParNodeKey(tree);
    let retObj = {};
    const findParNode = (tree, key) => {
        tree && tree.filter( (item, index, arr) => {
            if(item.logic && item.nodeKey == key) {
                retObj = item;
            }else if(item.hasOwnProperty('conditions') && item.conditions.length) {
                return findParNode(item.conditions, key);
            }
        })
    }
    findParNode(newTree, key);
    return retObj;
}

/**
 * 根据key查找当前节点及所属数组
 * **/
const getNodeAndArrByKey = (tree, key, callback) => {
    tree && tree.map( (item, index, arr) => {
        if(item.hasOwnProperty('extraParaVO') && item.extraParaVO.nodeTitleId === key) {
        // if(item.hasOwnProperty('extraParaVO') && item.nodeTitleId === key) {
            return callback(item, index, arr);
        }else if(item.hasOwnProperty('conditions')) {
            return getNodeAndArrByKey(item.conditions, key, callback)
        }
    })
}

/**
 * 正常子节点删除
 * **/
const delTreeNodeByKey = (data, key, isFirstDel = true) => {
    let shouldRemoveParNode = false;//是否应该删除父选择性节点
    let delStatus = false;//删除成功与否的标志
    getNodeAndArrByKey(data, key, (item, index, arr) => {
        isFirstDel && arr.splice(index, 1);
        isFirstDel = false;
        shouldRemoveParNode = !arr.length;
        delStatus = true;
        return;
    })
    if(shouldRemoveParNode) {//删除空的父节点
        delParNodeByKey(data, key);
    }
    return delStatus && data; 
}

/**
 * 选择性父删除
 * **/
const delParNodeByKey = (data, key) => {
    getNodeAndArrByKey(data, key, (item, index, arr) => {
        arr = [];
    })
}

/**
 * 生成table数据显示用display
 * **/
const generateDisplayTreeInfo = (data, json) => {
    let transDisplay = "";
    let transLogic = "and";
    const displayLoop = (data) => {
        data && data.map( (item, index, arr) => {
            if(item.hasOwnProperty('conditions') && item.conditions.length >= 1) {
                transLogic = item.logic;
                transDisplay += '(';
                displayLoop(item.conditions);
                transDisplay += ')';
            }else {
                if(item.value.firstvalue !== '') {
                    if(item.value.secondvalue) {
                        transDisplay += `${item.extraParaVO.refname} ${json['1880000025-000008']} ${item.value.firstvalue} ~ ${item.value.secondvalue} ${index < arr.length-1 ? generateZhCondition(transLogic, json)+' ' : ''}`
                    }else {
                        transDisplay += `${item.extraParaVO.refname} ${generateDisplayZh(item.oprtype, json)} ${item.display.includes(',') ? '(' : ''} ${item.display} ${item.display.includes(',') ? ')' : ''} ${index < arr.length-1 ? generateZhCondition(transLogic, json)+' ' : ''}`
                    }
                };
            }
        })
    }

    displayLoop(data);
    
    return transDisplay;
}

/**
 * 递归查找空数据项
 * **/
const findEmptyNode = (data) => {
    let emptyObj;
    const findEmptyLoop = (data) => {
        data && data.filter( (item, index, arr) => {
            if(item.hasOwnProperty('conditions') && item.conditions.length) {
                findEmptyLoop(item.conditions);
            }else if(!item.value || item.value.firstvalue === '') {
                emptyObj = item;
                return ;
            }
        })  
    }
    findEmptyLoop(data);
    return emptyObj;
}


/**
 * 验证tree里面数据是否有空项(点击确定时调用)
 * **/
const validateSubmitInfo = (data) => {
    let status = true;
    const emptyNode = findEmptyNode(data);
    if(emptyNode && Object.keys(emptyNode)) {
        return false;
    }
    return true;
}

export {
    generateZhCondition,
    generateDisplayZh,
    getNodeByKey,
    getNodeAndArrByKey,
    delTreeNodeByKey,
    generateDisplayTreeInfo,
    validateSubmitInfo,
    getChooseNodeAndArrByKey
}












