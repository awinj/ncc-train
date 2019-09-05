import React, {Component} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import Utils from '../../utils';
import "./index.less";
import RenderConditionTitle from './renderConditionTitle/index';
const { NCButton, NCRow, NCCol, NCTree, NCPopconfirm } = base;

const NCTreeNode = NCTree.NCTreeNode;

let transKey = 'parent';
let parentKeyNum = 1;

// 生成节点条件的汉字名称
const conditionArr = [{display: '或者', value: 'or'}];
function generateZhCondition(logic) {
    let msg = '并且';
    conditionArr.map( (item) => {
        if(logic == item.value) {msg = item.display;}
    })
    return msg;
}

//生成oprtype对应的汉字名称
const displayArr = [{display: '大于', value: '>'},{display: '小于', value: '<'},{display: '介于', value: '><'},
        {display: '不等于', value: '!='},{display: '大于等于', value: '>='},{display: '小于等于', value: '<='}];
function generateDisplayZh(oprtype) {
    let msg = '等于';
    displayArr.map( (item) => {
        if(oprtype == item.value) {msg = item.display;} 
    })
    return msg;
}

class RulesTree extends Component{
    constructor(props) {
        super(props);
        this.state= {
            dropPaKey: '',
            dragPaKey: '',
            treeData: [
                {
                    logic: 'and',
                    extraParaVO: {
                        isChoose: false,
                        paRefpk: `${transKey}${parentKeyNum}`,
                    },
                    conditions: []
                }
            ],
            originalTreeData: [
                {
                    logic: 'and',
                    extraParaVO: {
                        isChoose: false,
                        paRefpk: `${transKey}${parentKeyNum}`,
                    },
                    conditions: []
                }
            ],
            expandKeys: ['parent1?key=2?parent1']
        }
    }

    componentDidMount() {
        const treeInitData = (this.props.roleTreeJson && !Utils.isEmptyObj(this.props.roleTreeJson.querycondition)) ? {...this.props.roleTreeJson.querycondition} : {}
        if(!Utils.isEmptyObj(treeInitData)) {
            this.setState({
                treeData: [{...treeInitData}]
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!Utils.isEmptyObj(nextProps.transTreeNodeInfo) && nextProps.transTreeNodeInfo.nodeTitleId != this.props.transTreeNodeInfo.nodeTitleId) {
            const originalTreeData = [...this.state.treeData];
            if(originalTreeData[0].conditions.length >= 1) {
                originalTreeData[0].extraParaVO.isChoose = true;
            }
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
                    nodeTitleId: nextProps.transTreeNodeInfo.nodeTitleId
                },
                oprtype: nextProps.transTreeNodeInfo.oprtype || '=',
                display: '',
                field: nextProps.transTreeNodeInfo.field,
                value: {
                    firstvalue: '',
                    secondvalue: ''
                }
            }
            originalTreeData[0].conditions.push(transmitObj);
            console.log('transmitObj', transmitObj)
            this.setState({
                treeData: originalTreeData,
            }, () => {
                this.render();
            })
        }
    }

    loop(data, key, callback) {//tree数组递归
        !!data && data.forEach( (item, index, arr) => {
            let transKey = !!key && key.includes('?') ? key.split('?')[0] : key;
            if(item.extraParaVO.refpk == transKey) {
                return callback(item, index, arr)
            }else {
                return this.loop(item.conditions, key, callback)
            }
        })
    }

    parLoop(data, key, callback) {//父节点拖拽数组遍历
        !!data && data.forEach( (item, index, arr) => {
            let transKey = !!key && key.includes('?') ? key.split('?')[0] : key;
            // debugger
            if(item.extraParaVO.paRefpk == transKey) {
                return callback(item, index, arr)
            }else {
                return this.parLoop(item.conditions, key, callback)
            }
            
        })
    }

    dropTreeNode(info) {//拖拽节点放下
        const dragKey = info.dragNode.props.eventKey; //被拖拽节点
        const dropKey = info.node.props.eventKey; //目标节点
        let data = [...this.state.treeData];
        let dragObj;
        let dropObj;
        const canDrag = this.getParentKey(dragKey, dropKey);
        if(!canDrag) return ;
        debugger

        if(dropKey && dropKey.startsWith('parent')) {
            this.parLoop( data, dropKey, (item, index, arr) => {
                dropObj = item;
            })
        }else {
            this.loop( data, dropKey, (item, index, arr) => {
                dropObj = item;
            })
        }
        if(dragKey && dragKey.startsWith('parent')) {
            this.parLoop( data, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
            })
        }else {
            let needRemovePa = false;
            this.loop( data, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
                needRemovePa = !arr.length;
            })
            if(needRemovePa) {//如果当前节点信息为空，删除父节点
                this.removePaNode(dragKey)
            }
        }

        if(dragObj.extraParaVO.refpk && dropObj.extraParaVO.refpk && !dropObj.extraParaVO.isChoose) {
            this.dragPeerChild(dragObj, dropObj, dropKey);
        }else if(dropObj.extraParaVO.isChoose && !dragObj.extraParaVO.isChoose) {
            debugger
            this.dragConditionChild(dragObj, dropObj, dropKey);
        }else if(dragObj.extraParaVO.isChoose) {
            this.dragConditionToAll(dragObj, dropObj, dropKey);
        }

        console.log(this.state.treeData)
    }

    getParentKey(dragKey, dropKey) {//获取父节点key值,并判断拖拽限制
        //同一父节点下只有两个子节点且子节点互相拖拽，不可拖拽
        let data = [...this.state.treeData];
        let dragParentKey = dragKey.split('?')[2];
        let dropParentKey = dropKey.split('?')[2];
        let childLength;
        if(dragParentKey == dropParentKey) {
            this.parLoop(data, dragParentKey, (item) => {
                childLength = item.conditions.length;
            })
        }
        if(childLength == 2) {
            return false;
        }
        return true;
    }

    removePaNode(key) {//移除父节点
        const data = [...this.state.treeData];
        const parKey = key.split('?')[2];
        const loop = (data, key, callback) => {
            data && data.forEach( (item, index, arr) => {
                if(item.extraParaVO.paRefpk == parKey) {
                    return callback(item, index, arr)
                }else {
                    return loop(item.conditions, key, callback)
                }
            })
        }
        // 删除空的父节点
        let isFirstDel = true;
        loop(data, key, (item, index, arr) => {
            isFirstDel && arr.splice(index, 1);
            isFirstDel = false;
        })
    }

    dragPeerChild(dragObj, dropObj, dropKey) {//拖拽至子节点下，两个子节点上方生成选择
        // dragObj 被推拽对象 dropObj 拖拽目标对象
        let data = [...this.state.treeData];
        
        parentKeyNum += 1;
        this.loop(data, dropKey, (item, index, arr) => {
            console.log('arr', arr);
            arr.push({
                logic: 'and',
                extraParaVO: {
                    isChoose: true,
                    paRefpk: `${transKey}${parentKeyNum}`,
                },
                conditions: [dropObj, dragObj]
            }) 
        })

        // 删除目标节点
        let isFirstDel = true;
        this.loop(data, dropKey, (item, index, arr) => {
            isFirstDel && arr.splice(index, 1);
            isFirstDel = false;
        })
        
        this.setState({
            treeData: data
        })
    }

    dragConditionChild(dragObj, dropObj, dropKey) {//拖拽至选择节点下方，直接放在选择节点children尾部
        let data = [...this.state.treeData];
        this.parLoop(data, dropKey, (item, index, arr) => {
            item && item.conditions.push(dragObj)
        })
        
        this.setState({
            treeData: data
        })
    }

    dragConditionToPeer(dragObj, dropObj, dropKey) {//根节点拖拽至普通对象节点
        this.dragPeerChild(dragObj, dropObj, dropKey)
    }

    dragConditionToCondition(dragObj, dropObj) {//判断根节点拖拽至拖拽根节点
        this.parLoop(data, dropKey, (item, index, arr) => {
            console.log('item', item);
        })
    }

    dragConditionToAll(dragObj, dropObj, dropKey) {//拖拽选择节点,复制原节点及子节点
        if(!dropObj.extraParaVO.isChoose) {
            this.dragConditionToPeer(dragObj, dropObj, dropKey);
        }else {
            this.dragConditionChild(dragObj, dropObj, dropKey);
        }
    }

    dragNodeEnter(info) {//拖拽节点进入
        
    }

    delNodeInfo(refpk) {//点击删除， 删除当前节点信息
        debugger
        const data = [...this.state.treeData];
        let needRemovePa = false;
        const delNodeLoop = (data, key, callback) => {
            data && data.map( (item, index, arr) => {
                if(item.extraParaVO.nodeTitleId == key) {
                    return callback(item, index, arr);
                }else {
                    return delNodeLoop(item.conditions, key, callback)
                }
            })
        }
        delNodeLoop(data, refpk, (item, index, arr) => {
            arr.splice(index, 1);
            needRemovePa = !arr.length;
            return;
        })
        // this.loop(data, refpk, (item, index, arr) => {
        //     arr.splice(index, 1);
        //     needRemovePa = !arr.length;
        //     return;
        // })
        this.setState({
            transData: data
        })
        if(needRemovePa) {
            this.removePaNode(refpk); 
        }
    }

    hanleInputChange(refpk, value) {//修改表单 title input值
        const data = [...this.state.treeData];
        this.loop(data, refpk, (item, index, arr) => {
            item.extraParaVO.refcode = value;
        })
        this.setState({
            treeData: data
        })
    }

    cancelInfo(e) {//取消tree数据保存
        const originalTreeData = [...this.state.originalTreeData];
        this.setState({
            transData: originalTreeData
        });
        this.props.onCancelInfo(e);
    }

    ensureInfo(e) {//确定保存tree数据
        console.log('treeDataC', JSON.stringify(this.state.treeData));
        const convertionData = this.convertTreeData();
        if(!convertionData) return ;
        this.props.onEnsureInfo(convertionData,e);
    }

    validateSubmitInfo() {//提交之前数据非空校验
       const data = [...this.state.treeData];
        let hasEmptyVal = false;
        const emptyLoop = (data, callback) => {
            data && data.map( (item, index, arr) => {
                if(item.hasOwnProperty('conditions') && !Utils.isEmptyArr(item.conditions)) {
                    emptyLoop(item.conditions, callback);
                }else if(!item.value || !item.value.firstvalue){
                    callback();
                }
            })
        }
        !hasEmptyVal && emptyLoop(data, () => {
            toast({content:"规则设置存在错误条目或空值条目，请检查修改",color:"warning"});
            hasEmptyVal = true;
        })
        return hasEmptyVal;
    }

    convertTreeData() {//过滤传向后台数据，生成display字符串
        const data = [...this.state.treeData];
        let transData = {display: '', value: ''};
        let transDisplay = '';
        
        const validateStatus = this.validateSubmitInfo();
        if(validateStatus) return false;

        transData.value = {querytype: 'tree',querycondition: data[0]};
        let transLogic = 'and';

        const displayLoop = (data, callback) => {
            data && data.map( (item, index, arr) => {
                if(item.hasOwnProperty('conditions') && item.conditions.length >= 1) {
                    transLogic = item.logic;
                    transDisplay += '(';
                    displayLoop(item.conditions, callback)
                    transDisplay += ')';
                }else{
                    if(item.value.firstvalue) {
                        if(item.value.secondvalue) {
                            transDisplay += `${item.extraParaVO.refname} 介于 ${item.value.firstvalue} ~ ${item.value.secondvalue} ${index < arr.length-1 ? generateZhCondition(transLogic)+' ' : ''}`
                        }else {
                            transDisplay += `${item.extraParaVO.refname} ${generateDisplayZh(item.oprtype)} ${item.display} ${index < arr.length-1 ? generateZhCondition(transLogic)+' ' : ''}`
                        }
                    };
                }
            })
        }
        if(!Utils.isEmptyArr(data[0].conditions)) displayLoop(data);
        
        transData.display = transDisplay;
        
        return transData;
    }

    render() {
        const treeSource = [...this.state.treeData];
        const {RenderTreeNodeTitle} = this.props;

        let iKey=1;
        let transRefpk;
        const loop = (data) => data.map( (item, index) => {
            iKey += 1;
            // transRefpk = item.paRefpk ? `parent${parseInt(item.paRefpk.replace(/[^0-9]/ig,""))+1}` : transRefpk;
            transRefpk = item.extraParaVO.paRefpk ? item.extraParaVO.paRefpk : transRefpk;
            if(!!item.conditions && !Utils.isEmptyArr(item.conditions)) {
                if(item.extraParaVO.isChoose) {
                    return <NCTreeNode titleClass={"refernode"} key={`${item.extraParaVO.paRefpk}?key=${iKey}?${transRefpk}`} title={<RenderConditionTitle nodeInfo={item}
                        onChange={ (val) => {item.logic = val;}}/>} >
                            {loop(item.conditions)}
                        </NCTreeNode>; 
                }else if(item.conditions.length == 1){
                    return <NCTreeNode titleClass={"refernode"} key={`${item.conditions[0].extraParaVO.refpk}?key=${iKey}?${transRefpk}`} title={<RenderTreeNodeTitle
                                 nodeInfo={item.conditions[0]} onInputChange={this.hanleInputChange.bind(this)}
                                 onDelNode={this.delNodeInfo.bind(this,item.extraParaVO.nodeTitleId)}/>} >
                        </NCTreeNode>; 
                }else if(item.conditions.length > 1){
                    return <NCTreeNode titleClass={"refernode"} key={`${item.extraParaVO.refpk}?key=${iKey}?${transRefpk}`} title={<RenderTreeNodeTitle 
                                nodeInfo={item} onInputChange={this.hanleInputChange.bind(this)}
                                onDelNode={this.delNodeInfo.bind(this,item.extraParaVO.nodeTitleId)}/>} >
                                {loop(item.conditions)}
                            </NCTreeNode>; 
                }
            }else {
                return <NCTreeNode key={`${item.extraParaVO.refpk}?key=${iKey}?${transRefpk}`} title={<RenderTreeNodeTitle 
                                nodeInfo={item} onInputChange={this.hanleInputChange.bind(this)}
                                onDelNode={this.delNodeInfo.bind(this,item.extraParaVO.nodeTitleId)}/>} >
                        </NCTreeNode>; 
            }
            
        })

        return (
            <div>
                <div className="clear-contain">
                   {/* <NCButton size="sm" color="primary" style={{float:"right"}}
                        // onClick="onEmptyInputChange"
                    >清空</NCButton>  */}
                </div>
                {this.state.treeData[0].conditions .length != 0 ? <NCTree className="myCls" showLine draggable
                        defaultExpandedKeys={this.state.expandKeys}
                        onSelect={this.onSelect} onCheck={this.onCheck}
                        onDrop={this.dropTreeNode.bind(this)}
                        onDragEnter={this.dragNodeEnter.bind(this)}
                    >
                        {loop(treeSource)}
                </NCTree> : <div></div>}
                <div className="rule-tree-btn-group">
                    <NCButton className="pull-right" onClick={this.cancelInfo.bind(this)}>取消</NCButton>
                    <NCButton className="pull-right" colors="primary" onClick={this.ensureInfo.bind(this)}>确定</NCButton>
                </div>
            </div>
        )
    }
}

RulesTree = createPage({
    // initTemplate: initTemplate,
})(RulesTree);

export default RulesTree;