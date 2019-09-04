

//卡片区域
const CardArea={
    head:"card_main",  //表头主表
    body:["card_body"], //表体，多表体仍需完善
    headBtn:"card_head",//卡片表头按钮区域
    bodyBtn:"card_body",//卡片表体按钮区域
    lineBtn:"body_line"  //表体表格的行操作区域按钮
}

//列表区域
const ListArea={
    query:"list_query",  //查询区域
    head:"list_head",   //列表头区域
    headBtn:"list_head",  // 列表头按钮区域
    bodyBtn:"tab_inner",  //表体按钮区域
}

const PrimaryKey={
    head:"",    //主表主键
    body:[""],  //子表主键集合，根据显示顺序
    bill_no:""  //单据号字段
}

const ButtonAction={
    add:"add",  //新增
    edit:"edit",  //修改
    del:"delete",  //删除
    query:"query",  //查询
    refresh:"refresh",  //刷新
    save:"save",  //保存
    cancel:"cancel",  //取消
    addLine:"addLine", //表体肩部增行按钮
    delLines:"delLines",//表体肩部删除行按钮 删除选中行
    insertLine:"insertLine", //表体表格插行按钮
    delLine:"delLine",  ////表体表格删行按钮

    editLine:"editLine",  //表体表格编辑行按钮，暂未用到
    back:"back",  //返回



    expand: 'expand',
    fold: 'fold',
    unfold: 'unfold',
    // insertRow: 'insertRow',
    // delRow: 'delRow',
    // addRow: 'addRow',
    // deleteRow: 'deleteRow'
}

const BaseUrl="/nccloud/hk/action/";   //接口地址
//url
const RequestUrl = {

    save: `${BaseUrl}/save.do`,                       //保存
    delete: `${BaseUrl}/delete.do`,                   //删除
    queryCard: `${BaseUrl}/querycard.do`,                 //卡片查询
    queryList: `${BaseUrl}/querypage.do`,                 //列表查询
    queryListByPks: `${BaseUrl}/querypagebypk.do`,        //列表分页查询
    toCard: '/card',     //路由
    toList: '/list'    //路由

};


//领域名.模块名.节点名.自定义名
//缓存标示
const DataSource = 'tm.fmc.cost.datasource';

//查询区域缓存
const SearchCache = {
    key: 'tm.fmc.cost.searchCache',                //查询区域缓存Key
    dataSource: DataSource          //查询区域缓存数据的名称空间
}



const PageConfig={
    AppCode: '60080010',
    CardPage: '60080010_CARD',  //卡片页面编码
    ListPage:'60080010_LIST',  //列表页面编码
    node_type: '0'
}


export const configExt ={
    CardArea :CardArea,
    ListArea:ListArea,
    PrimaryKey:PrimaryKey,
    ButtonAction :ButtonAction,
    BaseUrl : BaseUrl,
    RequestUrl:RequestUrl,
    PageConfig:PageConfig,
    DataSource:DataSource,
    SearchCache:SearchCache,
}