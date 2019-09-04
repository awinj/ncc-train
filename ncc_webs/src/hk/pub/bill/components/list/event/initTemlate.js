

//列表模板渲染
export function initTemplate(props, json) {
    const {PageConfig} =props.configExt;
    let config={
        pagecode: PageConfig.ListPage,       //页面code
        appcode: PageConfig.AppCode
    }
    props.createUIDom(config,(data) =>{
            register2Props(data,props);
        }
    );
}

function register2Props(data,props) {
    const {ButtonAction} =props.configExt;
    if (data) {
        if (data.button) {
            //将请求回来的按钮组数据设置到页面的 buttons 属性上
            let button = data.button;
            props.button.setButtons(button);
            props.button.setPopContent(ButtonAction.delLine, "确认要删除吗?");/* 国际化处理： 确认要删除吗?*/
        }
        if (data.template) {
            let meta = data.template;
            meta = modifierMeta(props, meta, {});
            props.meta.setMeta(meta);
        }
    }
}

function modifierMeta(props, meta, json) {
    const {ListArea} =props.configExt;
    //查询区参照过滤
    meta[ListArea.query].items.map((item) => {
        if (item.attrcode === 'pk_org') { //财务组织过滤
            item.isMultiSelectedEnabled = true; //财务组织多选
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam('c')//appcode获取
                };
            };
        }
    });

    //开启分页
    meta[ListArea.head].pagination = true;

    // meta[ListArea.head].items = meta[ListArea.head].items.map((item, key) => {
    //     if (item.attrcode == PRIMARTKEY.bill_no) {
    //         item.render = (text, record, index) => {
    //             return (
    //                 <a
    //                     style={{cursor: 'pointer'}}
    //                     onClick={() => {
    //                         props.pushTo(REQUESTURL.toCard, {
    //                             status: 'browse',
    //                             id: record[PRIMARTKEY.head_id].value,
    //                             pagecode: CARD.page_code
    //                         });
    //                     }}
    //                 >
    //                     {record[PRIMARTKEY.bill_no] && record[PRIMARTKEY.bill_no].value}
    //                 </a>
    //             );
    //         };
    //     }
    //     return item;
    // });

    //添加操作列
    meta[ListArea.head].items.push({
        itemtype: 'customer',
        attrcode: 'opr',
        label: "操作",/* 国际化处理： 操作*/
        width: '160px',
        fixed: 'right',
        className: "table-opr",
        visible: true,
        render: (text, record, index) => {
            let buttonAry = [];
            buttonAry = ['edit', 'delete'];

            return props.button.createOprationButton(buttonAry, {
                area: ListArea.bodyBtn,
                buttonLimit: 3,
                onButtonClick: (props, key) => bodyButtonClick({...props, json}, key, text, record, index)
            });
        }
    });

    return meta;
}

