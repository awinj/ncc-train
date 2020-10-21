import React from 'react'
import {createPage,base} from 'nc-lightapp-front';
import {BillRender,BillEvent} from './method'

const { NCAffix } = base;


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
        edit:'edit',
        save:'save',
        cancel:'cancel',
        refresh:'refresh',
        addRow:'addRow',
        delRows:'delRows',
        expand:'expand',
        insertRow:'insertRow',
        delRow:'delRow',
        fold:'fold',
        unfold:'unfold'
    },
    listButton:{
        add:'add',
        refresh:'refresh',
        delete:'delete'
    }
}


const createBillPage = ({appConfig = {},methodConfig=new BillEvent(), renderConfig = new BillRender()}) => (App) => {

    appConfig = {...defaultAppConfig, ...appConfig}

    class Bill extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showMode: 'list',
                selectPk: '',
                isEdit: true,
            }
            this.appConfig=appConfig
            methodConfig.register(this);
            this.isCard=()=>{
                return this.state.showMode != 'list'
            }

            this.list={
                createSearch : () => {
                    const {renderSearch} = renderConfig;
                    return renderSearch(this.props,appConfig.listArea.query,{
                        dataSource: 'book_search_cache',
                        clickSearchBtn:(props,queryInfo)=> methodConfig.searchClick(props,queryInfo)
                    });
                },
                createButton:()=>{
                    const {renderButton} = renderConfig;
                    return renderButton(this.props, {
                        area: appConfig.listArea.headBtn,
                        onButtonClick:(props,key)=> methodConfig.onButtonClick(props,key)
                    });
                },
                createTable:()=>{
                    const {renderTable} = renderConfig;
                    return renderTable(this.props,appConfig.listArea.table,{
                        showCheck: true,
                        dataSource: 'book_search_cache',
                        pkname: 'pk_book',
                        handlePageInfoChange: methodConfig.handleListPageChange.bind(methodConfig),
                        onRowDoubleClick: methodConfig.onListRowDoubleClick.bind(methodConfig),
                        statusChange: methodConfig.editTableStatusChange.bind(methodConfig)
                    })
                }
            }
            this.card={
                createButton:()=>{
                    const {renderButton} = renderConfig;
                    return renderButton(this.props, {
                        area: appConfig.cardArea.headBtn,
                        onButtonClick: methodConfig.onButtonClick.bind(methodConfig)
                    });
                },
                createForm:()=>{
                    const {renderCardForm} = renderConfig;
                    return renderCardForm(this.props,appConfig.cardArea.head,{
                        onAfterEvent: methodConfig.onAfterEvent.bind(methodConfig),
                        setVisibleByForm: true,
                    })
                },
                createCardTable:()=>{
                    const {renderCardTable} = renderConfig;
                    return renderCardTable(this.props,appConfig.cardArea.body,{
                        tableHead: this.card.getTableHead,
                        showCheck: true,
                        showIndex: true,
                        onAfterEvent: methodConfig.onBodyAfterEvent.bind(methodConfig),
                        onSelected:methodConfig.onBodySelected.bind(methodConfig),
                        onSelectedAll:methodConfig.onBodySelectedAll.bind(methodConfig),
                        hideSwitch:()=>{return !this.state.isEdit}
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
                                    onButtonClick:(props,key)=> methodConfig.onBodyButtonClick(props,appConfig.cardArea.body,key),
                                    popContainer: document.querySelector('.header-button-area')
                                })}
                            </div>
                        </div>
                    )
                }

            }
            this.buttonVisibleRefresh=()=>{
                //TODO 默认实现基本按钮的显示控制
                const {button,cardTable}=this.props;
                const {setButtonVisible,getButtons,setButtonDisabled}=button;
                const {getCheckedRows}=cardTable;
                let buttons=getButtons();
                if(this.isCard()){
                    let visibleObj={};
                    let disableObj={};
                    buttons.filter(btn=>btn.area===appConfig.cardArea.headBtn).forEach(btn=>{
                        visibleObj[btn.key]=false
                    })
                    let {isEdit}=this.state;
                    if(isEdit){
                        visibleObj[appConfig.cardButton.save]=true;
                        visibleObj[appConfig.cardButton.cancel]=true;

                        //设置表体肩部按钮的可用性
                        disableObj[appConfig.cardButton.addRow]=false;
                        let selectRows=getCheckedRows(appConfig.cardArea.body);
                        disableObj[appConfig.cardButton.delRows]=!(selectRows&&selectRows.length>0);

                    }else{
                        visibleObj[appConfig.cardButton.add]=true;
                        visibleObj[appConfig.cardButton.refresh]=true;
                        //设置表体肩部按钮的可用性
                        disableObj[appConfig.cardButton.addRow]=true;
                        disableObj[appConfig.cardButton.delRows]=true;
                    }
                    setButtonVisible(visibleObj);
                    setButtonDisabled(disableObj)
                }else{
                    let obj={};
                    buttons.filter(btn=>btn.area===appConfig.listArea.headBtn).forEach(btn=>{
                        obj[btn.key]=false
                    })
                    obj[appConfig.listButton.add]=true;
                    obj[appConfig.listButton.refresh]=true;
                    setButtonVisible(obj);
                }


                buttons.forEach(btn=>{
                    methodConfig.buttonControlByStatus(this.props,btn);
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
                                        backBtnClick: ()=>methodConfig.onButtonClick(this.props,'back')
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
            let {appCode,pageCode}=appConfig;
            methodConfig.initTemplate(this.props, {appCode,pageCode},{},this.buttonVisibleRefresh)
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