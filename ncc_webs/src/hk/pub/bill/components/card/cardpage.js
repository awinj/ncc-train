import React from 'react';
import { base,createPage } from 'nc-lightapp-front';
import {initTemplate} from "./event/initTemlate";
import {pageClick,cardCreate,getCardData} from "./event/cardOperator"
import {buttonClick,bodyButtonClick} from "./event/buttonClick"
import {afterEvent} from "./event/afterEvent"
/**
 * @description: 卡片
 */
const { NCAffix } = base;


export default class BaseCardPage extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            json: {},
        };

    }

    componentWillMount() {
        initTemplate(this.props, {});
    }


    componentDidMount() {
        let status = this.props.getUrlParam('status');
        let id = this.props.getUrlParam('id');
        const {ButtonAction}=this.props.configExt;
        if (status === ButtonAction.add) { //新增
            cardCreate(this.props);
        } else if (id) {
            getCardData(this.props, id);
        }
    }

     onButtonClick  (props, id, hotkey)  {
        buttonClick({ ...props,configExt:this.props.configExt, json: this.state.json }, id, hotkey);
    }

    bodyButtonClick  (props, tabCode,key, text, record, index){
        bodyButtonClick({...props,configExt:this.props.configExt}, tabCode,key, text, record, index);
    }

    handlePageInfoChange  (props, id) {
        pageClick({ ...props,configExt:this.props.configExt, json: this.state.json }, id);
    }

    onAfterEvent(props, moduleId, key, value, oldValue){
        afterEvent({ ...props,configExt:this.props.configExt}, moduleId, key, value, oldValue)
    }


    getTableHead  ()  {
        const {CardArea}=this.props.configExt;
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {this.props.button.createButtonApp({
                        area: CardArea.bodyBtn,
                        onButtonClick: (props, key, text, record, index)=>{this.bodyButtonClick(props,CardArea.body[0], key, text, record, index)},
                        popContainer: document.querySelector('.header-button-area')
                    })}
                </div>
            </div>
        )};


    render() {
        let { form, cardPagination, BillHeadInfo, cardTable } = this.props;
        let { createCardPagination } = cardPagination;
        let { createForm } = form;
        let { createCardTable } = cardTable;
        let { createBillHeadInfo } = BillHeadInfo;
        const {ButtonAction,CardArea}=this.props.configExt;
        let status = this.props.getUrlParam('status');
        let id = this.props.getUrlParam('id');

        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <div className="nc-bill-header-area">
                            <div>
                                {createBillHeadInfo({
                                    title: "标题",//标题
                                    // billCode: billNo && billNo.value,//单据号
                                    backBtnClick: this.onButtonClick.bind(this, this.props, ButtonAction.back)
                                })}
                            </div>
                            <div className="header-button-area">
                                {this.props.button.createButtonApp({
                                    area: CardArea.headBtn,
                                    onButtonClick: this.onButtonClick.bind(this)
                                })}
                            </div>
                            {status == 'browse' && id &&
                            <div className="header-cardPagination-area" style={{ float: 'right' }}>
                                {createCardPagination({
                                    // dataSource: DATASOURCE,
                                    // pkname: PRIMARTKEY.head_id,
                                    handlePageInfoChange: this.handlePageInfoChange.bind(this)
                                })}
                            </div>
                            }
                        </div>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(CardArea.head, {
                            onAfterEvent: this.onAfterEvent.bind(this),
                            // onBeforeEvent: beforeEvent,
                            setVisibleByForm: true,
                        })}
                    </div>
                </div>

                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(CardArea.body[0], {
                            tableHead: this.getTableHead.bind(this),
                            showCheck: true,
                            showIndex: true,
                            // onSelected: bodySelectedEvent,
                            // onSelectedAll: bodySelectedAllEvent,
                            // onBeforeEvent: beforeTableEvent,
                            // onAfterEvent: afterTableEvent,
                            // modelSave: buttonClick.bind(this, { ...this.props, json: this.state.json }, CARD_BUTTON.save, undefined, true),
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
