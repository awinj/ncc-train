import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import OrgRefer from '../../../../hrpub/common/components/referSearch/org';
import './index.less'
import PrintTable from "../../period_org/main/print.js"
import ExportHtml from '../../../../hrpub/common/utils/exportHtml';
import '../../../../hrpub/common/static/fonts/demo.css';
import '../../../../hrpub/common/static/fonts/iconfont.css';
import NCBackBtn from "../../../../hrpub/common/components/hr-back/index"

// import {initTemplate, headerButtonClick } from './events';
let { NCRow, NCCol, NCCheckbox, NCButton, NCSwitch, NCMenu, NCItem, NCIcon, NCTable, NCModal } = base;
import { high, createPage, base, getUrlParam, toast, print, cacheTools, output, promptBox, getBusinessInfo } from 'nc-lightapp-front';
import { hrAjax as ajax } from 'src/hrpub/common/utils/utils'
import { timingSafeEqual } from 'crypto';
import { get } from 'https';
import { getAppPageConfig } from '../../../../hrpub/common/utils/utils';
let { Refer } = high;
const moduleId = "i6013"
const domainName = "hrwa"
class Taxrate extends Component {
    constructor (props) {
        super(props);
        this.config = {
            nodeType: this.props.nodeType
        }
        this.state = {
            tableType: "wa_taxlist",
            isEmpty: true,
            taxColumns: [],
            taxData: [],
            isMakeBill: true,
            showModal: false,
            json: {},
            country: {
                refpk: "0001Z010000000079UJJ",
                refname: "中国",
                refcode: "CN"
            },
            orgValue: {},
            headerButton: true,
            headerForm: false,
            editBackBtn: true,
            showBackButton: false,
            clickFocusData: {},
            addType: "",
            copyType: "",
            showTableWa_taxtable: true,
            saveData: {},
            allpks: [],
            isCopy: false,
            showDelBtn: true,
            showCard: true,
            BusinessInfo: "",
            delNum: 0,
            languageFlg: false,
            saveData1: {}
        };

    }
    componentWillMount() {

    }
    componentDidMount() {
        if (this.config.nodeType === 'GRPNODE') {
            window.location.hash =
                "?&c=60130146&p=60130146p&ar=0001Z510000000065KV7&id=0";
        } else {
            window.location.hash =
                "?&c=60130150&p=60130150p&ar=0001Z510000000065KV7&id=0";
        }

        this.config = Object.assign({}, this.config, getAppPageConfig())
        let props = this.props
        props.createUIDom(this.config, (data) => {
            console.log(data)
            this.setState({
                buttons: data.button || [],
                context: data.context || {}
            });
            let callback = (json, status, inlt) => {
                if (status) {
                    this.setState({
                        json,
                        inlt,
                        country: {
                            refpk: "0001Z010000000079UJJ",
                            refname: json['i6013-000492'], // 中国
                            refcode: "CN"
                        },
                        languageFlg: true
                    }, () => {
                        if (this.config.nodeType === 'GRPNODE') {
                            this.getInitData()
                        }
                    })//存json和inlt到页面state中并刷新页面
                }
            }
            props.MultiInit.getMultiLang({ moduleId: moduleId, domainName: domainName, callback })
            // props.meta.setMeta(data && data.template ? data.template : {});
            props.button.setButtons(data && data.button ? data.button : []);
            console.log(data.button)
            // 给已选项目加操作
            let that = this;
            if (data.template["wa_taxlist"]) {
                let event = {
                    label: this.state.json['i6013-000063'], /* 国际化处理： 操作*/
                    attrcode: "opr",
                    itemtype: "customer",
                    visible: true,
                    width: "140px",
                    className: "table-opr",
                    render(text, record, index) {
                        return (
                            <div style={{ display: that.props.nodeType === "ORGNODE" ? record.values.pk_org.value === that.state.orgValue.refpk ? "" : "none" : "" }}>
                                {props.button.createOprationButton(
                                    [
                                        "Delete", "Edit", "Copy"
                                    ],
                                    {
                                        area: "table_row",
                                        buttonLimit: 3,
                                        onButtonClick: (props, btncode, e) => {
                                            that.onButtonClick(props, btncode, "table_row", that, record, index)
                                        },
                                    }
                                )}
                            </div>
                        )
                    }
                }
                data.template['wa_taxlist'].items.forEach((item, key) => {  //添加超链接
                    if (item.attrcode === 'code') {
                        item.renderStatus = 'browse'
                        item.render = (text, record, index) => {
                            return (
                                <span style={{ color: '#007ace', cursor: 'pointer' }}
                                    onClick={() => { this.listRowDoubleClick(record) }}>
                                    {record && record.values['code'] && record.values['code'].value}
                                </span>
                            );
                        };
                    }
                });
                data.template["wa_taxlist"].items.push(event);
                props.meta.setMeta(data.template);
                props.button.setButtonsVisible({
                    "Delete": true,
                    "Edit": true,
                })
            }
        })
        let height = document.documentElement.clientHeight;
        this.confirmButtonStatusEdit()
        this.headerButtonStatusEdit1()
        this.setHeaderBtnDis()
        if (getBusinessInfo()) {
            this.setState({
                BusinessInfo: getBusinessInfo().groupId,
                pageHeight: height - 175
            })
        } else {
            this.setState({
                pageHeight: height - 175
            })
        }
    }
    getInitData() {
        ajax({
            url: "/nccloud/hrwa/taxrate/QueryGrid.do",
            data: { pk_org: this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, pk_country: this.state.country.refpk },
            success: (res) => {
                if (res.data) {
                    this.props.editTable.setTableData(this.state.tableType, res.data[this.state.tableType])
                    this.props.editTable.focusRowByIndex(this.state.tableType, 0)
                    this.setState({ clickFocusData: { record: res.data.wa_taxlist.rows[0] } })
                    this.delAddTablestatusHide()
                    this.setState({ allpks: [] })
                    let allpksarr = []
                    res.data.wa_taxlist.rows.forEach((item, index) => {
                        allpksarr.push(item.values.pk_wa_taxbase.value)
                    })
                    this.setState({ allpks: allpksarr }, () => {
                        cacheTools.set('allpks', this.state.allpks)
                        console.log(this.state.allpks)
                    })
                } else {
                    this.props.editTable.setTableData(this.state.tableType, { rows: [] })
                }

            }
        });
    }
    headerButtonClick() {
        console.log(2)
    }

    //单击行
    orgmanagerRowClick(props, moduleId, record, index, e) {
        this.setState({ clickFocusData: { "record": record } })
    }
    orgmanagerRowClickCard(props, moduleId, record, index, e) {
        console.log("单机卡片页面")
    }

    // 判断form以及表格的显示隐藏
    setstatusFormTable = () => {
        let value = this.props.form.getFormItemsValue("wa_taxbase", "itbltype")
        if (value.value === "1") {
            this.props.form.setFormItemsRequired("wa_taxbase", { "ndebuctrate": true })
            this.delAddTablestatusHide()
        } else {
            this.props.form.setFormItemsRequired("wa_taxbase", { "ndebuctrate": false })
            this.delAddTablestatusShow()
        }
        console.log(value)
        if (value.value === "0") {
            document.getElementsByName("test")[0].style.display = "block"
            document.getElementsByName("fixtax")[0].style.display = "none"
            this.props.editTable.hideColByKey("wa_taxtable", ["ndebuctamount", "ndebuctrate"])
            this.setState({ showTableWa_taxtable: true })
        } else if (value.value === "1") {
            document.getElementsByName("test")[0].style.display = "none"
            document.getElementsByName("fixtax")[0].style.display = "block"
            this.setState({ showTableWa_taxtable: false })
        } else {
            document.getElementsByName("test")[0].style.display = "none"
            document.getElementsByName("fixtax")[0].style.display = "none"
            this.props.editTable.showColByKey("wa_taxtable", ["ndebuctamount", "ndebuctrate"])
            this.setState({ showTableWa_taxtable: true })
        }
    }

    // 表单事件
    // props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
    taxrateOnAfterEvent(props, moduleId, key, value, oldValue) {
        this.setstatusFormTable()
    }

    // 按钮显示和隐藏
    confirmButtonStatusEdit() {
        this.props.button.setButtonsVisible({
            Save: false,
            Cancel: false,
            Refresh: true,
            TemplatePrint: true
        })
    }
    confirmButtonStatusEdit1() {
        this.props.button.setButtonsVisible({
            Save: true,
            Cancel: true,
            TemplatePrint: false,
            Refresh: false,
        })
    }
    headerButtonStatusEdit1() {
        this.props.button.setButtonsVisible({
            TemplatePrint: false,
            Refresh: true,
            Print: true
        })
    }
    headerButtonStatusEdit2() {
        this.props.button.setButtonsVisible({
            TemplatePrint: true,
            Refresh: true,
            Print: false
        })
    }
    delAddTablestatusShow() {
        this.props.button.setButtonsVisible({
            AddLine: true,
            DelLine: true
        })
    }
    delAddTablestatusHide() {
        this.props.button.setButtonsVisible({
            AddLine: false,
            DelLine: false
        })
    }

    // 设置按钮状态
    setHeaderBtnDis() {
        if (!this.state.orgValue.refpk && this.props.nodeType === "ORGNODE") {
            this.props.button.setButtonDisabled(["Add", "Edit", "Delete", "Copy", "Print", "Print_more", "output", "print_link"], true)
        } else {
            this.props.button.setButtonDisabled(["Add", "Edit", "Delete", "Copy", "Print", "Print_more", "output", "print_link"], false)
        }
    }

    setDelBtnDis() {
        if (this.props.nodeType === "ORGNODE") {
            if (this.state.orgValue.refpk === this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_org.value) {
                this.props.button.setButtonDisabled(["Delete", "Edit"], false)
            } else {
                this.props.button.setButtonDisabled(["Delete", "Edit"], true)
            }
        } else {
            this.props.button.setButtonDisabled(["Delete", "Edit"], false)
        }
    }


    // 设置翻页
    setCardPage = (id) => {
        this.setState({ showCard: true })
        ajax({
            url: "/nccloud/hrwa/taxrate/QueryGrid.do",
            data: { pk_org: this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, pk_country: this.state.country.refpk },
            success: (res) => {
                this.setState({ allpks: [] })
                let allpksarr = []
                res.data.wa_taxlist.rows.forEach((item, index) => {
                    allpksarr.push(item.values.pk_wa_taxbase.value)
                })
                this.setState({ allpks: allpksarr }, () => {
                    cacheTools.set('allpks', this.state.allpks)
                    this.props.cardPagination.setCardPaginationId({ id: id, status: 1 })
                    console.log(this.state.allpks)
                })
            }
        });
    }

    // 翻页事件
    pageInfoClick = (props, flag, status = 1) => {
        console.log(flag)
        ajax({
            url: "/nccloud/hrwa/taxrate/QueryCard.do",
            data: { pk_org: this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, pk_country: this.state.country.refpk, pk_wa_taxbase: flag },
            success: (res) => {
                if(res.data){
                    let _this = this
                    this.props.form.setAllFormValue({ "wa_taxbase": res.data.head.wa_taxlist })
                    this.props.editTable.setTableData(this.state.tableType, res.data.bodys.wa_taxtable)
                    this.props.form.setFormStatus("wa_taxbase", "browse")
                    this.props.editTable.setStatus("wa_taxtable", "browse")
                    if(this.props.nodeType === "GRPNODE" || props.form.getFormItemsValue("wa_taxbase", "pk_org").value === _this.state.orgValue.refpk){
                        props.button.setButtonDisabled(['Edit','Delete'],false)
                    }else{
                        props.button.setButtonDisabled(['Edit','Delete'],true) 
                    }
                    this.setState({
                        saveData: {
                            "pk_org": this.state.orgValue.refpk, "pk_country": this.state.country.refpk,
                            "modelinfo": res.data
                        }
                    })
                    
                    let value = this.props.form.getFormItemsValue("wa_taxbase", "itbltype")
                    if (value.value === "0") {
                        document.getElementsByName("test")[0].style.display = "block"
                        document.getElementsByName("fixtax")[0].style.display = "none"
                        this.props.editTable.hideColByKey("wa_taxtable", ["ndebuctamount", "ndebuctrate"])
                        this.setState({ showTableWa_taxtable: true })
                    } else if (value.value === "1") {
                        document.getElementsByName("test")[0].style.display = "none"
                        document.getElementsByName("fixtax")[0].style.display = "block"
                        this.setState({ showTableWa_taxtable: false })
                    } else {
                        document.getElementsByName("test")[0].style.display = "none"
                        document.getElementsByName("fixtax")[0].style.display = "none"
                        this.props.editTable.showColByKey("wa_taxtable", ["ndebuctamount", "ndebuctrate"])
                        this.setState({ showTableWa_taxtable: true })
                    }
                }  
            }
        });
    }

    // 删除数据
    confirmDelete = (recordRow) => {
        if (recordRow) {
            let dataDel = {}
            if (this.props.nodeType === "ORGNODE") {
                dataDel = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: recordRow.values.pk_group.value, pk_wa_taxbase: recordRow.values.pk_wa_taxbase.value }
            } else {
                dataDel = { pk_org: recordRow.values.pk_group.value, pk_country: this.state.country.refpk, pk_wa_taxbase: recordRow.values.pk_wa_taxbase.value }
            }
            ajax({
                url: "/nccloud/hrwa/taxrate/DelAction.do",
                data: dataDel,
                success: (res) => {
                    console.log(res)
                    this.getInitData()
                }
            });
        } else {
            console.log(this.state.clickFocusData)
            console.log(this.state.saveData)
            let dataDel1 = {}
            if (this.props.nodeType === "ORGNODE") {
                dataDel1 = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value, pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value }
            } else {
                dataDel1 = { pk_org: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value, pk_country: this.state.country.refpk, pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value }
            }
            ajax({
                url: "/nccloud/hrwa/taxrate/DelAction.do",
                data: dataDel1,
                success: (res) => {
                    this.setState({ tableType: "wa_taxlist" }, () => {
                        this.setState({
                            headerButton: true,
                            showBackButton: false,
                            headerForm: false
                        })
                        this.headerButtonStatusEdit1()
                        this.getInitData()
                    })
                }
            });
        }
    }

    //  取消按钮点击
    cancelClick = () => {
        this.setState({ saveData: this.state.saveData1 }, () => {
            this.setState({ isCopy: false, showCard: true })
            if (this.state.copyType === "listCopy" || this.state.addType === "listAdd") {
                this.setState({ tableType: "wa_taxlist" }, () => {
                    this.setState({
                        headerButton: true,
                        showBackButton: false,
                        headerForm: false,
                        showDelBtn: true
                    })
                    this.confirmButtonStatusEdit()
                    this.headerButtonStatusEdit1()
                    console.log(this.state.saveData)
                    console.log(this.state.saveData1)
                    // this.props.form.setAllFormValue({"wa_taxbase":this.state.saveData.modelinfo.head.wa_taxlist})
                    console.log(123)
                    // console.log(this.state.saveData.modelinfo.bodys.wa_taxtable)
                    // this.props.editTable.setTableData("wa_taxtable",this.state.saveData.modelinfo.bodys.wa_taxtable?this.state.saveData.modelinfo.bodys:{rows:[]})
                    this.getInitData()
                    // this.setDelBtnDis()
                })
            } else {
                this.setState({
                    headerButton: true,
                    showBackButton: true,
                    headerForm: true,
                    showDelBtn: true
                }, () => {
                    console.log(this.state.saveData)
                    this.headerButtonStatusEdit2()
                    this.confirmButtonStatusEdit()
                    console.log(this.state.saveData)
                    this.props.form.setAllFormValue({ "wa_taxbase": this.state.saveData.modelinfo.head.wa_taxlist })
                    this.props.editTable.setTableData("wa_taxtable", this.state.saveData.modelinfo.bodys.wa_taxtable ? this.state.saveData.modelinfo.bodys.wa_taxtable : { rows: [] })
                    this.setstatusFormTable()
                    this.props.form.setFormStatus("wa_taxbase", "browse")
                    this.props.editTable.setStatus("wa_taxtable", "browse")
                    this.delAddTablestatusHide()
                    this.setDelBtnDis()
                })
            }
        })

    }

    // 修改数据

    // 行编辑 props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, record（行数据）, index（当前index）
    tableEditAfterEvent = (props, moduleId, key, value, changedrows, index, record) => {
        console.log(moduleId)
        console.log(key)
        console.log(value)
        console.log(changedrows)
        console.log(record)
        console.log(index)
        switch (key) {
            case "nminamount":
                if (value === "") {
                    this.props.editTable.setValByKeyAndIndex("wa_taxtable", index, "nminamount",
                        { value: 0, display: 0, scale: 2 })
                }
                break;
            default:
                break;
        }

    }


    // 保存数据
    saveTacrate = (saveData) => {
        console.log(saveData)
        if (this.state.isCopy) {
            // let saveFormValue = this.props.form.getFormItemsValue("wa_taxbase","itbltype")
            if (saveData.modelinfo.head.wa_taxlist.rows[0].values.itbltype.value === "1") {
                saveData.type = "copyfix"
            } else {
                saveData.type = "copy"
            }
        }
        ajax({
            url: "/nccloud/hrwa/taxrate/SaveAction.do",
            data: saveData,
            success: (res) => {
                console.log(res)
                this.setCardPage(res.data)
                this.setState({
                    headerButton: true,
                    showBackButton: true,
                    headerForm: true,
                    isCopy: false,
                    showDelBtn: true
                }, () => {
                    this.headerButtonStatusEdit2()
                    this.confirmButtonStatusEdit()
                    this.props.editTable.setTableData(this.state.tableType, this.state.saveData.modelinfo.bodys)
                    this.props.form.setFormStatus("wa_taxbase", "browse")
                    this.props.editTable.setStatus("wa_taxtable", "browse")
                    this.delAddTablestatusHide()
                })
                ajax({
                    url: "/nccloud/hrwa/taxrate/QueryCard.do",
                    data: { pk_org: this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, pk_country: this.state.country.refpk, pk_wa_taxbase: res.data },
                    success: (res) => {
                        console.log(res)
                        this.props.form.setAllFormValue({ "wa_taxbase": res.data.head.wa_taxlist })
                        this.props.editTable.setTableData(this.state.tableType, res.data.bodys)
                        this.setState({
                            saveData: {
                                "pk_org": this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, "pk_country": this.state.country.refpk,
                                "modelinfo": res.data
                            }
                        }, () => {
                            this.setDelBtnDis()
                        })

                    }
                });
            }
        });
    }

    // 按钮点击事件
    onButtonClick(props, btncode, areacode, opt, recordRow, index) {
        console.log(btncode)
        console.log(areacode)
        console.log(opt)
        console.log(recordRow)
        console.log(index)
        switch (btncode) {
            case 'Edit':
                // 修改
                let olddataEdit = this.state.saveData
                this.setState({ saveData1: olddataEdit })
                this.setState({ showCard: false, copyType: "", addType: "" })
                if (recordRow) {
                    this.setState({
                        tableType: "wa_taxtable",
                        headerButton: false,
                        headerForm: true,
                        showBackButton: true,
                        showDelBtn: false
                    }, () => {
                        this.props.form.setFormStatus("wa_taxbase", "edit")
                        this.props.editTable.setStatus(this.state.tableType, "edit")
                        this.confirmButtonStatusEdit1()
                        let dataEdit = {}
                        if (this.props.nodeType === "ORGNODE") {
                            dataEdit = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: recordRow.values.pk_group.value, pk_wa_taxbase: recordRow.values.pk_wa_taxbase.value }
                        } else {
                            dataEdit = { pk_org: recordRow.values.pk_group.value, pk_country: this.state.country.refpk, pk_wa_taxbase: recordRow.values.pk_wa_taxbase.value }
                        }
                        ajax({
                            url: "/nccloud/hrwa/taxrate/QueryCard.do",
                            data: dataEdit,
                            success: (res) => {
                                if (parseFloat(res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value) === 0) {
                                    res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value = "0"
                                } else {
                                    res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value = parseFloat(res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value)
                                }
                                if (parseFloat(res.data.head.wa_taxlist.rows[0].values.nfixrate.value) === 0) {
                                    res.data.head.wa_taxlist.rows[0].values.nfixrate.value = "0"
                                } else {
                                    res.data.head.wa_taxlist.rows[0].values.nfixrate.value = parseFloat(res.data.head.wa_taxlist.rows[0].values.nfixrate.value)
                                }
                                this.props.form.setAllFormValue({ "wa_taxbase": res.data.head.wa_taxlist })
                                this.setstatusFormTable()
                                this.props.editTable.setTableData(this.state.tableType, res.data.bodys.wa_taxtable ? res.data.bodys.wa_taxtable : { rows: [] })
                                this.state.saveData.pk_org = this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo
                                this.state.saveData.pk_country = this.state.country.refpk
                                this.state.saveData.modelinfo = res.data
                                this.setState(this.state)
                                // this.setState({saveData:{"pk_org":this.props.nodeType==="ORGNODE"?this.state.orgValue.refpk:this.state.BusinessInfo,"pk_country":this.state.country.refpk,
                                //             "modelinfo":res.data}},function() {
                                //                 console.log('console',this.state.saveDate)
                                //             })


                            }
                        });
                    })
                } else {
                    this.setState({
                        headerButton: false,
                        headerForm: true,
                        showBackButton: true,
                        showDelBtn: false
                    }, () => {
                        this.props.form.setFormStatus("wa_taxbase", "edit")
                        this.props.editTable.setStatus("wa_taxtable", "edit")
                        this.confirmButtonStatusEdit1()
                        console.log(this.state.clickFocusData)
                        console.log(this.state.saveData)
                        let dataEdit1 = {}
                        if (this.props.nodeType === "ORGNODE") {
                            dataEdit1 = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value, pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value }
                        } else {
                            dataEdit1 = { pk_org: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value, pk_country: this.state.country.refpk, pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value }
                        }
                        ajax({
                            url: "/nccloud/hrwa/taxrate/QueryCard.do",
                            data: dataEdit1,
                            success: (res) => {
                                console.log(res)
                                if (parseFloat(res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value) === 0) {
                                    res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value = "0"
                                } else {
                                    res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value = parseFloat(res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value)
                                }
                                if (parseFloat(res.data.head.wa_taxlist.rows[0].values.nfixrate.value) === 0) {
                                    res.data.head.wa_taxlist.rows[0].values.nfixrate.value = "0"
                                } else {
                                    res.data.head.wa_taxlist.rows[0].values.nfixrate.value = parseFloat(res.data.head.wa_taxlist.rows[0].values.nfixrate.value)
                                }
                                this.props.form.setAllFormValue({ "wa_taxbase": res.data.head.wa_taxlist })
                                this.setstatusFormTable()
                                console.log(res.data)
                                this.props.editTable.setTableData(this.state.tableType, res.data.bodys.wa_taxtable)
                                console.log(this.props.editTable.getAllRows(this.state.tableType))
                                this.setState({
                                    saveData: {
                                        "pk_org": this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, "pk_country": this.state.country.refpk,
                                        "modelinfo": res.data
                                    }
                                })
                            }
                        });
                    })
                }
                break;
            case 'Refresh':
                // 刷新
                if (this.state.tableType === "wa_taxtable") {
                    let dataRef = {}
                    if (this.props.nodeType === "ORGNODE") {
                        dataRef = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value, pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value }
                    } else {
                        dataRef = { pk_org: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value, pk_country: this.state.country.refpk, pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value }
                    }
                    ajax({
                        url: "/nccloud/hrwa/taxrate/QueryCard.do",
                        data: dataRef,
                        success: (res) => {
                            console.log(res)
                            this.props.cardPagination.setCardPaginationId({ id: res.data.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value, status: 1 })
                            this.props.form.setAllFormValue({ "wa_taxbase": res.data.head.wa_taxlist })
                            this.props.editTable.setTableData("wa_taxtable", res.data.bodys.wa_taxtable)
                            this.setState({
                                saveData: {
                                    "pk_org": this.state.orgValue.refpk, "pk_country": this.state.country.refpk,
                                    "modelinfo": res.data
                                }
                            })
                            this.setstatusFormTable()
                            this.delAddTablestatusHide()
                        }
                    });
                } else {
                    this.getInitData((res) => {
                        toast({ color: 'success', content: this.state.json['jf6005-000339'] });//刷新成功！
                    });
                }

                break;
            case 'Add':
                // 新增
                let oddDataAdd = this.state.saveData
                this.setState({ saveData1: oddDataAdd })
                this.setState({ showCard: false })
                let dataAdd = {}
                if (this.props.nodeType === "ORGNODE") {
                    dataAdd = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: this.state.clickFocusData.record.values.pk_group.value, itbltype: this.state.clickFocusData.record.values.itbltype.value }
                } else {
                    dataAdd = { pk_org: this.state.clickFocusData.record.values.pk_group.value, pk_country: this.state.country.refpk, itbltype: this.state.clickFocusData.record.values.itbltype.value }
                }
                ajax({
                    url: "/nccloud/hrwa/taxrate/QueryCard.do",
                    data: dataAdd,
                    success: (res) => {
                        console.log(res)
                        this.props.form.setAllFormValue({ "wa_taxbase": res.data.head.wa_taxlist })
                        this.props.editTable.setTableData("wa_taxtable", { rows: [] })
                        this.setstatusFormTable()
                        if (this.state.tableType === "wa_taxlist") {
                            this.setState({ addType: "listAdd" }, () => {
                                this.setState({
                                    tableType: "wa_taxtable",
                                    headerButton: false,
                                    headerForm: true,
                                    showBackButton: true,
                                    showDelBtn: false
                                }, () => {
                                    this.props.form.setFormStatus("wa_taxbase", "edit")
                                    this.props.editTable.setStatus(this.state.tableType, "edit")
                                    this.confirmButtonStatusEdit1()
                                })
                            })
                            this.setState({
                                saveData: {
                                    "pk_org": this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, "pk_country": this.state.country.refpk,
                                    "modelinfo": res.data
                                }
                            })
                            console.log(this.state.saveData)
                        } else {
                            this.setState({ addType: "cardAdd" }, () => {
                                this.setState({
                                    tableType: "wa_taxtable",
                                    headerButton: false,
                                    headerForm: true,
                                    showBackButton: true,
                                    showDelBtn: false
                                }, () => {
                                    this.props.form.setFormStatus("wa_taxbase", "edit")
                                    this.props.editTable.setStatus(this.state.tableType, "edit")
                                    this.confirmButtonStatusEdit1()
                                })

                            })
                        }
                    }
                });
                break;
            case 'Delete':
                // 删除
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['i6013-000746'],                // "请注意"
                    content: this.state.json['i6013-000531'],             // 是否确定删除？
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.state.json['i6013-000635'],          // "确定"
                    cancelBtnName: this.state.json['i6013-000009'],         // "取消"
                    hasCloseBtn: false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
                    beSureBtnClick: this.confirmDelete.bind(this, recordRow),   // 确定按钮点击调用函数,非必输
                    // cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
                    // closeBtnClick:functionClose,    //关闭按钮点击调用函数，非必输
                    closeByClickBackDrop: false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                    zIndex: 200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
                })
                break;
            case 'Copy':
                // 复制
                let oddDataCopy = this.state.saveData
                this.setState({ saveData1: oddDataCopy })
                console.log(this.state.saveData)
                this.setState({ isCopy: true, showCard: false, copyType: "", addType: "" })
                let dataCopy = {}
                if (this.props.nodeType === "ORGNODE") {
                    if (recordRow) {
                        dataCopy = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: recordRow.values.pk_group.value, pk_wa_taxbase: recordRow.values.pk_wa_taxbase.value }
                    } else {
                        dataCopy = {
                            pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value,
                            pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value
                        }
                    }
                } else {
                    if (recordRow) {
                        dataCopy = { pk_org: recordRow.values.pk_group.value, pk_country: this.state.country.refpk, pk_wa_taxbase: recordRow.values.pk_wa_taxbase.value }
                    } else {
                        dataCopy = {
                            pk_org: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_group.value, pk_country: this.state.country.refpk,
                            pk_wa_taxbase: this.state.saveData.modelinfo.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value
                        }
                    }
                }
                ajax({
                    url: "/nccloud/hrwa/taxrate/QueryCard.do",
                    data: dataCopy,
                    success: (res) => {
                        console.log(res)
                        if (parseFloat(res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value) === 0) {
                            res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value = "0"
                        } else {
                            res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value = parseFloat(res.data.head.wa_taxlist.rows[0].values.ndebuctrate.value)
                        }
                        if (parseFloat(res.data.head.wa_taxlist.rows[0].values.nfixrate.value) === 0) {
                            res.data.head.wa_taxlist.rows[0].values.nfixrate.value = "0"
                        } else {
                            res.data.head.wa_taxlist.rows[0].values.nfixrate.value = parseFloat(res.data.head.wa_taxlist.rows[0].values.nfixrate.value)
                        }
                        let Data = res.data.head.wa_taxlist
                        Data.rows[0].values.code = { display: "", value: "" }
                        Data.rows[0].values.name = { display: "", value: "" }
                        this.props.form.setAllFormValue({ "wa_taxbase": Data })
                        this.setstatusFormTable()
                        this.props.editTable.setTableData("wa_taxtable", res.data.bodys.wa_taxtable)
                        if (this.state.tableType === "wa_taxlist") {
                            this.setState({ copyType: "listCopy" }, () => {
                                this.setState({
                                    tableType: "wa_taxtable",
                                    headerButton: false,
                                    headerForm: true,
                                    showBackButton: true,
                                    showDelBtn: false
                                }, () => {
                                    this.props.form.setFormStatus("wa_taxbase", "edit")
                                    this.props.editTable.setStatus(this.state.tableType, "edit")
                                    this.confirmButtonStatusEdit1()
                                })
                            })
                            this.setState({
                                saveData: {
                                    "pk_org": this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, "pk_country": this.state.country.refpk,
                                    "modelinfo": res.data
                                }
                            })
                        } else {
                            this.setState({ copyType: "cardCopy" }, () => {
                                this.setState({
                                    tableType: "wa_taxtable",
                                    headerButton: false,
                                    headerForm: true,
                                    showBackButton: true,
                                    showDelBtn: false
                                }, () => {
                                    this.props.form.setFormStatus("wa_taxbase", "edit")
                                    this.props.editTable.setStatus(this.state.tableType, "edit")
                                    this.confirmButtonStatusEdit1()
                                })
                            })
                        }
                    }
                });
                break;
            case 'Print':
                // 打印
                // 税率表_组织   税率表_集团
                PrintTable(document.getElementsByClassName("u-table")[0], {
                    title: this.props.nodeType === "ORGNODE" ? this.state.json['i6013-000756'] : this.state.json['i6013-000757'], maker: "作者", date: "日期", maxColLen: 8, beforeHtml: "", afterHtml: "", beforeAppend(tableDataList) {
                        tableDataList[0].forEach((item) => {
                            item.pop()
                        })
                        return tableDataList
                    }
                })
                break;
            case 'Print_more':
                // 打印
                // 税率表_组织   税率表_集团
                PrintTable(document.getElementsByClassName("u-table")[0], {
                    title: this.props.nodeType === "ORGNODE" ? this.state.json['i6013-000756'] : this.state.json['i6013-000757'], maker: "作者", date: "日期", maxColLen: 8, beforeHtml: "", afterHtml: "", beforeAppend(tableDataList) {
                        tableDataList[0].forEach((item) => {
                            item.pop()
                        })
                        return tableDataList
                    }
                })
                break;
            case 'output':
                // 输出
                // 税率表_组织   税率表_集团
                ExportHtml(document.querySelector('.u-table'), {
                    title: this.props.nodeType === "ORGNODE" ? this.state.json['i6013-000756'] : this.state.json['i6013-000757'],
                    fileName: this.props.nodeType === "ORGNODE" ? this.state.json['i6013-000756'] : this.state.json['i6013-000757'],
                    maker: "作者",
                    date: "日期"
                })
                break;
            case 'Preview':
                // 预览
                // 税率表_组织   税率表_集团
                PrintTable(document.getElementsByClassName("u-table")[0], {
                    title: this.props.nodeType === "ORGNODE" ? this.state.json['i6013-000756'] : this.state.json['i6013-000757'], maker: "作者", date: "日期", maxColLen: 8, beforeHtml: "", afterHtml: "", beforeAppend(tableDataList) {
                        tableDataList[0].forEach((item) => {
                            item.pop()
                        })
                        return tableDataList
                    }
                })
                break;
            case 'TemplatePrint':
                //模板打印
                let telPrintData = this.props.form.getAllFormValue("wa_taxbase")
                let nodeKey = ""
                let tablePrintType = telPrintData.rows[0].values.itbltype.value
                if (tablePrintType === "0") {
                    nodeKey = "gtaxprint"
                } else if (tablePrintType === "1") {
                    nodeKey = "fixTaxPrint"
                } else {
                    nodeKey = "laowutaxprint"
                }
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    '/nccloud/hrwa/taxrate/Print.do', //后台服务url
                    {
                        funcode: this.props.appcode,      //小应用编码
                        nodekey: nodeKey,     //模板节点标识
                        oids: [telPrintData.rows[0].values.pk_wa_taxbase.value],    // 功能节点的数据主键
                    }
                )
                break;
            case 'Template_Print':
                //模板打印
                let telPrint_Data = this.props.form.getAllFormValue("wa_taxbase")
                let node_Key = ""
                let table_PrintType = telPrint_Data.rows[0].values.itbltype.value
                if (table_PrintType === "0") {
                    node_Key = "gtaxprint"
                } else if (table_PrintType === "1") {
                    node_Key = "fixTaxPrint"
                } else {
                    node_Key = "laowutaxprint"
                }
                print(
                    'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    '/nccloud/hrwa/taxrate/Print.do', //后台服务url
                    {
                        funcode: this.props.appcode,      //小应用编码
                        nodekey: node_Key,     //模板节点标识
                        oids: [telPrint_Data.rows[0].values.pk_wa_taxbase.value],    // 功能节点的数据主键
                    }
                )
                break;
            case 'Output':
                //输出
                let outPutData = this.props.form.getAllFormValue("wa_taxbase")
                let NodeKey = ""
                let table_OutputType = outPutData.rows[0].values.itbltype.value
                if (table_OutputType === "0") {
                    NodeKey = "gtaxprint"
                } else if (table_OutputType === "1") {
                    NodeKey = "fixTaxPrint"
                } else {
                    NodeKey = "laowutaxprint"
                }
                output({
                    // 'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                    // 税率表_组织   税率表_集团
                    url: '/nccloud/hrwa/taxrate/Print.do', //后台服务url
                    data: {
                        filename: this.props.nodeType === "ORGNODE" ? this.state.json['i6013-000756'] : this.state.json['i6013-000757'],
                        funcode: this.props.appcode,      //小应用编码
                        nodekey: NodeKey,     //模板节点标识
                        oids: [outPutData.rows[0].values.pk_wa_taxbase.value],    // 功能节点的数据主键
                        outputType: 'output'
                    }
                }
                )
                break;
            case 'Cancel':
                // 取消
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['i6013-000746'],             // "请注意"
                    content: this.state.json['i6013-000051'],             // 是否放弃保存
                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    beSureBtnName: this.state.json['i6013-000635'],          //"确定"
                    cancelBtnName: this.state.json['i6013-000009'],         // "取消"
                    hasCloseBtn: false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
                    beSureBtnClick: this.cancelClick.bind(this),   // 确定按钮点击调用函数,非必输
                    // cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
                    // closeBtnClick:functionClose,    //关闭按钮点击调用函数，非必输
                    closeByClickBackDrop: false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                    zIndex: 200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
                })
                break;
            case 'Save':
                // 保存
                // /nccloud/hrwa/taxrate/SaveAction.do
                let saveFormValue = this.props.form.getFormItemsValue("wa_taxbase", "itbltype")
                if (saveFormValue.value === "1") {
                    this.props.form.setFormItemsRequired("wa_taxbase", { 'ndebuctrate': true })
                } else {
                    this.props.form.setFormItemsRequired("wa_taxbase", { 'ndebuctrate': false })
                }
                if (!this.props.form.isCheckNow("wa_taxbase")) {
                    return false
                }
                let saveDataObj = JSON.parse(JSON.stringify(this.state.saveData))
                saveDataObj.modelinfo.head.wa_taxlist = this.props.form.getAllFormValue("wa_taxbase")
                saveDataObj.modelinfo.bodys = this.props.editTable.getAllRows("wa_taxtable")
                this.saveTacrate(saveDataObj)
                break;
            case 'AddLine':
                // 增行 nminamount ntaxrate
                let delDataNumAdd = 0
                this.props.editTable.getAllRows(this.state.tableType).forEach((item, index) => {
                    if (item.status === "3") {
                        delDataNumAdd += 1
                    }
                })
                let index = this.props.editTable.getAllRows(this.state.tableType).length - delDataNumAdd
                this.props.editTable.addRow("wa_taxtable", undefined, false, {
                    "itaxlevel": { display: (index + 1).toString(), value: (index + 1).toString(), scale: 0 },
                    "ndebuctamount": { value: "0", display: "0", scale: 2, isEdit: false },
                    "nminamount": { value: "0", display: "0", scale: 2, isEdit: false },
                    // "nmaxamount":{value: "0", display:"0", scale:2,isEdit:false },
                    "ndebuctrate": { value: "0", display: "0", scale: 2, isEdit: false },
                    "ntaxrate": { value: "0", display: "0", scale: 4, isEdit: false },
                    "nquickdebuct": { value: "0", display: "0", scale: 2, isEdit: false }
                })
                // this.props.editTable.focusRowByIndex("wa_taxtable",this.props.editTable.getAllRows("wa_taxtable").length-delDataNumAdd-1)                   
                break;
            case "DelLine":
                // 删行
                let delInitNum = 0
                this.props.editTable.getAllRows(this.state.tableType).forEach((item, index) => {
                    if (item.status === "3") {
                        delInitNum += 1
                    }
                })
                console.log(delInitNum)
                console.log(this.props.editTable.getAllRows(this.state.tableType))
                let delIndex = ""
                if (this.props.editTable.getClickRowIndex(this.state.tableType)) {
                    delIndex = this.props.editTable.getClickRowIndex(this.state.tableType).index
                } else {
                    // delIndex=this.props.editTable.getAllRows(this.state.tableType)-delInitNum
                }
                //  else {
                //     promptBox({
                //         color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                //         title: "请注意",                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                //         content: '由于税率表存在级次，非最后一行不能删除。',             // 提示内容,非必输
                //         noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                //         noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                //         beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                //         cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
                //         hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
                //         closeByClickBackDrop:false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                //         zIndex:200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
                //     })
                //     return
                // }
                let tableLength = this.props.editTable.getAllRows(this.state.tableType).length - 1
                console.log(delIndex)
                console.log(tableLength)
                if (delIndex < tableLength - (delInitNum + 1)) {
                    promptBox({
                        color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                        title: this.state.json['i6013-000746'],                // "请注意"
                        content: this.state.json['i6013-000758'],             // 由于税率表存在级次，非最后一行不能删除。
                        noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                        noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                        beSureBtnName: this.state.json['i6013-000635'],          // 确定按钮名称, 默认为"确定",非必输
                        cancelBtnName: this.state.json['i6013-000009'],         // 取消按钮名称, 默认为"取消",非必输
                        hasCloseBtn: false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
                        closeByClickBackDrop: false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                        zIndex: 200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
                    })
                    return
                } else {
                    console.log("删行")
                    if (delInitNum === this.props.editTable.getAllRows(this.state.tableType).length) {
                        return
                    }
                    let delDataNum = 0
                    this.props.editTable.deleteTableRowsByIndex(this.state.tableType, this.props.editTable.getAllRows(this.state.tableType).length - 1 - delInitNum)
                    this.props.editTable.getAllRows(this.state.tableType).forEach((item, index) => {
                        if (item.status === "3") {
                            delDataNum += 1
                        }
                    })
                    console.log(delDataNum)
                    this.props.editTable.focusRowByIndex(this.state.tableType, parseInt(this.props.editTable.getAllRows(this.state.tableType).length - 1 - delDataNum))
                }
                break;
            default:
                break;
        }
    }

    //  点击返回按钮
    handleClick() {
        if (this.props.form.getFormStatus("wa_taxbase") === "edit") {
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['i6013-000746'],               // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                content: this.state.json['i6013-000337'],             // 是否放弃保存？
                noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                beSureBtnName: this.state.json['i6013-000635'],          // 确定按钮名称, 默认为"确定",非必输
                cancelBtnName: this.state.json['i6013-000009'],         // 取消按钮名称, 默认为"取消",非必输
                hasCloseBtn: false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
                beSureBtnClick: this.cancelClick.bind(this),   // 确定按钮点击调用函数,非必输
                closeByClickBackDrop: false,    //点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
                zIndex: 200                     //遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
            })
            return false
        }
        this.setState({
            tableType: "wa_taxlist",
            headerButton: true,
            showBackButton: false,
            headerForm: false
        })
        // this.confirmButtonStatusEdit()
        this.headerButtonStatusEdit1()
        this.getInitData()
    }
    // 列表双击事件 record(行数据) ，index(当前index) props, e (事件对象)
    listRowDoubleClick = (record, index, props, e) => {
        this.setState({
            tableType: "wa_taxtable",
            headerForm: true,
            showBackButton: true, editBackBtn: false, headerButton: true,
            clickFocusData: { "record": record },
            showCard: true
        })
        this.headerButtonStatusEdit2()
        this.props.form.setFormStatus("wa_taxbase", "browse")
        this.props.editTable.setStatus("wa_taxtable", "browse")
        this.confirmButtonStatusEdit()
        let dataDbclick = {}
        if (this.props.nodeType === "ORGNODE") {
            dataDbclick = { pk_org: this.state.orgValue.refpk, pk_country: this.state.country.refpk, pk_group: record.values.pk_group.value, pk_wa_taxbase: record.values.pk_wa_taxbase.value }
        } else {
            dataDbclick = { pk_org: record.values.pk_group.value, pk_country: this.state.country.refpk, pk_wa_taxbase: record.values.pk_wa_taxbase.value }
        }
        ajax({
            url: "/nccloud/hrwa/taxrate/QueryCard.do",
            data: dataDbclick,
            success: (res) => {
                console.log(res)
                this.props.cardPagination.setCardPaginationId({ id: res.data.head.wa_taxlist.rows[0].values.pk_wa_taxbase.value, status: 1 })
                this.props.form.setAllFormValue({ "wa_taxbase": res.data.head.wa_taxlist })
                this.props.editTable.setTableData("wa_taxtable", res.data.bodys.wa_taxtable ? res.data.bodys.wa_taxtable : { rows: [] })
                this.setState({
                    saveData: {
                        "pk_org": this.props.nodeType === "ORGNODE" ? this.state.orgValue.refpk : this.state.BusinessInfo, "pk_country": this.state.country.refpk,
                        "modelinfo": res.data
                    }
                }, () => {
                    this.setDelBtnDis()
                })

                this.setstatusFormTable()
                this.delAddTablestatusHide()
            }
        });
    }
    // 删除列表数据
    deleteListData = () => {

    }
    // 修改列表数据
    editListData = () => {

    }

    // 组织参照切换事件
    handleTreeChange = (value) => {
        this.setState({
            orgValue: value
        }, () => {
            if (!this.state.country.refpk) {
                return false
            }
            this.getInitData()
            this.setHeaderBtnDis()
        })
    }
    render() {
        const { button, editTable, form, cardPagination } = this.props;
        let { createEditTable } = editTable;
        const { createCardPagination } = cardPagination;
        const { createButtonApp } = button;
        const { taxColumns, taxData } = this.state;
        let { createForm, setFormStatus } = form;
        return (
            <div>
                <div className="header">
                    <div className="Taxrate_header_button">
                        <div style={{ overflow: "hidden" }}>

                            <div style={{ display: this.state.showBackButton ? "none" : this.props.nodeType === "ORGNODE" ? "" : "none" }} className="fl">
                                <div>
                                    <OrgRefer
                                        getOrgData={this.handleTreeChange}
                                        orgVal={this.state.orgValue}
                                    />
                                </div>
                            </div>
                            <div className="fl" style={{ "display": this.state.showBackButton ? "none" : "" }}>
                                <div>
                                    <Refer
                                        refType={'grid'}
                                        refName={this.state.json['i6013-000493']}/* 国际化处理： 国家地区*/
                                        placeholder={this.state.json['i6013-000493']}/* 国际化处理： 国家地区*/
                                        queryGridUrl={'/nccloud/hrpub/ref/HRCountryGridRef.do'}
                                        refCode={'hrpub.refer.pub.HRCountryGridRef'}
                                        value={this.state.languageFlg ? this.state.country : null}
                                        onChange={(value) => {
                                            this.setState({
                                                country: value
                                            }, () => {
                                                if (!this.state.country.refpk) {
                                                    this.props.editTable.setTableData(this.state.tableType, { rows: [] })
                                                    this.props.button.setButtonDisabled(["Add", "Copy", "Print", "Print_more", "output", "Refresh"], true)
                                                } else {
                                                    this.getInitData()
                                                    this.props.button.setButtonDisabled(["Add", "Copy", "Print", "Print_more", "output", "Refresh"], false)
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="fr">
                                <span style={{ display: this.state.headerButton ? "" : "none" }}>
                                    {createButtonApp({
                                        area: 'list_card', onButtonClick: (props, btncode) => {
                                            this.onButtonClick(props, btncode, this);
                                        },
                                    })}
                                </span>
                                <div className="ib" style={{ display: this.state.tableType === "wa_taxtable" && this.state.showDelBtn ? "" : "none" }}>
                                    {createButtonApp({
                                        area: 'table_row', onButtonClick: (props, btncode) => {
                                            this.onButtonClick(props, btncode, this);
                                        },
                                    })}
                                </div>
                                <div className="ib">
                                    {createButtonApp({
                                        area: 'list', onButtonClick: (props, btncode) => {
                                            this.onButtonClick(props, btncode, this);
                                        },
                                    })}
                                </div>
                                <div className="fr" style={{ display: this.state.showBackButton && this.state.showCard ? "" : "none" }}>
                                    {createCardPagination({
                                        handlePageInfoChange: this.pageInfoClick.bind(this)
                                    })}
                                </div>
                            </div>
                            <div className="fl back_btn">
                                <NCBackBtn
                                    style={{ display: this.state.showBackButton ? "" : "none" }}
                                    onClick={this.handleClick.bind(this)}
                                >
                                </NCBackBtn>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-wrapper" style={{ display: this.state.headerForm ? "" : "none" }}>
                    {
                        createForm("wa_taxbase", {
                            setVisibleByForm: true,
                            onAfterEvent: this.taxrateOnAfterEvent.bind(this),
                            expandArr: ["fixtax", "test"]
                        })
                    }
                </div>
                <div className="ta-content clearfix">
                    <div style={{ display: this.state.tableType === "wa_taxlist" ? "" : "none" }}>
                        {
                            createEditTable("wa_taxlist", {
                                // showCheck: this.state.showOrgDetailPFBtn,
                                height: this.state.pageHeight,
                                onRowClick: this.orgmanagerRowClick.bind(this),
                                onRowDoubleClick: this.listRowDoubleClick.bind(this),
                                showIndex: true
                            })
                        }
                    </div>
                    <div className="fr editTableBtn">
                        {createButtonApp({
                            area: 'table', onButtonClick: (props, btncode) => {
                                this.onButtonClick(props, btncode, this);
                            },
                        })}
                    </div>
                    <div style={{ display: this.state.tableType === "wa_taxtable" && this.state.showTableWa_taxtable ? "" : "none" }}>
                        {
                            createEditTable("wa_taxtable", {
                                // showCheck: this.state.showOrgDetailPFBtn,
                                onRowClick: this.orgmanagerRowClickCard.bind(this),
                                showIndex: true,
                                onAfterEvent: this.tableEditAfterEvent.bind(this)
                            })
                        }
                    </div>

                </div>
            </div>

        )
    }
}
let TaxratePage = createPage({
})(Taxrate)
ReactDOM.render(<TaxratePage />, document.querySelector('#app'));
export default Taxrate;