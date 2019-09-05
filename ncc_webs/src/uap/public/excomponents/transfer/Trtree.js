import React, { Component } from 'react';
import { base, deepClone } from 'nc-lightapp-front';
import * as tree_utils from './tree_utils';
import addNodeNormal from './addNodeNormal';
import addNodeVRFusion from './addNodeVRFusion';
const { 
    delNode,
    delParents,
    filterChildrens,
    getTreeDataById,
    getNodeByTreeIdAndKey,
    getNodeByKey,
    findAllParentsKey,
	getAllNodeKeys,
	arrayBIsContaindA, 
	noneAInB
 } = tree_utils;
// import Utils from '../utils';
const { NCTree } = base;
const NCTreeNode = NCTree.NCTreeNode;



/**
 * 获取当前树选中Node
 */
// function getSelectedValue(treeId){
// 	return this.state.TransfertreeData[treeId].selectedValue;
// }

// function getCheckedValue(treeId){
// 	return this.state.TransfertreeData[treeId].checkedValue;
// }

// function getHalfCheckedValue(treeId){
// 	return this.state.TransfertreeData[treeId].halfCheckedValue;
// }



/**
 * 根据treeid和pid查找所有子节点
 */
/* function getChildrenByPid(treeId,pid){
	let tree = getTreeDataById.bind(this)(treeId);
	let childrens = [];
	getChildrenNode(tree,pid,childrens);
	return childrens;
} */

function addToTree(treeType, from_tree, to_tree, checkedKeys, halfCheckedKeys,fromTreeDataList, toTreeDataList, fixed, selectType, isRefer){
	if(treeType == 'VRFusion'){
		// 虚实节点类型
		return addNodeVRFusion(from_tree, to_tree, checkedKeys, halfCheckedKeys,fromTreeDataList, toTreeDataList, fixed, selectType, isRefer)
	}else{
		// normal
		return addNodeNormal(from_tree, to_tree, checkedKeys, halfCheckedKeys,fromTreeDataList, toTreeDataList, fixed, selectType, isRefer);
	}
}




/**
 * 创建树
 */
function createTree({
	treeId,
	data,
	// onSelect,
	onExpand,
	onCheck,
	searchMode,
	selectType,
	// treeType,
	cacheTree,
	clearCheckedKeys,
	searchValue,
	checkedKeys,
	expandedKeys,
	autoExpandParent,
	fixed,
	otherConfig={}
}={}){	
		let thisTree = this.state.TransfertreeData[treeId];
		filterChildrens(data);
		// console.log('checkedKeys', checkedKeys)
		if (!thisTree) {
			thisTree = this.state.TransfertreeData[treeId] = {};
			thisTree.autoExpandParent = autoExpandParent;  //是否展开父节点
			// thisTree.onExpand = onExpand;
			// thisTree.expandedKeys = expandedKeys;
			// thisTree.onSelect = onSelect;//当用户选择树节点触发的回调函数

			// thisTree.currentTree = null;//保存当前点击的树节点pk
			// thisTree.treeNode = null;   //节点对象
			// thisTree.saveItem = '';  //保存当前操作节点对象，用于重置
			// thisTree.pkArr = [];  //
			// thisTree.itemArr = [];  //
			// thisTree.selectedValue = [];  // 保存当前选中的节点key
			// thisTree.checkedValue = []; // 保存checked的节点
			// thisTree.saveExpendKey = [];  // 保存当前选中的节点key
			// thisTree.halfCheckedValue = [];
			// thisTree.data = data?filterChildrens(data):[];
			// console.log('transfertreeData', thisTree.data, this.state.leftTreeData, this.state.rightTreeData);
		}

		const classMap = {
			'0': 'iconfont icon-yonghuzu',
			'1': 'iconfont icon-yonghu',
			'org_0': 'iconfont icon-yewudanyuan ',
			'org_1': 'iconfont icon-bumen ',
			'org_2': 'iconfont icon-xuzuzhi',
			'org_3': 'iconfont icon-jituan'
		};

		const isDisable = (item) => {
			if(item.fixed && (!item.children || item.children.length == 0)){
				return true;
			}else{
				return false;
			}
		}

		const setIcon = (iconKey) => {
			// let iconKey = item.nodeData.key;
			let className;
			// switch(iconKey){
			// 	case '0': 
			// 		className = 'iconfont icon-yonghuzu';
			// 		break;
			// 	case '1':
			// 		className = 'iconfont icon-yonghu';
			// 		break;
			// 	default:
			// 		className = '';
			// }
			className = classMap[iconKey];
			return className ? className : '';
		}

		/**
		 * 生成树节点
		 */
		const loop = data => data.map((item) => {
			item.key = item.refpk;
			let title;
			let iconKey = item.nodeData && item.nodeData.key;
			let iconTitle = iconKey ? <span><span className={setIcon(iconKey)}></span>{item.name}</span> : <span>{item.name}</span>;
			// 添加搜索功能
			if(searchValue!==''){
				const index = item.name.search(searchValue);
				const beforeStr = item.name.substr(0,index);
				const afterStr = item.name.substr(index + searchValue.length);
				title = index > -1 ? (
					<span>
						<span className={setIcon(iconKey)}></span>
						{beforeStr}
						<span className="u-tree-searchable-filter">{searchValue}</span>
						{afterStr}
					</span>
				) : iconTitle;
			}


			if( item.key === undefined){
				//  console.log('error_item', item);
				 console.error(`树组件，数据格式错误， 缺少key字段，请检查数据格式`);
				 return false
			}
			if (item.children) {
				return (
					<NCTreeNode key={item.key} title={searchValue=="" ? iconTitle : title} >
						{loop(item.children)}
					</NCTreeNode>
				);
			}

			return <NCTreeNode key={item.key}  title={searchValue=="" ? iconTitle : title} disabled = { fixed == treeId ? isDisable(item): false}/>;
		});

		

		const treeNodes = loop(data);
		// console.log('treeNode', treeNodes)

		const onSelectNode = (selectedKeys, e) => {
			// console.log('selectedKeys', selectedKeys, e);
			thisTree.selectedValue = selectedKeys;
			if(thisTree.onSelect && typeof thisTree.onSelect === 'function'){
				thisTree.onSelect(selectedKeys, e);
			}
		}
		const onCheckNode = (checkedKeys, e) => {
			console.log('checkedKeys', checkedKeys,e);
			let halfCheckedKeys = e.halfCheckedKeys;
			let newCheckedKeys = [];
			if(searchMode){
				checkedKeys.forEach((itemKey, index)=> {
					let itemNodeInB = getNodeByKey(cacheTree, itemKey);
					let itemNodeInA = getNodeByKey(data, itemKey);
					// console.log('nodeInA', itemNodeInA, 'nodeInB', itemNodeInB);
					if(itemNodeInB.children && itemNodeInB.children.length > 0){
						let allNodeKeysInB = getAllNodeKeys([itemNodeInB]);
						allNodeKeysInB.splice(allNodeKeysInB.indexOf(itemKey),1);
						let allNodeKeysInA = getAllNodeKeys([itemNodeInA]);
						allNodeKeysInA.splice(allNodeKeysInA.indexOf(itemKey),1);
						// console.log(itemKey,allNodeKeysInA, allNodeKeysInB);
						if(allNodeKeysInA.length == allNodeKeysInB.length && arrayBIsContaindA(allNodeKeysInA, allNodeKeysInB)){
							// 相等
							console.log('相等', itemKey)
							newCheckedKeys.push(itemKey);
						}else if(noneAInB(allNodeKeysInA, allNodeKeysInB)){
							console.log('不包含')
							// 不包含
						}else{
							console.log('包含部分', itemKey)
							// 包含部分
							if(selectType !== 'default' || !selectType){
								newCheckedKeys.push(itemKey);
								halfCheckedKeys = []
							}else{
								halfCheckedKeys.push(itemKey);
							}
						}
					}else{
						newCheckedKeys.push(itemKey);
					}
				});
				checkedKeys = newCheckedKeys;
			}
			let directExceptParentNode = [];
			if(selectType == 'onlyChild' || selectType == 'onlyLeaf'){
				let key = e.node.props.eventKey;
				let node = getNodeByKey(data,key);
				if(e.checked){
					if(node.children && node.children.length > 0){
						let childrenKeys = getAllNodeKeys(node.children);
						checkedKeys = checkedKeys.concat(childrenKeys);
					}
				}else{
					if(node.children && node.children.length > 0){
						let childrenKeys = getAllNodeKeys(node.children);
						checkedKeys = checkedKeys.filter(item => {
							return !childrenKeys.includes(item);
						});
					}else{
						let index = checkedKeys.indexOf(key);
						index > -1 && checkedKeys.splice(index,1);
					}
				}
			}else if(selectType == 'onlyDirectChild'){
				// 仅直接下级
				let key = e.node.props.eventKey;
				let node = getNodeByKey(data,key);
				if(e.checked){
					if(node.children && node.children.length > 0){
						let directChildrenKeys = node.children.map(child => {
							return child.key;
						});
						checkedKeys = checkedKeys.concat(directChildrenKeys);
						directExceptParentNode.push(key);
					}
				}else{
					if(node.children && node.children.length > 0){
						let directChildrenKeys = node.children.map(child => {
							return child.key;
						});
						checkedKeys = checkedKeys.filter(item => {
							return !directChildrenKeys.includes(item);
						});
						let index = directExceptParentNode.indexOf(key);
						directExceptParentNode.splice(index, 1);
					}
				}
			}

			// console.log('checked', checkedKeys);
			onCheck(treeId, checkedKeys, halfCheckedKeys, directExceptParentNode || []);
			clearCheckedKeys(treeId);
		}
		const onExpandNode = (expandedKeys) => {
			onExpand(treeId, expandedKeys);
		}

		return (
			<NCTree
				showLine = {true}
				checkable = {true}
				openIcon = {<i className = 'iconfont icon-wenjianjiadakai'/>}
				closeIcon = {<i className='iconfont icon-wenjianjia'/>}
				expandedKeys = {expandedKeys}
				onSelect={onSelectNode.bind(this)}    //  节点展开事件
				onCheck={onCheckNode.bind(this)}
				onExpand={onExpandNode.bind(this)}
				checkedKeys = {checkedKeys}
				checkStrictly = {selectType == 'onlySelf' || selectType == 'onlyChild' || selectType == 'onlyLeaf' || selectType == 'onlyDirectChild'}
				autoExpandParent={thisTree.autoExpandParent}    //是否展开所有节点
				{...otherConfig}
            >
                {treeNodes}
            </NCTree>
		);

}

const Trtree = {
	createTree :  createTree,	//创建树
	// getSelectedValue : getSelectedValue,	//获取树选中Node
	// getCheckedValue: getCheckedValue,
	// getHalfCheckedValue: getHalfCheckedValue,
	// setStateEve : setStateEve,	//更新树
	delNode : delNode,	//删除树节点
	getNodeByTreeIdAndKey : getNodeByTreeIdAndKey,	//
	getTreeDataById : getTreeDataById,	//根据treeId获取树的节点数据数组
	getAllNodeKeys: getAllNodeKeys,
	delParents: delParents,
	addToTree: addToTree,
	getNodeByKey: getNodeByKey,
	findAllParentsKey: findAllParentsKey
};
export default Trtree;