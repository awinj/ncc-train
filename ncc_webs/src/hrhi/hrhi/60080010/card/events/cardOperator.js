import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { REQUESTURL, CARD, PRIMARTKEY, CARD_BUTTON, DATASOURCE } from '../../constant';
import { buttonVisibilityControl } from './buttonVisibilityControl';

let { updateCache, addCache, getNextId, deleteCacheById, getCacheById, getCurrentLastId } = cardCache;

//卡片返回
export function cardBack(props) {
    props.pushTo(REQUESTURL.toList, {});
}


//卡片新增
export function cardCreate(props) {
    props.setUrlParam({ status: 'add' });
    //单据有主组织，新增时,将其他字段设置为不可编辑
    props.initMetaByPkorg();
    //切换变更禁用的按钮
    toggleChangeDisableBtn(props, false);
    props.button.setButtonDisabled(CARD_BUTTON.addRow, true);
    clearAll(props);
    setByStatus(props);
}

/**
 * 根据状态设置卡片
 * @param {*} status  
 */
function setByStatus(props) {
    buttonVisibilityControl(props);
    let status = props.getUrlParam('status');
    //设置单据编号
    props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: status === 'browse',
        showBillCode: status === 'browse',
        billCode: props.form.getFormItemsValue(CARD.form_id, PRIMARTKEY.bill_no) && props.form.getFormItemsValue(CARD.form_id, PRIMARTKEY.bill_no).value
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
    let status = props.getUrlParam("status");
    //浏览态显示组织版本，编辑态显示组织
    let showflag = status == 'browse';
    let obj = {};
    obj[orgField] = !showflag;
    obj[orgVField] = showflag;
    props.form.setFormItemsVisible(CARD.form_id, obj);
}

/**
 * 切换变更禁用按钮（财务组织、增行等）
 *
 * @param {*} flag - 禁用状态 true:禁用 false:启用
 */
function toggleChangeDisableBtn(props, flag) {
    props.form.setFormItemsDisabled(CARD.form_id, { 'pk_org': flag });
    props.cardTable.setAllCheckboxAble(CARD.table_code, !flag);//禁用子表复选框
}

//清空表头表体数据
function clearAll(props) {
    props.form.EmptyAllFormValue(CARD.form_id);
    props.cardTable.setTableData(CARD.table_code, { rows: [] });
}

//卡片保存
export function cardSave(props, isFromSide) {
    return new Promise((resolve, rejected) => {
        let flag = props.form.isCheckNow(CARD.form_id) && props.cardTable.checkTableRequired(CARD.table_code);
        if (flag) {
            let data = props.createMasterChildData(CARD.page_code, CARD.form_id, CARD.table_code, 'cardTable');
            props.validateToSave(data, () => {

                let status = props.getUrlParam('status');
                ajax({
                    url: REQUESTURL.save,
                    data: data,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            toast({ color: 'success', content: props.json['36660FMC-000004'] });/* 国际化处理： 保存成功*/

                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(res.formulamsg);
                            }

                            let id = null;
                            if (res.data) {
                                if (res.data.head && res.data.head[CARD.form_id]) {
                                    id = res.data.head[CARD.form_id].rows[0].values[PRIMARTKEY.head_id].value;
                                    props.form.setAllFormValue({ [CARD.form_id]: res.data.head[CARD.form_id] });
                                }
                                if (res.data.body && res.data.body[CARD.table_code]) {
                                    props.cardTable.setTableData(CARD.table_code, res.data.body[CARD.table_code]);
                                }
                            }

                            props.setUrlParam({
                                id,
                                status: 'browse'
                            });

                            // 缓存
                            if (status === 'add') {
                                addCache(id, data, CARD.form_id, DATASOURCE);
                            } else {
                                updateCache(PRIMARTKEY.head_id, id, data, CARD.form_id, DATASOURCE);
                            }

                            setByStatus(props);

                            resolve(true);
                        }
                    }
                });

            }, { [CARD.table_code]: 'cardTable' });
        }
        if (isFromSide) {
            props.cardTable.closeModel(CARD.table_code);
        }
    })
}

//卡片修改
export function cardUpdate(props) {
    props.setUrlParam({ status: 'edit' });
    setByStatus(props);
}

//卡片删除
export function cardDelete(props) {
    let pk = props.form.getFormItemsValue(CARD.form_id, PRIMARTKEY.head_id).value || props.getUrlParam('id');

    ajax({
        url: REQUESTURL.delete,
        data: {
            pks: [pk]
        },
        success: (res) => {
            if (res.success) {
                toast({ color: 'success', content: props.json['60080010-000005'] });/* 国际化处理： 删除成功*/

                // 获取下一条数据的id
                let nextId = getNextId(pk, DATASOURCE);
                //删除缓存
                deleteCacheById(PRIMARTKEY.head_id, pk, DATASOURCE);
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
    clearAll(props);
    if (!isRefresh) {
        let cardData = getCacheById(id, DATASOURCE);
        if (cardData) {//有缓存
            cardData.head && props.form.setAllFormValue({ [CARD.form_id]: cardData.head[CARD.form_id] });
            cardData.body && props.cardTable.setTableData(CARD.table_code, cardData.body[CARD.table_code]);
            setByStatus(props);
            return;
        }
    }
    ajax({
        url: REQUESTURL.queryCard,
        data: {
            pk: id,
            pagecode: CARD.page_code
        },
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data && data.head) {
                    props.form.setAllFormValue({ [CARD.form_id]: data.head[CARD.form_id] });
                }
                if (data && data.body) {
                    props.cardTable.setTableData(CARD.table_code, data.body[CARD.table_code]);
                }
                // 更新缓存
                updateCache(PRIMARTKEY.head_id, id, data, CARD.form_id, DATASOURCE);
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
    let id = props.getUrlParam('id');
    props.setUrlParam({ status: 'browse' });
    if (id) { //有id切换编辑态
        props.form.cancel(CARD.form_id);
        props.cardTable.resetTableData(CARD.table_code);
        getCardData(props, id);
    } else { //没有id查缓存中最后一条数据
        let currentLastId = getCurrentLastId(DATASOURCE);
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