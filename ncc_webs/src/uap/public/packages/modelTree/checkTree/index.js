import React, {Component} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import Utils from '../../../utils';
import "./../index.less";
const { NCRow, NCCol } = base;

let data =[
    {
        "refcode": "040001",
        "refname": "中国建设银行上海支行",
        "refpk": "1001A110000000001UPa",
        "values": {},
    },
    {
        "pid": "1001A110000000001UPa", //父元素pk
        "refcode": "040001",// 编码
        "refname": "中国建设银行上海某某地支行",//名称
        "refpk": "1001A110000000001U12",//主键
        "values": {}//自定义属性
    },
    {
        "refcode": "040001",
        "refname": "中国工商银行天安支行",
        "refpk": "1001A110000123144",
        "values": {}
    },
    {
        "refcode": "040001",
        "refname": "中国农业银行天安支行",
        "refpk": "1001A110000022323",
        "values": {}
    },
    {
        "pid": "1001A1100000000023232",
        "refcode": "040001",
        "refname": "中国招商银行广州天河路支行",
        "refpk": "1001A1100000000566",
        "values": {}
    },
    {
        "pid": "1001A110000000001Uvv",
        "refcode": "040001",
        "refname": "中国招商银行广州支行",
        "refpk": "1001A1100000000023232",
        "values": {},

    },
    {
        "refcode": "040001",
        "refname": "中国招商银行天安支行",
        "refpk": "1001A110000000001Uvv",
        "values": {},
    },
];


class CheckTree extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.props.syncTree.setSyncTreeData('checkTree',  data)
    }

    onSelectEve(...info) {//选中节点信息
        console.log('info', info);
    }

    onCheckEve(...info) {
        console.log('info', info);
    }

    render() {
        const {table, button, search, form, editTable, syncTree, modal } = this.props;
        let {createSyncTree} = syncTree;

        return (
            <div>
                  { createSyncTree({
                        treeId:'checkTree', // 组件id
                        needSearch:false, //是否需要查询框，默认为true,显示。false: 不显示
                        needEdit:false,  //是否需要编辑节点功能，默认为true,可编辑；false：不可编辑
                        checkable: true,
                        onCheckEve: this.onCheckEve.bind(this),//点击复选框事件
                        // onSelectedChange:this.onSelectChange.bind(this)  //监听选择节点改变事件
                        // userDefine:this.defineEve.bind(this) // 业务组自定义dom事件,布局放在树最上面
                          //onTreeStatusChange:this.treeStatusChange.bind(this),  //树 编辑态改变监听事件
                          //  showLine :false,  //是否显示连线，默认不显示
                        // openIcon:this.openIcon,  // 展开状态图标替换 ( 业务组自定义展开和关闭图标时，需要根据全局变量NODE_ENV，填加field = 'tree-switcher' ,fieldname='树开关' ，用于自动化测试)
                    })}

            </div>
        )
    }
}

export default CheckTree = createPage({
	// initTemplate: initTemplate
})(CheckTree);