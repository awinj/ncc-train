/*****************************************************
 * 表单工具类
 *****************************************************/


/*****************************************************
 * 检查 元数据模板中是否含有指定的属性
 * 例如：meta,formId,"enablestate" 检查元数据模板中有无enablestate属性
 * @param meta
 * @param areacode
 * @param attrcode
 * @returns {boolean}
 *****************************************************/
const checkHasProps = (meta,areacode,attrcode)=>{
    
    //判断元数据中有我的表单元数据
    if(Object.prototype.toString.call(meta).slice(8, -1) === 'Object' && meta.hasOwnProperty(areacode)){
        let formMeta = meta[areacode];
        if(formMeta.code!=areacode){
            throw new Error("areacode和元数据模板不匹配，请确认！");
        }
        if(!formMeta.hasOwnProperty("items")){
            throw new Error("元数据没有属性项！");
        }
        //获得属性
        let items = formMeta.items;
        if(Object.prototype.toString.call(items).slice(8, -1) === 'Array'){
            return items.filter((item)=>{
                //查找属性
                if(item.hasOwnProperty("attrcode") && item.attrcode == attrcode){
                    return true;
                }
            });
        }
    }
    return false;
};
const convertEnableState = (enablestate,type)=>{

    const convert2DB = (value) =>{
      switch(value){
          case true:
              return {display:'已启用',value:'2'};
          case false:
              return {display:'已停用',value:'3'};
      }
    };
    const convert2Form = (value) =>{
        switch(value){
            case '1':
            case '3':
                return {display:false,value:false};
            case '2':
                return {display:true,value:true};
        }
    };
    if(!enablestate || !enablestate.hasOwnProperty('display') || !enablestate.hasOwnProperty('value')){
        throw new Error("请确认参数存在，并且含有display和value两个属性")
    }
    if(!type){
        type = 'db';
    }
    switch(type){
        case 'db':
            if(typeof(enablestate.value) ==='boolean'){
                return convert2DB(enablestate.value);
            }
            break;
        case 'form':
            if(typeof (enablestate.value)== 'string' && !isNaN(Number(enablestate.value)) ){
                return convert2Form(enablestate.value)
            }
    }


}

export {checkHasProps,convertEnableState}