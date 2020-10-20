import React from 'react'
import {createPage,base} from 'nc-lightapp-front';
import {renderSearch,renderButton,renderTable,renderCardForm,renderCardTable,
    initTemplate,
    onButtonClick,searchClick,buttonVisibleByStatus} from '../method'

const { NCAffix } = base;

const renderDefaultConfig = {
    renderSearch,
    renderButton,
    initTemplate,
    renderTable,
    renderCardForm,
    renderCardTable
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
        head:"card_head",  //表头主表
        body:["card_body"], //表体，多表体仍需完善
        headBtn:"head",//卡片表头按钮区域
        bodyBtn:"tab",//卡片表体按钮区域
        lineBtn:"body"  //表体表格的行操作区域按钮
    },
    cardButton:{
        add:'add',
        refresh:'refresh',
        expand:'expand',
        fold:'fold',
        unfold:'unfold',
        insertRow:'insertRow',
        delRow:'delRow'
    }
}

const methodDefaultConfig={
    searchClick:searchClick,
    onButtonClick:onButtonClick,
    onAfterEvent:()=>{},
    handlePageInfoChange:()=>{},
    onRowDoubleClick:()=>{},
    buttonVisibleByStatus:()=>{}
}

const createBillPage = ({appConfig = {},methodConfig={}}, renderConfig = {}) => (App) => {
    renderConfig = {...renderDefaultConfig, ...renderConfig}
    appConfig = {...defaultAppConfig, ...appConfig}
    methodConfig={...methodDefaultConfig,...methodConfig}

    class Bill extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showMode: 'form',
                selectPk: '',
                isEdit: true,
            }
            this.appConfig=appConfig

            this.toCard=({selectPk,isEdit=false})=>{
                this.setState(
                    {
                        selectPk,
                        isEdit,
                        showMode:'form'
                    }
                )
            }
            this.isCard=()=>{
                return this.state.showMode != 'list'
            }

            this.list={
                createSearch : () => {
                    const {renderSearch} = renderConfig;
                    return renderSearch(this.props,appConfig.listArea.query,{
                        dataSource: 'book_search_cache',
                        clickSearchBtn: methodConfig.clickSearchBtn
                    });
                },
                createButton:()=>{
                    const {renderButton} = renderConfig;
                    return renderButton(this.props, {
                        area: appConfig.listArea.headBtn,
                        onButtonClick: methodConfig.onButtonClick.bind(this)
                    });
                },
                createTable:()=>{
                    const {renderTable} = renderConfig;
                    return renderTable(this.props,appConfig.listArea.table,{
                        showCheck: true,
                        dataSource: 'book_search_cache',
                        pkname: 'pk_book',
                        handlePageInfoChange: methodConfig.handlePageInfoChange,
                        onRowDoubleClick: methodConfig.onRowDoubleClick,
                        statusChange: methodConfig.editTableStatusChange
                    })
                }
            }
            this.card={
                createButton:()=>{
                    const {renderButton} = renderConfig;
                    return renderButton(this.props, {
                        area: appConfig.cardArea.headBtn,
                        onButtonClick: methodConfig.onButtonClick.bind(this)
                    });
                },
                createForm:()=>{
                    const {renderCardForm} = renderConfig;
                    return renderCardForm(this.props,appConfig.cardArea.head,{
                        onAfterEvent: methodConfig.onAfterEvent.bind(this),
                        setVisibleByForm: true,
                    })
                },
                createCardTable:()=>{
                    const {renderCardTable} = renderConfig;
                    return renderCardTable(this.props,appConfig.cardArea.body,{
                        tableHead: this.card.getTableHead,
                        showCheck: true,
                        showIndex: true,
                        onAfterEvent: methodConfig.onAfterEvent.bind(this),
                    })
                },
                getTableHead: () => {
                    const {button} = this.props;
                    const {createButtonApp} = button;
                    return (
                        <div className="shoulder-definition-area">
                            <div className="definition-icons">
                                {createButtonApp({
                                    area: appConfig.cardArea.bodyBtn,
                                    onButtonClick: methodConfig.bodyButtonClick,
                                    popContainer: document.querySelector('.header-button-area')
                                })}
                            </div>
                        </div>
                    )
                }

            }
            this.buttonVisibleRefresh=()=>{
                //TODO 默认实现基本按钮的显示控制
                const {button}=this.props;
                const {setButtonVisible,getButtons}=button;
                let buttons=getButtons();
                if(this.isCard()){
                    let obj={};
                    buttons.filter(btn=>btn.area===appConfig.cardArea.headBtn).forEach(btn=>{
                        obj[btn.key]=false
                    })
                    debugger
                    obj[appConfig.cardButton.add]=true;
                    obj[appConfig.cardButton.refresh]=true;
                    setButtonVisible(obj);
                }else{
                    setButtonVisible({'add':false,'refresh':true})
                }

                debugger
                buttons.forEach(btn=>{
                    methodDefaultConfig.buttonVisibleByStatus(this.props,btn);
                })
            }

            this.createListPage=()=>{
                return <div className="nc-bill-list">
                    <div className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            <h2 className="title-search-detail">{'图书档案'}</h2>
                        </div>

                        {this.list.createButton()}
                    </div>

                    {this.list.createSearch()}

                    {this.list.createTable()}
                </div>
            }

            this.createCardPage=()=>{
                let {   BillHeadInfo,  } = this.props;
                let { createBillHeadInfo } = BillHeadInfo;
                return <div className="nc-bill-card">
                    <div className="nc-bill-top-area">
                        <NCAffix>
                            <div className="nc-bill-header-area">
                                <div>
                                    {createBillHeadInfo({
                                        title: '图书管理',//标题
                                        billCode: 'fasdfasdf',//单据号
                                        backBtnClick: this.onButtonClick
                                    })}
                                </div>
                                {
                                    this.card.createButton()
                                }
                            </div>
                        </NCAffix>
                        {this.card.createForm()}
                    </div>

                    {this.card.createCardTable()}
                </div>
            }

            this.createBill = () => {
                const isList=this.state.showMode=='list';
                if(isList){
                    return this.createListPage()
                }else{
                    return this.createCardPage();
                }
            }
            this.output = {
                createBill: this.createBill,
            }
        }

        componentWillMount(){
            console.log('componentWillMount')
            let {initTemplate} = renderConfig;
            initTemplate.bind(this)(this.props, {appcode: appConfig.appCode, pagecode: appConfig.pageCode},{},this.buttonVisibleRefresh)
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