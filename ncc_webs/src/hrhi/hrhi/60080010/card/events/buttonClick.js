import { promptBox } from 'nc-lightapp-front';
import { CARD_BUTTON } from '../../constant';
import { cardBack, cardCreate, cardSave, cardUpdate, cardDelete, cardCancel, cardRefresh } from './cardOperator';

/**
* @description: 卡片页头部按钮操作
* @param: isFromSide 是否来自侧拉区域
* @param: id 当前按钮名
*/
export function buttonClick(props, id, hotkey, isFromSide) {
    switch (id) {
        //返回
        case CARD_BUTTON.back:
            cardBack(props);
            break;

        //头部 新增
        case CARD_BUTTON.create:
            cardCreate(props);
            break;

        //头部 保存
        case CARD_BUTTON.save:
            cardSave(props, isFromSide);
            break;

        //头部 保存新增
        case CARD_BUTTON.saveAdd:
            cardSave(props, isFromSide).then(flag => {
                if (flag) {
                    cardCreate(props);
                }
            });
            break;

        //头部 修改
        case CARD_BUTTON.update:
            cardUpdate(props);
            break;

        //头部 删除
        case CARD_BUTTON.delete:
            promptBox({
                color: 'warning',
                title: props.json['60080010-000000'],/* 国际化处理： 删除*/
                content: props.json['60080010-000001'],/* 国际化处理： 确定删除吗？*/
                beSureBtnClick: () => {
                    cardDelete(props);
                }
            });
            break;

        // 头部 取消
        case CARD_BUTTON.cancel:
            promptBox({
                color: 'warning',
                title: props.json['60080010-000002'],/* 国际化处理： 取消*/
                content: props.json['60080010-000003'],/* 国际化处理： 是否确认要取消?*/
                beSureBtnClick: () => {
                    cardCancel(props);
                }
            });
            break;

        //头部 刷新
        case CARD_BUTTON.refresh:
            cardRefresh(props);
            break;

        default:
            break;
    }
}
