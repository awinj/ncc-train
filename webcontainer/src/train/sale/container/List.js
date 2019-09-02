import React from 'react';

import { render, HrContainer } from 'src/hrpub/common/frame/index';

import MainAction from '../actions/main';

import { createPage, base, ajax, toast, NCScrollElement } from 'nc-lightapp-front';
const { NCAffix } = base

import Header from '../components/Header';

import './index.less';


class List extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    onButtonClick = (props, key) => {
        if (key == "add") {
            this.props.showCard();
        }
        else {
            alert(key)
        }
    }

    handlePageInfoChange = (props, config, pks) => {
        this.pageInfoClick({ ...props, json: this.state.json }, config, pks);
    }



    clickSearchBtn = (props, queryInfo) => {
        
        let pageInfo = props.table.getTablePageInfo("billlist");
        if (!queryInfo) {
            queryInfo = props.search.getQueryInfo("query");
        }
        queryInfo.pageInfo = pageInfo;

        queryInfo.pageCode = "60080010p";
        queryInfo.oid = "1001ZZ10000000002DNP";
        // 刷新按钮可用
        props.button.setDisabled({ ["refresh"]: false });

        ajax({
            url: "/nccloud/hk/action/querypage.do",
            data: queryInfo,
            success: (res) => {
                let { success, data } = res;
                if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                    props.dealFormulamsg(res.formulamsg);
                }
                if (success && data && data["billlist"]) {
                    props.table.setAllTableData("billlist", data["billlist"]);
                    toast({ color: 'success' });
                } else {
                    props.table.setAllTableData("billlist", { rows: [] });
                    toast({ color: 'warning', content: "未查询出符合条件的数据！" });/* 国际化处理： 未查询出符合条件的数据！*/
                }

            }
        });


    }

    render() {
        const { button, search, editTable, form, cardTable, modal, cardPagination } = this.props;
        const { createButtonApp } = button;
        let { createEditTable } = editTable;
        let { createCardTable } = cardTable;
        let { NCCreateSearch } = search;
        let { createSimpleTable } = this.props.table;

        return <div>
            {/* {createButtonApp({
                area: 'list_head',
                onButtonClick: this.onButtonClick.bind(this),
                // popContainer: document.querySelector('.header-button-area')
            })}

            {
                createEditTable('billlist')
            } */}

            <div className="nc-bill-list">
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {/* {createPageIcon()} */}
                        <h2 className="title-search-detail">{"title"}</h2>
                    </div>

                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: "list_head",
                            onButtonClick: this.onButtonClick
                        })}
                    </div>
                </div>

                <div className="nc-bill-search-area">
                    {NCCreateSearch("query", {
                        clickSearchBtn: this.clickSearchBtn
                    })}
                </div>

                <div className="table-area">
                    {createSimpleTable("billlist", {
                        // showCheck: true,
                        // dataSource: SEARCHCACHE.dataSource,
                        // pkname: PRIMARTKEY.head_id,
                        handlePageInfoChange: this.handlePageInfoChange,
                        // onRowDoubleClick: this.onRowDoubleClick
                    })}
                </div>
            </div>

        </div>
    }
}

export default List;