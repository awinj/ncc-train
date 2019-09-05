const delTreeNode = (tree,children,key,isContainChild) => {
	// debugger
	children.forEach((data, index) => {
        if (data.key === key) {
			if(!isContainChild){
				if(data.children &&  data.children.length > 0){
					data.children.forEach((it,i) => {
						tree.push(it);
					});
				}
			}
			children.splice(index, 1);
        } else {
            if (data.hasOwnProperty('children')) {
                delTreeNode(tree,data.children, key,isContainChild);
            }
        }
    });
};

/**
 * 删除树节点 
 * isContainChild删除是否包含子节点，默认包含
 */
function delNode(treeId, key,isContainChild = true) {
	let tree = getTreeDataById.bind(this)(treeId);
	delTreeNode(tree,tree, key,isContainChild);
	// filterChildrens(tree);
}

function delParents(nodes, tree){
	// debugger
	let shouldDelNode;
	let recrusive = node => {
		let parent = getNodeByKey(tree, node.pid) || getNodeByKey(tree, node.nodeData.typeId);
		// console.log('parent', parent)
		if(parent && parent.children && parent.children.length == 1){
			shouldDelNode = parent;
			// console.log('cur-shouldDelNode', shouldDelNode);
			if((parent.pid && getNodeByKey(tree, parent.pid)) || (parent.nodeData.typeId && getNodeByKey(tree, parent.nodeData.typeId)) ){
				recrusive(parent);
			}else{
				return;
			}
		}else{
			return;
		}
	}
	let newNodes = nodes.map(item => {
		recrusive(item);
		return shouldDelNode ? shouldDelNode : item;
	});
	// console.log('newNodes', newNodes)
	return newNodes;
}

/**
 * 将树子节点数组为空的节点，删除children属性
 */
const filterChildrens = (tree) => {
	tree.forEach((item,index) => {
		if(item.children && item.children.length === 0){
			delete item.children;
		}else if(item.children && item.children.length > 0){
			filterChildrens(item.children);
		}
	});
	return tree;
};


/**
 * 根据treeId获取树的节点数据数组
 */
function getTreeDataById(treeId){
	// let tree = this.state.TransfertreeData[treeId].data;
	// if(!tree) tree = this.state.TransfertreeData[treeId].data = [];
	if(this.leftTreeId == treeId){
		return this.state.leftTreeData;
	}
	if(this.rightTreeId == treeId){
		return this.state.rightTreeData;
	}
}
/**
 * 根据treeid和key查找node
 */
function getNodeByTreeIdAndKey(treeId,key){
	let tree = getTreeDataById.bind(this)(treeId);
	return getNodeByKey(tree,key);
}
/**
 * 根据key查找node
 */
function getNodeByKey(tree,key,node){
	if(!node){
		tree.find(item => {
			if(item.key === key){
				node = item;
			}else if(item.children){
				node = getNodeByKey(item.children,key,node);
			}
		});
	}
	return node;
}

/**
 * 根据pid查找所有子节点
 */
function getChildrenNode(tree,pid,childrens){
	tree.forEach((item)=> {
		if(item.pid === pid){
            childrens.push(item);
		}else if(item.children){
			getChildrenNode(item.children,pid,childrens);
		}
	});
}


function hasEnableInLeaf(node){
	let hasActive = false;
	let recrusive = function(node){
		let nodes = node.children;
		if(nodes && nodes.length){
			for(let i=0;i<nodes.length;i++){
				let item = nodes[i];
				if((!item.children || item.children.length == 0)&& !item.fixed){
					hasActive = true;
					return;
				}else if(item.children && item.children.length > 0){
					recrusive(item);
				}else{
					continue;
				}
			}
		}
	}
	recrusive(node);
	// console.log('hasActive', hasActive);
	return hasActive;

}

function hasAllFixedLeaf(node){
	let hasFixed = true;
	let recrusive = function(node){
		let nodes = node.children;
		for(let i=0; i<nodes.length; i++){
			let item = nodes[i];
			if((!item.children || item.children.length == 0) && item.fixed){
				hasFixed = hasFixed && item.fixed;
				continue;
			}else if(item.children && item.children.length > 0){
				recrusive(item);
			}else{
				continue;
			}
		}
	}
	recrusive(node);
	return hasFixed;
}


function hasFixedLeaf(node){
	let hasFixed = false;
	let recrusive = function(node){
		let nodes = node.children;
		for(let i=0; i<nodes.length; i++){
			let item = nodes[i];
			if((!item.children || item.children.length == 0) && item.fixed){
				hasFixed = true;
				return;
			}else if(item.children && item.children.length > 0){
				recrusive(item);
			}else{
				continue;
			}
		}
	}
	recrusive(node);
	return hasFixed;
}

function findAllParentsKey(key, tree, parentsNodes){
	let node = getNodeByKey(tree, key);
	const find = (tree, pid) => {
		if(pid){
			let parent = getNodeByKey(tree, pid);
			if(parent){
				parentsNodes.push(parent.key);
				parent.pid && find(tree, parent.pid)
			}
		}
	}
	find(tree, node.pid);
	return parentsNodes;
}

function hasGivenKey(key, treeDataList){
	let haskey;
	for(let i=0;i<treeDataList.length;i++){
		const node = treeDataList[i];
		if(node.keyid === key){
			haskey = true;
			break;
		}
	}
	return haskey;
}
// b 是否包含 a
function arrayBIsContaindA(Aarray,Barray){
    if(Aarray.length > Barray.length) return false;
    // Aarray.forEach(key => {
    //    if( Barray.indexOf(key) == -1 ) return false;
    // });
    for(let i = 0; i < Aarray.length; i++){
        if(Barray.indexOf(Aarray[i]) == -1) return false;
    }
    return true;
}

// b 中是否存在 a 中的元素
function noneAInB(Aarray, Barray){
    for(let i = 0; i < Aarray.length; i++){
        if(Barray.indexOf(Aarray[i]) !== -1) return false;
    }
    return true;
}


/**
 * 根据pid查找所有子节点并删除
 */
function getChildrenNodeAndDel(tree,pid,childrens){
	for (let index = tree.length-1; index >=0; index--) {
		const item = tree[index];
		if(item.pid === pid){
			childrens.push(item);
			tree.splice(index,1);
		}else if(item.children){
			getChildrenNodeAndDel(item.children,pid,childrens);
		}
	}
}

/**
 * 更新树
 */
function setStateEve() {
	this.setState({
		TransfertreeData: this.state.TransfertreeData
	});
}

/**
 * 获取所有节点key，返回数组
 */
function getAllNodeKeys(data){
	// console.log('data', data);
	let allKeys = [];
	let recrusive = (data) => {
		let sameLevel = [];
		data.forEach((item) => {
			sameLevel.unshift(item.key);
			if(item.hasOwnProperty('children')){
				recrusive(item.children);
			}
		});
		allKeys = sameLevel.concat(allKeys);
	}
	recrusive(data);
	return allKeys;
};

function compareToIgnoreCase(str1, str2){
	str1 = str1.toLowerCase();
	str2 = str2.toLowerCase();
	if(str1.length != str2.length){
		return str1.length - str2.length;
	}
	for(let i = 0; i < str1.length; i++){
		if(str1[i] !== str2[i]){
			return str1.charCodeAt(i) - str2.charCodeAt(i);
		}
	}
}

function sortBy(array){
	return array.sort((item1, item2) => {
		return compareToIgnoreCase(item1.id, item2.id);
	});
}
// 排序
function treeSort(treeData){
	sortBy(treeData);
	let recrusive = (treeData) => {
		for(let i=0; i<treeData.length; i++){
			let children = treeData[i].children;
			if(children && children.length > 0){
				sortBy(children);
				recrusive(children);
			}
		}
	};
	recrusive(treeData);
}


export {
    delTreeNode,
    delNode,
    delParents,
    filterChildrens,
    getTreeDataById,
    getNodeByTreeIdAndKey,
    getNodeByKey,
    getChildrenNode,
    hasEnableInLeaf,
	hasFixedLeaf,
	hasAllFixedLeaf,
    findAllParentsKey,
    hasGivenKey,
    getChildrenNodeAndDel,
    setStateEve,
    getAllNodeKeys,
    arrayBIsContaindA,
	noneAInB,
	treeSort
};