import React, {Component} from 'react';
import FinanceOrgTreeRef from '../../refer/org/FinanceOrgTreeRef';
import SaleOrgTreeRef from '../../refer/org/SaleOrgTreeRef';
import CreditCtlRegionGridRef from '../../refer/org/CreditCtlRegionGridRef';
import BusinessUnitTreeRef from '../../refer/org/BusinessUnitTreeRef';
import {base, ajax, getBusinessInfo} from 'nc-lightapp-front';

const {NCTable, NCButton, NCCol, NCRow} = base;
let businessInfo = getBusinessInfo();

/**
 * author zhenmx
 * 客户批改，向导批改,银行账户使用权授权，子户使用权授权 组织选择组件
 */
class OrgtypeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: {
                main: this,
                rowKey: 'id',
                columns: [{
                    title: this.props.json['OrgtypeSelector-001'],
                    dataIndex: 'code',
                    width: '40%'
                }, {
                    title: this.props.json['OrgtypeSelector-002'],
                    dataIndex: 'name',
                    width: '40%'
                }, {
                    title: this.props.json['OrgtypeSelector-003'],
                    dataIndex: 'doit',
                    width: '20%'
                }]
            },
            selectData: {
                datas: []
            },
            currentOrgType: 'baseinfo',
            checkedOrg: []

        };
    }

    reset(orgTypeId) {
        if (!!orgTypeId) {
            this.state.currentOrgType = orgTypeId;
        }
        this.setState(this.state);
    }
    //清空 参照所选记录 和表格数据
    cleanTableData() {
        this.setState({
            selectData: {
                datas: []
            },
            checkedOrg: []
        });
    }

    onChange = (value) => {
        this.state.checkedOrg = value;
        this.state.selectData.datas = [];
        value.length > 0 && value.map((m) => {
            let data = {
                id: m.refpk,
                code: m.refcode,
                name: m.refname
            }
            this.state.selectData.datas.push(data);
        });
        this.setState(this.state,()=>{
            this.props.AttrRefonChange && this.props.AttrRefonChange([]);
        });
    }

    renderRef = () => {
        let {currentOrgType} = this.state;
        let {table} = this.state;
        let {datas} = this.state.selectData;
        let {NODE_TYPE} = this.props.config;
        let {oprFlag} = this.props;
        return (
            <div>
                    <div>
                        <div style={{width: '400px',margin:'10px 0'}}>
                                <span style={{display:'inline-block',width:70,marginRight:10}}>
                                    {currentOrgType === 'sale_info' ?
                                            this.props.json['OrgtypeSelector-004'] : currentOrgType === 'credit_info' ?
                                            this.props.json['OrgtypeSelector-005'] : currentOrgType === 'finance_info' ?
                                            this.props.json['OrgtypeSelector-006'] : this.props.json['OrgtypeSelector-007']}</span>
                                <div style={{display:'inline-block',width:240,verticalAlign:'middle'}}>
                                {currentOrgType === 'sale_info' ? SaleOrgTreeRef({
                                    value: this.state.checkedOrg,
                                    isMultiSelectedEnabled: true,
                                    onChange: this.onChange.bind(this),
                                    queryCondition: () => {
                                        return {
                                            //AppCode: this.props.config.appcode,
                                            //TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                                            TreeRefActionExt: 'nccloud.web.uapbd.rateschema.action.PrimaryOrgSQLBuilderData'
                                        }
                                    }
                                }) : currentOrgType === 'credit_info' ? CreditCtlRegionGridRef({
                                    value: this.state.checkedOrg,
                                    isMultiSelectedEnabled: true,
                                    onChange: this.onChange.bind(this),
                                    queryCondition: () => {
                                        return {
                                            //AppCode: this.props.config.appcode,
                                            // TreeRefActionExt: 'nccloud.web.uapbd.rateschema.action.PrimaryOrgSQLBuilderData'
                                            GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                                        }
                                    }

                                }) : currentOrgType === 'finance_info' ? FinanceOrgTreeRef({
                                    value: this.state.checkedOrg,
                                    isMultiSelectedEnabled: true,
                                    onChange: this.onChange.bind(this),
                                    isShowUnit: this.props.config.appcode === '10140BACCG' || this.props.config.appcode === '10140BACCO' ? true : false,
                                    defaultUnitValue: {
                                        refname: businessInfo.groupName,
                                        refpk: businessInfo.groupId
                                    },
                                }) : currentOrgType === 'baseinfo' && NODE_TYPE === 'ORG_NODE' && oprFlag === 'stepEdit' ? BusinessUnitTreeRef({
                                    value: this.state.checkedOrg,
                                    isMultiSelectedEnabled: true,
                                    onChange: this.onChange.bind(this),
                                    queryCondition: () => {
                                        return {
                                            // AppCode: this.props.config.appcode,
                                            // TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                                            TreeRefActionExt: 'nccloud.web.uapbd.rateschema.action.PrimaryOrgSQLBuilderData'
                                        }
                                    }
                                }) : ''}
                            </div>
                        </div>
                    </div>
                <NCRow md={12} xs={12} sm={12}>
                    <NCCol md={12} xs={12} sm={12}>
                        <NCTable {...table} data={datas} {...{
                            bodyStyle: {'overflow-y': 'auto', height: '180px'},
                            useFixedHeader: true
                        }}>
                        </NCTable>
                    </NCCol>
                </NCRow>
            </div>

        );
    }

    getData() {
        return this.state.selectData.datas.map(n => n.id);
    }
    render() {

        return (
            <div>
                {this.renderRef()}
            </div>
        )
    }
}
export default OrgtypeSelector;