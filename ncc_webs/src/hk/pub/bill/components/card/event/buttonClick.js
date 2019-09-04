import { promptBox } from 'nc-lightapp-front';
import { ListArea,ButtonAction} from '../../../constant';
import { cardBack, cardCreate, cardSave, cardUpdate, cardDelete, cardCancel, cardRefresh,bodySelectedEvent } from './cardOperator';




export function buttonClick(props, btnKey, hotkey, isFromSide ) {
    const {ButtonAction} =props.configExt;
    switch (btnKey) {
        //返回
        case ButtonAction.back:
            cardBack(props);
            break;

        //头部 新增
        case ButtonAction.add:
            cardCreate(props);
            break;

        //头部 保存
        case ButtonAction.save:
            cardSave(props, isFromSide);
            break;

        //头部 保存新增
        // case CARD_BUTTON.saveAdd:
        //     cardSave(props, isFromSide).then(flag => {
        //         if (flag) {
        //             cardCreate(props);
        //         }
        //     });
        //     break;

        //头部 修改
        case ButtonAction.edit:
            cardUpdate(props);
            break;

        //头部 删除
        case ButtonAction.delete:
            promptBox({
                color: 'warning',
                title: "删除",/* 国际化处理： 删除*/
                content: "确定删除吗？",/* 国际化处理： 确定删除吗？*/
                beSureBtnClick: () => {
                    cardDelete(props);
                }
            });
            break;

        // 头部 取消
        case ButtonAction.cancel:
            promptBox({
                color: 'warning',
                title: "取消",/* 国际化处理： 取消*/
                content: "是否确认要取消?",/* 国际化处理： 是否确认要取消?*/
                beSureBtnClick: () => {
                    cardCancel(props);
                }
            });
            break;

        //头部 刷新
        case ButtonAction.refresh:
            cardRefresh(props);
            break;

        default:
            break;
    }
}

//列表操作列按钮操作
export function bodyButtonClick(props,tabCode, key, text, record, index) {
    const {ButtonAction} =props.configExt;
    switch (key) {
        //行 新增
        case ButtonAction.addLine:
            props.cardTable.addRow(tabCode, undefined, {}, true);
            break;

        //行 删除
        case ButtonAction.delLines:
            let checkedRows = props.cardTable.getCheckedRows(tabCode);
            let chceckedIndex = checkedRows && checkedRows.map(item => item.index);
            if (checkedRows.length > 0) {
                props.cardTable.delRowsByIndex(tabCode,chceckedIndex);
            }
            bodySelectedEvent(props,tabCode);
            break;

        //行 展开
        // case CARD_BUTTON.expand:
        //     props.cardTable.openTabModel(CARD.table_code, 'edit', record, index);
        //     break;

        // //行 展开（浏览态）
        // case CARD_BUTTON.unfold:
        // //行 收起
        // case CARD_BUTTON.fold:
        //     props.cardTable.toggleTabRowView(CARD.table_code, record);
        //     break;

        //行 插行
        case ButtonAction.insertLine:
            props.cardTable.addRow(tabCode, index);
            break;

        //行 删行
        case ButtonAction.delLine:
            props.cardTable.delRowsByIndex(tabCode, index);
            bodySelectedEvent(props);
            break;
    }

}

//
// //点击查询，获取查询区数据
// export function searchBtnClick(props) {
//     listSearch(props);
// }