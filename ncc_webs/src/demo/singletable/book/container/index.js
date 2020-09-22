import React from 'react'
import {createPage, createPageIcon} from 'nc-lightapp-front';

class BookComp extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.initTemplate(this.props,{});
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
                        props.button.setPopContent('delete', '确认要删除吗?');
                        props.button.setButtonsVisible({'save':false});
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
                                let buttonAry =  ['edit', 'delete'];
                                return props.button.createOprationButton(buttonAry, {
                                    area: 'table',
                                    buttonLimit: 3,
                                    onButtonClick: (props, key) => bodyButtonClick({ ...props, json }, key, text, record, index)
                                });
                            }
                        });
                        props.meta.setMeta(meta);
                    }
                }
            }
        );
    }


    onButtonClick = (props,key) => {
        console.log(key)
    }

    clickSearchBtn = (props) => {
        console.log("查询")
    }

    handlePageInfoChange = (props, config, pks) => {
        console.log(pks)
    }

    onRowDoubleClick = (record, index, props) => {

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
                    onRowDoubleClick: this.onRowDoubleClick
                })}
            </div>
        </div>
    }

}

export default createPage({})(BookComp)


