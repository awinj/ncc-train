import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { buttonVisibilityControl } from './buttonVisibilityControl';

let { updateCache, addCache, getNextId, deleteCacheById, getCacheById, getCurrentLastId } = cardCache;

//卡片返回
export function cardBack(props) {
    const {RequestUrl}=props.configExt;
    props.pushTo(RequestUrl.toList, {});
}


//卡片新增
export function cardCreate(props) {
    const {ButtonAction}=props.configExt;
    props.setUrlParam({ status: 'add' });
    //单据有主组织，新增时,将其他字段设置为不可编辑
    props.initMetaByPkorg();
    //切换变更禁用的按钮
    toggleChangeDisableBtn(props, false);
    props.button.setButtonDisabled(ButtonAction.addLine, true);
    clearAll(props);
    setByStatus(props);
}

/**
 * 根据状态设置卡片
 * @param {*} status
 */
function setByStatus(props) {
    const {CardArea, PrimaryKey, ButtonAction, DataSource, PageConfig}=props.configExt;
    buttonVisibilityControl(props);
    let status = props.getUrlParam('status');
    //设置单据编号
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status === 'browse',
        showBillCode: status === 'browse',
        billCode: props.form.getFormItemsValue(CardArea.head, PrimaryKey.bill_no) && props.form.getFormItemsValue(CardArea.head, PrimaryKey.bill_no).value
    });
    if (status !== 'add') {
        props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
    }
    //orgVersionView(props);//组织版本视图
}

/**
 * 组织多版本视图
 * @param {*} props
 * @param {*} headCode
 * @param {*} orgField (主组织字段名，默认pk_org,可自行注入，非必输)
 * @param {*} orgVField (主组织版本字段名，默认pk_org_v,可自行注入，非必输)
 */
function orgVersionView(props, orgField = 'pk_org', orgVField = 'pk_org_v') {

    const { CardArea}=props.configExt;
    let status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    let showflag = status == 'browse';
    let obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setFormItemsVisible(CardArea.head, obj);
}

/**
 * 切换变更禁用按钮（财务组织、增行等）
 *
 * @param {*} flag - 禁用状态 true:禁用 false:启用
 */
function toggleChangeDisableBtn(props, flag) {
    const {CardArea}=props.configExt;
    props.form.setFormItemsDisabled(CardArea.head, { 'pk_org': flag });
    CardArea.body.map(tabcode=>{
        props.cardTable.setAllCheckboxAble(tabcode, !flag);//禁用子表复选框
    })

}

//清空表头表体数据
function clearAll(props) {
    const { CardArea}=props.configExt;
    props.form.EmptyAllFormValue(CardArea.head);
    CardArea.body.map(tabcode=>{
        props.cardTable.setTableData(tabcode, { rows: [] });
    })

}

//卡片保存
export function cardSave(props, isFromSide) {
    const {RequestUrl, CardArea, PrimaryKey,  DataSource, PageConfig}=props.configExt;
    return new Promise((resolve, rejected) => {

        //保存前必填字段校验
        let flag=props.form.isCheckNow(CardArea.head);
        for(let i in CardArea.body){
            flag=flag&props.cardTable.checkTableRequired(CardArea.body[i]);
        }
        if (flag) {
            let data = props.createMasterChildData(PageConfig.CardPage, CardArea.head, CardArea.body[0]);
            if(CardArea.body.length>1){//一主多子
                data=props.createExtCardData(PageConfig.CardPage, CardArea.head, CardArea.body[0]);
            }
            props.validateToSave(data, () => {

                let status = props.getUrlParam('status');
                ajax({
                    url: RequestUrl.save,
                    data: data,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            toast({ color: 'success', content: "保存成功" });/* 国际化处理： 保存成功*/

                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(res.formulamsg);
                            }

                            let id = null;
                            if (res.data) {
                                if (res.data.head && res.data.head[CardArea.head]) {
                                    id = res.data.head[CardArea.head].rows[0].values[PrimaryKey.head].value;
                                    props.form.setAllFormValue({ [CardArea.head]: res.data.head[CardArea.head] });
                                }
                                for(let tabCode of CardArea.body){
                                    if (res.data.body && res.data.body[tabCode]) {
                                        props.cardTable.setTableData(tabCode, res.data.body[tabCode]);
                                    }
                                }
                            }

                            props.setUrlParam({
                                id,
                                status: 'browse'
                            });

                            // 缓存
                            if (status === 'add') {
                                addCache(id, data, CardArea.head, DataSource);
                            } else {
                                updateCache(PrimaryKey.head, id, data, CardArea.head, DataSource);
                            }

                            setByStatus(props);

                            resolve(true);
                        }
                    }
                });

            }, { [CardArea.body[0]]: 'cardTable' });
        }
        // if (isFromSide) {
        //     props.cardTable.closeModel(CardArea.body);
        // }
    })
}

//卡片修改
export function cardUpdate(props) {
    props.setUrlParam({ status: 'edit' });
    setByStatus(props);
}

//卡片删除
export function cardDelete(props) {
    const {RequestUrl, CardArea, PrimaryKey, ButtonAction, DataSource}=props.configExt;
    let pk = props.form.getFormItemsValue(CardArea.head, PrimaryKey.head).value || props.getUrlParam('id');

    ajax({
        url: RequestUrl.delete,
        data: {
            pks: [pk]
        },
        success: (res) => {
            if (res.success) {
                toast({ color: 'success', content:"删除成功" });/* 国际化处理： 删除成功*/

                // 获取下一条数据的id
                let nextId = getNextId(pk, DataSource);
                //删除缓存
                deleteCacheById(PrimaryKey.head, pk, DataSource);
                let lastId = nextId ? nextId : null;
                props.setUrlParam({ status: 'browse', id: lastId });
                if (nextId) {
                    getCardData(props, nextId);
                } else {// 删除的是最后一个的操作
                    clearAll(props);
                    setByStatus(props);
                }
            }
        }
    });
}

/**
 * 卡片详情
 * @param {*} id         单据id
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCardData(props, id, isRefresh = false) {
    const {RequestUrl, CardArea, PrimaryKey,  DataSource, PageConfig}=props.configExt;
    clearAll(props);
    if (!isRefresh) {
        let cardData = getCacheById(id, DataSource);
        if (cardData) {//有缓存
            cardData.head && props.form.setAllFormValue({ [CardArea.head]: cardData.head[CardArea.head] });
            if(cardData.body instanceof Array){
                cardData.body && props.cardTable.setMulTablesData(cardData);
            }
            else{
                cardData.body && props.cardTable.setTableData(CardArea.body, cardData.body[CardArea.body[0]]);
            }
            setByStatus(props);
            return;
        }
    }
    ajax({
        url: RequestUrl.queryCard,
        data: {
            pk: id,
            pagecode: PageConfig.CardPage
        },
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data && data.head) {
                    props.form.setAllFormValue({ [CardArea.head]: data.head[CardArea.head] });
                }
                if (data && data.body) {
                    if(data.body instanceof Array){
                        data.body && props.cardTable.setMulTablesData(data);
                    }
                    else{
                        data.body && props.cardTable.setTableData(CardArea.body, data.body[CardArea.body[0]]);
                    }
                }
                // 更新缓存
                updateCache(PrimaryKey.head, id, data, CardArea.head, DataSource);
                setByStatus(props);
            }
        },
        error: (res) => {
            toast({ color: 'danger', content: res.message });
            clearAll(props);
            setByStatus(props);
        }
    });
}

//卡片取消
export function cardCancel(props) {
    const { CardArea, DataSource}=props.configExt;
    let id = props.getUrlParam('id');
    props.setUrlParam({ status: 'browse' });
    if (id) { //有id切换编辑态
        props.form.cancel(CardArea.head);
        for(let tabCode of CardArea.body){
            props.cardTable.resetTableData(tabCode);
        }
        getCardData(props, id);
    } else { //没有id查缓存中最后一条数据
        let currentLastId = getCurrentLastId(DataSource);
        let lastId = currentLastId ? currentLastId : '';
        props.setUrlParam({ id: lastId });
        if (lastId) {
            getCardData(props, lastId);
        } else {
            clearAll(props);
            setByStatus(props);
        }
    }
}

//卡片刷新
export function cardRefresh(props) {
    let id = props.getUrlParam('id');
    getCardData(props, id, true);
}

/**
 * 卡片分页
 * @param {*} props  页面内置对象
 * @param {*} pk    下一页的pk
 */
export function pageClick(props, id) {
    props.setUrlParam({ status: 'browse', id });
    getCardData(props, id);
}







//单选
export function bodySelectedEvent(props, moduleId, record, index, status) {
    const { ButtonAction}=props.configExt;
    const disabledBtn = [ButtonAction.delLines];
    let checkedRows = props.cardTable.getCheckedRows(moduleId);
    if (checkedRows.length > 0) {
        props.button.setButtonDisabled(disabledBtn, false);
    } else {
        props.button.setButtonDisabled(disabledBtn, true);
    }
}

//全选
export function bodySelectedAllEvent(props, moduleId, status, length) {
    const { ButtonAction}=props.configExt;
    const disabledBtn = [ButtonAction.delLines];
    props.button.setButtonDisabled(disabledBtn, !status);
}
