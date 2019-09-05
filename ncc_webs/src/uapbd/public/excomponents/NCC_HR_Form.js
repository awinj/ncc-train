import React,{Component} from 'react';
import {base,high} from 'nc-lightapp-front';
import zhCN from "rc-calendar/lib/locale/zh_CN";
import enUS from "rc-calendar/lib/locale/en_US";
import classnames from 'classnames';
import './NCC_HR_Form.less';
const {NCFormControl,NCRadio,NCForm,NCCheckbox,NCSelect,NCSwitch,NCDatePicker,NCRow,NCCol,NCTextArea,NCNumber,NCTZDatePickerEnd,NCTZDatePickerStart,NCTZDatePickClientTime,NCTZDatePickerRangeDay} = base;
const {NCOption} = NCSelect;
const {Refer} = high;
const EMPTY_FUNC = ()=>{}//空方法
/***********************
 * 去除字符串两端的空格
 * @param str
 * @returns {*}
 ***********************/
const trim=(str)=>{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
const simpleRegExp = new RegExp(/^(([^\^<>%&',;=?$"':#@!~\]\[{}\\/`\|])*)$/);


/*************************************
 * 自定义表单
 *
 * @author liupzhc
 * @date 2018-05-24
 * @version 1.0.0
 *************************************/
class NCC_HR_Form extends Component{
    constructor(props){
        super(props);
        this.state = {
            formStatus:'browse',
            formMeta:this.props.formMeta || {},
            formData:this.props.formData || {},
            formIds:this.props.formIds ||[]
        }

        this.init.call(this);
    }
    componentWillMount(){
        this.beforeSubmitValidate = this.beforeSubmitValidate.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.setFormItemValue = this.setFormItemValue.bind(this);
        this.emptyFormAllData = this.emptyFormAllData.bind(this);
    }
    /*******************************
     * 初始化页面参数
     *******************************/
    init(){
        let relationFormIds = null;
        this.state.formIds.map((formId)=>{
            let relation = this.state.formMeta['formrelation'] || {};
            if(relation.hasOwnProperty(formId)){
                relationFormIds = relation[formId];
            }
        });

        /********************************
         * 初始化页面 refer 参数
         ********************************/
        if(!this.state['refer']){
            this.state.refer = {};
        }

        var refer = this.state['refer'];
        /***********************************************
         * form的items 参照选择值记录
         ***********************************************/
        this.state.formIds.map((formId)=>{
            refer[formId] = {};
            this.state.formMeta[formId].items.map((item)=>{
                if(item.itemtype == 'refer'){
                    refer[formId][item.attrcode] = {};
                }
            });
        });
        /***********************************************
         * 关联form的items 参照选择值记录
         ***********************************************/
        relationFormIds && relationFormIds.map((relationId)=>{
            refer[relationId] = {};
            this.state.formMeta[relationId].items.map((item)=>{
                if(item.itemtype == 'refer'){
                    refer[relationId][item.attrcode] = {};
                }
            });

        });

        /********************************
         * 初始化页面 validate 参数
         ********************************/
        if(!this.state['validateFormData']){
            this.state.validateFormData = {};
        }
        /***********************************************
         * form的items validate 参数
         ***********************************************/
        var validateFormData = this.state['validateFormData'];
        this.state.formIds.map((formId)=>{
            validateFormData[formId] = {};
            this.state.formMeta[formId].items.map((item)=>{
                validateFormData[formId][item.attrcode]={error:false,errorMessage:''};
            });
        });
        /***********************************************
         * 关联form的items validate 参数
         ***********************************************/
        relationFormIds && relationFormIds.map((relationId)=>{
            validateFormData[relationId] = {};
            this.state.formMeta[relationId].items.map((item)=>{
                validateFormData[relationId][item.attrcode]={error:false,errorMessage:''};
            });
        });
        /*************************************
         * 初始化form 的 header展示标志
         *************************************/
        if(!this.state.showFormIcon){
            this.state.showFormIcon = {};
            this.state.formIds.map((formId)=>{
                this.state.showFormIcon[this.state.formMeta[formId].code]={
                    [this.state.formMeta[formId].code]:true
                }
            });
        }
        /*************************************
         * 初始化关联form 的 header展示标志
         *************************************/
        relationFormIds && relationFormIds.map((relationId)=>{
            this.state.showFormIcon[this.state.formMeta[relationId].code]={
                [this.state.formMeta[relationId].code]:true
            }
        });

        /*************************************
         * 初始化formData
         *************************************/
        this.state.formIds.map((formId)=>{
            if(!this.state.formData.hasOwnProperty(formId)){
                this.state.formData[formId] = {};
            }
            this.state.formMeta[formId].items.map((item)=>{
                this.state.formData[formId][item.attrcode] = {};
            });
        });
        /*************************************
         * 初始化关联form的formData
         *************************************/
        relationFormIds && relationFormIds.map((relationId)=>{
            if(!this.state.formData.hasOwnProperty(relationId)){
                this.state.formData[relationId] = {};
            }
            this.state.formMeta[relationId].items.map((item)=>{
                this.state.formData[relationId][item.attrcode] = {};
            });
        });

        this.setState(this.state);
    }
    /**
     * 获得日期格式
     * @type {{"0": string, "1": string, "2": string}}
     */
    dateFormat(type){
        var format = {
            0:'YYYY-MM-DD',//年月日 disabledTime：true
            1:'YYYY-MM-DD hh:mm:ss',//年月日 时分秒 showTime
            2:'YYYY-MM',//年月
        }
        return format[type];
    }


    /**
     * 设置表单状态  browse 浏览态
     *              edit  编辑态
     * @param formId
     * @param value
     */
    setFormStatus(formId,value){
        if(value != 'edit' && value != 'browse'){
            return;
        }
        this.state.formStatus = value;
        this.setState(this.state);
    }

    /**
     *  onBeforeChange事件
     *  用户自定义的onBeforeChange事件在这里执行
     * @param item
     */
    onBeforeChange(areacode,item){

        if(item.hasOwnProperty("listener")){
            var listeners = item.listener;
            if(listeners.hasOwnProperty("onBeforeChange")){
                var onBeforeChange =listeners.onBeforeChange;
                if(onBeforeChange && typeof onBeforeChange ==='function'){
                    /*********************************
                     * 执行自定义事件
                     *********************************/
                    onBeforeChange.call(this,areacode,item);
                }
            }
        }
    }

    /**
     * onChange事件
     * @param attrcode
     * @param value
     */
    onChange(obj,value){
        let areacode = obj.areacode;
        let attrcode = obj.attrcode;
        let item = this.getFormMetaItemByAttrCode.call(this,obj);
        if(!item){
            throw new Error("没找到对应的元数据项")
        }
        item = item[0];
        /*********************************************
         * 执行元数据中自定义的onBeforeChange事件
         *********************************************/
        new Promise((resolve,reject)=>{
            return resolve(this.onBeforeChange(areacode,item));
        })
        /*********************************************
         * onchange事件开始
         *********************************************/
        let result = {};
        if(this.state.formData[areacode]){
            result = this.state.formData[areacode][item.attrcode];
        }
        switch(item.itemtype){
            case 'select':
            case 'radio':
                item.options.map((option)=>{
                    if(option.value == value){
                        this.state.formData[areacode][item.attrcode] = {display:option.display,value:value};
                        this.setState(this.state);
                        return;
                    }
                });
                break;
            case 'checkbox':
                /*********************************************
                 * 执行 元数据自定义的onChange事件
                 *********************************************/
                if(item && item.hasOwnProperty('listener')){
                    let listeners = item.listener;
                    if(listeners && listeners.hasOwnProperty('onChange')){
                        let onChange = listeners.onChange;
                        if(onChange && typeof onChange === 'function'){
                            /****checkbox的onChange事件****/
                            onChange(areacode,item);
                        }
                    }
                }

                /*********************************************
                 * checkbox的onChange事件更新值
                 *********************************************/
                if(result.value == 'Y' || result.value == true ){
                    this.state.formData[areacode][item.attrcode].display='N';
                    this.state.formData[areacode][item.attrcode].value='N';
                }else{
                    this.state.formData[areacode][item.attrcode].display='Y';
                    this.state.formData[areacode][item.attrcode].value='Y';
                }
                this.setState(this.state);
                break;
            case 'switch':
                /*********************************************
                 * switch开关的onChange事件
                 *********************************************/
                this.state.formData[areacode][item.attrcode].value = ! this.state.formData[areacode][item.attrcode].value;
                this.state.formData[areacode][item.attrcode].display = ! this.state.formData[areacode][item.attrcode].display;

                this.setState(this.state);
                break;
            case 'refer':
                /*********************************************
                 * refer的onChange事件
                 *********************************************/
                //记录该参照的选中信息
                this.state.refer[areacode][item.attrcode] = value;

                //重置formData中该参照字段的信息
                this.state.formData[areacode][item.attrcode].display=value.refname;
                this.state.formData[areacode][item.attrcode].value=value.refpk;
                //重置state
                this.setState(this.state);
                /***********************
                 * 抛出一个参照选择后事件
                 */
                if(item.listener && item.listener.hasOwnProperty('onAfterReferSelectedEvent')){
                    var onAfterReferSelectedEvent = item.listener['onAfterReferSelectedEvent'];
                    if(onAfterReferSelectedEvent && typeof onAfterReferSelectedEvent ==='function'){
                        /**
                         * 返回要关联的参照项的编码
                         */
                        var res = onAfterReferSelectedEvent.call(this,item,value,areacode);
                        var refItemId = res.refItemId;
                        var condition = res.condition;
                        if(refItemId && this.state.formMeta[areacode].items){
                            this.state.formMeta[areacode].items.map((item)=>{
                                if(item.attrcode == refItemId){
                                    item.queryCondition = condition;
                                }
                            });
                        }
                        this.setState(this.state);
                    }
                }
                break;
            default:
                this.state.formData[areacode][item.attrcode] = {display:value,value:value};
                this.setState(this.state);
                break;
        }

        this.onblurValidate.call(this,null,obj);
    }

    /**
     * onBlur 校验数据
     * @param attrcode
     */
    onblurValidate(event,obj){
        let {areacode,attrcode} = obj;
        let item = this.getFormMetaItemByAttrCode.call(this,obj);
        let itemData = this.state.formData[areacode][attrcode];
        /*******************************
         * 确认当前item存在onblur监听事件
         *******************************/
        if(!item || !item.listener || !item.listener.onBlur ){
            /*******************************
             * 执行简单校验
             *******************************/
            this.simpleValidate.call(this,item,itemData);
            return;
        }

        /*******************************
         * 获得当前组件的值
         *******************************/


        var onBlurValidate = item.listener.onBlurValidate;
        /*******************************
         * 执行用户自定义校验
         *******************************/
        if(onBlurValidate && typeof onBlurValidate === 'function') {
            /*******************************
             * 执行用户自定义校验
             *******************************/
            var result = onBlurValidate(item, itemData);

            this.state.validateFormData[item.attrcode] = result || {};
        }
        this.setState(this.state);

    }

    /**************************************************
     * 简单校验
     *   对特殊字符进行校验
     * @param item
     * @param itemData
     **************************************************/
    simpleValidate(item,itemData){


        if(!simpleRegExp.test(itemData.value)){
            this.state.validateFormData[item.attrcode] = {
                error:true,
                errorMessage:"请输入正确格式的数据!"
            };
        }else if(item.maxlength && itemData.value.replace(/[\u0391-\uFFE5]/g,"oo").length > item.maxlength){
            this.state.validateFormData[item.attrcode] = {
                error:true,
                errorMessage:"输入值的长度超长!"
            };
        }else if(item.required && (!itemData.value || !itemData.display || trim(itemData.value) == '' || trim(itemData.display) == '')){
            this.state.validateFormData[item.attrcode] = {
                error:true,
                errorMessage:"输入值的长度超长!"
            };
        }else{
            this.state.validateFormData[item.attrcode]={
                error:false,
                errorMessage:""
            }
        }
        this.setState(this.state);


    }

    /**************************************************
     * 根据attrcode获得元数据item
     * @param attrcode
     **************************************************/
    getFormMetaItemByAttrCode(obj){
        let attrcode = obj.attrcode;
        let areacode = obj.areacode;
        if(!attrcode){
            throw new Error("缺少attrcode参数！");
        }
        if(!areacode){
            throw new Error("缺少areacode参数！");
        }

        if(this.props.formMeta[areacode] && this.props.formMeta[areacode].items){
            return this.props.formMeta[areacode].items.filter((item)=>{
                if(item.attrcode === attrcode){
                    return item;
                }
            })
        }
        return null;
    }

    /*****************************外放方法******************************/
    /**************************************************
     * 获得表单值
     **************************************************/
    getFormValue(){
        return this.state.formData;
    }

    /**************************************************
     * 表单提交前校验
     * @returns {boolean}
     **************************************************/
    beforeSubmitValidate(){
        var errorInfos = this.state.validateFormData;

        for(var key in errorInfos){
            if(errorInfos[key].error){
                return !errorInfos[key].error;
            }
        }
        return true;
    }
    setFormItemValue(areacode,item,data){
        if(!this.state.formData.hasOwnProperty(areacode)){
            throw new Error('未找到'+areacode+'对应的表单数据对象');
        }
        if(!this.state.formData[areacode].hasOwnProperty(item.attrcode)){
            throw new Error('该表单数据对象没有该数据项');
        }
        if(!data){
            throw new Error('请设置数据项数据');
        }
        this.state.formData[areacode][item.attrcode] = {display:data.display||data.value||'',value:data.value||''};

        this.setState(this.state);

    }
    emptyFormAllData(areacode){
        if(!this.state.formData.hasOwnProperty(areacode)){
            throw new Error('未找到'+areacode+'对应的表单数据对象');
        }
        for(var key in this.state.formData[areacode]){
            this.state.formData[areacode][key] = {};
        }
        this.setState(this.state);
    }
    /***************************** ---- ******************************/

    /**************************************************
     * 复选框点击事件
     * @param item
     * @param value
     * @returns {IterableIterator<*>}
     **************************************************/
    onCheckboxClick(item,value){
        /***********************************
         * 执行用户自定义的复选框点击事件
         ***********************************/
        if(this.state.formStatus == 'edit'){
            let listeners = item.listener;
            if(listeners.hasOwnProperty('onClick')){
                let onClick = listeners.onClick;
                if(onClick && typeof onClick === 'function'){
                    onClick.call(this,item);
                }
            }
        }

    }
    onFormHeaderClick(meta){
        this.state.showFormIcon[meta.code][meta.code] = !this.state.showFormIcon[meta.code][meta.code];
        this.setState({showFormIcon: this.state.showFormIcon});
    }

    render(){
        let isEditStatus = this.state.formStatus == 'edit';
        /**************************************************
         * 渲染编辑组件
         * @param item
         * @param isEditStatus
         * @param code
         * @returns {string}
         *************************************************/
        const renderEditItem = (item,isEditStatus,code)=>{
            /******************************************
             * 一般类型组件 在浏览态不渲染组件，只渲染value
             ******************************************/
            let value = null;
            if(this.state.formData[code][item.attrcode] && (this.state.formData[code][item.attrcode].hasOwnProperty('display') ||this.state.formData[code][item.attrcode].hasOwnProperty('value'))){
                value = this.state.formData[code][item.attrcode].display || this.state.formData[code][item.attrcode].value || '';
            }
            var eventParam = {attrcode:item.attrcode,areacode:code};
            /******************************************
             * 编辑态 根据组件的itemtype 渲染不同的组件
             ******************************************/
            switch(item.itemtype){
                case 'input':

                    if(isEditStatus){
                        /****************************************
                         * 渲染input组件
                         ****************************************/
                        value = (
                            <NCFormControl
                                type="text"
                                disabled={!!item.disabled}
                                placeholder={item.placeholder}
                                value={value}
                                onChange={this.onChange.bind(this,eventParam)}
                                onBlur={this.onblurValidate.bind(this,event,eventParam)}

                            />
                        );

                    }
                    break;
                case 'switch'://开关

                    let switchVal = !!value ;
                    item.config = item.config || {};
                    item.config.valuePropName = 'checked';
                    /******************************************
                     * 渲染switch组件
                     ******************************************/
                    value = (
                        <NCSwitch
                            disabled={isEditStatus || false}
                            defaultChecked={true}
                            onChange={this.onChange.bind(this,eventParam)}
                            checked={switchVal}
                        />
                    );
                    break;
                case 'select':
                    /******************************************
                     * 渲染select选项
                     ******************************************/
                    const renderOptions=(options)=>options.map((option)=>{
                        return(<NCOption key={option.value} value={option.value}>{option.display}</NCOption>)
                    });
                    let options = item.options && renderOptions(item.options);
                    if(isEditStatus){
                        /******************************************
                         * 渲染select组件
                         ******************************************/
                        value = (
                            <NCSelect
                                defaultValue={value}
                                disabled={!isEditStatus}
                                onChange={this.onChange.bind(this,eventParam)}
                            >
                                {options}
                            </NCSelect>
                        )
                    }
                    break;
                case 'datepicker':
                    if(isEditStatus){
                        /******************************************
                         * 获得格式 和 是否显示时间
                         ******************************************/
                        let format =this.dateFormat(item.format) || this.dateFormat('1'),
                            showTime = item.format == '1'?true:false;
                        /******************************************
                         * 渲染日期组件
                         ******************************************/
                        value = (
                            <NCDatePicker
                                disabled={!!item.disabled}
                                format={format}
                                showTime={showTime}
                                locale={item.locale=='enUS'?enUS:zhCN}
                                placeholder={item.placeholder || '请选择合适的日期'}
                                onChange={this.onChange.bind(this,eventParam)}
                                value={value}
                            />)
                    }
                    break;

                case 'radio':
                    /******************************************
                     * 渲染单选按钮组 组件
                     ******************************************/
                    value=(
                        <NCRadio.NCRadioGroup
                            name={item.label}
                            selectedValue={value}
                            onChange={this.onChange.bind(this,eventParam)}
                        >
                            {item.options && item.options.map((option)=>{
                                return (<NCRadio color="success"
                                                 value={option.value}
                                                 disabled={!isEditStatus}>
                                    {option.display || option.value || ''}
                                </NCRadio>)
                            })}
                        </NCRadio.NCRadioGroup>
                    )
                    break;
                case 'checkbox':
                    /******************************************
                     * 渲染复选按钮
                     ******************************************/
                    value=(
                        <NCCheckbox
                            color="success"
                            disabled={!isEditStatus}
                            defaultChecked={false}
                            checked={value == 'Y'}
                            onClick={this.onCheckboxClick.bind(this,item)}
                            onChange={this.onChange.bind(this,eventParam)}
                        />

                    )
                    break;
                case 'textarea':
                    /******************************************
                     * 渲染textarea组件
                     ******************************************/
                    if(isEditStatus){
                        value =  <NCTextArea
                            disabled={!!item.disabled}
                            rows={item.rows || 3}
                            placeholder={item.placeholder}
                            onChange={this.onChange.bind(this,eventParam)}
                            onBlur={this.onblurValidate.bind(this,event,eventParam)}
                        />
                    }

                    break;
                case 'refer':
                    /******************************************
                     * 渲染参照
                     ******************************************/
                    switch(item.refType){
                        case 'tree':
                            value = <Refer
                                refName={item.label}
                                refCode={item.attrcode}
                                refType={item.refType}
                                queryTreeUrl={item.queryTreeUrl}
                                disabled={!isEditStatus}
                                queryCondition={item.queryCondition}
                                onChange={this.onChange.bind(this,eventParam)}
                                value={this.state.refer[code][item.attrcode] || {}}
                            />
                            break;
                        case 'grid':
                            value= <Refer
                                refName={item.label}
                                refCode={item.attrcode}
                                refType={item.refType}
                                queryGridUrl={item.refcode}
                                disabled={!isEditStatus}
                                queryCondition={item.queryCondition}
                                onChange={this.onChange.bind(this,eventParam)}
                                value={this.state.refer[code][item.attrcode] || {}}
                            />
                            break;
                        case 'gridTree':
                            value= <Refer
                                refName={item.label}
                                refCode={item.attrcode}
                                refType={item.refType}
                                queryGridUrl={item.refGridCode}
                                queryTreeUrl={item.refTreeCode}
                                disabled={!isEditStatus}
                                queryCondition={item.queryCondition}
                                onChange={this.onChange.bind(this,eventParam)}
                                value={this.state.refer[code][item.attrcode] || {}}
                            />
                            break;

                    }

                    break;
                case 'number':
                    if(isEditStatus){
                        value = (
                            <NCNumber
                                disabled={!!item.disabled}
                                suffix={item.suffix}
                                scale={item.scale}
                                placeholder={item.placeholder}
                                value={value}
                                onChange={this.onChange.bind(this,eventParam)}
                            />
                        )
                    }
                    break;
            }
            return value;

        }
        /*************************************************
         * 渲染校验信息
         * @param item
         * @param isEditStatus
         * @returns {*}
         ************************************************/
        const renderErrorInfos = (item,isEditStatus)=>{
            if(isEditStatus){
                var validateItem = this.state.validateFormData[item.attrcode];
                if(validateItem && validateItem.error && !!validateItem.errorMessage){
                    return (<span className="input-error-message" style={{color: 'red', fontSize:'10px'}}>{validateItem.errorMessage}</span>);
                }
            }
        }
        /************************************************
         * 渲染表单项
         * @param code
         * @param items
         * @returns {*}
         ************************************************/
        const renderFormItems = (code,items)=>(items.map((item)=>{
            let labelName = item.label;//控件名称
            let visible = item.hasOwnProperty('visible')?item.visible:false;//是否显示 默认不显示
            let required = item.hasOwnProperty('required')?item.required:false;//是否必填 默认不必填
            let itemKey = item.attrcode;

            let element = renderEditItem.call(this,item,isEditStatus,code);
            let isTextArea = item.itemtype == 'textarea';
            let errorInfos = renderErrorInfos.call(this,item,isEditStatus,code);
            return (visible?(
                <span id={itemKey}>

                        <NCCol xs={1} className="formLabel" style={{lineHeight: '21px',height: '21px',textAlign: 'right',position: "relative",top: '5px'}}>
                             {(isEditStatus && required) && <span className="u-mast">*</span>}
                            {labelName}
                        </NCCol>

                        <NCCol xs={item.col-1} className = 'clearfix formControl' style={{paddingLeft: '12px',paddingBottom: '25px'}}>
                             {
                                 <div style={{minHeight: '28px'}} className={`form-component-item-wrapper ${item.itemtype}-wrapper ${this.state.formStatus}`}>
                                     {element}
                                 </div>
                             }
                            <div className="form-component-errorMessage" style={{height: '20px',position: 'absolute',bottom: 5,left: 15}}>
                                 {errorInfos}
                             </div>
                        </NCCol>

                    </span>
            ):null)

        }));
        /************************************************
         * 创建表单
         * @param ids
         * @returns {*}
         ************************************************/
        const createForms = (ids)=>(ids.map((id)=>{
            let curFormMeta = this.state.formMeta[id];
            let metaItems = curFormMeta.items;
            let formrelation = this.state.formMeta['formrelation'] || {};
            let curFormRelationIds = {};//关联元数据ids
            if(formrelation.hasOwnProperty(id)){
                curFormRelationIds = formrelation[id];
            }
            
            let relationMetas = [];//关联元数据
            relationMetas.push(curFormMeta);
            if(curFormRelationIds && curFormRelationIds.length>0){
                curFormRelationIds.map((relationId)=>{
                    let relationMeta = this.state.formMeta[relationId];
                    if(relationMeta && relationMeta.items){
                        relationMetas.push(relationMeta);
                    }
                })
            }
            return relationMetas.map((meta)=>{
                let nameIcon = classnames({
                    'icon-jiantouxia1': this.state.showFormIcon[meta.code][meta.code],
                    'icon-jiantouyou': !this.state.showFormIcon[meta.code][meta.code]
                });
                let groupFormClass = classnames({
                    'show-form': this.state.showFormIcon[meta.code][meta.code],
                    'hide-form': !this.state.showFormIcon[meta.code][meta.code]
                });
                /************************************************
                 * 获得非textarea的元数据项
                 ************************************************/
                const besidesTextAreaItems = meta.items.filter((item)=>{if(item.itemtype !='textarea'){
                    return item;
                }});
                /************************************************
                 * 获得textarea的元数据项
                 ************************************************/
                const textAreaItems = meta.items.filter((item)=>{if(item.itemtype =='textarea'){
                    return item;
                }});
                let areacode = meta.code;
                return (
                    <div className="group-form-wrapper">
                        <div className="group-form-name">
                            <span
                                className={`toggle-form-icon iconfont ${nameIcon}`}
                                onClick={this.onFormHeaderClick.bind(this,meta)}
                            >
                            </span>
                            <span className="name">{meta.name && meta.name}</span>
                        </div>
                        <div id={meta.code} className={`ncc-hr-form-style group-form-item ${groupFormClass}`}>
                            <NCForm showSubmit={false} checkFormNow={false} useRow={true} className="lightapp-component-form"
                                    submitCallBack={() => {}}>
                                {/*浏览态: 只渲染值  编辑态：渲染组件*/}
                                <NCRow>
                                    {renderFormItems(areacode,besidesTextAreaItems)}
                                </NCRow>
                                <NCRow>
                                    {renderFormItems(areacode,textAreaItems)}
                                </NCRow>
                            </NCForm>
                        </div>
                    </div>
                )
            })

        }));

        const forms = createForms(this.state.formIds);
        return (
            <div>{forms}</div>
        )
    }
}

export default NCC_HR_Form

