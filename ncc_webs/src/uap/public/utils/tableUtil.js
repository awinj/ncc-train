/**
 * 表格操作的通用工具类
 * @author  yinshb
 */

 /**
  * 将保存后返回的数据更新到页面中
  * @param allData  页面获取的表格数据
  * @param reDataRows   保存后返回的行
  */
 export function filterResult(allData,reDataRows){
    if(!reDataRows) return;
    if(allData.rows){
        allData.rows.forEach((item,index) => {
            reDataRows.forEach((it,i) => {
                if(it.rowid === item.rowid){
                    allData.rows[index] = it;
                }
            });
        });
    }
 }

 /**
 * 表格数查询启用状态值转化
 * @param rows数组
 */
export function convertGridEnablestate(rows,enablestate='enablestate'){
    if(rows && rows.length>0){
        rows.map((ele,key)=>{
            if(ele.values[enablestate].value ==='2'){
                ele.values[enablestate].value = true;
            }else if(ele.values[enablestate].value ==='1'||ele.values[enablestate].value ==='3') {
                ele.values[enablestate].value = false;
            }else if(ele.values[enablestate].value ===true){
                ele.values[enablestate].value = '2'
            }else if(ele.values[enablestate].value ===false){
                ele.values[enablestate].value = '3'
            }else{
                ele.values[enablestate].value = '1'
            }
        });
    }
    return rows;
}


/**
 * 过来表格删除的行
 * @param  rows 页面表格中行数据的数组
 */
export function filterDelRows(rows){
    rows.filter(item => item.status != '3');
}

/**
 * 后台返回表格数处理
 * @param   props   prpos参数
 * @param   tableid 表格id
 * @param   data    后台返回数据对象
 * @param   empty   数据为空时执行回调方法
 * @param   notEmpty    数据不为空时执行回调方法
 * @param   after   处理完成后执行回到方法
 */
export function handleTableReData({props,tableid,data,empty,notEmpty,after}={}){
    if(!data || !(data[tableid] || data.model) || !(data[tableid].rows || data.model.rows)){
        //后台返回的为空数据
        data = Object;
        data[tableid] = {areacode:tableid,rows:[]};
        if(typeof empty === 'function'){
            empty(data);
            props.editTable.setTableData(tableid, data[tableid]);
        }
    }else{
        if(typeof notEmpty === 'function'){
            notEmpty(data);
            props.editTable.setTableData(tableid, data[tableid]?data[tableid]:data.model);
        }
    }
    if(typeof after === 'function'){
        after(data);
    }
}