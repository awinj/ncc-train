import React from 'react'
import {createPage} from 'nc-lightapp-front';
import {renderSearch,renderButton,renderTable, initTemplate} from '../method'

const renderDefaultConfig = {
     renderSearch,
    renderButton,
     initTemplate,
    renderTable
}

const defaultAppConfig = {
    appCode: '60701010',
    pageCode: '60701010p',
    listArea: {
        query:"search",  //查询区域
        table:"table",   //列表表格区域
        headBtn:"head",  // 列表头按钮区域
        bodyBtn:"tab_inner",  //表体按钮区域
    },
    cardArea:{
        head:"card_main",  //表头主表
        body:["card_body"], //表体，多表体仍需完善
        headBtn:"card_head",//卡片表头按钮区域
        bodyBtn:"card_body",//卡片表体按钮区域
        lineBtn:"body_line"  //表体表格的行操作区域按钮
    }
}

const methodDefaultConfig={
    searchClick:()=>{},
}

const createBillPage = ({appConfig = {},methodConfig={}}, renderConfig = {}) => (App) => {
    renderConfig = {...renderDefaultConfig, ...renderConfig}
    appConfig = {...defaultAppConfig, ...appConfig}
    methodConfig={...methodDefaultConfig,...methodConfig}

    class Bill extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showMode: 'list',
                selectPk: '',
                idEdit: false,
            }

            this.createSearch = () => {
                const {renderSearch} = renderConfig;
                return renderSearch(this.props,appConfig.listArea.query,{
                    dataSource: 'book_search_cache',
                    clickSearchBtn: methodConfig.clickSearchBtn
                });
            }

            this.createButton=()=>{
                const {renderButton} = renderConfig;
                return renderButton(this.props, {
                    area: appConfig.listArea.headBtn,
                    onButtonClick: methodConfig.onButtonClick
                });
            }

            this.createTable=()=>{
                const {editTable} = this.props;
                return renderTable(this.props,appConfig.listArea.table,{
                    showCheck: true,
                    dataSource: 'book_search_cache',
                    pkname: 'pk_book',
                    handlePageInfoChange: methodConfig.handlePageInfoChange,
                    onRowDoubleClick: methodConfig.onRowDoubleClick,
                    statusChange: methodConfig.editTableStatusChange
                })

            }

            this.createBill = () => {
                return <div className="nc-bill-list">
                    <div className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            <h2 className="title-search-detail">{'图书档案'}</h2>
                        </div>

                        {this.createButton()}
                    </div>

                    {this.createSearch()}

                    {this.createTable()}
                </div>

            }
            this.output = {
                createBill: this.createBill,
            }
        }

        componentDidMount() {
            let {initTemplate} = renderConfig;
            initTemplate(this.props, {appcode: appConfig.appCode, pagecode: appConfig.pageCode})
        }


        render() {
            return <div>
                <App {...this.output} {...this.props} />
            </div>
        }
    };
    return createPage({})(Bill);
}


export {createBillPage}