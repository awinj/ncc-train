


const CardArea={
    head:"card_main",
    body:["card_body"],
    headBtn:"card_head",
    bodyBtn:"card_body",
    lineBtn:"body_line"
}
const ListArea={
    query:"list_query",
    head:"list_head",
    headBtn:"list_head",
    bodyBtn:"tab_inner",
}

const PrimaryKey={
    head:"",
    body:[""],
    bill_no:""
}

const ButtonAction={
    add:"add",
    edit:"edit",
    del:"delete",
    query:"query",
    refresh:"refresh",
    save:"save",
    cancel:"cancel",
    addLine:"addLine",
    delLines:"delLines",//删除选中行
    insertLine:"insertLine",
    delLine:"delLine",

    editLine:"editLine",
    back:"back",



    expand: 'expand',
    fold: 'fold',
    unfold: 'unfold',
    // insertRow: 'insertRow',
    // delRow: 'delRow',
    // addRow: 'addRow',
    // deleteRow: 'deleteRow'
}

const BaseUrl="/nccloud/hk/action/";
//url
const RequestUrl = {

    save: `${BaseUrl}/save.do`,                       //保存
    delete: `${BaseUrl}/delete.do`,                   //删除
    queryCard: `${BaseUrl}/querycard.do`,                 //卡片查询
    queryList: `${BaseUrl}/querypage.do`,                 //列表查询
    queryListByPks: `${BaseUrl}/querypagebypk.do`,        //列表分页查询
    toCard: '/card',
    toList: '/list'

};


//领域名.模块名.节点名.自定义名
//缓存标示
const DataSource = 'tm.fmc.cost.datasource';

//查询区域缓存
const SearchCache = {
    key: 'tm.fmc.cost.searchCache',                //查询区域缓存Key
    dataSource: DataSource          //查询区域缓存数据的名称空间
}

//
//  export function pushTo (router,para)  {
//     let urlpara="";
//      for (let val in para) {
//          urlpara=urlpara+(val+"="+para[val]+"&");//输出如:name
//      }
//      urlpara=urlpara.substring(0,urlpara.length-1);
//      let url=window.location.toString();
//      let qindex=url.indexOf("?");
//      if(qindex>=0){
//          url=url.substring(0,qindex)
//      }
//      url=url+"?"+urlpara;
//
//      window.location=url;
// }

const PageConfig={
    AppCode: '60080010',
    CardPage: '60080010_CARD',
    ListPage:'60080010_LIST',
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