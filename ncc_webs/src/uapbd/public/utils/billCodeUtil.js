import {ajax,toast} from 'nc-lightapp-front';
let urls = {
    queryCurrOrg : "/nccloud/uapbd/bankacc/querycurrorg.do",
    queryBillCode : "/nccloud/uapbd/bankacc/querybillcode.do"
}

let oldCode;
class BillCodeUtil{
    constructor(
        nodeType= 'glb',
        billTypeCode = '',
        type = 'add',
        props,
        formId = '',
        itemcode = '',
        classname = ''){
        this.config = {
            nodeType:nodeType,
            itemcode :itemcode,
            type:type,
            props:props,
            formId :formId,
            billTypeCode:billTypeCode,
            classname : classname
        }
        this.getCurrOrg = this.getCurrOrg.bind(this);
        this.setType = this.setType.bind(this);
        this.getBillCode = this.getBillCode.bind(this);
        this.convertFormData = this.convertFormData.bind(this);
        this.setCode = this.setCode.bind(this);
        this.getCurrOrg();
    }

    /**
     * 查询当前登录信息
     */
    getCurrOrg = () =>{
        var me = this;
        let requestparam = {
            type:me.config.nodeType
        }
        ajax({
            url: urls['queryCurrOrg'],
            data:requestparam,
            success: function (res) {
                let {data,success} = res;
                if(success){
                    if(data){
                        me.config.pk_org = data.pk_org;
                        me.config.pk_group = data.pk_group;
                    }
                }
            }
        })
    }
    setType = (newType)=>{
        var me = this;
        me.config.type = newType;
    }
    setCode = (newCode) =>{
        let me = this;
        me.config.oldCode = newCode;
    }
    /**
     * 将平台获取的formData格式进行转换
     * @param formData
     */
    convertFormData(formData){
        var me = this;
        if(!formData)
            return;
        let obj = {};
        let values = formData.rows[0].values;
        for(let [key,value] of Object.entries(values)){
            if(value.value)
                obj[key] = value.value;
        }
        me.config.object = obj;
    }

    /**
     * 获取编码单据号
     * @param callback
     * @param classname
     * @param values
     */
    getBillCode = (values,callback)=>{
        var me = this;
        if(!me.config.props && !callback){
            toast({content:'props和回调函数必须至少传一个',color:'error'});
            return;
        }
        if(values)
            me.convertFormData(values);
        let requestparam = {
            pk_org:me.config.pk_org,
            pk_group:me.config.pk_group,
            name:me.config.billTypeCode,
            type:me.config.type,
            code:me.config.oldCode || oldCode || '',//取消时引用
            classname:me.config.classname || '',
            object:JSON.stringify(me.config.object) || ''
        }
        ajax({
            url: urls['queryBillCode'],
            //async:false,
            data:requestparam,
            success: function (res) {
                let {data,success} = res;
                if(success){
                    if(data){
                        //后置编码
                        if(data.hasOwnProperty("codes")){
                            /*let codeVals = {};
                            let disables = {};
                            data.codes.forEach((item,index)=>{
                                codeVals[item.code] = {value:item.value};
                                disables[item.code] = !data.isEdit;
                            });*/
                            //若传递form对象，则此处进行赋值和编辑性控制,否则回调
                            if(me.config.props){
                                if(['add','edit'].includes(me.config.type)) {
                                    //若后置编码且可编辑，并且有输入的值，则以输入值为准
                                    let inputVal = me.config.props.form.getFormItemsValue(me.config.formId,me.config.itemcode);
                                    if(!inputVal.value)
                                        me.config.props.form.setFormItemsValue(me.config.formId, {
                                            [me.config.itemcode]: {value:data.code,display:data.code}
                                        });
                                }
                                if(me.config.type != 'delete')
                                    me.config.props.form.setFormItemsDisabled(me.config.formId,{
                                        [me.config.itemcode]:!data.isEdit
                                    });
                            }
                        }else{
                            if(me.config.props){
                                if(me.config.type == 'add')
                                    me.config.props.form.setFormItemsValue(me.config.formId,{[me.config.itemcode]:{value:data.code}});
                                if(me.config.type != 'delete')
                                    me.config.props.form.setFormItemsDisabled(me.config.formId,{[me.config.itemcode]:!data.isEdit});
                            }
                        }
                        if(data.code){
                            oldCode = data.code;
                            me.setCode(data.code);
                        }
                        if(callback){
                            callback(data);
                        }
                    }
                }
            }
        })
    }
}
export default BillCodeUtil