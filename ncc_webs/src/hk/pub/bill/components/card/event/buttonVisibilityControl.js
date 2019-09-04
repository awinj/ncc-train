import { ButtonAction,CardArea } from '../../../constant';

/**
* @description: 卡片按钮可见性
*/
export function buttonVisibilityControl(props) {
    const {ButtonAction,CardArea} =props.configExt;
    let status = props.getUrlParam('status');
    let id = props.getUrlParam('id');
    let isBrowse = status === 'browse'||status=== undefined;
    //单据状态
    // let busistatus = props.form.getFormItemsValue(CARD.form_id, 'busistatus') && props.form.getFormItemsValue(CARD.form_id, 'busistatus').value;

    let btnObj = {};
    //将要显示的按钮
    let showBtn = [];
    //禁用的按钮
    let disabledBtn = [ButtonAction.delLines];
    //编辑态显示按钮
    let editBtn = [ButtonAction.save,  ButtonAction.cancel, ButtonAction.addLine, ButtonAction.delLines,
        ButtonAction.insertLine,ButtonAction.delLine];
    //获得所有按钮编码（但此处不包括按钮组下的按钮）
    let buttons = props.button.getButtons().map(item => item.key);
    //(有重复的按钮编码，但无妨)
    let allBtns = [...buttons, ...editBtn, ButtonAction.add, ButtonAction.edit, ButtonAction.delete];
    if (!isBrowse) { //编辑态

        showBtn = editBtn;

    } else { //浏览态
        if (!id) {//点击新增然后点击取消后

            showBtn = [ButtonAction.add];

        } else {//单据浏览态
            let commonBtn = [ButtonAction.refresh];
            showBtn = [ButtonAction.add, ButtonAction.edit, ButtonAction.delete, ...commonBtn];
        }
    }
    for (let item of allBtns) {
        btnObj[item] = showBtn.includes(item);
    }
    props.button.setButtonVisible(btnObj);
    props.button.setButtonDisabled(disabledBtn, true);
    props.cardTable.setStatus(CardArea.body, isBrowse ? 'browse' : 'edit');
    props.form.setFormStatus(CardArea.head, status);
}
