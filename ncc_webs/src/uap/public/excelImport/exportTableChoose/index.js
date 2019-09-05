import React, { Component } from 'react';
import { createPage, base, ajax, page,formDownload} from 'nc-lightapp-front';
const { NCUpload, NCButton, NCIcon, NCMessage, NCModal, NCTextArea, NCTable } = base;


const temp = {"exportTableChoose":{moduletype: 'table',pagination: false,"items":[{"attrcode":"otherrownum","label":"行号","colnum":"0","visible":true},{"attrcode":"hi_psnjobclerkcode","label":"员工号","colnum":"1","visible":true},{"attrcode":"bd_psndoccode","label":"人员编码","colnum":"2","visible":true},{"attrcode":"bd_psndocname","label":"人员姓名","colnum":"3","visible":true},{"attrcode":"bd_psndocidtype","label":"证件类型","colnum":"4","visible":true},{"attrcode":"org_deptname","label":"部门名称","colnum":"5","visible":true}],"moduletype":"table","pagination":false,"code":"test","name":"导出模板","oid":""}}; 
const data = {
    area_code: 'exportTableChoose',
    pageInfo: {pageIndex:"0","pageSize":"-1","total":"-1","totalPage":"-1"},
    "rows":[{"status":"0","values":{"bd_psndocidtype":{"display":"身份证"},"bd_psndoccode":{"display":"RM070"},"org_deptname":{"display":"总经理室"},"otherrownum":{"display":null},"hi_psnjobclerkcode":{"display":"RM070"},"bd_psndocname":{"display":"大罗"}}},{"status":"0","values":{"bd_psndocidtype":{"display":"身份证"},"bd_psndoccode":{"display":"RM9"},"org_deptname":{"display":"总经理室"},"otherrownum":{"display":null},"hi_psnjobclerkcode":{"display":"RM9"},"bd_psndocname":{"display":"本泽马"}}}]
}

class ExportTableChoose extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.props.meta.setMeta(temp);
        this.props.table.setAllTableData('exportTableChoose', data)
    }

    getTableData = () => {//请求table数据(不需要tree-tree时调用)
        ajax({
			url: '/nccloud/platform/pub/mergerequest.do',
			data: {},
			method: 'post',
			loading: false,
            success: (res) => {}
        })
    }

    render() {
        const { button, modal, table, editTable } = this.props;
        {console.log('props', this.props)}
        let { createSimpleTable } = table;
        return (
            <div>
                {createSimpleTable('exportTableChoose')}
            </div>
        )
    }
}

ExportTableChoose = createPage({
    // initTemplate: initTemplate,
})(ExportTableChoose);

export default ExportTableChoose;

