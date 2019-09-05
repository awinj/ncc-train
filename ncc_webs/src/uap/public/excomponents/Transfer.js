import React, { Component } from 'react';
import { deepClone } from 'nc-lightapp-front';
import Trtree from './transfer/Trtree';
import Treetransfer from './transfer/treeTransfer';

/**
 * 根据树节点获取该节点下的所有末级
 */
const getlastNodes = (node,lastNodes) => {
    if(node.children && node.children.length > 0){
        node.children.forEach((item) => {
            if(item.children && item.children.length > 0){
                getlastNodes(item,lastNodes);
            }else{
                lastNodes.push(item);
            }
        });
    }else{
        lastNodes.push(node);
    }
};


/**
 * 创建穿梭框
 */
export default class Transfer extends Component{
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            // status,
            // onlySelf: this.props.onlySelf,
            // onlyChild: this.props.onlyChild,
            // onlyLeaf: this.props.onlyLeaf,

            // 节点选种方式  'onlySelf, onlyChild, onlyLeaf'
            selectType: this.props.selectType || 'default',
            
            treeType: this.props.treeType,
            disableBtns: this.props.disableBtns,
            hiddenAllMoveBtns: this.props.hiddenAllMoveBtns,
            value:this.props.value?this.props.value:{},//穿梭框返回的结果
            TransferId:this.props.TransferId,//穿梭框id
            leftTreeData:this.props.leftTreeData||[],//左树初始化数据
            rightTreeData:this.props.rightTreeData||[],//右树初始化数据
            leftExpandedKeys: [],
            rightExpandedKeys: [],
            leftCheckedKeys: [],
            leftHalfCheckedKeys: [],
            rightHalfCheckedKeys: [],
            rightCheckedKeys: [],
            leftSearchValue: '',
            // leftSearchTree: this.props.leftTreeData || [],
            leftSearchTree: [],
            rightSearchValue: '',
            isLeftSearch: false,
            isRightSearch: false,
            // rightSearchTree: this.props.rightTreeData || [],
            rightSearchTree: [],
            beforeMove:this.props.beforeMove,//异动前事件
            afterMove:this.props.afterMove,//移动后事件
            leftTreeConfig:this.props.leftTreeConfig,//左树配置，为对象{}
            rightTreeConfig:this.props.rightTreeConfig,//右树配置，为对象{}
            TransfertreeData:{}
        }
        this.state.value.leftTreeData = this.state.leftTreeData;
        this.state.value.rightTreeData = this.state.rightTreeData;
        this.TransferTreeMethods = {
            createTree : Trtree.createTree.bind(this),
            // getSelectedValue : Trtree.getSelectedValue.bind(this),      
            // getCheckedValue: Trtree.getCheckedValue.bind(this),
            // getHalfCheckedValue: Trtree.getHalfCheckedValue.bind(this),
            // setStateEve : Trtree.setStateEve.bind(this),
            delNode : Trtree.delNode.bind(this),
            getNodeByTreeIdAndKey : Trtree.getNodeByTreeIdAndKey.bind(this),
            getTreeDataById : Trtree.getTreeDataById.bind(this),
            getAllNodeKeys: Trtree.getAllNodeKeys.bind(this),
            delParents: Trtree.delParents.bind(this),
            addToTree: Trtree.addToTree.bind(this),
            getNodeByKey: Trtree.getNodeByKey.bind(this),
            findAllParentsKey: Trtree.findAllParentsKey.bind(this)
        }
        this.leftTreeId = `${this.state.TransferId}_left_tree`;
        this.rightTreeId = `${this.state.TransferId}'_right_tree`;
        this.leftDataList = [];
        this.rightDataList = [];
        this.directExceptParentNodeKeys = [];
        this.generateList(this.props.leftTreeData, this.leftDataList);
        this.generateList(this.props.rightTreeData, this.rightDataList);
    }

    componentWillReceiveProps(nextProps){
        this.setState ({
            // expand: [],
            // status,
            // onlySelf: nextProps.onlySelf,
            // onlyChild: nextProps.onlyChild,
            // onlyLeaf: nextProps.onlyLeaf,

            // 节点选种方式
            selectType: nextProps.selectType || 'default',

            treeType: this.props.treeType,
            hiddenAllMoveBtns: this.props.hiddenAllMoveBtns,
            disableBtns: nextProps.disableBtns,
            value: nextProps.value?nextProps.value:{},//穿梭框返回的结果
            TransferId:nextProps.TransferId,//穿梭框id
            leftTreeData:nextProps.leftTreeData||[],//左树初始化数据
            rightTreeData:nextProps.rightTreeData||[],//右树初始化数据
            leftExpandedKeys: [],
            rightExpandedKeys: [],
            leftCheckedKeys: [],
            leftHalfCheckedKeys: [],
            rightHalfCheckedKeys: [],
            rightCheckedKeys: [],
            // leftSearchTree: this.props.leftTreeData || [],
            leftSearchTree:[],
            leftSearchValue: '',
            rightSearchValue: '',
            isRightSearch: false,
            isLeftSearch: false,
            // rightSearchTree: this.props.rightTreeData || [],
            rightSearchTree: [],
            beforeMove:nextProps.beforeMove,//异动前事件
            afterMove:nextProps.afterMove,//移动后事件
            leftTreeConfig:nextProps.leftTreeConfig,//左树配置，为对象{}
            rightTreeConfig:nextProps.rightTreeConfig,//右树配置，为对象{}
            TransfertreeData:{}
        });
        this.state.value.leftTreeData = this.state.leftTreeData;
        this.state.value.rightTreeData = this.state.rightTreeData;
        this.leftTreeId = `${this.state.TransferId}_left_tree`;
        this.rightTreeId = `${this.state.TransferId}'_right_tree`;
        this.leftDataList = [];
        this.rightDataList = [];
        // this.isLeftSearch = false;
        // this.isRightSearch = false;
        this.generateList(nextProps.leftTreeData, this.leftDataList);
        this.generateList(nextProps.rightTreeData, this.rightDataList);
    }
    
    /**
     * 添加到左树
     */
    toLeft = () => {
        let checkedKeys = this.state.rightCheckedKeys.reverse();
        let halfCheckedKeys = this.state.rightHalfCheckedKeys.reverse();
        let moveNodes = [];
        if(checkedKeys.length == 0) {
            return;
        }else{
            //删除右树节点
            // debugger;
            let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
            let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            if(this.props.beforeMove && typeof this.props.beforeMove === 'function'){
                let nodes = checkedKeys.map(key => {
                    return this.TransferTreeMethods.getNodeByKey(rightTree, key);
                });
                let result = this.props.beforeMove(nodes,this.state.value,'br2l');//从右树到左树移动前事件
                if(!result) return;
            }
            let nodes = this.TransferTreeMethods.addToTree(this.state.treeType, rightTree,leftTree, checkedKeys, halfCheckedKeys,this.rightDataList, this.leftDataList, this.props.rightFixed, this.state.selectType,this.props.referLeftTree);
            // nodes = this.TransferTreeMethods.delParents(nodes, rightTree);
            this.generateList(nodes, [], {},undefined, moveNodes);
            this.delTreeNode(nodes,this.rightTreeId);
            // this.TransferTreeMethods.setStateEve();

            let leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            let rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);

            this.state.value.leftTreeData = leftTreeData;
            this.state.value.rightTreeData = rightTreeData;
            this.setState({
                rightCheckedKeys: [],
                rightHalfCheckedKeys: [],
                leftCheckedKeys: [],
                leftHalfCheckedKeys: [],
                leftTreeData: leftTreeData,
                rightTreeData: rightTreeData,
                isLeftSearch: false,
                isRightSearch: false
            });
            this.leftDataList = [];
            this.rightDataList = [];
            // this.isLeftSearch = false;
            // this.isRightSearch = false;
            this.generateList(leftTreeData, this.leftDataList);
            this.generateList(rightTreeData, this.rightDataList);
            // console.log('toLeft-movenodes', moveNodes);
            if(this.state.afterMove && typeof this.state.afterMove === 'function'){//添加移动后事件
                this.state.afterMove(moveNodes,this.state.value,'ar2l');//从右树到左树移动后事件
            }
        }
    }

    /**
     * 添加到右树
     */
    toRight = () => {
        let checkedKeys = this.state.leftCheckedKeys.reverse();
        if(this.state.selectType == "onlyDirectChild"){
            checkedKeys = checkedKeys.filter(item => {
                return !this.directExceptParentNodeKeys.includes(item)
            });
        }
        let halfCheckedKeys = this.state.leftHalfCheckedKeys.reverse();
        let moveNodes = [];
        if(checkedKeys.length == 0){
            return;
        }else{
            let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
            if(this.props.beforeMove && typeof this.props.beforeMove === 'function'){
                let nodes = checkedKeys.map(key => {
                    return this.TransferTreeMethods.getNodeByKey(leftTree, key);
                });
                let result = this.props.beforeMove(nodes,this.state.value,'bl2r');//从右树到左树移动前事件
                if(!result) return;
            }
            // console.log('trees',leftTree,rightTree)
            // debugger
            //删除左树节点
            let nodes = this.TransferTreeMethods.addToTree(this.state.treeType, leftTree,rightTree, checkedKeys, halfCheckedKeys,this.leftDataList, this.rightDataList, false, this.state.selectType);
            // nodes = this.TransferTreeMethods.delParents(nodes, leftTree);
            // console.log('nodes', nodes);
            this.generateList(nodes, [], {},undefined, moveNodes);
            if(!this.props.referLeftTree){
                // 左树不是参照树
                this.delTreeNode(nodes,this.leftTreeId);
            }
            // this.TransferTreeMethods.setStateEve();

            let leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
            let rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
            // console.log('rightTreeData', rightTreeData);
            // console.log('leftTreeData', leftTreeData);
            this.setState({
                leftCheckedKeys: [],
                leftHalfCheckedKeys: [],
                rightCheckedKeys: [],
                rightHalfCheckedKeys: [],
                leftTreeData: leftTreeData,
                rightTreeData: rightTreeData,
                isLeftSearch: false,
                isRightSearch: false
            });
            this.leftDataList = [];
            this.rightDataList = [];
            // this.isLeftSearch = false;
            // this.isRightSearch = false;
            
            this.state.value.leftTreeData = leftTreeData;
            this.state.value.rightTreeData = rightTreeData;

            this.generateList(leftTreeData, this.leftDataList);
            this.generateList(rightTreeData, this.rightDataList);
            // console.log('toRight-movenodes', moveNodes);
            if(this.state.afterMove && typeof this.state.afterMove === 'function'){//添加移动后事件
                this.state.afterMove(moveNodes,this.state.value,'al2r');//从左树到右树移动后事件
            }
        }    
    }

    allToLeft = () => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
        let leftTreeData; 
        let rightTreeData;
        let nodes;
        let moveNodes=[];
        // 不通过合并算法  左树是右树的子集
        if(this.props.allToLeft_without_merge){
            // TODO
            if(this.props.leftFixed){

            }else{

            }
        }else{
            let checkedKeys = this.TransferTreeMethods.getAllNodeKeys(rightTree);
            checkedKeys = this.state.treeType == 'VRFusion' ? checkedKeys.reverse() : checkedKeys;
            let halfCheckedKeys = [];
            let moveNodes = [];
            // console.log('nodeKeys', selectNodeKeys);
            if(!checkedKeys || checkedKeys.length === 0){
                return;
            }else{
                if(this.props.beforeMove && typeof this.props.beforeMove === 'function'){
                    let nodes = checkedKeys.map(key => {
                        return this.TransferTreeMethods.getNodeByKey(rightTree, key);
                    });
                    let result = this.props.beforeMove(nodes,this.state.value,'br2l');//从右树到左树移动前事件
                    if(!result) return;
                }
                // 删除右树节点
                if(this.props.rightFixed){
                    let unfixedNodes=[];
                    this.generateList(rightTree, [], {},undefined, undefined, undefined, unfixedNodes);
                    moveNodes = unfixedNodes;
                    unfixedNodes.forEach(item =>{
                        let rightParent = this.TransferTreeMethods.getNodeByKey(rightTree, item.pid);
                        let children = rightParent.children;
                        let removeNode = deepClone(this.TransferTreeMethods.getNodeByKey(rightParent.children, item.id));
                        let newChildren = children.filter(child => {
                            return child.key !== item.id;
                        });
                        rightParent.children = newChildren;
                        // console.log('rightTree', rightTree)
                        let leftParent = this.TransferTreeMethods.getNodeByKey(leftTree, item.pid);
                        if(!leftParent){
                            leftTree.push(item);
                            return;
                        }
                        if(!leftParent.children){
                            leftParent.children = [];
                        }
                        let hasSiblingNode = this.TransferTreeMethods.getNodeByKey([leftParent], item.id);
                        !hasSiblingNode && leftParent.children.push(removeNode);
                    });

                }else{
                    nodes = this.TransferTreeMethods.addToTree(this.state.treeType, rightTree,leftTree, checkedKeys, halfCheckedKeys,this.rightDataList, this.leftDataList, false, this.state.selectType);
                    // nodes = this.TransferTreeMethods.delParents(nodes, rightTree);
                    this.generateList(nodes, [], {},undefined, moveNodes);
                    this.delTreeNode(nodes, this.rightTreeId);
                }
                // this.TransferTreeMethods.setStateEve();
                leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
                rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);

            }
        }

        this.state.value.leftTreeData = leftTreeData;
        this.state.value.rightTreeData = rightTreeData;
        this.setState({
            leftCheckedKeys: [],
            rightCheckedKeys: [],
            rightHalfCheckedKeys: [],
            leftTreeData: leftTreeData,
            rightTreeData: rightTreeData
        });
        this.leftDataList = [];
        this.rightDataList = [];
        this.generateList(leftTreeData, this.leftDataList);
        this.generateList(rightTreeData, this.rightDataList);
        if(this.state.afterMove && typeof this.state.afterMove === 'function'){
            this.state.afterMove(moveNodes, this.state.value, 'ar2l');
        }
    }

    allToRight = () => {
        let rightTree = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);
        let leftTree = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
        let leftTreeData; 
        let rightTreeData;
        let nodes;
        let moveNodes = [];
        // 左树是参照树.
        if(this.props.referLeftTree){
            let fromTreelist = [];
            let toTreeFixedList=[];
            let toTreelist= [];
            this.generateList(leftTree, [],{}, undefined, fromTreelist);
            this.generateList(rightTree, [],{}, undefined, toTreelist, toTreeFixedList);
            moveNodes = this.getMovedNodes(fromTreelist, toTreelist); 
            console.log('moveNodes', moveNodes, 'fromTreelist', fromTreelist, 'toTreelist', toTreelist);
            if(this.props.rightFixed){
                let cloneLeftTree = deepClone(leftTree);
                // 右侧有固定数据，求出合并后的树.
                this.mergeToFixedTree(toTreeFixedList, cloneLeftTree);
                rightTree.length = 0;
                rightTree.push.apply(rightTree, cloneLeftTree);
                rightTreeData = rightTree;
                leftTreeData = leftTree;
            }else{
                rightTreeData = deepClone(leftTree);
                leftTreeData = leftTree;
            }
        }else{
            let checkedKeys = this.TransferTreeMethods.getAllNodeKeys(leftTree);
            checkedKeys = this.state.treeType == 'VRFusion' ? checkedKeys.reverse() : checkedKeys;
            // console.log('allcheckedkeys', checkedKeys);
            let halfCheckedKeys = [];
            if(!checkedKeys || checkedKeys.length === 0){
                return;
            }else{
                if(this.props.beforeMove && typeof this.props.beforeMove === 'function'){
                    let nodes = checkedKeys.map(key => {
                        return this.TransferTreeMethods.getNodeByKey(leftTree, key);
                    });
                    let result = this.props.beforeMove(nodes,this.state.value,'bl2r');//从右树到左树移动前事件
                    if(!result) return;
                }
                //删除左树节点
                nodes = this.TransferTreeMethods.addToTree(this.state.treeType,leftTree,rightTree, checkedKeys, halfCheckedKeys,this.leftDataList, this.rightDataList, false, this.state.selectType);
                // console.log('allToRight-delete-nodes', nodes);
                // nodes = this.TransferTreeMethods.delParents(nodes, leftTree);
                this.generateList(nodes, [],{}, undefined, moveNodes);
                this.delTreeNode(nodes, this.leftTreeId);
                // this.TransferTreeMethods.setStateEve();
                leftTreeData = this.TransferTreeMethods.getTreeDataById(this.leftTreeId);
                rightTreeData = this.TransferTreeMethods.getTreeDataById(this.rightTreeId);

            }
        }

        this.state.value.leftTreeData = leftTreeData;
        this.state.value.rightTreeData = rightTreeData;
        this.setState({
            rightCheckedKeys: [],
            leftCheckedKeys: [],
            leftHalfCheckedKeys: [],
            leftTreeData: leftTreeData,
            rightTreeData: rightTreeData
        });
        this.leftDataList = [];
        this.rightDataList = [];
        this.generateList(leftTreeData, this.leftDataList);
        this.generateList(rightTreeData, this.rightDataList);
        console.log('allToRight-moveNodes',moveNodes );
        if(this.state.afterMove && typeof this.state.afterMove === 'function'){
            this.state.afterMove(moveNodes, this.state.value, 'al2r');
        }
    }

    delTreeNode = (nodes,treeid) => {
        nodes.forEach((item,index) => {
            this.TransferTreeMethods.delNode(treeid,item.key,false);
            if(item.children && item.children.length > 0){
                this.delTreeNode(item.children,treeid);
            }
        });
    };

    onExpand = (treeId, expandedKeys) => {
        if(treeId == this.leftTreeId){
            this.setState({
                leftExpandedKeys: expandedKeys
            });
        }
        if(treeId == this.rightTreeId){
            this.setState({
                rightExpandedKeys: expandedKeys
            });
        }
    }
    onCheck = (treeId, checkedKeys, halfCheckedKeys, directExceptParentNodeKeys) => {
        // console.log('onCheck-checkedKeys', checkedKeys)
        if(this.state.selectType == 'onlyDirectChild' && directExceptParentNodeKeys.length > 0){
            this.directExceptParentNodeKeys = directExceptParentNodeKeys;
        }
        if(treeId == this.leftTreeId){
            this.setState({
                leftCheckedKeys: checkedKeys,
                leftHalfCheckedKeys: halfCheckedKeys || []
            });
        }
        if(treeId == this.rightTreeId){
            this.setState({
                rightCheckedKeys: checkedKeys,
                rightHalfCheckedKeys: halfCheckedKeys || []
            });
        }
    }
    clearCheckedKeys = (treeId) => {
        if(treeId === this.leftTreeId){
            this.setState({
                rightCheckedKeys: []
            });
        }else{
            this.setState({
                leftCheckedKeys: []
            });
        }
    }
    updateState = () => {
        this.setState({
            TransfertreeData: this.state.TransfertreeData
        });
    }

    leftSearch = (searchValue) => {
        if(searchValue == ''){
            this.setState({
                leftSearchValue: searchValue,
                leftExpandedKeys: [],
                isLeftSearch: false,
                leftCheckedKeys: []
            });
            return;
        }
        let expandedKeys = this.computeKeys(searchValue, this.leftDataList, this.props.leftTreeData);
        let leafNodes = this.filterSearchLeafNode(searchValue, this.props.leftTreeData, expandedKeys);
        console.log('expandedKeys', expandedKeys, 'leafNodes', leafNodes);
        let leafMap = {}, topLeaf=[];
        
        leafNodes.forEach(item => {
            let hasPar = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.leftTreeData, item.pid));
            if(this.state.treeType == 'VRFusion'){
                let typeId = item.nodeData.typeId;
                if(!hasPar){
                    if(expandedKeys.includes(typeId)){
                        if(!leafMap[typeId]){
                            leafMap[typeId] = [item];
                        }else{
                            leafMap[typeId].push(item);
                        }
                    }else{
                        topLeaf.push(item);
                    }
                }else{
                    if(expandedKeys.includes(item.pid)){
                        if(!leafMap[item.pid]){
                            leafMap[item.pid] = [item];
                        }else{
                            leafMap[item.pid].push(item);
                        }
                    }else{
                        topLeaf.push(item);
                    }
                }    
            }
            if(this.state.treeType != 'VRFusion'){
                if(hasPar){
                    if(expandedKeys.includes(item.pid)){
                        if(!leafMap[item.pid]){
                            leafMap[item.pid] = [item];
                        }else{
                            leafMap[item.pid].push(item);
                        }
                    }else{
                        topLeaf.push(item);
                    }
                }else{
                    topLeaf.push(item);
                }
            }
        });

        let expandNodes  = expandedKeys.map((key, index) => {
            let node = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.leftTreeData, key));
            node.children = [];
            if(leafMap[key] && leafMap[key].length > 0){
                node.children = node.children.concat(leafMap[key]);
            }
            return node;
        });
        let hasPar=[];
        // console.log('expandNodes', expandNodes);
        for(let i = expandNodes.length-1; i >= 0; i--){
            let node = expandNodes[i];
            let pid = expandNodes[i].pid;
            if(!pid){
                continue;
            }else{
                for(let j = expandNodes.length - 1; j >= 0; j--){
                    if(pid == expandNodes[j].id && node.id != expandNodes[j].id){
                        expandNodes[j].children.unshift(node);
                        hasPar.push(node);
                    }
                }
            }
        }
        let searchNodes = expandNodes.filter(item => {
            return !hasPar.includes(item);
        });
        console.log('searchNodes, topLeaf', searchNodes, topLeaf);
        searchNodes = [...searchNodes, ...topLeaf];
        let virtualParMap={};
        let filterSearchNodes;
        if(this.state.treeType == 'VRFusion'){
            filterSearchNodes = searchNodes.filter(searchNode => {
                let typeId = searchNode.nodeData.typeId;
                let virtualNode = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.leftTreeData, typeId));
                if(virtualNode && typeId != searchNode.id){
                    if(!virtualParMap[virtualNode.id]){
                        virtualNode.children=[];
                        virtualNode.children.push(searchNode);
                        virtualParMap[virtualNode.id] = virtualNode;
                    }else{
                        virtualParMap[virtualNode.id].children.push(searchNode);
                    }
                    return false;
                }else{
                    return true;
                }
            });
            let virtualExpandKeys = Object.keys(virtualParMap);
            expandedKeys = [...virtualExpandKeys, ...expandedKeys];
            // console.log('1111', expandedKeys);
            // console.log('virtualParMap', virtualParMap);
            let fitVirtualNodes=[] // 添加虚父节点
            for(let virtualId in virtualParMap){
                fitVirtualNodes.push(virtualParMap[virtualId]);
            }
            searchNodes = [...fitVirtualNodes, ...filterSearchNodes]
            // console.log('111searchNodes', searchNodes)
        }

        this.isLeftSearch = true;
        // console.log('hasPar', hasPar, 'filterExpandNodes', filterExpandNodes);
        this.setState({
            isLeftSearch: true,
            leftSearchValue: searchValue,
            leftExpandedKeys: expandedKeys,
            leftSearchTree: searchNodes,
            leftCheckedKeys: []
        });
    }

    rightSearch = (searchValue) => {
        if(searchValue == '') {
            // this.isRightSearch = false;
            this.setState({
                rightSearchValue: searchValue,
                rightExpandedKeys: [],
                isRightSearch: false,
                rightCheckedKeys: []
            });
            return;
        };
        let expandedKeys = this.computeKeys(searchValue, this.rightDataList, this.props.rightTreeData);
        // console.log('expandedKeys', expandedKeys);
        let leafNodes = this.filterSearchLeafNode(searchValue, this.props.rightTreeData, expandedKeys);
        let leafMap = {}, topLeaf=[];
        
        leafNodes.forEach(item => {
            let hasPar = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.rightTreeData, item.pid));
            if(this.state.treeType == 'VRFusion'){
                let typeId = item.nodeData.typeId;
                if(!hasPar){
                    if(expandedKeys.includes(typeId)){
                        if(!leafMap[typeId]){
                            leafMap[typeId] = [item];
                        }else{
                            leafMap[typeId].push(item);
                        }
                    }else{
                        topLeaf.push(item);
                    }
                }else{
                    if(expandedKeys.includes(item.pid)){
                        if(!leafMap[item.pid]){
                            leafMap[item.pid] = [item];
                        }else{
                            leafMap[item.pid].push(item);
                        }
                    }else{
                        topLeaf.push(item);
                    }
                }    
            }
            if(this.state.treeType != 'VRFusion'){
                if(hasPar){
                    if(expandedKeys.includes(item.pid)){
                        if(!leafMap[item.pid]){
                            leafMap[item.pid] = [item];
                        }else{
                            leafMap[item.pid].push(item);
                        }
                    }else{
                        topLeaf.push(item);
                    }
                }else{
                    topLeaf.push(item);
                }
            }
        });

        let expandNodes  = expandedKeys.map((key, index) => {
            let node = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.rightTreeData, key));
            node.children = [];
            if(leafMap[key] && leafMap[key].length > 0){
                node.children = node.children.concat(leafMap[key]);
            }
            return node;
        });
        let hasPar=[];
        // console.log('expandNodes', expandNodes);
        for(let i = expandNodes.length-1; i >= 0; i--){
            let node = expandNodes[i];
            let pid = expandNodes[i].pid;
            if(!pid){
                continue;
            }else{
                for(let j = expandNodes.length - 1; j >= 0; j--){
                    if(pid == expandNodes[j].id && node.id != expandNodes[j].id){
                        expandNodes[j].children.unshift(node);
                        hasPar.push(node);
                    }
                }
            }
        }
        let searchNodes = expandNodes.filter(item => {
            return !hasPar.includes(item);
        });
        searchNodes = [...searchNodes, ...topLeaf];
        // console.log('initSearchNodes', searchNodes)
        let virtualParMap={};
        let filterSearchNodes;
        if(this.state.treeType == 'VRFusion'){
            filterSearchNodes = searchNodes.filter(searchNode => {
                let typeId = searchNode.nodeData.typeId;
                let virtualNode = deepClone(this.TransferTreeMethods.getNodeByKey(this.props.rightTreeData, typeId));
                if(virtualNode && typeId != searchNode.id){
                    if(!virtualParMap[virtualNode.id]){
                        virtualNode.children=[];
                        virtualNode.children.push(searchNode);
                        virtualParMap[virtualNode.id] = virtualNode;
                    }else{
                        virtualParMap[virtualNode.id].children.push(searchNode);
                    }
                    return false;
                }else{
                    return true;
                }
            });
            let virtualExpandKeys = Object.keys(virtualParMap);
            expandedKeys = Array.from(new Set([...virtualExpandKeys, ...expandedKeys]));
            // console.log('1111', expandedKeys);
            // console.log('virtualParMap', virtualParMap);
            let fitVirtualNodes=[] // 添加虚父节点
            for(let virtualId in virtualParMap){
                fitVirtualNodes.push(virtualParMap[virtualId]);
            }
            searchNodes = [...fitVirtualNodes, ...filterSearchNodes]
            // console.log('111searchNodes', searchNodes)
        }
        // this.isRightSearch = true;
        this.setState({
            isRightSearch: true,
            rightSearchValue: searchValue,
            rightSearchTree: searchNodes,
            rightExpandedKeys: expandedKeys,
            rightCheckedKeys: []
        });
    }

    filterSearchLeafNode = (searchValue, treeData, expandedKeys) => {
        let leafNodes = [];
        let recrusive = (searchValue, treeData)=> {
            treeData.forEach(item => {
                let index = item.name.search(searchValue);
                if(index > -1 && (!item.children || (item.children.length > 0 && !expandedKeys.includes(item.id)))){
                    // todo 判断一下子节点中是否包换查找的节点, 不包含就push
                    // console.log('222')
                    leafNodes.push(deepClone(item));
                }else if(item.children && item.children.length > 0){
                    recrusive(searchValue, item.children);
                }
            });
        };
        recrusive(searchValue, treeData);
        return leafNodes;
    }


    /**
     * 左树区域
     */
    leftArea = () => {
        // console.log('leftArea-halfCheckedKeys', this.state.leftHalfCheckedKeys)
        let data = this.state.isLeftSearch ? this.state.leftSearchTree : this.state.leftTreeData
        return this.TransferTreeMethods.createTree({
            expandedKeys: this.state.leftExpandedKeys,
            checkedKeys: this.state.leftCheckedKeys,
            autoExpandParent: false,
            onExpand: this.onExpand,
            onCheck: this.onCheck,
            treeId : this.leftTreeId,
            searchMode: this.state.isLeftSearch,
            cacheTree: this.state.leftTreeData,
            selectType: this.state.selectType,
            data : data,
            clearCheckedKeys: this.clearCheckedKeys,
            otherConfig : this.state.leftTreeConfig,
            searchValue: this.state.leftSearchValue,
            fixed: this.props.rightFixed || this.props.leftFixed ?   this.props.leftFixed ? this.leftTreeId : this.rightTreeId : ''
        });
    }

    /**
     * 右树区域
     */
    rightArea = ()=> {
        // console.log('rightArea-halfCheckedKeys', this.state.rightHalfCheckedKeys)
        // console.log('isRightSearch', this.state.isRightSearch);
        let data = this.state.isRightSearch ? this.state.rightSearchTree : this.state.rightTreeData
        return this.TransferTreeMethods.createTree({
            treeId : this.rightTreeId,
            data : data,
            searchValue: this.state.rightSearchValue,
            expandedKeys: this.state.rightExpandedKeys,
            checkedKeys: this.state.rightCheckedKeys,
            searchMode: this.state.isRightSearch,
            cacheTree: this.state.rightTreeData,
            selectType: this.state.selectType,
            autoExpandParent: false,
            onExpand: this.onExpand,
            onCheck: this.onCheck,
            clearCheckedKeys: this.clearCheckedKeys,
            otherConfig : this.state.rightTreeConfig,
            fixed: this.props.rightFixed || this.props.leftFixed ?   this.props.leftFixed ? this.leftTreeId : this.rightTreeId : ''
        });
    }

    mergeToFixedTree =(fixedList, fromTree) => {
        let parent,node;
        fixedList.forEach(item => {
            item.pid && (parent = this.TransferTreeMethods.getNodeByKey(fromTree, item.pid));
            if(parent){
                node = this.TransferTreeMethods.getNodeByKey(parent.children, item.id);
                node.fixed = true;
            }else{
                node = this.TransferTreeMethods.getNodeByKey(fromTree, item.id);
                node.fixed = true;
            }
        });
    }

    generateList = (data, dataList,hash, list,listWithoutChildren, fixedList, unfixedList) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            let title = node.name;
            let keyid = node.key;
            let pid = node.pid;
            let fixed = node.fixed;
            dataList.push({
                key: title,
                pid: pid,
                keyid: keyid
            });
            list && (list.push(keyid));
            if (node.children && node.children.length>0) {
                this.generateList(node.children, dataList,hash, list,listWithoutChildren, fixedList, unfixedList);
            }else{
                if(!hash || hash[keyid]) continue;
                
                listWithoutChildren && (listWithoutChildren.push({id: keyid, pid}));
                if(fixed){
                    fixedList && (fixedList.push({id: keyid, pid}));
                }else{
                    unfixedList && (unfixedList[unfixedList.length]={id: keyid, pid});
                }
                hash[keyid] = true;
            }
        }

    };

    getMovedNodes = (fromTreeList, toTreeList) => {
        let hash={};
        let diffNodes=[];
        let i=0;
        while(i < toTreeList.length){
            hash[toTreeList[i].id] = true;
            i++;
        }
        fromTreeList.forEach(item => {
            if(!hash[item.id]){
                diffNodes[diffNodes.length] = item;
            }
        });
        return diffNodes;
    }
    

    computeKeys = (searchValue, dataList, tree) => {
        let expandedKeys = [];
        let _this = this;
        dataList.forEach(item => {
            if(item.key.indexOf(searchValue) > -1){
                // console.log('keyid', item.keyid)
                let parentKeys = []
                // console.log('key_parent',_this.getParentKey(item.key, gdata))
                // expandedKeys.push(_this.getParentKey(item.key, gdata));
                _this.TransferTreeMethods.findAllParentsKey(item.keyid, tree, parentKeys);
                // if(item.pid){
                    expandedKeys = expandedKeys.concat(parentKeys);
                // }
            }
        });
        // console.log('dataList', dataList, 'expandedKeys', expandedKeys);
        const uniqueExpandedKeys = [...new Set(expandedKeys)];
        return uniqueExpandedKeys;
    }

    render(){
        console.log('transferrrrr',this.state)
        return (
            <Treetransfer 
                title = {this.props.title}
                toRight={this.toRight.bind(this)} 
                toLeft={this.toLeft.bind(this)}
                allToLeft={this.allToLeft.bind(this)}
                fullscreen={this.props.fullscreen}
                allToRight={this.allToRight.bind(this)}
                leftArea={this.leftArea.bind(this)}
                leftSearch={this.leftSearch.bind(this)}
                rightSearch={this.rightSearch.bind(this)}
                rightFixed={this.props.rightFixed}
                hiddenAllMoveBtns={this.props.hiddenAllMoveBtns}
                disableBtns={this.state.disableBtns}
                rightArea={this.rightArea.bind(this)}/>
        )
    }
}

