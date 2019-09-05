import React, {Component} from 'react';
import {base,getBusinessInfo} from 'nc-lightapp-front';
const {NCSelect} = base;
const {NCOption} = NCSelect;
import OrgtypeSelector from './OrgtypeSelector';
import BatchEditAttrRefer from './batchEditRefer/BatchEditAttrRefer/index';

/**
 * author zhenmx
 * 客户批改，向导批改 属性选择组件
 */
class AttrSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabVal: {
                refcode:'baseinfo'
            },
            mdid: 'e4f48eaf-5567-4383-a370-a59cb3e8a451',
            propVal: [],
            refpk: '',
            tabArr: [
                {
                refcode: 'sale_info'
                },
                {
                    refcode: 'finance_info'
                },
                {
                    refcode: 'credit_info'
                },
                {
                    refcode: 'baseinfo'
                }],
            batchFormId: 'custBatchEditForm',
            selectedAttrs: [],
            attr_valueMap: {},
            tabs: props.tabs,
            singleOrgFlag:0,
        }

    }
    componentDidMount() {
        let meta = this.props.meta.getMeta();
        let custclassitem,currentOrg;
        //如果是列表界面 需要靠选中的数据来判断是否是singleorg
        if(this.props.config.pageFlag === 'list'){
            if(this.props.oprFlag === 'directEdit'){
                let checkedRows = this.props.table.getCheckedRows(this.props.config.gridId);
                let pkset = new Set();
                checkedRows.length>0 && checkedRows.map((row)=>{
                    pkset.add(row.data.values.pk_org.value)
                });
                if(pkset.size === 1){
                    currentOrg = Array.from(pkset)[0];
                    this.state.singleOrgFlag = 1;
                }
            }
            //如果是卡片界面
        }else{
            if(this.props.oprFlag === 'directEdit'){
                currentOrg = this.props.form.getFormItemsValue(this.props.config.formId,'pk_org').value;
            }
        }
        if(this.props.config.NODE_TYPE === 'GLOBE_NODE'){
             custclassitem =
                meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'pk_custclass');
            if(!!custclassitem){
                custclassitem.queryCondition = ()=>{
                    return{
                     pk_org:'GLOBLE00000000000000'
                    }
                }
            }
        }else if(this.props.config.NODE_TYPE === 'ORG_NODE'){
             custclassitem =
                meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'pk_custclass');
            if(!!custclassitem){
                custclassitem.queryCondition = ()=>{
                    return{
                        pk_org:currentOrg
                    }
                }
            }
        }else{

        }
        //财务信息专管业务员参照
        let resppersonitem =
            meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'pk_resppsn1');
        if (!!resppersonitem) {
            resppersonitem.queryCondition = () => {
                return {
                    //busifuncode: 'sa',
                    pk_org: this.orgSelect.state.selectData.datas[0]['id']
                }
            }
        }
        //财务信息专管部门参照
        let respdeptitem =
            meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'pk_respdept1');
        if (!!respdeptitem) {
            respdeptitem.queryCondition = () => {
                return {
                    pk_org: this.orgSelect.state.selectData.datas[0]['id'],
                    pk_group:getBusinessInfo().groupId,
                    TreeRefActionExt: 'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder',
                }
            }
        }
        //销售信息专管业务员参照
        let saleresppersonitem =
            meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'respperson');
        if (!!saleresppersonitem) {
            saleresppersonitem.queryCondition = () => {
                return {
                    busifuncode: 'sa',
                    pk_org: this.orgSelect.state.selectData.datas[0]['id']
                }
            }
        }
        //销售信息专管部门参照
        let salerespdeptitem =
            meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'respdept');
        if (!!salerespdeptitem) {
            salerespdeptitem.queryCondition = () => {
                return {
                    pk_org: this.orgSelect.state.selectData.datas[0]['id'],
                    pk_group: getBusinessInfo().groupId,
                    TreeRefActionExt: 'nccloud.web.uapbd.supplier.suprefcondition.action.RespDeptNCTreeRefSqlBuilder',
                }
            }
        }
        //财务信息收款协议参照
        let financeincomeGridItem =
            meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'pk_payterm');
        if (!!financeincomeGridItem) {
            financeincomeGridItem.queryCondition = () => {
                return {
                    pk_org: this.orgSelect.state.selectData.datas[0]['id'],
                }
            }
        }
        //销售信息交易类型参照
        let ordertypedefaultitems =
            meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'ordertypedefault');
        if (!!ordertypedefaultitems) {
            ordertypedefaultitems.queryCondition = () => {
                return {
                    GridRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.TransactionTypeExtendsRef',
                }
            }
        }
        //付款客户，开票客户，收货客户 添加参照过滤条件
        meta[this.state.batchFormId]['items'].map((obj) => {
            if (obj.attrcode === 'billingcust' || obj.attrcode === 'issuecust' || obj.attrcode === 'pk_paycust') {
                obj.queryCondition = () => {
                    return {
                        pk_org: this.orgSelect.state.selectData.datas[0]['id'],
                    }
                }
            }
        })
        //销售信息收款协议参照
       let  saleincomeGridItem =
            meta[this.state.batchFormId]['items'].find(item => item['attrcode'] === 'paytermdefault');
        if (!!saleincomeGridItem) {
            saleincomeGridItem.queryCondition = () => {
                return {
                    pk_org: this.orgSelect.state.selectData.datas[0]['id'],
                }
            }
        }
        this.setState(this.state,()=>{
            this.props.meta.setMeta(meta,this.resetFormItem.bind(this));
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.tabs.length > 0) {
            this.state.tabs = nextProps.tabs;
            this.setState(this.state);
        }
    }

    resetFormItem = () => {
        let {batchFormId} = this.state;
        let meta = this.props.meta.getMeta();
        meta[batchFormId]['items'].map((i) => {
            i.visible = false;
        });
        this.props.meta.setMeta(meta);
    }
    TabRefonChange = (value) => {
        this.resetFormItem();
        //页签切换清空 参照所选记录 和表格数据
        this.orgSelect.cleanTableData();
        this.state.tabVal = Object.keys(value).length === 0 ? '' : value;
        this.state.propVal = [];
        this.state.selectedAttrs = [];
        this.state.attr_valueMap = {};
        this.state.refpk = value.refpk
        this.setState(this.state, () => {
            value.refcode === this.state.tabArr[3].refcode && this.props.config.NODE_TYPE !== 'ORG_NODE'
            || this.orgSelect.reset(value.refcode);
        });
    };
    AttrRefonChange = (val) => {
        let me = this;
        let {batchFormId} = this.state;
        this.state.propVal = val;
        this.state.attr_valueMap = {};
        this.state.selectedAttrs = val.map(v => {
            return v.refcode
        });
        ;
        this.props.form.setFormStatus(batchFormId, 'edit');
        let meta = this.props.meta.getMeta();
        meta[batchFormId]['items'].map((item) => {
            if (this.state.selectedAttrs.includes(item.attrcode)) {
                item.visible = true;
            } else {
                item.visible = false;
            }
        });
        this.props.meta.setMeta(meta, () => {
            this.setState(me.state, () => {
            })
        });
    }
    onFormAfterEdit = (props, moduleId, key, value) => {
        this.state.attr_valueMap[key] = value.value;
        this.setState(this.state);
    }
    onBeforeEvent = (props, moduleId, key, value,data) => {
        let meta = props.meta.getMeta();
        let currentOrg;
        if(props.config.pageFlag === 'list'){
            if(this.props.oprFlag === 'directEdit'){
                let checkedRows = this.props.table.getCheckedRows(props.config.gridId);
                let pkset = new Set();
                checkedRows.length>0 && checkedRows.map((row)=>{
                    pkset.add(row.data.values.pk_org.value)
                });
                currentOrg = Array.from(pkset)[0];
            }else{
                if(this.props.config.NODE_TYPE === 'ORG_NODE'){
                    currentOrg = this.orgSelect.state.checkedOrg[0].refpk;
                }
            }
            //如果是卡片界面
        }else{
            if(this.props.oprFlag === 'directEdit'){
                currentOrg = this.props.form.getFormItemsValue(this.props.config.formId,'pk_org').value;
            }else{
                if(this.props.config.NODE_TYPE === 'ORG_NODE'){
                    currentOrg = this.orgSelect.state.checkedOrg[0].refpk;
                }
            }
        }
        //批改 客户基本分类参照过滤
        let pk_custclassitem =   meta[moduleId]['items'].find((item)=> item.attrcode === 'pk_custclass');
        pk_custclassitem.queryCondition = ()=>{
            return{
                pk_org :props.config.NODE_TYPE === 'GLOBE_NODE'?'GLOBLE00000000000000':props.config.NODE_TYPE === 'ORG_NODE'?currentOrg:'',
            }
        }
        //批改 上级客户参照过滤
        let pk_custmainitem = meta[moduleId]['items'].find((item)=> item.attrcode === 'pk_customer_main');
        pk_custmainitem.queryCondition = ()=>{
            return{
                pk_org:props.config.NODE_TYPE === 'GLOBE_NODE'?'GLOBLE00000000000000':props.config.NODE_TYPE === 'ORG_NODE'?currentOrg:''
            }
        }
        props.meta.setMeta(meta);
        return true;
    }
    renderBatchEditForm = () => {
        let {form} = this.props;
        let {createForm} = form;
        let {batchFormId} = this.state;
        return (
            <div>{createForm(batchFormId, {
                onAfterEvent: this.onFormAfterEdit.bind(this),
                onBeforeEvent:this.onBeforeEvent.bind(this)
            })}</div>
        );
    }
    onSupBatchUpdateTabsChanged = (value) => {
        this.resetFormItem();
        //页签切换清空 参照所选记录 和表格数据
        this.orgSelect.cleanTableData();
        this.setState({
            tabVal: Object.keys(value).length === 0 ? '' : value,
            propVal: [],
            selectedAttrs: [],
            attr_valueMap: {},
            refpk: value.refpk
        }, () => {
            value.refcode === this.state.tabArr[3].refcode && this.props.config.NODE_TYPE !== 'ORG_NODE'
            || this.orgSelect.reset(value.refcode);
        });
    }
    render() {
        return (
            <div>
                <div style={{display: 'inline-block'}}>
                    <div style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        width: '70px',
                        marginRight: 10
                    }}>{this.props.json['batchedit-000002']}:
                    </div>
                    <div style={{display: 'inline-block', width: 240, verticalAlign: 'middle'}}>
                        <NCSelect defaultValue={this.state.tabs.length !== 0 && this.state.tabs[0].refname}
                                  onChange={this.TabRefonChange.bind(this)}>
                            {this.state.tabs.map(tab => {
                                return <NCOption value={tab}>{tab.refname}</NCOption>
                            })}
                        </NCSelect>
                    </div>
                </div>
                <div style={{display: 'inline-block'}}>
                    <h1 style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        width: '70px',
                        marginLeft: '20px'
                    }}>{this.props.json['batchedit-000000']}:</h1>
                    <div style={{display: 'inline-block', width: 240, verticalAlign: 'middle'}}>
                        {BatchEditAttrRefer({
                            value: this.state.propVal,
                            onChange: this.AttrRefonChange.bind(this),
                            queryCondition: function () {
                                return {
                                    //选择组织的个数不通查到的批改属性不一样，或者列表选择行数的所属组织的个数
                                    NODE_TYPE: this.props.config.NODE_TYPE,
                                    checkedOrgLenth:
                                        this.state.tabVal.refcode !=='baseinfo' ?
                                            this.orgSelect.state.checkedOrg.length :
                                            this.props.config.NODE_TYPE === 'ORG_NODE' && this.props.oprFlag === 'directEdit' && this.props.config.pageFlag === 'list'?
                                                this.state.singleOrgFlag:
                                                this.props.config.NODE_TYPE === 'ORG_NODE' && this.props.oprFlag === 'stepEdit' ?
                                                    this.orgSelect.state.checkedOrg.length:'1',
                                    pk_batchupdatetab: this.state.refpk || this.state.tabs[0].refpk,
                                    oprFlag: this.props.oprFlag
                                }
                            }.bind(this),
                            json: this.props.json
                        })}
                    </div>
                </div>
                <div style={{
                    display:
                        !!!this.state.tabVal ||
                        this.props.config.NODE_TYPE !== 'ORG_NODE' &&
                        this.state.tabVal.refcode === this.state.tabArr[3].refcode ||
                        this.props.config.NODE_TYPE === 'ORG_NODE' &&
                        this.props.oprFlag === 'directEdit' &&
                        this.state.tabVal.refcode === this.state.tabArr[3].refcode ?
                            'none' : ''
                }}>
                    <OrgtypeSelector
                        ref={(item) => this.orgSelect = item} {...this.props} {...{
                        AttrRefonChange:this.AttrRefonChange.bind(this),
                        json:this.props.json
                    }}/>
                </div>

                {this.renderBatchEditForm()}
            </div>
        )
    }

}

export default AttrSelect