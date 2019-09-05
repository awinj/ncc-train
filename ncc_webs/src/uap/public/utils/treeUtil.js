/******************************************************
 * 树操作工具类
 *
 ******************************************************/

/*************************************************************
 * 检查某节点下如果没有子节点，去掉children属性，设置isleaf为true（即去掉“>”符号）
 *
 * 常用于树节点移动后检查原父节点有无子节点操作
 * @param treeId
 * @param pk
 * @returns {boolean}
 *************************************************************/
const checkHasChildren = (treeId,pk)=> {
    let tree = this.props.syncTree.getSyncTreeValue(treeId);
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
                let res = this.checkHasChildren(data.children, pk);
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

/**
 * 有父子关系的数组转Tree结构函数
 * @return {Array} Tree结构数组
 */
const convertTree = (rows) => {
    function exists(rows, parentId){
      for(var i=0; i<rows.length; i++){
        if (rows[i].id == parentId) return true;
      }
      return false;
    }
  
    let nodes = [];
    // get the top level nodes
    for(let i=0; i<rows.length; i++){
      let row = rows[i];
      if (!exists(rows, row.parentId)){
        nodes.push({
          id:row.id,
          text:row.name
        });
      }
    }
  
    let toDo = [];
    for(let i=0; i<nodes.length; i++){
      toDo.push(nodes[i]);
    }
    while(toDo.length){
      let node = toDo.shift();    // the parent node
      // get the children nodes
      for(let i=0; i<rows.length; i++){
        let row = rows[i];
        if (row.parentId == node.id){
          let child = {id:row.id,text:row.name};
          if (node.children){
            node.children.push(child);
          } else {
            node.children = [child];
          }
          toDo.push(child);
        }
      }
    }
    return nodes;
  }

/**
 * 展开一级树节点
* @param res tree数据(平行)
* @param id tree组件id
* @param that this
* @return 
*/
const expandFirstNode = (treeData, id, that) => {
    if(!treeData || !id || !that) return ;

    let pks = [];
    treeData.map( (item, index) => {
        if(item && item.key) {
            pks.push(item.key);
        }
    })
    that.props.syncTree.openNodeByPk(id, pks)
    return ;
}

export {checkHasChildren,dealTreeData, convertTree, expandFirstNode}