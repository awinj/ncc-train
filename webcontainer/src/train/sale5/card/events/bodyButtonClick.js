import { CARD_BUTTON, CARD } from '../../constant';
import { bodySelectedEvent } from './bodySelectedEvent';

/**
* @description: 表体按钮点击事件
* @param: key 当前触发按钮名称
* @param: index 当前行序
* @param: record 当前行信息
*/
export function bodyButtonClick(props, key, text, record, index) {
    switch (key) {
        //行 新增
        case CARD_BUTTON.addRow:
            props.cardTable.addRow(CARD.table_code, undefined, {}, true);
            break;

        //行 删除
        case CARD_BUTTON.deleteRow:
            let checkedRows = props.cardTable.getCheckedRows(CARD.table_code);
            let chceckedIndex = checkedRows && checkedRows.map(item => item.index);
            if (checkedRows.length > 0) {
                props.cardTable.delRowsByIndex(CARD.table_code, chceckedIndex);
            }
            bodySelectedEvent(props);
            break;

        //行 展开
        case CARD_BUTTON.expand:
            props.cardTable.openTabModel(CARD.table_code, 'edit', record, index);
            break;

        //行 展开（浏览态）
        case CARD_BUTTON.unfold:
        //行 收起
        case CARD_BUTTON.fold:
            props.cardTable.toggleTabRowView(CARD.table_code, record);
            break;

        //行 插行
        case CARD_BUTTON.insertRow:
            props.cardTable.addRow(CARD.table_code, index);
            break;

        //行 删行
        case CARD_BUTTON.delRow:
            props.cardTable.delRowsByIndex(CARD.table_code, index);
            bodySelectedEvent(props);
            break;
    }
    if (![CARD_BUTTON.unfold, CARD_BUTTON.fold].includes(key)) {
        props.cardTable.setStatus(CARD.table_code, 'edit');
    }
}
