import React, { Component } from 'react';
import { createPage, base, ajax, page,formDownload, getMultiLang} from 'nc-lightapp-front';
import Transfer from '../../../public/excomponents/Transfer';
const { NCUpload, NCButton, NCIcon, NCMessage, NCModal, NCTextArea, NCTable } = base;
import { buttonClick, initTemplate } from './events';
import './index.less';
import Utils from '../../../public/utils';
import UpDownProgress from '../../../public/packages/upDownProgress';
import ExportChooseTable from '../exportTableChoose';

export default class ExcelImport extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            backdocstr: '',
            selectedPKS:this.props.selectedPKS ? this.props.selectedPKS:'',
            showBackDocinfoModal: false,
            resultinfo: '',
            leftTreeData: {},
            rightTreeData: {},
            rightBackTreeData: [],
            treeValue: {},
            moduleName: this.props.moduleName ? this.props.moduleName : '',
            billType: this.props.billType ? this.props.billType : '',
            tableColumns: [],
            json: {},
            inlt: null
        }
        initTemplate.call(this);
    }

    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            if (status) {
                this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }
        }
        getMultiLang({moduleId: 2052,domainName: '领域名',callback})
    }

    componentDidMount() {

        this.getData();
    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log('billType', nextProps.billType)
        if(nextProps.moduleName && (nextProps.billType != this.props.billType || nextProps.moduleName != this.props.moduleName)) {
            this.setState({
                moduleName: nextProps.moduleName,
                billType: nextProps.billType,
            }, () => {
                if(nextProps.perosonalExport && Object.keys(nextProps.perosonalExport).length) {//自定义table导出
                    this.getTableColumns();
                    this.getTableData();
                }else {
                    this.getData();
                }
            })
        }
    }



    getData = () => {
        let _this = this;
        const { exportTreeUrl, appcode, pagecode } = this.props;
        ajax({

            url: exportTreeUrl || '/nccloud/uapdr/trade/schemeTreeToTreeQuery.do',
            data: {
                "moduleName": this.state.moduleName,
                "billType": this.state.billType,
                "appcode": appcode,
                "pagecode": pagecode
            },
            success: (res) => {
                if (res.data) {
                    this.setState({
                        leftTreeData: res.data.leftdata,
                        rightTreeData: res.data.rightdata,
                        treeValue: res.data
                    })
                }
            }
        });
    }

    closeBackDocModal = () => {
        this.setState({ showBackDocinfoModal: false });
    }


    appSureBtnClick = () => {
        let _this = this;
        let exportDatas='';
        if(this.props.selectedPKS&& this.props.selectedPKS.length>0){
            this.props.selectedPKS.map((item, index) => {
                exportDatas = exportDatas+item+";"
          })
  
        }
        let rightTreeDatas = Utils.getrecusionUtil(this.state.rightTreeData);
 
        let data = {
            "rightdata":rightTreeDatas,
            "moduleName": this.state.moduleName,
            "billType": this.state.billType,
            "exportDatas":exportDatas
        }
        formDownload({
            params:data,
            url:'/nccloud/uapdr/trade/excelexport.do',
            enctype:2
        })
    }

    appSureBtnClickTable = () => {//导出选择table数据进行导出
        let data = {
            "rightdata":"",
            "moduleName": this.state.moduleName,
            "billType": this.state.billType,
            "exportDatas": ""
        }
        formDownload({
            params:data,
            url:this.props.perosonalExport.downLoadUrl,
            enctype:2
        })
    }

    getTableColumns = () => {//请求table 模板(不需要tree-tree时调用)
        const that = this;
        ajax({
			url: this.props.perosonalExport.tempUrl,
			data: {},
			method: 'post',
			loading: false,
            success: (res) => {
                let tableColumns = [];
                that.setState({
                    tableColumns: tableColumns
                })
            }
        })
    }

    getTableData = () => {//请求table数据(不需要tree-tree时调用)
        ajax({
			url: this.props.perosonalExport.dataUrl,
			data: {},
			method: 'post',
			loading: false,
            success: (res) => {}
        })
    }

    render() {
        const { button, modal, table, editTable } = this.props;
        const { createEditTable } = editTable;
        let { createSimpleTable } = table;
        const { createButtonApp } = button;
        const { createModal } = modal;
        
        return (
            <div className='nc-bill-excelimport'>
                {/* 导出进行tree-to-tree选择数据导出 */}
                {createModal('exportFileModal',
                    {
                        title: this.state.json['1880000025-000004'],
                        content:
                            <Transfer
                                // beforeMove = {this.before}
                                TransferId={'excel_transferid'}
                                rightFixed={true}
                                leftTreeData={this.state.leftTreeData}
                                rightTreeData={this.state.rightTreeData}
                                value={this.state.treeValue}
                                oprType='1' 
                                hiddenAllMoveBtns={true}/>,
                        size: 'xlg',
                        beSureBtnClick: this.appSureBtnClick.bind(this)
                    })}
                
                {/* 导出选择table数据选中导出 */}
                {
                    createModal('exportFileModalTable',{
                        title: this.state.json['1880000025-000004'],
                        content: <ExportChooseTable />,
                        size: 'xlg',
                        beSureBtnClick: this.appSureBtnClickTable.bind(this)
                    })
                }
                {/* 导入进度控制 */}
                <UpDownProgress toastKey={this.state.toastKey} listUrl=""
                    url="" paramObj={{}}/>
            </div>)
    }

}

