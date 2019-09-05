import * as tree_utils from './tree_utils';
import { deepClone } from 'nc-lightapp-front';
const { getNodeByKey, hasGivenKey, hasEnableInLeaf, getChildrenNodeAndDel, hasFixedLeaf, hasAllFixedLeaf, treeSort } = tree_utils;

export default function addToTree(from_tree, to_tree, checkedKeys, halfCheckedKeys,fromTreeDataList, toTreeDataList, fixed, selectType, isRefer){
	let arrayCheckedNodes = checkedKeys.map(item => {
		return getNodeByKey(from_tree, item);
	});
	let arrayHalfCheckedNodes = halfCheckedKeys.map(item => {
		return getNodeByKey(from_tree, item);
	});
	// console.log('arrayCheckedNodes', arrayCheckedNodes, 'arrayHalfCheckedNodes', arrayHalfCheckedNodes);
	let skeletonHalfCheckedNodes = deepClone(arrayHalfCheckedNodes);
	let newSkeletonHalfCheckedNodes = [];
	skeletonHalfCheckedNodes.forEach(item => {
		if(!hasGivenKey(item.key, toTreeDataList)){
			newSkeletonHalfCheckedNodes.push(item);
		}
	});
	// 半选
	newSkeletonHalfCheckedNodes.forEach(item =>{
			item.children = [];
			if(!item.pid || !getNodeByKey(from_tree, item.pid) || !getNodeByKey(to_tree, item.pid)){
				to_tree.push(item);
			}else{
				let parent = getNodeByKey(to_tree, item.pid);
				if(!parent){
					to_tree.push(item);
					return;
				}
				if(!parent.children){
					parent.children = [];
				}
				let hasSiblingNode = getNodeByKey([parent], item.key);
				!hasSiblingNode && parent.children.push(item);
			}
	});

	// 全选节点 
	// console.log('arrrrr',arrayCheckedNodes);
	let cloneSkeletonCheckedNodes = deepClone(arrayCheckedNodes);
	// console.log('cloneSkeletonCheckedNodes', cloneSkeletonCheckedNodes);
	let newSkeletonCheckedNodes = [];
	let fixedDeleteCheckedNodes; // 应该删除的右侧节点
	let selfDeletedCheckedNodes=[]; 
	let fixedShouldDelPar = [];
	// debugger
	cloneSkeletonCheckedNodes.forEach(item => {
		if(!hasGivenKey(item.key, toTreeDataList)){
			newSkeletonCheckedNodes.push(item);
		}else{
			fixed && item.children && item.children.length > 0 && !hasAllFixedLeaf(item) && fixedShouldDelPar.push(item);
		}
	});
	if(selectType == 'onlySelf' || selectType == 'onlyChild' || selectType == 'onlyLeaf'){
		selfDeletedCheckedNodes = newSkeletonCheckedNodes.map(item => {
			let cloneNode = deepClone(item);
			 cloneNode.children && (cloneNode.children = []);
			 return cloneNode;
		});
	}
	// console.log('newSkeletonCheckedNodes', newSkeletonCheckedNodes)
	if(fixed){
		if(isRefer){
			newSkeletonCheckedNodes = cloneSkeletonCheckedNodes;
		}
		// console.log('____newSkeletonCheckedNodes', newSkeletonCheckedNodes)
		// 统计需要移除的父节点(没有固定叶子的)
		let leafNodes = [];
		let isMovePar=[]; // 需要进行左移判断的父节点
		fixedDeleteCheckedNodes = newSkeletonCheckedNodes.filter((item) => {
			if(item.children && item.children.length > 0){
				// 1.子节点全为enable的父节点 2. 子节点包含enable + disable两种状态的父节点
				hasEnableInLeaf(item) && (isMovePar[isMovePar.length] = item);
				// 没有固定叶子节点的父节点。
				return !hasFixedLeaf(item);
			}else{
				leafNodes[leafNodes.length] = item;
				return false;
			}
		});
		// console.log('需要移除的无固定叶子的父节点', fixedDeleteCheckedNodes);
		// console.log('fixedDeleteCheckedNodes', fixedDeleteCheckedNodes);
		// 统计需要保留的父节点(有固定叶子节点的)
		// let filterNewSkeletonCheckedNodes = newSkeletonCheckedNodes.filter((item, index)=>{
		// 	if(item.children && item.children.length > 0){
		// 		return hasEnableInLeaf(item);
		// 	}
		// });
		// console.log('FixedNewSkeletonCheckedNodes',filterNewSkeletonCheckedNodes)
		// 应该左移的全选节点
		// newSkeletonCheckedNodes = filterNewSkeletonCheckedNodes;
		// 统计需要进行左移判断的父节点()和叶子节点
		// console.log('isMovePar', isMovePar, fixedShouldDelPar);
		console.log('isMovePar', isMovePar, 'fixedDeleteCheckedNodes', fixedDeleteCheckedNodes, 'fixedShouldDelPar', fixedShouldDelPar)
		newSkeletonCheckedNodes = [...isMovePar, ...leafNodes];
	}
	let leafCheckedNodes=[];
	newSkeletonCheckedNodes.forEach(item => {
		(item.children && item.children.length >0)&&(item = deepClone(item));
		if(selectType == 'onlySelf' || selectType == 'onlyChild'){
			item.children = [];
			let children = [];
			let pid = item.id;
			getChildrenNodeAndDel(to_tree,pid, children);
			item.children = children;
			// console.log('item----2222',item)
			let parent = getNodeByKey(to_tree, item.pid);
			let hasSiblingNode = getNodeByKey(to_tree, item.key);
			// console.log('parent',parent);
			if(!parent){
				!hasSiblingNode && to_tree.unshift(item);
				return;
			}
			if(parent && !parent.children){
				parent.children = [];
			}
			!hasSiblingNode && parent.children.unshift(item);
			return;
		}
		if(item.children && item.children.length > 0){
			if(selectType == 'onlyLeaf'){
				return;
			}
			let hasSiblingNode = getNodeByKey(to_tree, item.key);
			// 仅插入父节点
			item.children = [];
			let parent = getNodeByKey(to_tree, item.pid);
			if(!parent){
				!hasSiblingNode && to_tree.push(item);
				return;
			}
			if(!parent.children){
				parent.children = [];
			}
			!hasSiblingNode && parent.children.push(item);
			// parent.children.push(item);
		}else if(!item.fixed){
			// 末端叶子
			// leafCheckedNodes = arrayCheckedNodes.filter(item => (!item.children || item.children.length == 0) && !item.fixed);
			leafCheckedNodes[leafCheckedNodes.length] = item;
		}
	});
	// console.log('leafCheckedNodes', leafCheckedNodes)
	leafCheckedNodes.forEach(item => {
		let parent = getNodeByKey(to_tree, item.pid);
		let hasSiblingNode = getNodeByKey(to_tree, item.key);
		if(!parent){
			!hasSiblingNode && to_tree.push(item);
			return;
		}
		if(!parent.children){
			parent.children = [];
		}
		!hasSiblingNode && parent.children.push(item);
	});
	// treeSort(to_tree);
	// 返回移除节点
	return  selectType == 'onlySelf' ? [...selfDeletedCheckedNodes] :fixed ? [...fixedDeleteCheckedNodes,...fixedShouldDelPar,...leafCheckedNodes]:arrayCheckedNodes;
}