import React from 'react';

import { hrAjax } from 'src/hrpub/common/utils/utils';
import { base } from 'nc-lightapp-front';

/**
* @description: 卡片
*/
const { NCAffix } = base;
import './index.less';


const Area={
        cardhead:"cardhead",
        cardbody:"cardbody"
}

const ButtonArea={
        cardhead:"card_head",
        cardbody:"card_body"
}

const ButtonAction={
        cancel:"cancel",
        add:"cancel",
        addLine:"addLine",
        save:"save"
}



class Card extends React.Component {

        constructor(props) {
                super(props);
        }

        componentDidMount() {

                this.props.form.setFormStatus(Area.cardhead, "add")
        }

        onButtonClick = (props, key) => {
                if (key == ButtonAction.cancel) {
                        this.props.showList();
                }
                else if (key == "save") {
                        let data = props.createMasterChildData("60080010", Area.cardhead, Area.cardbody);
                        hrAjax({
                                url: "/nccloud/hk/action/save.do",
                                data: data
                        }).then(res=>{
                                his.props.form.setFormStatus(Area.cardhead, "browse");
                        })
                }
                 
        }
        bodyButtonClick=(props, key, text, record, index)=>{
                if (key == "addLine") {
                        props.cardTable.addRow(Area.cardbody);
                }
        }
        //获取列表肩部信息
        getTableHead = () => (
                <div className="shoulder-definition-area">
                        <div className="definition-icons">
                                {this.props.button.createButtonApp({
                                        area:ButtonArea.cardbody,
                                        onButtonClick: this.bodyButtonClick.bind(this),
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
                let billNo = this.props.form.getFormItemsValue("60080010p", "bill_no");
                return (
                        <div className="nc-bill-card">
                                <div className="nc-bill-top-area">
                                        <NCAffix>
                                                <div className="nc-bill-header-area">
                                                        <div>
                                                                {createBillHeadInfo({
                                                                        title: "标题",//标题
                                                                        billCode: billNo && billNo.value,//单据号
                                                                        // backBtnClick: buttonClick.bind(this, this.props, CARD_BUTTON.back)
                                                                })}
                                                        </div>
                                                        <div className="header-button-area">
                                                                {this.props.button.createButtonApp({
                                                                        area: ButtonArea.cardhead,
                                                                        onButtonClick: this.onButtonClick
                                                                })}
                                                        </div>
                                                        {status == 'browse' && id &&
                                                                <div className="header-cardPagination-area" style={{ float: 'right' }}>
                                                                        {createCardPagination({
                                                                                // dataSource: DATASOURCE,
                                                                                // pkname: PRIMARTKEY.head_id,
                                                                                // handlePageInfoChange: this.handlePageInfoChange
                                                                        })}
                                                                </div>
                                                        }
                                                </div>
                                        </NCAffix>
                                        <div className="nc-bill-form-area">
                                                {createForm(Area.cardhead, {
                                                        // onAfterEvent: afterEvent,
                                                        // onBeforeEvent: beforeEvent,
                                                        setVisibleByForm: true,
                                                })}
                                        </div>
                                </div>

                                <div className="nc-bill-bottom-area">
                                        <div className="nc-bill-table-area">
                                                {createCardTable(Area.cardbody, {
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

export default Card;