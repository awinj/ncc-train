import { CARD, CARD_BUTTON } from '../../constant';

/**
* @description: 卡片按钮可见性
*/
export function buttonVisibilityControl(props) {
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse';
    //单据状态
    // let busistatus = props.form.getFormItemsValue(CARD.form_id, 'busistatus') && props.form.getFormItemsValue(CARD.form_id, 'busistatus').value;

    let btnObj = {};
    //将要显示的按钮
    let showBtn = [];
    //禁用的按钮
    let disabledBtn = [CARD_BUTTON.deleteRow];
    //编辑态显示按钮
    let editBtn = [CARD_BUTTON.save, CARD_BUTTON.saveAdd, CARD_BUTTON.cancel, CARD_BUTTON.addRow, CARD_BUTTON.deleteRow, CARD_BUTTON.insertRow, CARD_BUTTON.delRow, CARD_BUTTON.expand];
    //获得所有按钮编码（但此处不包括按钮组下的按钮）
    let buttons = props.button.getButtons().map(item => item.key);
    //(有重复的按钮编码，但无妨)
    let allBtns = [...buttons, ...editBtn, CARD_BUTTON.create, CARD_BUTTON.update, CARD_BUTTON.delete];
    if (!isBrowse) { //编辑态

        showBtn = editBtn;

    } else { //浏览态
        if (!id) {//点击新增然后点击取消后

            showBtn = [CARD_BUTTON.create];

        } else {//单据浏览态
            let commonBtn = [CARD_BUTTON.refresh, CARD_BUTTON.fold, CARD_BUTTON.unfold];
            // switch (busistatus) {
            //             //     case '0':	//待提交
            //             //         showBtn = [CARD_BUTTON.create, CARD_BUTTON.update, CARD_BUTTON.delete, ...commonBtn];
            //             //         break;
            //             //     default:
            //             //         showBtn = [CARD_BUTTON.create, ...commonBtn];
            //             //         break;
            //             // }
            showBtn = [CARD_BUTTON.create, CARD_BUTTON.update, CARD_BUTTON.delete, ...commonBtn];
        }
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn, true);
    props.cardTable.setStatus(CARD.table_code, isBrowse ? 'browse' : 'edit');
    props.form.setFormStatus(CARD.form_id, status);
}
