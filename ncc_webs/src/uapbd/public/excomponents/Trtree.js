/**
 * 封装树
 * @author yinshb
 */
import React, { Component } from 'react';
import {base} from 'nc-lightapp-front';
const { NCTree } = base;
const NCTreeNode = NCTree.NCTreeNode;

const delTreeNode = (tree,children,key,isContainChild) => {
	children.forEach((data, index) => {
        if (data.key === key) {
			if(!isContainChild){
				if(data.children &&  data.children.length > 0){
					data.children.forEach((it,i) => {
						tree.push(it);
					});
				}
			}
			children.splice(index, 1)
        } else {
            if (data.hasOwnProperty('children')) {
                delTreeNode(tree,data.children, key,isContainChild);
            }
        }
    });
};

/**
 * 将树种子节点数组为空的节点，删除children属性
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * 根据treeId获取树的节点数据数组
 */
function getTreeDataById(treeId){
	let tree = this.state.TransfertreeData[treeId].data;
	if(!tree) tree = this.state.TransfertreeData[treeId].data = [];
	return tree;
}


/**
 * 获取当前树选中Node
 */
function getSelectedValue(treeId){
	return this.state.TransfertreeData[treeId].selectedValue;
}

/**
 * 添加节点到树
 */
function addNodeToTree(treeId,nodes){
	let tree = getTreeDataById.bind(this)(treeId);
	nodes.forEach((item,index) => {
		//获取子节点并删除子节点，将返回的子节点放入item
		let childrens = item.children?item.children:[];
		getChildrenNodeAndDel(tree,item.key,childrens);
		if(childrens.length > 0){
			item.children = childrens;
		}
		//查找父节点
		let parentNode = getNodeByKey(tree,item.pid);
		//如果存在父节点
		if(parentNode){
			if (!parentNode.children) {
				//子节点不存在时创建空数据
				parentNode.children = [];
			}
			parentNode.children.push(item);
		}else{
			//没有查找到父节点
			tree.push(item);
		}
	});
	filterChildrens(tree);
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
 * 根据treeid和pid查找所有子节点
 */
/* function getChildrenByPid(treeId,pid){
	let tree = getTreeDataById.bind(this)(treeId);
	let childrens = [];
	getChildrenNode(tree,pid,childrens);
	return childrens;
} */

/**
 * 根据pid查找所有子节点
 */
function getChildrenNode(tree,pid,childrens){
	tree.forEach(item => {
		if(item.pid === pid){
			childrens.push(item);
		}else if(item.children){
			getChildrenNode(item.children,pid,childrens);
		}
	});
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
			getChildrenNode(item.children,pid,childrens);
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
 * 删除树节点 
 * isContainChild删除是否包含子节点，默认包含
 */
function delNode(treeId, key,isContainChild = true) {
	let tree = getTreeDataById.bind(this)(treeId);
	delTreeNode(tree,tree, key,isContainChild);
	filterChildrens(tree);
}

/**
 * 创建树
 */
function createTree({
	treeId,
	data,
	onSelect,
	autoExpandParent,
	otherConfig={}
}={}){
		let thisTree = this.state.TransfertreeData[treeId];
		if (!thisTree) {
			thisTree = this.state.TransfertreeData[treeId] = {};
			thisTree.onSelect = onSelect;//当用户选择树节点触发的回调函数
			thisTree.currentTree = null;//保存当前点击的树节点pk
			thisTree.treeNode = null;   //节点对象
			thisTree.autoExpandParent = autoExpandParent;  //是否展开父节点
			thisTree.saveItem = '';  //保存当前操作节点对象，用于重置
			thisTree.pkArr = [];  //
			thisTree.itemArr = [];  //
			thisTree.selectedValue = [];  // 保存当前选中的节点key
			thisTree.saveExpendKey = [];  // 保存当前选中的节点key
			thisTree.data = data?filterChildrens(data):[];
		}

		/**
		 * 生成树节点
		 */
		const loop = data => data.map((item) => {
			item.key = item.refpk;
			if( item.key === undefined){
				 console.error(`树组件，数据格式错误， 缺少key字段，请检查数据格式`);
				 return false
			}
			if (item.children) {
				return (
					<NCTreeNode key={item.key} title={item.name} disabled = { item.disabled }>
						{loop(item.children)}
					</NCTreeNode>
				);
			}
			return <NCTreeNode key={item.key}  title={item.name} disabled = { item.disabled }/>;
		});

		/**
		 * 获取所有节点key，返回数组
		 */
		const  getAllNodeKeys = (data) => {
			let allKeys = [];
			const getAllNodeKey = (data) => {
				data.forEach((item) => {
					if(item.hasOwnProperty('children')){
						allKeys.push(item.key);
						getAllNodeKey(item.children)
					}
				})
			};
			getAllNodeKey(data);
			return allKeys;
		};

		const treeNodes = loop(data);

		const onSelectNode = (selectedKeys, e) => {
			//selectedKeys, e:{selected: bool, selectedNodes, node, event}
			thisTree.selectedValue = selectedKeys;
			if(thisTree.onSelect && typeof thisTree.onSelect === 'function'){
				thisTree.onSelect(selectedKeys, e);
			}
		}

		return (
			<NCTree
                showLine = {true}
                onSelect={onSelectNode.bind(this)}    //  节点展开事件
				autoExpandParent={thisTree.autoExpandParent}    //是否展开所有节点
				{...otherConfig}
            >
                {treeNodes}
            </NCTree>
		)

}

const Trtree = {
	createTree :  createTree,	//创建树
	getSelectedValue : getSelectedValue,	//获取树选中Node
	addNodeToTree : addNodeToTree,	//将Node添加到树
	setStateEve : setStateEve,	//更新树
	delNode : delNode,	//删除树节点
	getNodeByTreeIdAndKey : getNodeByTreeIdAndKey,	//
	getTreeDataById : getTreeDataById	//根据treeId获取树的节点数据数组
};
export default Trtree;