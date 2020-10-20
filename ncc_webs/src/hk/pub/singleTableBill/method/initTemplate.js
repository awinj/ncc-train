


function initTemplate(props, {pagecode,appcode}, json,callback)  {
    props.createUIDom({
            pagecode,       //页面code
            appcode
        }, (data) => {
            if (data) {
                if (data.button) {
                    //将请求回来的按钮组数据设置到页面的 buttons 属性上
                    let button = data.button;
                    props.button.setButtons(button);
                }
                if (data.template) {
                    let meta = data.template;

                    for (let item of Object.keys(meta.gridrelation)) {
                        meta[item].items.push({
                            attrcode: 'opr',
                            label: '操作',/* 国际化处理： 操作*/
                            itemtype: 'customer',
                            fixed: 'right',
                            className: 'table-opr',
                            visible: true,
                            width: 150,
                            render: (text, record, index) => {
                                const isEdit = this.state.isEdit;
                                const {cardButton}=this.appConfig;
                                let buttonAry = [];
                                if (!isEdit) { //浏览态
                                    buttonAry = [record.expandRowStatus ? cardButton.fold : cardButton.unfold];
                                } else { //编辑态
                                    buttonAry = [cardButton.expand, cardButton.insertRow, cardButton.delRow];
                                }
                                return props.button.createOprationButton(buttonAry, {
                                    area: 'body',
                                });
                            }
                        })
                    }

                    props.meta.setMeta(meta,callback);
                }
            }
        }
    );
}

export {initTemplate}