import {promptBox } from 'nc-lightapp-front';

export  default function ({
                              'title':title,
                              'content':content,
                              'beSureBtnClick':functionSure,
                              'cancelBtnClick':functionCancel,
                              'closeBtnClick':functionClose,
                              'leftBtnName':leftBtnName,
                              'rightBtnName':rightBtnName}) {
    promptBox({
        color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
        title: title,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
        content: content,             // 提示内容,非必输
        noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
        noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
        beSureBtnName: leftBtnName  || '确定',          // 确定按钮名称, 默认为"确定",非必输
        cancelBtnName: rightBtnName ||'取消', // 取消按钮名称, 默认为"取消",非必输
        hasCloseBtn:false,
        beSureBtnClick: functionSure,   // 确定按钮点击调用函数,非必输
        cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
        closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
        closeByClickBackDrop:true,//点击遮罩关闭提示框，默认是true点击关闭，阻止关闭是false

    })

}