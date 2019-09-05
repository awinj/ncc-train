/******************************************************
 * 树操作工具类
 *
 ******************************************************/

/*************************************************************
 * 检查某节点下如果没有子节点，去掉children属性，设置isleaf为true（即去掉“>”符号）
 *
 * 常用于树节点移动后检查原父节点有无子节点操作
 * @param tree
 * @param pk
 * @returns {boolean}
 *************************************************************/
const checkHasChildren = (tree,pk)=> {
    if(!!!tree){
        //树组件没有数据
        return false;
    }
    let i = tree.length;
    while (i--){
        let data = tree[i];
        if (data.refpk === pk) {
            if(data.hasOwnProperty('children') && data.children.length === 0){
                delete data.children;
                data.isleaf = true;
            }
            return true;
        } else {
            if (data.hasOwnProperty('children')) {
                let res = checkHasChildren(data.children, pk);
                if(res){
                    return false
                }
            }
        }
    }
};

/*************************************************************
 * 处理树节点数据 去掉数据对象中children属性为空的children属性
 *
 * 用在加载树节点数据回调时
 * @param data
 * @returns {*}
 *************************************************************/
const dealTreeData = (data)=>{
    let deleteDataChildrenProp = function(node){
        node.iconBox = {
            addIcon:false,
            editIcon:false,
            delIcon:false
        };
        if(!node.children || node.children.length == 0) {

            delete node.children;
        }
        else{
            node.isLeaf = false;
            node.children.forEach( (e) => {
                deleteDataChildrenProp(e);
            } );
        }
    };
    data.forEach( (e) => {
        deleteDataChildrenProp(e);
    });
    return data;
};


export {checkHasChildren,dealTreeData}