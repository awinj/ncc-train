/**
* @description: 常量
*/

//应用编码
export const APPCODE = '60080010';

/**
* @description: 多语
* @param moduleId: 多语资源名
* @param domainName: 工程名
*/
export const MULTILANG = {
        moduleId: '60080010',
        domainName: 'trainncc'
};

/**
 * 列表
 */
export const LIST = {
        page_title: 'TR101010-000011',                  //页面标题/* 国际化处理： 投融资费用*/

        page_code: '60080010p',                     //页面编码

        search_id: 'query',                        //查询区 
        table_id: 'billlist',                          //表格区 

        head_btn_code: 'list_head',                     //表头按钮区 
        body_btn_code: 'list_inner'                                             //表体表格按钮区
};

export const PRIMARTKEY = {
        head_id: "pk_quotation",                        //表头主键字段名
        body_id:   "pk_quotation_b",                          //表体主键字段名
        bill_no: 'billno'                                                           //单据编号字段名
};


/**
 * 卡片
 */
export const CARD = {
        page_title: 'TR101010-000011',                   //页面标题/* 国际化处理： 投融资费用*/

        page_code: '60080010p',                      //页面编码

        form_id: 'billhead',                            //表头表单区
        table_code: 'billbody',                         //表体表格区
        table_edit_code: 'card_body_edit',               //表体表格编辑态侧拉区
        table_browse_code: 'card_body_browse',           //表体表格浏览态下拉区

        head_btn_code: 'card_head',                      //表头按钮区
        shoulder_btn_code: 'card_body',                  //表体肩部按钮区
        body_btn_code: 'card_body1'                       //表体表格按钮区
};

//领域名.模块名.节点名.自定义名
//缓存标示
export const DATASOURCE = 'tm.fmc.cost.datasource';

//查询区域缓存 
export const SEARCHCACHE = {
        key: 'tm.fmc.cost.searchCache',                //查询区域缓存Key
        dataSource: DATASOURCE          //查询区域缓存数据的名称空间
}

//请求基础路径
export const base_path = '/nccloud/hrhi/sale';

//url
export const REQUESTURL = {
        
        save: `${base_path}/save.do`,                       //保存
        delete: `${base_path}/delete.do`,                   //删除
        queryCard: `${base_path}/querycard.do`,                 //卡片查询
        queryList: `${base_path}/querypage.do`,                 //列表查询
        queryListByPks: `${base_path}/querypagebypk.do`,        //列表分页查询
        toCard: '/card',
        toList: '/list'
        
};

export const LIST_BUTTON = {
        create: 'add',
        bodyUpdate: 'edit',
        bodyDelete: 'delete',
        refresh: 'RefreshBtn'
};

export const CARD_BUTTON = {
        save: 'SaveBtn',
        saveAdd: 'SaveAddBtn',
        cancel: 'CancelBtn',
        create: 'CreateBtn',
        update: 'UpdateBtn',
        delete: 'DeleteBtn',
        refresh: 'RefreshBtn',
        back: 'Back',

        expand: 'expand',
        fold: 'fold',
        unfold: 'unfold',
        insertRow: 'insertRow',
        delRow: 'delRow',
        addRow: 'addRow',
        deleteRow: 'deleteRow'
};


// export {CARD_BUTTON,LIST_BUTTON,REQUESTURL,base_path,SEARCHCACHE,DATASOURCE,CARD,PRIMARTKEY,LIST}