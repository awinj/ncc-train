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
 * 单表批量删除数据时可调用此方法转化enablestate
 * @param rows数组
 */
export function convertDelData(selectedData,enablestate='enablestate'){
    let indexArr=[];
    let dataArr=[];
    if(selectedData && selectedData.length>0){
        selectedData.forEach((val) => {
            let data = val.data.values;
            if(data[enablestate]!=null){
                if(data[enablestate] === true){
                    data[enablestate] = {value: '2'};
                }else if(data[enablestate] ===false){
                    data[enablestate] = {value: '3'};
                }else{
                    data[enablestate] = {value: '1'};
                }
            }
            let delObj = {
                status: '3',
                rowId: val.data.rowId,
                values: data
            };
            dataArr.push(delObj);
            indexArr.push(val.index);
        });
    }
    return {indexArr,dataArr};
}


/**
 * 过来表格删除的行
 * @param  rows 页面表格中行数据的数组
 */
export function filterDelRows(rows){
    let length = rows.length-1;
    for(;length>=0;length--){
        if(rows[length].status === '3'){
            rows.splice(length,1);
        }
    }
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
            //props.editTable.setTableData(tableid, data[tableid]);
        }
    }else{
        if(typeof notEmpty === 'function'){
            notEmpty(data);
            //props.editTable.setTableData(tableid, data[tableid]?data[tableid]:data.model);
        }
    }
    if(typeof after === 'function'){
        after(data);
    }
}

/*************************************************************
 * 根据表格数据数组中的对象的某属性或某几个值来过滤数据
 *
 * 常用于表格数据的简单过滤与简单查询
 * @param arrObj 对象数组
 * @param attrName 单个属性名称或多属性名称数组
 * @param attrValue 属性过滤值
 * @returns {result}
 *************************************************************/
const filterArraybyAttr = (arrObj,attrName,attrValue)=> {
    if(!(arrObj && arrObj.length && attrValue && attrValue.length && attrName && attrName.length)){
        return arrObj;
    }
    let result = [];
    let attrNameNum = [...attrName];
    arrObj.forEach((obj)=>{
        for(let i=0;i<attrNameNum.length;i++){
            if(obj.values[attrNameNum[i]].value.contains(attrValue)){
                result[result.length] = obj;
                break;
            }
        }
    });
    return result;
};

 /*************************************************************
 * 根据表格数据数组中的对象的某pk属性值是否在pks中来过滤数据
 *
 * @param arrObj 对象数组
 * @param attrName 属性名称
 * @param pks pk数组
 * @returns {result}
 *************************************************************/
const filterArraybyPks = (arrObj,pkAttrName,pks)=> {
    if(!(arrObj && arrObj.length && pkAttrName && pkAttrName.length && pks && pks.length)){
        return arrObj;
    }
    let result = [];
    arrObj.forEach((obj) => {
        for(let i=0;i<pks.length;i++){
            if(obj.values[pkAttrName].value === pks[i]){
                result[result.length] = obj;
                break;
            }
        }
    });
    return result;
};

export {filterArraybyAttr,filterArraybyPks}
