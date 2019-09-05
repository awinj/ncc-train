import React, { Component } from 'react';
import {base } from 'nc-lightapp-front';
let {NCButton,NCTree,NCFormControl  } = base;
import './Transfer.less';
import '../uapbdstyle/uapbd_style_common.less';
var EMPTY_FN = function(){};

var TreeWapper = function(){
    var datas = [],
        dataMap = {},
        root =  {
            root: true,
            key: 'root',
            title: '根节点'
        };

    this.setRootTitle = function(title){
        root.title = title;
    }
    
    this.initData =  function(ds){
        datas = ds;
        var loop =  (nodes) => {
            nodes.forEach(node => {
                dataMap[node.key] = node;
                loop(node.children||[]);
            });
        };
        loop(datas);
        dataMap[root.key] = {...root, children: ds};
    }.bind(this);

    var buildNodeTreeNode = function(move = true){
        var newRoot = { ...root},
            loop = (nodes, pnode) => {
            nodes.map( node => {
                var  movesign =  node.move && !(node.nodeData && !!node.nodeData.isFix) ? true: false,
                     n  = movesign == move ?  {... node, children: []} : undefined ,
                    childs = node.children || [];
                if(n){
                    pnode.children = pnode.children || [];
                    pnode.children.push(n);
                }
                loop(childs, n || newRoot);
            });
        };
        loop(datas, newRoot);
        return newRoot;
    }.bind(this);

    this.renderNode = (move = false, textValue,flag,keys) => {
        var  root = buildNodeTreeNode(move);
        var nodeComps, expandKeys = [];

        if(textValue){
            const loopsearch = (nodes = []) => {
                var parendExpand = false;
                (nodes || [] ).forEach(child => {
                    var expand = loopsearch( child.children || [] );
                    child.needExpand = expand;
                    child.needShow = expand ? true: (child.code && child.code.indexOf(textValue) != -1 || (child.title.indexOf(textValue)  != -1)? true: false);
                    parendExpand = parendExpand ? parendExpand :child.needShow;
                    if(expand){
                        expandKeys.push(child.key);
                    }
                });
                return parendExpand;
            }
            var rootExpand = loopsearch([root]);
            expandKeys.push('root');
        }

        if(!flag){
            expandKeys = keys;
        }
       
        var  renderTreeTitle = (item, pitem) => {
            let child = item.children || [];
            let isLeaf = !child.length;
            var drawTitleString = (title) =>{
                if(textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1 ){
                    var start = title.indexOf(textValue) , end = start + textValue.length;
                    return <span><span className='refer-tree-title'>{title.substring(0, start)}</span><span className="transfer-treefilter-highlight" >{textValue}</span><span>{title.substring(end, title.length)}</span></span>
                }else{
                    return (<span><span className='refer-tree-title'>{title}</span></span>);
                }
            };
            // <span><span  className='refer-tree-title'>{title}</span></span>  样例子
            let titleInfo = <span><i className={isLeaf ? 'tree-dian' : expandKeys && expandKeys.indexOf(item.key) > -1 ? 'icon iconfont  icon-wenjianjiadakai tree-wenjian':'icon iconfont  icon-wenjianjia tree-wenjian'}></i>&nbsp;{drawTitleString(item.code)}&nbsp;&nbsp;{drawTitleString(item.name || item.title)}</span>
            return (<div className="title-con">{titleInfo}</div>);
        };
    
        const loopdraw = (datas, pdata) => {
            return  datas.filter( item => {
                return (item.needShow == undefined && item.needExpand == undefined) || item.needShow || item.needExpand || item.key == 'root';
            }).map((item) => {
                var children = item.children || [];
                let isLeaf = !children.length;
                let switcherName = isLeaf ? 'isLeaf_hiden_point_line':'isLeaf_show_point_line';
                return (<NCTree.NCTreeNode switcherClass={switcherName} title={renderTreeTitle(item)} key={item.key} isLeaf={children.length == 0}>{loopdraw(children)}</NCTree.NCTreeNode>)
            });
        }
        nodeComps =  loopdraw([root]);
        return {
            nodeComps: nodeComps,
            expandKeys: expandKeys
        };
    };

    var loopChildMove = function(nodes, move = false,isAllChild = true){
        nodes.forEach( n => {
            n.move = move;
            isAllChild && loopChildMove(n.children || [], move);
        });
    };

    var loopOnlyLeafMove = function(nodes,move=false){
        nodes.forEach( n => {
            if(!n.children || n.children.length === 0){
                n.move = move;
            }
            loopOnlyLeafMove(n.children || [], move);
        });
    }

    var loopParentMove = function(n, move = false){
        var pid   = n.pid,
            pnode =  dataMap[pid] || root;
        if(pnode.root)
            return;
        pnode.move = move;
        loopParentMove(pnode,move);
    };

    this.moveRight  = function(nodeid, incParent = false, incChild = false, incSelf = true,isAllChild=false,isOnlyLeaf=false){
        var curNode = dataMap[nodeid],
            move = true;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove(curNode.children || [], move,isAllChild);
        if(isOnlyLeaf)
            loopOnlyLeafMove([curNode],move);
    };

    this.moveLeft = function(nodeid, incParent = false, incChild = false, incSelf = true,isAllChild=false,isOnlyLeaf=false){
        var curNode = dataMap[nodeid],
            move = false;
        if(!curNode) return;
        if(incSelf)
            curNode.move = move;
        if(incParent)
            loopParentMove(curNode, move);
        if(incChild)
            loopChildMove(curNode.children ||[], move,isAllChild);
        if(isOnlyLeaf)
            loopOnlyLeafMove([curNode],move);

    };

    this.getData = function(move){
        var resultNodes = [],
            rootNode = dataMap['root'];

        var loopChild = function(nodes){
            nodes.forEach( n => {
                if(n.move === (move && !(n.nodeData && !!n.nodeData.isFix))){
                    let resultNode = {... n, children: []}
                    resultNodes.push(resultNode);
                }
                loopChild(n.children || []);
            });
        };
        loopChild(rootNode.children || []);
        return resultNodes;
    };
};


class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeWapper: new TreeWapper(),
            showSearch:!!props.showSearch,
            onBeforeEvent:props.onBeforeEvent,
            onAfterEvent:props.onAfterEvent,
            treesearchorigin:{
                type: 'search',
                value: undefined,
                onChange:(value) =>{
                    this.state.treesearchorigin.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    this.state.origin.searchValue = this.state.treesearchorigin.value;
                    this.state.origin.autoExpandParent = true;
                    this.state.origin.searchExpand = false;
                    this.setState(this.state);
                }
            },
            origin: {
                searchValue: undefined,
                selectedKeys:[],
                expandedKeys:['root'],
                multiple: true,
                autoExpandParent: true,
                searchExpand:true,
                showLine:true,
                onSelect: (selectedKeys) => {
                    this.state.origin.selectedKeys = selectedKeys;
                    this.setState(this.state);
                },
                onExpand : (expandedKeys) => {
                    this.state.origin.expandedKeys = expandedKeys;
                    this.state.origin.autoExpandParent = false;
                    this.state.origin.searchExpand = true;
                    this.setState(this.state);
                }
            },
            treesearchtarget:{
                type: 'search',
                value: undefined,
                onChange:(value) =>{
                    this.state.treesearchtarget.value = value;
                    this.setState(this.state);
                },
                onSearch: () =>{
                    this.state.target.searchValue = this.state.treesearchtarget.value;
                    this.state.target.autoExpandParent = true;
                    this.state.target.searchExpand = false;
                    this.setState(this.state);
                }
            },
            target: {
                searchValue: undefined,
                selectedKeys:[],
                showLine:true,
                expandedKeys:['root'],
                multiple: true,
                autoExpandParent: true,
                searchExpand:true,
                onSelect: (selectedKeys) => {
                    this.state.target.selectedKeys = selectedKeys;
                    this.setState(this.state);
                },
                onExpand : (expandedKeys) => {
                    this.state.target.expandedKeys = expandedKeys;
                    this.state.target.autoExpandParent = false;
                    this.state.target.searchExpand = true;
                    this.setState(this.state);
                }
            },
            incChild:{
                checked: false,
                onChange: (v) => {
                    this.state.incChild.checked = v;
                    this.setState(this.state);
                }
            },
            moveType:{
                ncParent: false, 
                incChild: false, 
                incSelf: false,
                isAllChild:true,
                isOnlyLeaf:false
            }
        }
    }

    /**
     * 设置树节点移动类型
     */
    setMoveType=(type)=>{
        switch(type){
            case '0'://包含所有下级
                this.state.moveType.incParent=false;
                this.state.moveType.incChild=true;
                this.state.moveType.incSelf=true;
                this.state.moveType.isAllChild=true;
                this.state.moveType.isOnlyLeaf = false;
                this.setState(this.state);
                break;
            case '1'://仅自己
                this.state.moveType.incParent=false;
                this.state.moveType.incChild=false;
                this.state.moveType.incSelf=true;
                this.state.moveType.isAllChild=false;
                this.state.moveType.isOnlyLeaf=false;
                this.setState(this.state);
                break;
            case '2'://仅直接下级
                this.state.moveType.incParent = false;
                this.state.moveType.incChild = true;
                this.state.moveType.incSelf = false;
                this.state.moveType.isAllChild = true;
                this.state.moveType.isOnlyLeaf=false;
                this.setState(this.state);
                break;
            case '3'://仅末级
                this.state.moveType.incParent = false;
                this.state.moveType.incChild = false;
                this.state.moveType.incSelf = false;
                this.state.moveType.isAllChild = false;
                this.state.moveType.isOnlyLeaf = true;

        }
    }

    /**
     * 设置根节点名称
     */
    setRootTitle = (title) =>{
        this.state.treeWapper.setRootTitle(title);
        this.setState(this.state);
    }

    /**
     * 设置树数据
     * @param {*} data 
     */
    reset(data){
        this.state.treeWapper.initData(data);
        this.setState(this.state);
    }

    getData(){
        return this.state.treeWapper.getData(true);
    }
    render() {
        var treeWapper = this.state.treeWapper,
        origin  = this.state.origin,
        target  = this.state.target;

        var moveToTaget = () => {
            if(this.state.onBeforeEvent && typeof this.state.onBeforeEvent === 'function'){
                let result = this.state.onBeforeEvent('l2r',treeWapper.getData(false),treeWapper.getData(true),origin.selectedKeys);
                if(!result) return;
            }
            origin.selectedKeys.forEach(key => {
                treeWapper.moveRight(key, this.state.moveType.incParent, this.state.moveType.incChild, this.state.moveType.incSelf,this.state.moveType.isAllChild,this.state.moveType.isOnlyLeaf);
            });
            this.state.origin.selectedKeys=[];
            this.state.target.selectedKeys=[];
            this.setState(this.state,()=>{
                if(this.state.onAfterEvent && typeof this.state.onAfterEvent === 'function'){
                    this.state.onAfterEvent('l2r',treeWapper.getData(false),treeWapper.getData(true),origin.selectedKeys);
                }
            });
        };

        var moveToTagetAll = () => {
            if(this.state.onBeforeEvent && typeof this.state.onBeforeEvent === 'function'){
                let result = this.state.onBeforeEvent('all_l2r',treeWapper.getData(false),treeWapper.getData(true));
                if(!result) return;
            }
            treeWapper.moveRight('root', false, true, false,true,false );
            this.state.origin.selectedKeys=[];
            this.state.target.selectedKeys=[];
            this.setState(this.state,()=>{
                if(this.state.onAfterEvent && typeof this.state.onAfterEvent === 'function'){
                    this.state.onAfterEvent('all_l2r',treeWapper.getData(false),treeWapper.getData(true));
                }
            });
        };


        var moveToOrigin = () =>{
            if(this.state.onBeforeEvent && typeof this.state.onBeforeEvent === 'function'){
                let result = this.state.onBeforeEvent('r2l',treeWapper.getData(false),treeWapper.getData(true),origin.selectedKeys);
                if(!result) return;
            }
            target.selectedKeys.forEach(key =>{
                treeWapper.moveLeft(key, this.state.moveType.incParent, this.state.moveType.incChild, this.state.moveType.incSelf,this.state.moveType.isAllChild,this.state.moveType.isOnlyLeaf);
            });
            this.state.origin.selectedKeys=[];
            this.state.target.selectedKeys=[];
            this.setState(this.state,()=>{
                if(this.state.onAfterEvent && typeof this.state.onAfterEvent === 'function'){
                    this.state.onAfterEvent('r2l',treeWapper.getData(false),treeWapper.getData(true),origin.selectedKeys);
                }
            });
        };

        var moveToOriginAll = () =>{
            if(this.state.onBeforeEvent && typeof this.state.onBeforeEvent === 'function'){
                let result = this.state.onBeforeEvent('all_r2l',treeWapper.getData(false),treeWapper.getData(true));
                if(!result) return;
            }
            treeWapper.moveLeft('root', false, true, false,true,false);
            this.state.origin.selectedKeys=[];
            this.state.target.selectedKeys=[];
            this.setState(this.state,()=>{
                if(this.state.onAfterEvent && typeof this.state.onAfterEvent === 'function'){
                    this.state.onAfterEvent('all_r2l',treeWapper.getData(false),treeWapper.getData(true));
                }
            });
        }

       var  orignRender = treeWapper.renderNode(false, origin.searchValue,!!(origin.searchValue && !this.state.origin.searchExpand),origin.expandedKeys);
       var  targetRender = treeWapper.renderNode(true, target.searchValue,!!(target.searchValue && !this.state.target.searchExpand),target.expandedKeys);

       var orignExpandKeys =  origin.searchValue && !this.state.origin.searchExpand ? orignRender.expandKeys  : origin.expandedKeys;
       var targetExpandKeys = target.searchValue && !this.state.target.searchExpand ? targetRender.expandKeys : target.expandedKeys;

        var originTree = {
            ...origin,
            expandedKeys: orignExpandKeys
        };

        var targetTree = {
            ...target,
            expandedKeys: targetExpandKeys
        };

        return (

            <div className = 'uapbd-transfer-main'>
                <div className = 'left-area' style={{height:'400px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                    <div className = 'left-area-nei'>
                        <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>待选择数据</div>
                        {this.state.showSearch&&(<div style={{marginLeft:20,marginTop:10,marginRight:20}}>
                            <NCFormControl {...this.state.treesearchorigin}/>
                        </div>)}
                        <div field="tree-area" className="syncTreeCom syncTreeComTransferLineStyle" style={{height:'calc(100% - 70px)'}}>
                            <div className='synctree-area'  fieldname="树控件" style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                <NCTree
                                    closeIcon={<i field="tree-switcher" fieldname="树开关" class="icon iconfont icon-shushouqi tree-swich"></i>}
                                    openIcon={<i field="tree-switcher" fieldname="树开关" class="icon iconfont icon-shu_zk tree-swich"></i>}
                                {...originTree}>{orignRender.nodeComps}</NCTree>
                            </div>
                        </div>
                        {/* <div className='left-area-tree' style={{marginLeft:20}}> */}
                    </div>
                </div>

                <div className = 'button-area'>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToTaget.bind(this)}>&gt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToTagetAll.bind(this)}>&gt;&gt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToOrigin.bind(this)}>&lt;</NCButton>
                    </div>
                    <div className="opr-botton opr-botton-trans">
                        <NCButton onClick={moveToOriginAll.bind(this)}>&lt;&lt;</NCButton>
                    </div>
                </div>
                <div className = 'right-area' style={{height:'400px',padding:'10px',background:'rgba(249,249,249,1)',width:'calc(50% - 25px)'}}>
                    <div className = 'right-area-nei'>
                    <div style={{height:30,width:'100%',background:'rgba(249,249,249,1)',margin: 0,paddingTop: 5,paddingLeft: 20}}>已选择数据</div>
                        {this.state.showSearch&&(<div style={{marginLeft:20,marginTop:10,marginRight:20}}>
                            <NCFormControl {...this.state.treesearchtarget}/>
                        </div>)}
                        <div field="tree-area" className="syncTreeCom syncTreeComTransferLineStyle" style={{height:'calc(100% - 70px)'}}>
                            <div className='synctree-area'  fieldname="树控件" style={{marginLeft:20,width:'calc(100% - 20px)'}}>
                                <NCTree 
                                    showLine={true}
                                    closeIcon={<i field="tree-switcher" fieldname="树开关" class="icon iconfont icon-shushouqi tree-swich"></i>}
                                    openIcon={<i field="tree-switcher" fieldname="树开关" class="icon iconfont icon-shu_zk tree-swich"></i>}
                                    {...targetTree}>{targetRender.nodeComps}</NCTree>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        )
    }
}
export default Transfer;