import React, {Component} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import * as treeUtil from './treeUtil';
import Utils from '../../utils';
import RenderConditionTitle from './renderConditionTitle/index';
import { deepClone } from 'nc-lightapp-front';
import "./index.less";
const { NCButton, NCTree } = base;
const {getNodeByKey, delTreeNodeByKey, validateSubmitInfo, generateDisplayTreeInfo, getNodeAndArrByKey, getChooseNodeAndArrByKey } = treeUtil;

const NCTreeNode = NCTree.NCTreeNode;

class RuleTree extends Component{
    constructor(props) {
        super(props);
        this.state= {
            dropPaKey: '',
            dragPaKey: '',
            treeData: [
                {
                    logic: 'and',
                    extraParaVO: {},
                    conditions: []
                }
            ],
            expandKeys: ['2'],//默认展开父节点
            json: {},
            inlt: null
        }
    }

    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                // intemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }
      
        }
        this.props.MultiInit.getMultiLang({moduleId: 'rbac-ruleTress',domainName: 'uap',callback})
    }

    componentDidMount() {
        const treeInitData = (this.props.roleTreeJson && !Utils.isEmptyObj(this.props.roleTreeJson.querycondition)) ? deepClone(this.props.roleTreeJson.querycondition) : {}
        if(!Utils.isEmptyObj(treeInitData)) {
            this.setState({
                treeData: [{...treeInitData}]
            }, () => {
                console.log('treeData', this.state.treeData);
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('nodeInfo',nextProps.transTreeNodeInfo)
        if(!Utils.isEmptyObj(nextProps.transTreeNodeInfo) && nextProps.transTreeNodeInfo.nodeTitleId != this.props.transTreeNodeInfo.nodeTitleId) {
            const originalTreeData = [...this.state.treeData];
            const transmitObj = {
                extraParaVO: {
                    isleaf: nextProps.transTreeNodeInfo.isleaf,
                    pid: nextProps.transTreeNodeInfo.pid,
                    refcode: nextProps.transTreeNodeInfo.field,
                    refname: nextProps.transTreeNodeInfo.refname,
                    refpk: nextProps.transTreeNodeInfo.refpk,
                    operationtype: nextProps.transTreeNodeInfo.operationtype,
                    itemtype: nextProps.transTreeNodeInfo.itemtype,
                    refcode: nextProps.transTreeNodeInfo.refcode,
                    options: nextProps.transTreeNodeInfo.options,
                    nodeTitleId: nextProps.transTreeNodeInfo.nodeTitleId,
                    showcode: nextProps.transTreeNodeInfo.showcode,
                    returntype: nextProps.transTreeNodeInfo.returntype,
                },
                oprtype: nextProps.transTreeNodeInfo.oprtype || '=',
                display: '',
                field: nextProps.transTreeNodeInfo.field,
                value: {
                    firstvalue: '',
                    secondvalue: ''
                }
            }
            // let treeInitObj = deepClone(originalTreeData[0]);
            // treeInitObj.conditions.push(transmitObj);
            originalTreeData[0].conditions.push(transmitObj);
            this.setState({
                treeData: originalTreeData,
            }, () => {
                this.render();
            })
        }
    }

    hanleInputChange(refpk, value) {//修改用户填选数据
        const data = [...this.state.treeData];
        getNodeAndArrByKey(data, refpk, (item, index, arr) => {
            item.extraParaVO.refcode = value;
        })
        this.setState({
            treeData: data
        })
    }

    getDragDropObj(key) {//获取被拖拽节点对象
        const originalTreeData = [...this.state.treeData];
        let obj = {};
        if(Utils.checkNumber(key)) {//全部由数字组成意味着拖拽/目标节点是选择性父节点
            obj = getChooseNodeAndArrByKey(originalTreeData, key);
        }else {
            obj = getNodeByKey(originalTreeData, key);
        }
        return obj;
    }

    dropTreeNode(info) {//节点拖拽(初始化事件)
        const dragKey = info.dragNode.props.eventKey; //被拖拽节点
        const dropKey = info.node.props.eventKey; //目标节点
        if(!dragKey || !dropKey) return ;
        this.moveTreeNode(dragKey, dropKey);
    }

    delNode(data, key) {//删除目标及被拖拽节点
        if(Utils.checkNumber(key)) {//选择性父节点(拖拽至父选择节点不删除目标节点)
           // delParNodeByKey(data, key);
        }else {//普通子节点
            delTreeNodeByKey(data, key);
        }
    }

    moveTreeNode(dragKey, dropKey) {
        const originalTreeData = [...this.state.treeData];
        const dragObj = this.getDragDropObj(dragKey);
        const dropObj = this.getDragDropObj(dropKey);
        //删除被拖拽节点
        this.delNode(originalTreeData, dragKey);
        
        //数据新增合成
        if(Utils.checkNumber(dropKey)) {//目标节点是选择性父节点
            dropObj.conditions.push(dragObj);
        }else {//目标节点是普通节点
            getNodeAndArrByKey(originalTreeData, dropKey, (item, index, arr) => {
                console.log('arr', arr);
                arr.push({
                    logic: 'and',
                    extraParaVO: {},
                    conditions: [dropObj, dragObj]
                })
            })
        }

        //删除目标节点
        this.delNode(originalTreeData, dropKey);
        
        this.setState({
            treeData: originalTreeData
        })
    }

    delNodeInfo(key) {//删除当前节点
        debugger
        const originalTreeData = [...this.state.treeData];
        const removeData = delTreeNodeByKey(originalTreeData, key);
        const info = this.state.json['1880000025-000000'];
        if(!removeData) {
            toast({content: `${info}`});
            return ;
        }
        this.setState({
            treeData: removeData
        })
    }

    cancelInfo(e) {//取消并关闭modal
        this.props.onCancelInfo(e);
    }

    ensureInfo(e) {//保存
        const originalTreeData = [...this.state.treeData];
        const validateStatus = validateSubmitInfo(originalTreeData);
        const info = this.state.json['1880000025-000001'];
        if(!validateStatus) {
            toast({content:`${info}`,color:"warning"});
            return ;
        }
        let displayStr = generateDisplayTreeInfo(originalTreeData, this.state.json);
        const transData = {
            value: {querytype: 'tree',querycondition: originalTreeData[0]},
            display: displayStr
        };
        this.props.onEnsureInfo(transData,e);
    }

    render() {
        const treeSource = [...this.state.treeData];
        const {RenderTreeNodeTitle, languageMetaArr} = this.props;
        let parKey=1;
        const loop = (data) => data.map( (item, index) => {
            if(item.hasOwnProperty('conditions') && !Utils.isEmptyArr(item.conditions)) {
                if(item.logic && item.conditions.length) {
                    parKey += 1;
                    return <NCTreeNode titleClass={"refernode"} key={parKey} 
                                title={<RenderConditionTitle nodeInfo={item}
                                    onChange={ (val) => {item.logic = val;}}/>} >
                            {loop(item.conditions)}
                        </NCTreeNode>; 
                }else if(item.conditions.length == 1){
                    return <NCTreeNode titleClass={"refernode"} key={item.extraParaVO.nodeTitleId} 
                                title={<RenderTreeNodeTitle
                                            nodeInfo={item.conditions[0]}
                                            languageMetaArr = {languageMetaArr}  
                                            onInputChange={this.hanleInputChange.bind(this)}
                                            onDelNode={this.delNodeInfo.bind(this, item.extraParaVO.nodeTitleId)}/>} >
                        </NCTreeNode>; 
                }else if(item.conditions.length > 1){
                    return <NCTreeNode titleClass={"refernode"} key={item.extraParaVO.nodeTitleId} 
                                title={<RenderTreeNodeTitle 
                                            nodeInfo={item} 
                                            languageMetaArr = {languageMetaArr} 
                                            onInputChange={this.hanleInputChange.bind(this)}
                                            onDelNode={this.delNodeInfo.bind(this, item.extraParaVO.nodeTitleId)}/>} >
                                {loop(item.conditions)}
                            </NCTreeNode>; 
                }
            }else {
                return <NCTreeNode key={item.extraParaVO.nodeTitleId} 
                            title={<RenderTreeNodeTitle 
                                        nodeInfo={item}
                                        languageMetaArr = {languageMetaArr} 
                                        onInputChange={this.hanleInputChange.bind(this)}
                                        onDelNode={this.delNodeInfo.bind(this, item.extraParaVO.nodeTitleId)}/>} >
                        </NCTreeNode>; 
            }
            
        })

        return (
            <div>
                {this.state.treeData.length > 0 && this.state.treeData[0].conditions.length != 0 ? <NCTree className="myCls" showLine draggable
                        defaultExpandedKeys={this.state.expandKeys}
                        onDrop={this.dropTreeNode.bind(this)}
                    >
                        {loop(treeSource)}
                </NCTree> : <div></div>}
                <div className="rule-tree-btn-group">
                    <NCButton className="pull-right" onClick={this.cancelInfo.bind(this)}>{this.state.json["1880000025-000002"]}</NCButton>
                    <NCButton className="pull-right" colors="primary" onClick={this.ensureInfo.bind(this)}>{this.state.json["1880000025-000003"]}</NCButton>
                </div>
            </div>
        )
    }
}

RuleTree = createPage({
    // initTemplate: initTemplate,
})(RuleTree);

export default RuleTree;