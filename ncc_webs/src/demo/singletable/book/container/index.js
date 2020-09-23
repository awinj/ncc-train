import React from 'react'
import {createPage, createPageIcon, ajax, toast} from 'nc-lightapp-front';

class BookComp extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.initTemplate(this.props, {});
    }

    initTemplate = (props, json) => {
        props.createUIDom({
                pagecode: '60701010p',       //页面code
                appcode: '60701010'
            }, (data) => {
                if (data) {
                    if (data.button) {
                        //将请求回来的按钮组数据设置到页面的 buttons 属性上
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonsVisible({'save': false, 'cancel': false});
                    }
                    if (data.template) {
                        let meta = data.template;

                        meta['table'].items.push({
                            itemtype: 'customer',
                            attrcode: 'opr',
                            label: '操作',/* 国际化处理： 操作*/
                            width: '160px',
                            fixed: 'right',
                            className: "table-opr",
                            visible: true,
                            render: (text, record, index) => {
                                let buttonAry = ['tab_add', 'tab_del'];
                                return props.button.createOprationButton(buttonAry, {
                                    area: 'tab',
                                    buttonLimit: 3,
                                    onButtonClick: (props, key) => this.bodyButtonClick(props, key, text, record, index)
                                });
                            }
                        });
                        props.meta.setMeta(meta);
                    }
                }
            }
        );
    }


    onButtonClick = (props, key) => {

        const {editTable, search} = this.props;
        if ('add' === key) {
            this.setEditTableStatus('edit')
            editTable.addRow('table');
        } else if ('edit' === key) {
            this.setEditTableStatus('edit')
        } else if ('delete' === key) {
            let rows = editTable.getCheckedRows('table');
            let rowsIndex = rows.map(item => {
                return item.index;
            })
            editTable.deleteTableRowsByIndex('table', rowsIndex);
        } else if ('cancel' === key) {
            this.props.editTable.cancelEdit('table');
            this.editTableStatusChange();
        } else if ('save' === key) {
            let tableData = editTable.getChangedRows('table');
            let data = {
                pageid: '60701010p',
                model: {
                    areaType: "table",
                    areacode: 'table',
                    pageinfo: null,
                    rows: tableData
                }
            };
            ajax({
                url: '/nccloud/book/action/save.do',
                data: data,
                success: (res) => {     //此处使用箭头函数，如果不使用箭头函数，一定要bind(this)
                    let {success, data} = res;
                    if (success) {
                        toast({title: '保存成功', color: 'success'});
                        this.props.editTable.setStatus('table', 'browse');//设置表格状态为浏览态
                    }
                }
            });
        }
    }

    bodyButtonClick = (props, key, text, record, index) => {
        if ('tab_add' === key) {
            props.editTable.addRow('table', index + 1);
        } else if ('tab_del' === key) {
            props.editTable.deleteTableRowsByIndex('table', index);
        }

    }

    clickSearchBtn = (props, queryInfo) => {
        let pageInfo = props.editTable.getTablePageInfo('table');

        queryInfo = props.search.getQueryInfo('search');

        queryInfo.pageInfo = pageInfo;
        queryInfo.pageCode = '60701010p';

        // 刷新按钮可用
        props.button.setDisabled({'refresh': false});

        ajax({
            url: '/nccloud/book/action/querypage.do',
            data: queryInfo,
            success: (res) => {
                let {success, data} = res;
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    props.dealFormulamsg(res.formulamsg);
                }
                if (success && data && data['table']) {
                    props.editTable.setTableData('table', data['table']);
                    toast({color: 'success'});
                } else {
                    props.editTable.setTableData('table', {rows: []});
                    toast({color: 'warning', content: "未查询出符合条件的数据！"});/* 国际化处理： 未查询出符合条件的数据！*/
                }

            }
        });
    }

    handlePageInfoChange = (props, config, pks) => {
        console.log(pks)
    }

    onRowDoubleClick = (record, index, props) => {

    }


    //行状态 String ‘edit’/'browse'
    setEditTableStatus = (status) => {
        this.props.editTable.setStatus('table', status);
        this.editTableStatusChange();
    }

    editTableStatusChange = () => {
        console.log("editTableStatusChange");
        this.buttonVisibleControl();
    }

    buttonVisibleControl = () => {
        const tableid = 'table';
        let tableData = this.props.editTable.getCheckedRows(tableid);
        let length = tableData.length;//获取列表页选择数据的行数
        let tableStatus = this.props.editTable.getStatus(tableid);
        this.props.button.setButtonsVisible({
            add: true,
            edit: tableStatus !== 'edit',
            save: tableStatus === 'edit',
            cancel: tableStatus === 'edit',
            delete: true,
            refresh: tableStatus !== 'edit'
        });
    }

    render() {
        const {editTable, search} = this.props;
        const {createEditTable} = editTable;
        const {NCCreateSearch} = search;
        return <div className="nc-bill-list">
            <div className="nc-bill-header-area">
                <div className="header-title-search-area">
                    {createPageIcon()}
                    <h2 className="title-search-detail">{'图书档案'}</h2>
                </div>

                <div className="header-button-area">
                    {this.props.button.createButtonApp({
                        area: 'head',
                        onButtonClick: this.onButtonClick
                    })}
                </div>
            </div>

            <div className="nc-bill-search-area">
                {NCCreateSearch('search', {
                    dataSource: 'book_search_cache',
                    clickSearchBtn: this.clickSearchBtn
                })}
            </div>

            <div className="table-area">
                {createEditTable('table', {
                    showCheck: true,
                    dataSource: 'book_search_cache',
                    pkname: 'pk_book',
                    handlePageInfoChange: this.handlePageInfoChange,
                    onRowDoubleClick: this.onRowDoubleClick,
                    statusChange: this.editTableStatusChange
                })}
            </div>
        </div>
    }

}

export default createPage({})(BookComp)


