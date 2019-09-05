import { ajax, cardCache, toast } from 'nc-lightapp-front';


//列表新增
export function listCreate(props) {
    const {RequestUrl,PageConfig} =props.configExt;
    props.pushTo(RequestUrl.toCard, {
        status: 'add',
        pagecode: PageConfig.CardPage
    });
}

//列表刷新
export function listRefresh(props) {
    const {SearchCache,PageConfig} =props.configExt;
    let { getDefData } = cardCache;
    let queryInfo = getDefData(SearchCache.key, SearchCache.dataSource);
    listSearch(props, queryInfo);
}

//列表修改
export function listEdit(props, pk) {
    const {RequestUrl,PageConfig} =props.configExt;
    props.pushTo(RequestUrl.toCard, {
        status: 'edit',
        id: pk,
        pagecode: PageConfig.CardPage
    });
}

//列表删除
export function listDelete(props, pk, index) {
    const {ListArea,RequestUrl} =props.configExt;
    ajax({
        url: RequestUrl.delete,
        data: { pks: [pk] },
        success: (res) => {
            if (res.success) { //成功
                props.table.deleteCacheId(ListArea.head, pk);
                props.table.deleteTableRowsByIndex(ListArea.head, index);
                toast({ color: 'success', content: "删除成功" });/* 国际化处理： 删除成功*/
            } else { //失败
                toast({ color: 'warning', content: "删除失败" });/* 国际化处理： 删除失败*/
            }
        }
    });
}

function getTablePageInfo(props,moduleId) {
    if (typeof moduleId == 'string') {
        if (props.myTable[moduleId]) {
            let { pageIndex = 0, pageSize = 10 } = props.myTable[moduleId].state.table.pageInfo;
            return {
                pageIndex: pageIndex > 0 ? pageIndex - 1 : 0,
                pageSize
            };
        } else {
            let { pageIndex = 0, pageSize = 10 } = props.myTableData[moduleId].pageInfo;
            return {
                pageIndex: pageIndex > 0 ? pageIndex - 1 : 0,
                pageSize
            };
        }
    }
    return { pageIndex: 0, pageSize: 10 };
}

//列表查询
export function listSearch(props, queryInfo) {
    const {ListArea,RequestUrl,PageConfig,ButtonAction,SearchCache} =props.configExt;
    // let pageInfo=getTablePageInfo(props,ListArea.head);
    let pageInfo = props.table.getTablePageInfo(ListArea.head);
    if (!queryInfo) {
        queryInfo = props.search.getQueryInfo(ListArea.query);
    }
    queryInfo.pageInfo = pageInfo;
    queryInfo.pageCode = PageConfig.ListPage;

    // 刷新按钮可用
    props.button.setDisabled({ [ButtonAction.refresh]: false });

    ajax({
        url: RequestUrl.queryList,
        data: queryInfo,
        success: (res) => {
            let { success, data } = res;
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(res.formulamsg);
            }
            if (success && data && data[ListArea.head]) {
                props.table.setAllTableData(ListArea.head, data[ListArea.head]);
                toast({ color: 'success' });
            } else {
                props.table.setAllTableData(ListArea.head, { rows: [] });
                toast({ color: 'warning', content: "未查询出符合条件的数据！"});/* 国际化处理： 未查询出符合条件的数据！*/
            }

            // 将查询条件缓存
            let { setDefData } = cardCache;
            setDefData(SearchCache.key, SearchCache.dataSource, queryInfo);
        }
    });
}

//分页查询
export function pageInfoClick(props, config, pks) {
    const {ListArea,RequestUrl,PageConfig} =props.configExt;
    let data = {
        pks,
        pagecode: PageConfig.ListPage
    };

    ajax({
        url: RequestUrl.queryListByPks,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success && data && data[ListArea.head]) {
                props.table.setAllTableData(ListArea.head, data[ListArea.head]);
                toast({ color: 'success' });
            } else {
                props.table.setAllTableData(ListArea.head, { rows: [] });
                toast({ color: 'warning', content: "未查询出符合条件的数据！"});/* 国际化处理： 未查询出符合条件的数据！*/
            }
        }
    });
}

//列表行双击
export function handleDoubleClick(record, index, props) {
    const {RequestUrl,PageConfig,PrimaryKey} =props.configExt;
    props.pushTo(RequestUrl.toCard, {
        status: 'browse',
        id: record[PrimaryKey.head].value,
        pagecode: PageConfig.CardPage,
        scene: props.getUrlParam('scene')
    });
};


export function listDidMount(props) {
    const {ButtonAction,SearchCache} =props.configExt;
    let { getDefData } = cardCache;
    if (getDefData(SearchCache.key, SearchCache.dataSource)) {
        props.button.setDisabled({
            [ButtonAction.delete]: true,
            [ButtonAction.refresh]: false
        });
    } else {
        props.button.setDisabled({
            [ButtonAction.delete]: true,
            [ButtonAction.refresh]: true
        });
    }
}