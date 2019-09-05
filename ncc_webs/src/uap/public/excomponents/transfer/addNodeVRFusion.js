import * as tree_utils from './tree_utils';
import { deepClone } from 'nc-lightapp-front';
const { getNodeByKey, hasGivenKey, hasEnableInLeaf, getChildrenNodeAndDel, getAllNodeKeys, arrayBIsContaindA, noneAInB, treeSort } = tree_utils;

export default function addToTree(from_tree, to_tree, checkedKeys, halfCheckedKeys,fromTreeDataList, toTreeDataList, fixed, selectType, isRefer){
	let typeIds = [];
	let removeNodes=[];
	let arrayCheckedNodes = [];
	checkedKeys.forEach(item => {
		let node = getNodeByKey(from_tree, item);
		typeIds.push(node.nodeData.typeId);
		removeNodes.push(node);
		arrayCheckedNodes.unshift(node);
	});
	let uniqueTypeIds = Array.from(new Set(typeIds));
	let virtualNodes = uniqueTypeIds.map(id => {
		let node = getNodeByKey(from_tree,id);
		if(!node.nodeData.real){
			return node;
		} 
	});

	arrayCheckedNodes = virtualNodes.concat(arrayCheckedNodes);
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
	let shouldDelVirNode = [];
	// debugger
	cloneSkeletonCheckedNodes.forEach(item => {
		if(!hasGivenKey(item.key, toTreeDataList)){
			newSkeletonCheckedNodes.push(item);
		}else if(!item.nodeData.real){
			// newSkeletonCheckedNodes.push(item);
			// 两侧都包含虚节点
			shouldDelVirNode.push(item);
			shouldDelVirNode = deepClone(Array.from(new Set(shouldDelVirNode)));
		}
	});
	if(selectType == 'onlySelf' || selectType == 'onlyChild' || selectType == 'onlyLeaf' || selectType == "onlyDirectChild"){
		let filterNewSkeletonCheckedNodes = newSkeletonCheckedNodes.filter(item => {
			let cloneNode = deepClone(item);
			cloneNode.children && (cloneNode.children = [])
			if((selectType == 'onlySelf' || selectType == 'onlyChild' || selectType == "onlyDirectChild") && !item.nodeData.real){
				let virtualNode = getNodeByKey(from_tree, item.nodeData.typeId);
				let virtualNodeKeys = getAllNodeKeys([virtualNode]);
				virtualNodeKeys.splice(virtualNodeKeys.indexOf(item.nodeData.typeId), 1);
				if(arrayBIsContaindA(virtualNodeKeys, checkedKeys)){
					console.log('包含，虚节点移动， 移除');
					selfDeletedCheckedNodes.push (cloneNode);
					return true;
				}else if(noneAInB(virtualNodeKeys, checkedKeys)){
					console.log('不包含，虚节点不动，不移除');
					return false;
				}else{
					console.log('包含部分，虚节点移动， 不移除');
					return true;
				}
			}else{
				selfDeletedCheckedNodes.push (cloneNode);
				return true;
			}
		});
		newSkeletonCheckedNodes = filterNewSkeletonCheckedNodes
	}

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
		// 统计需要进行左移判断的父节点()和叶子节点
		newSkeletonCheckedNodes = [...isMovePar, ...leafNodes];
	}
	let leafCheckedNodes=[];
	// console.log('newSkeletonCheckedNodes', newSkeletonCheckedNodes);
	newSkeletonCheckedNodes.forEach(item => {
		(item.children && item.children.length >0)&&(item = deepClone(item));
		if(selectType == 'onlySelf' || selectType == 'onlyChild' || selectType == 'onlyDirectChild' ){
			let pid = item.id;
			if(selectType == 'onlySelf' || selectType == 'onlyDirectChild'){
				if(item.children && item.children.length > 0){
					// 找到子节点并挂载到虚节点上
					let children = [];
					let virtualNode = getNodeByKey(from_tree, item.nodeData.typeId);
					getChildrenNodeAndDel(from_tree, pid, children);
					if(!virtualNode.children){
						virtualNode.children = [];
					}
					virtualNode.children = [...children, ...virtualNode.children];
				}
			}
			item.children = [];
			let children = [];
			getChildrenNodeAndDel(to_tree,pid, children);// 查找目标树中该项的子元素
			item.children = children;
			
			let parent = getNodeByKey(to_tree, item.pid);
			let hasSiblingNode = getNodeByKey(to_tree, item.key);
			let virtualParent = getNodeByKey(to_tree, item.nodeData.typeId);
			if(!parent && virtualParent){
				parent = virtualParent;
			}
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
			// 仅插入父节点
			item.children = [];
			let parent = getNodeByKey(to_tree, item.pid);
			let hasSiblingNode = getNodeByKey(to_tree, item.key);
			if(!parent){
				!hasSiblingNode && to_tree.unshift(item);
				return;
			}
			if(!parent.children){
				parent.children = [];
			}
			!hasSiblingNode && parent.children.unshift(item);
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
			!hasSiblingNode && to_tree.unshift(item);
			return;
		}
		if(!parent.children){
			parent.children = [];
		}
		!hasSiblingNode && parent.children.unshift(item);
	});

	// 两侧都存在虚节点，判断是否移除。
	if(shouldDelVirNode.length > 0){
		shouldDelVirNode.forEach(virtualNode => {
			let virtualNodeKeys = getAllNodeKeys([virtualNode]);
			virtualNodeKeys.splice(virtualNodeKeys.indexOf(virtualNode.nodeData.typeId), 1);
			if(arrayBIsContaindA(virtualNodeKeys, checkedKeys)){
				console.log('两侧有相同虚节点，包含，虚节点移动， 移除');
				selfDeletedCheckedNodes.push (virtualNode);
			}
		});
	}
	treeSort(to_tree);
	// 返回移除节点
	console.log('selfDeletedCheckedNodes',selfDeletedCheckedNodes)
	return  selectType == 'onlySelf' || selectType == 'onlyChild' || selectType == 'onlyDirectChild' ? selfDeletedCheckedNodes :fixed ? [...fixedDeleteCheckedNodes,...leafCheckedNodes]:removeNodes;
}