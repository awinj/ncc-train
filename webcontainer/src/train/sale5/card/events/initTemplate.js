import { CARD, APPCODE, CARD_BUTTON } from '../../constant';
import { bodyButtonClick } from './bodyButtonClick';
import { buttonVisibilityControl } from './buttonVisibilityControl';

/**
* @description: 卡片模板渲染
*/
export function initTemplate(props, json) {
        props.createUIDom(
                {
                        pagecode: CARD.pagecode,//页面pagecode
                        appcode: APPCODE
                },
                (data) => {
                        if (data) {
                                if (data.button) {
                                        let button = data.button;
                                        props.button.setButtons(button);
                                }
                                if (data.template) {
                                        let meta = data.template;
                                        meta = modifierMeta(props, meta, json);
                                        props.meta.setMeta(meta, () => {
                                                let status = props.getUrlParam('status');
                                                if (status === 'add') { //新增
                                                        props.initMetaByPkorg();
                                                        buttonVisibilityControl(props);
                                                }
                                        });
                                }
                                //表体统一参照过滤
                                /*
                                props.cardTable.setQueryCondition(CARD.table_code, {
                                                                                
                                });
                                */
                        }
                }
        )
}

function modifierMeta(props, meta, json) {
        //表头参照过滤
        meta[CARD.form_id].items.map(item => {
                if (item.attrcode === 'pk_org') { //财务组织
                        item.queryCondition = () => {
                                return {
                                        funcode: props.getSearchParam('c')//appcode获取
                                };
                        };
                }
        });

        for (let item of Object.keys(meta.gridrelation)) {
                meta[item].items.push({
                        attrcode: 'opr',
                        label: json['60080010-000006'],/* 国际化处理： 操作*/
                        itemtype: 'customer',
                        fixed: 'right',
                        className: 'table-opr',
                        visible: true,
                        width: 150,
                        render: (text, record, index) => {

                                let status = props.getUrlParam('status');
                                let buttonAry = [];
                                if (status === 'browse') { //浏览态
                                        buttonAry = [record.expandRowStatus ? CARD_BUTTON.fold : CARD_BUTTON.unfold];
                                } else { //编辑态
                                        buttonAry = [CARD_BUTTON.expand, CARD_BUTTON.insertRow, CARD_BUTTON.delRow];
                                }
                                return props.button.createOprationButton(buttonAry, {
                                        area: CARD.body_btn_code,
                                        onButtonClick: (props, key) => bodyButtonClick(props, key, text, record, index)
                                });
                        }
                })
        }
        return meta;
}
