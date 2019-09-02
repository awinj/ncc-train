import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { initTemplate } from './events/initTemplate';
import { buttonClick } from './events/buttonClick';
import { beforeEvent } from './events/beforeEvent';
import { beforeTableEvent } from './events/beforeTableEvent';
import { afterEvent } from './events/afterEvent';
import { afterTableEvent } from './events/afterTableEvent';
import { bodySelectedEvent, bodySelectedAllEvent } from './events/bodySelectedEvent';
import { MULTILANG, CARD, PRIMARTKEY, CARD_BUTTON, DATASOURCE } from '../constant';
import { pageClick, cardCreate, getCardData } from './events/cardOperator';
import { bodyButtonClick } from './events/bodyButtonClick';

/**
* @description: 卡片
*/
const { NCAffix } = base;

class Card extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        json: {},
                };
        }

        componentWillMount() {
                initTemplate(this.props, {});
                // json： 多语json格式参数； 
                // status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； 
                // inlt： 可用来进行占位符的一些操作
                // let callback = (json, status, inlt) => {
                //         if (status) {
                //                 initTemplate(this.props, json); // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中

                //                 // 保存json和inlt到页面state中并刷新页面
                //                 this.setState({ json, inlt })
                //         }
                // }
                // this.props.MultiInit.getMultiLang({ moduleId: MULTILANG.moduleId, domainName: MULTILANG.domainName, callback });

                // 关闭浏览器
                window.onbeforeunload = () => {
                        let status = this.props.cardTable.getStatus(CARD.table_code);
                        if (status == 'edit') {
                                return this.state.json['TR101010-000007'];/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
                        }
                };
        }

        componentDidMount() {
                let status = this.props.getUrlParam('status');
                let id = this.props.getUrlParam('id');
                if (status === 'add') { //新增
                        cardCreate(this.props);
                } else if (id) {
                        getCardData(this.props, id);
                }
        }

        onButtonClick = (props, id, hotkey) => {
                buttonClick({ ...props, json: this.state.json }, id, hotkey);
        }

        handlePageInfoChange = (props, id) => {
                pageClick({ ...props, json: this.state.json }, id);
        }

        //获取列表肩部信息
        getTableHead = () => (
                <div className="shoulder-definition-area">
                        <div className="definition-icons">
                                {this.props.button.createButtonApp({
                                        area: CARD.shoulder_btn_code,
                                        onButtonClick: bodyButtonClick,
                                        popContainer: document.querySelector('.header-button-area')
                                })}
                        </div>
                </div>
        );

        render() {
                let { form, cardPagination, BillHeadInfo, cardTable } = this.props;
                let { createCardPagination } = cardPagination;
                let { createForm } = form;
                let { createCardTable } = cardTable;
                let { createBillHeadInfo } = BillHeadInfo;
                let status = this.props.getUrlParam('status');
                let id = this.props.getUrlParam('id');
                let billNo = this.props.form.getFormItemsValue(CARD.page_code, PRIMARTKEY.bill_no);
                return (
                        <div className="nc-bill-card">
                                <div className="nc-bill-top-area">
                                        <NCAffix>
                                                <div className="nc-bill-header-area">
                                                        <div>
                                                                {createBillHeadInfo({
                                                                        title: this.state.json[CARD.page_title],//标题
                                                                        billCode: billNo && billNo.value,//单据号
                                                                        backBtnClick: buttonClick.bind(this, this.props, CARD_BUTTON.back)
                                                                })}
                                                        </div>
                                                        <div className="header-button-area">
                                                                {this.props.button.createButtonApp({
                                                                        area: CARD.head_btn_code,
                                                                        onButtonClick: this.onButtonClick
                                                                })}
                                                        </div>
                                                        {status == 'browse' && id &&
                                                                <div className="header-cardPagination-area" style={{ float: 'right' }}>
                                                                        {createCardPagination({
                                                                                dataSource: DATASOURCE,
                                                                                pkname: PRIMARTKEY.head_id,
                                                                                handlePageInfoChange: this.handlePageInfoChange
                                                                        })}
                                                                </div>
                                                        }
                                                </div>
                                        </NCAffix>
                                        <div className="nc-bill-form-area">
                                                {createForm(CARD.form_id, {
                                                        onAfterEvent: afterEvent,
                                                        onBeforeEvent: beforeEvent,
                                                        setVisibleByForm: true,
                                                })}
                                        </div>
                                </div>

                                <div className="nc-bill-bottom-area">
                                        <div className="nc-bill-table-area">
                                                {createCardTable(CARD.table_code, {
                                                        // tableHead: this.getTableHead.bind(this),
                                                        showCheck: true,
                                                        showIndex: true,
                                                        onSelected: bodySelectedEvent,
                                                        onSelectedAll: bodySelectedAllEvent,
                                                        onBeforeEvent: beforeTableEvent,
                                                        onAfterEvent: afterTableEvent,
                                                        // modelSave: buttonClick.bind(this, { ...this.props, json: this.state.json }, CARD_BUTTON.save, undefined, true),
                                                })}
                                        </div>
                                </div>
                        </div>
                );
        }
}

Card = createPage({
        billinfo: {
                billtype: 'card',
                pagecode: CARD.page_code,
                headcode: CARD.form_id,
                bodycode: CARD.table_code
        }
})(Card);
export default Card;
