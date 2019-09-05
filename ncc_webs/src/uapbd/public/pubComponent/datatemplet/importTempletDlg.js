import React, {Component} from 'react';
import {base, ajax, toast,cardCache} from 'nc-lightapp-front';
const {setDefData, getDefData} = cardCache;

const {NCButton, NCModal, NCTable, NCCheckbox, NCRow, NCCol, NCFormControl} = base;
import confirmUtil from '../../../public/pubComponent/confirmUtil/confirmUtil';

/**
 * 数据模板
 * author zhenmx
 *
 */
class ImportTempletDlg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: {
                title: {
                    value: '',
                    display: ''
                },
                show: false,
                modalDropup: true,
                size: 'lg',
                backdrop: true / false //是否弹出遮罩层/点击遮罩层是否触发关闭事件
            },
            table: {
                rowKey: 'pk_datatemplet_id',
                columns: [
                    {
                        title: this.props.json['dataTemplet-000000'],/* 国际化处理： 模板名称*/
                        dataIndex: 'templet_name',
                        key: 'templet_name',
                        width: '30%'
                    },
                    {
                        title: this.props.json['dataTemplet-000001'],/* 国际化处理： 默认模板*/
                        dataIndex: 'isdefault',
                        key: 'isdefault',
                        width: '30%',
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <NCCheckbox colors="info"
                                                onChange={this.onSetDefault.bind(this, record)}
                                                checked={record.isdefault}
                                    />
                                </div>
                            )
                        }
                    },
                    {
                        title: this.props.json['dataTemplet-000002'],/* 国际化处理： 操作*/
                        dataIndex: '',
                        key: 'd',
                        width: '40%',
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <a href='javascript:void(0);' onClick={this.onDeleteTemplet.bind(this, record)}
                                       style={{marginRight: 8}}>{this.props.json['dataTemplet-000015']}</a>{/* 国际化处理： 删除*/}
                                    <a href='javascript:void(0);'
                                       onClick={this.onImportTemplet.bind(this, record)}>{this.props.json['dataTemplet-000016']}</a>{/* 国际化处理： 调用模板*/}
                                </div>
                            );
                        },
                    },]
            },
            showGrid: true,
            checkDefault: false,
            inputValue: '',
            columdata: [],
            //默认模板主子表数据 非常重要
            defaultExtBillcard: {},
            //默认模板行记数据
            defaultDataTemp: {},
            codeIsEdit: ''

        }


    }

    /**
     * 设置默认模板
     * @param record
     * @param value
     */
    onSetDefault = (record, value) => {
        debugger;
        let columnarr = [];
        if (record.isdefault === false) {
            let column = this.state.columdata.find(c => c.isdefault === true);
            if (column) {
                column.isdefault = false;
                columnarr.push(column);
            }
        }
        record.isdefault = value;
        columnarr.push(record);
        ajax({
            url: '/nccloud/uapbd/dataTemplet/setDefaultTemp.do',
            data: {
                pagecode: this.props.config.pagecode,
                pk_curOrg: this.props.config.pk_curOrg,
                nodeType: this.props.config.nodeType,
                templetVOs: columnarr
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        let {extBillcard} = data;
                        if (extBillcard) {
                            this.setState({
                                defaultExtBillcard: extBillcard,
                                defaultDataTemp: record
                            });
                            toast({color: 'success', content: this.props.json['dataTemplet-000003']});/* 国际化处理： 设置默认模板成功！*/
                        } else {
                            toast({color: 'success', content: this.props.json['dataTemplet-000004']});/* 国际化处理： 取消默认模板成功！*/
                        }

                    }
                }
            }
        });
        this.setState(this.state);
    }

    componentDidMount() {
    }

    /**
     * 加载模板列表以及默认模板数据
     * @param callback
     */
    loadTempData = (callback) => {
        ajax({
            url: '/nccloud/uapbd/dataTemplet/queryDataTemp.do',
            data: {
                pagecode: this.props.config.pagecode || this.props.pagecode,
                pk_curOrg: this.props.config.pk_curOrg,
                nodeType: this.props.config.nodeType
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        let {extBillcard, templetVOs} = data;
                        if (extBillcard) {
                            this.state.defaultExtBillcard = extBillcard;
                            extBillcard.userjson && setDefData('PermissionOrgIDs', this.props.config.datasource, extBillcard.userjson);
                        }
                        if (templetVOs) {
                            this.state.columdata = templetVOs;
                            this.state.defaultDataTemp = templetVOs.find(temp => temp.isdefault === true);
                            this.state.inputValue = this.state.defaultDataTemp && this.state.defaultDataTemp.templet_name;
                            this.state.checkDefault = this.state.defaultDataTemp && this.state.defaultDataTemp.isdefault;
                        }

                    }
                    this.state.showGrid = true;
                    this.state.modal.title.display = this.props.json['dataTemplet-000012']/* 国际化处理： 模板*/
                    this.setState(this.state, () => {
                        callback && callback();
                    });
                }
            }
        })
    }
    /**
     * 把默认模板上的值赋到单据上
     * @param callback
     * @returns {Function}
     */
    setDefaultTemp = (callback) => {
        return (param, data) => {
            let appcode = this.props.config.appcode || this.props.appcode
            let {head, bodys} = data || this.state.defaultExtBillcard;
            if (head) {
                this.props.form.setAllFormValue({[this.props.config.formId]: head[this.props.config.formId]});
                this.props.form.setFormItemsDisabled(
                    this.props.config.formId, {
                        'code': head && head.hasOwnProperty('userjson') && head.userjson == 'Y'
                        || this.state.defaultExtBillcard.hasOwnProperty('head')
                        && this.state.defaultExtBillcard.head.hasOwnProperty('userjson')
                        && this.state.defaultExtBillcard.head.userjson == 'Y' ? true: false
                    });
            }
            if (bodys) {
                if (['10140SUB', '10140SUG', '10140SUO'].includes(appcode)) {
                    let {suplinkman, supcountrytaxes} = bodys;
                    if (suplinkman) {
                        this.props.cardTable.setTableData(this.props.config.subGrid2, suplinkman);
                    }else{
                        this.props.cardTable.setTableData(this.props.config.subGrid2, {rows:[]});
                    }
                    if (supcountrytaxes) {
                        this.props.cardTable.setTableData(this.props.config.subGrid3, supcountrytaxes);
                    }else{
                        this.props.cardTable.setTableData(this.props.config.subGrid3, {rows:[]});
                    }
                } else if (['10140CUB', '10140CUG', '10140CUO']) {
                    let {custtaxtypes, custcontacts} = bodys;
                    if (custcontacts) {
                        this.props.cardTable.setTableData(this.props.config.subGrid2, custcontacts);
                    }else{
                        this.props.cardTable.setTableData(this.props.config.subGrid2, {rows:[]});
                    }
                    if (custtaxtypes) {
                        this.props.cardTable.setTableData(this.props.config.subGrid3, custtaxtypes);
                    }else{
                        this.props.cardTable.setTableData(this.props.config.subGrid3, {rows:[]});
                    }
                }
            }
            callback && callback(param);
        }
    }
    /**
     * 删除模板
     * @param record
     */
    onDeleteTemplet = (record) => {
        let _this = this;
        confirmUtil({
            title: this.props.json['dataTemplet-000005'],/* 国际化处理： 删除模板*/
            content: this.props.json['dataTemplet-000006'],/* 国际化处理： 是否确认删除模板？*/
            beSureBtnClick: () => {
                ajax({
                    url: '/nccloud/uapbd/dataTemplet/deleteDataTemp.do',
                    data: record,
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            console.log(data);
                            if (!data) {
                                _this.state.columdata = _this.state.columdata.filter((column) => column.pk_datatemplet_id != record.pk_datatemplet_id);
                                _this.setState(_this.state, () => {
                                    toast({
                                        color: 'success',
                                        content: this.props.json['dataTemplet-000007']/* 国际化处理： 删除模板成功！*/
                                    });
                                });
                            }
                        }
                    }
                });
            },
            leftBtnName: this.props.json['dataTemplet-000008'],/* 国际化处理： 确定*/
            rightBtnName: this.props.json['dataTemplet-000009']/* 国际化处理： 取消*/
        });
    }
    /**
     * 导入模板
     * @param record
     */
    onImportTemplet = (record) => {
        confirmUtil({
            title: this.props.json['dataTemplet-000020'],/* 国际化处理： 导入*/
            content: this.props.json['dataTemplet-000011'],/* 国际化处理： 是否要导入数据模板数据，这样会清空您录入的信息？*/
            beSureBtnClick: () => {
                this.state.inputValue = record.templet_name;
                this.state.checkDefault = record.isdefault;
                ajax({
                    url: '/nccloud/uapbd/dataTemplet/importDataTemp.do',
                    data: {
                        pk_curOrg: this.props.config.pk_curOrg,
                        nodeType: this.props.config.nodeType,
                        templetVO: record,
                        pagecode: this.props.config.pagecode
                    },
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            if (data) {
                                this.setDefaultTemp()(null, data);
                                this.onClose();
                            }
                        }
                    }
                });
            },
            leftBtnName: this.props.json['dataTemplet-000008'],/* 国际化处理： 确定*/
            rightBtnName: this.props.json['dataTemplet-000009']/* 国际化处理： 取消*/
        });
    }

    /**
     * 数据模板模态弹出
     * @param value
     */
    show(value) {
        this.state.modal.show = true;
        this.state.modal.title = {
            value: value.title,
            display: this.props.json['dataTemplet-000012']/* 国际化处理： 模板*/
        };
        this.setState(this.state);
    }

    /**
     * 保存模板
     */
    onSaveTemp() {
        if (this.state.showGrid) {
            //模板列表进入保存模板
            this.state.showGrid = false;
            this.state.modal.title = {value: 'temp', display: this.props.json['dataTemplet-000010']};/* 国际化处理： 保存模板*/
            this.setState(this.state);
        } else {
            //如果没有输入模板名称提示
            if (!!!this.state.inputValue) {
                toast({color: 'info', content: this.props.json['dataTemplet-000013']});/* 国际化处理： 请输入模板名称！*/
                return;
            }
            let {formId, pagecode, subGrid2, subGrid3} = this.props.config;
            let extspecilAggBill = this.props.createExtCardData(pagecode, formId, [subGrid2, subGrid3]);
            let currentcolum = this.state.columdata.find(column => column.templet_name === this.state.inputValue)
            if (!!currentcolum) {
                //更新模板保存
                ajax({
                    url: '/nccloud/uapbd/dataTemplet/saveTemplet.do',
                    data: {
                        pagecode: pagecode,
                        pk_datatemplet_id: currentcolum.pk_datatemplet_id,
                        billCard: extspecilAggBill,
                        isDefault: this.state.checkDefault,
                        templet_name: this.state.inputValue,
                        templetVO: currentcolum
                    },
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            toast({
                                color: 'success',
                                content: this.props.json['dataTemplet-000014']/* 国际化处理： 模板保存成功！*/
                            });
                            this.loadTempData(() => {
                            });

                        }
                    }
                });
            } else {
                //新增数据模板保存
                ajax({
                    url: '/nccloud/uapbd/dataTemplet/saveTemplet.do',
                    data: {
                        pagecode: pagecode,
                        pk_datatemplet_id: '',
                        billCard: extspecilAggBill,
                        isDefault: this.state.checkDefault,
                        templet_name: this.state.inputValue
                    },
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            toast({
                                color: 'success',
                                content: this.props.json['dataTemplet-000014']/* 国际化处理： 模板保存成功！*/
                            });
                            this.loadTempData(() => {
                            });
                        }
                    }
                })

            }

        }

    }

    /**
     * 数据模板模态关闭
     */
    onClose() {
         if(!this.state.showGrid) {
             confirmUtil.call(this, {
                 title: this.props.json['dataTemplet-000019'], /* 国际化处理： 取消*/
                 content: this.props.json['dataTemplet-000018'], /* 国际化处理： 是否确定取消？*/
                 beSureBtnClick: () => {
                     this.state.modal.title.display = this.props.json['dataTemplet-000012']/* 国际化处理： 模板*/
                     this.state.showGrid = true,
                     this.setState(this.state);
                 },
                 leftBtnName: this.props.json['dataTemplet-000008'], /* 国际化处理： 确定*/
                 rightBtnName: this.props.json['dataTemplet-000009']/* 国际化处理： 取消*/
             });
         }else{
             this.state.modal.show = false;
             this.state.showGrid = true;
             this.setState(this.state);
         }
    }

    /**
     * 模板名称输入框改变事件
     * @param value
     */
    inputValueChange = (value) => {
        this.setState({
            inputValue: value
        });
    }
    inputOnBlur = (value) => {
        this.setState({
            inputValue: value
        });
    }
    /**
     * 保存模板 默认模板复选框
     * @param value
     */
    onCheckDefault = (value) => {
        this.setState({
            checkDefault: value
        })
    }
    render() {
        var modalCfg = {...this.state.modal}
        return (
            <NCModal {...modalCfg} onHide={this.onClose.bind(this)}>
                <NCModal.Header closeButton={true}>
                    <NCModal.Title>{this.state.modal.title.display}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    {this.state.showGrid ? <NCRow md={12} xs={12} sm={12}  style={{'margin-right': 20 ,'margin-left': 20}}>
                        <NCTable
                            columns={this.state.table.columns}
                            data={this.state.columdata}
                        />
                    </NCRow> : ''}
                    {!this.state.showGrid ?
                        <NCRow md={12} xs={12} sm={12} style={{marginTop:10}}>
                            <NCRow md={12} xs={12} sm={12}>
                                <NCCol md={2} xs={2} sm={2}>
                                    <h3>{this.props.json['dataTemplet-000000']}：</h3>{/* 国际化处理： 模板名称*/}
                                </NCCol>
                                <NCCol md={5} xs={5} sm={5}>
                                    <NCFormControl value={this.state.inputValue}
                                                   onChange={this.inputValueChange.bind(this)}
                                                   onBlur={this.inputOnBlur.bind(this)} type="input"
                                                   className="demo-input"/>
                                </NCCol>
                                <NCCol md={5} xs={5} sm={5}></NCCol>
                            </NCRow>
                            <NCRow md={12} xs={12} sm={12} style={{margin:'10px 0'}}>
                                <NCCol md={2} xs={2} sm={2}>
                                    <h3>{this.props.json['dataTemplet-000017']}：</h3>{/* 国际化处理： 默认*/}
                                </NCCol>
                                <NCCol md={2} xs={2} sm={2}>
                                    <NCCheckbox colors="info"
                                                onChange={this.onCheckDefault.bind(this)}
                                                checked={this.state.checkDefault}
                                    />
                                </NCCol>
                                <NCCol md={7} xs={7} sm={7}></NCCol>
                            </NCRow>
                        </NCRow> : ''}

                </NCModal.Body>
                <NCModal.Footer>
                    <NCButton onClick={this.onSaveTemp.bind(this)}>{this.state.showGrid ? this.props.json['dataTemplet-000010']:this.props.json['dataTemplet-000008']}</NCButton>{/* 国际化处理： 保存模板*/}
                    <NCButton onClick={this.onClose.bind(this)}>{this.props.json['dataTemplet-000009']}</NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}
export default ImportTempletDlg;
