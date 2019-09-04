
import {bodyButtonClick} from "./buttonClick"
import {buttonVisibilityControl} from './buttonVisibilityControl'

//列表模板渲染
export function initTemplate(props, json) {
    const {PageConfig}=props.configExt;
    let config={
        pagecode: PageConfig.CardPage,       //页面code
        appcode: PageConfig.AppCode
    }
    props.createUIDom(config,(data) =>{
            register2Props(data,props);
        }
    );
}

// 添加数据到props，其中包含设置分页
function register2Props(data,props) {
    if (data) {
        if (data.button) {
            let button = data.button;
            props.button.setButtons(button);
        }
        if (data.template) {
            let meta = data.template;
            meta = modifierMeta(props, meta, {});
            props.meta.setMeta(meta, () => {
                let status = props.getUrlParam('status');
                if (status === 'add') { //新增
                    props.initMetaByPkorg();
                }
                buttonVisibilityControl(props);
            });
        }
    }
}


function modifierMeta(props, meta, json) {
    //表头参照过滤
    const { CardArea,ButtonAction}=props.configExt;
    meta[CardArea.head].items.map(item => {
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
            label: "操作",/* 国际化处理： 操作*/
            itemtype: 'customer',
            fixed: 'right',
            className: 'table-opr',
            visible: true,
            width: 150,
            render: (text, record, index) => {

                let status = props.getUrlParam('status');
                let buttonAry = [];
                if (status === 'browse') { //浏览态
                    // buttonAry = [record.expandRowStatus ? ButtonAction.fold : ButtonAction.unfold];
                } else { //编辑态
                    buttonAry = [ ButtonAction.insertLine, ButtonAction.delLine];
                }
                return props.button.createOprationButton(buttonAry, {
                    area: CardArea.lineBtn,
                    onButtonClick: (prop, key) => bodyButtonClick(props,item, key, text, record, index)
                });
            }
        })
    }
    return meta;
}

