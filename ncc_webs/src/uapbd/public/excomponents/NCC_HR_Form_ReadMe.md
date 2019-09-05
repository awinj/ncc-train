/**
 *
 * @title 表单校验
 * @description 用户信息录入实例
 */
import React ,{Component } from 'react';
import ReactDOM from 'react-dom';



import NCC_HR_Form from './NCC_HR_Form1';

class FormDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testValue:'',
            formIds:['customer'],
            formMeta:this.testMeta,
            isEdit: 'true',
        };
        this.onBeforeChange = this.onBeforeChange.bind(this);

    }

    /**********************************************************************************************************************
     * 说明：
     *  1、元数据项item 可以添加 listener属性：
     *                  listener：{
     *                      onBeforeChange:()=>{}//改变前事件
     *                      onAfterReferSelectedEvent：()=>{} //参照专属的参照选择后事件
     *                      onBlurValidate:()=>{return {error:boolean,errorMessage:'错误提示'}}//输入框或textarea onblur时校验输入的数据事件
     *                  }
     *
     *  2、this.FormComp 表单对象：
     *              表单暂时开放了几个方法，可以通过表单对象调用
     *                  this.FormComp.getFormValue() 获得表单数据
     *                  this.FormComp.beforeSubmitValidate() 提交前校验  return boolean
     *                  this.FormComp.setFormItemValue(areacode,item,data)  设置表单某一项的数据 data:{display:'',value:''}
     *                  this.FormComp.emptyFormAllData(areacode) 清空表单数据
     *
     *
     *  3、还有几种类型的item没有添加
     *
     *      NCTZDatePickerEnd,NCTZDatePickerStart,NCTZDatePickClientTime,NCTZDatePickerRangeDay,NCRangePicker,NCMonthPicker
     *
     *
     *  4、暂时做到这些后续有缺失的功能或者不全的地方，可以找我继续维护
     *
     *  5、看看下面的testMeta和render里的NCC_HR_Form标签
     *
     **********************************************************************************************************************/

    testMeta= {
            code: "1317CUUG_base",
            name: "客户升级",
            pageid: "1317CUUG_base",
            customer: {
                items: [
                    {
                        itemtype: "refer",
                        col: "4",
                        visible: true,
                        label: "所属组织",
                        maxlength: "20",
                        disabled: true,
                        refType:'tree',
                        queryTreeUrl:'/nccloud/uapbd/ref/CustClassDefaultTreeRef.do',
                        attrcode: "pk_org",
                        listener:{
                            onAfterReferSelectedEvent:(item,value,areacode)=>{
                                var result  = {};
                                result.refItemId = 'pk_group';//要给哪个参照加条件
                                result.condition = {pk_accountingbook:value.refpk||''};//条件对象
                                return result;
                            }
                        }
                    },
                    {
                        col: "4",
                        itemtype: "refer",
                        attrcode: "pk_group",
                        label: "所属集团",
                        visible: true,
                        maxlength: "20",
                        disabled: false,
                        refType:'tree',
                        queryTreeUrl:'/nccloud/uapbd/ref/AccountDefaultModelTreeRef.do',
                    },
                    {
                        itemtype: "input",
                        col: "4",
                        visible: true,
                        label: "客户编码",
                        maxlength: "40",
                        attrcode: "code"
                    },
                    {
                        itemtype: "datepicker",
                        col: "4",
                        visible: true,
                        label: "测试时间",
                        maxlength: "19",
                        disabled: false,
                        attrcode: "creationtime",
                        locale:'zhCN',          //enUS or zhCN
                        format:'0',             //0 or 1
                        placeholder:'选择你的日期'
                    },

                    {
                        itemtype: "refer",
                        col: "4",
                        visible: true,
                        label: "客户基本分类",
                        maxlength: "20",
                        attrcode: "pk_custclass"
                    },
                    {
                        itemtype: "select",
                        col: "4",
                        label: "客户状态",
                        maxlength: "50",
                        disabled: true,
                        attrcode: "custstate",
                        options: [
                            {
                                "display": "核准",
                                "value": "1"
                            }
                        ]
                    },
                    {
                        itemtype: "refer",
                        col: "4",
                        visible: true,
                        label: "地区分类",
                        maxlength: "20",
                        attrcode: "pk_areacl"
                    },
                    {
                        itemtype: "switch",
                        col: "4",
                        visible: true,
                        label: "供应商",
                        maxlength: "1",
                        disabled: true,
                        attrcode: "issupplier"
                    },
                    {
                        itemtype: "refer",
                        col: "4",
                        visible: true,
                        label: "对应供应商",
                        maxlength: "20",
                        disabled: true,
                        attrcode: "pk_supplier"
                    },
                    {
                        itemtype: "select",
                        col: "4",
                        visible: true,
                        label: "客户类型",
                        attrcode: "custprop",
                        options: [
                            {
                                display: "外部单位",
                                value: "0"
                            },
                            {
                                display: "内部单位",
                                value: "1"
                            }
                        ]
                    },

                    {
                        itemtype: "switch",
                        col: "4",
                        visible: true,
                        label: "散户",
                        maxlength: "1",
                        attrcode: "isfreecust"
                    },
                    {
                        itemtype: "number",
                        scale: "2",//保留几位小数
                        col: "4",
                        visible: true,
                        label: "注册资金",
                        maxlength: "14",
                        attrcode: "registerfund"
                    },
                    {
                        itemtype: "textarea",
                        col: "11",
                        visible: true,
                        label: "备注",
                        maxlength: "1024",
                        attrcode: "memo"
                    },
                    {
                        itemtype: "switch",
                        col: "4",
                        visible: true,
                        label: "冻结标志",
                        maxlength: "1",
                        disabled: true,
                        attrcode: "frozenflag"
                    },
                    {
                        itemtype: "select",
                        col: "4",
                        visible: true,
                        label: "启用状态",
                        disabled: true,
                        attrcode: "enablestate",
                        options: [
                            {
                                display: "未启用",
                                value: "1"
                            },
                            {
                                display: "已启用",
                                value: "2"
                            },
                            {
                                display: "已停用",
                                value: "3"
                            }
                        ]
                    },
                    {
                        "itemtype": "datepicker",
                        "col": "4",
                        "label": "时间戳",
                        "maxlength": "19",
                        "attrcode": "ts"
                    },
                    {
                        itemtype: "datepicker",
                        col: "4",
                        label: "删除时间",
                        maxlength: "19",
                        attrcode: "deltime"
                    }
                ],
                moduletype: "form",
                code: "customer",
                name: "客户基本信息"
            },

            audit: {
                items: [
                    {
                        "itemtype": "refer",
                        "col": "4",
                        "visible": true,
                        "label": "创建人",
                        "maxlength": "20",
                        "disabled": false,
                        "attrcode": "creator",
                        refType: 'gridTree',
                        queryTreeUrl: '/nccloud/uapbd/ref/PsndocTreeRef.do',
                        queryGridUrl: '/nccloud/uapbd/ref/PsndocGridRef.do',
                        queryCondition:{"pk_org":"0001LL1000000000GLVS"}
                    },
                    {
                        "itemtype": "datepicker",
                        "col": "4",
                        "visible": true,
                        "label": "创建时间",
                        "maxlength": "19",
                        "disabled": true,
                        "attrcode": "creationtime"
                    },
                    {
                        "itemtype": "refer",
                        "col": "4",
                        "visible": true,
                        "label": "最后修改人",
                        "maxlength": "20",
                        "disabled": true,
                        "attrcode": "modifier",
                        refType: 'gridTree',
                        queryTreeUrl: '/nccloud/uapbd/ref/PsndocTreeRef.do',
                        queryGridUrl: '/nccloud/uapbd/ref/PsndocGridRef.do',
                        queryCondition:{"pk_org":"0001LL1000000000GLVS"}
                    },
                    {
                        "itemtype": "datepicker",
                        "col": "4",
                        "visible": true,
                        "label": "最后修改时间",
                        "maxlength": "19",
                        "disabled": true,
                        "attrcode": "modifiedtime"
                    }
                ],
                moduletype: "form",
                relationcode: "customer",
                code: "audit",
                name: "审计信息"
            },
            formrelation: {
                customer: ["audit"]
            }
        };

    /**
     * 定义 beforechange事件
     * @param item
     */
    onBeforeChange(item){
        console.log('beforeChange'+item.attrcode);
    }

    /**
     * 改变表单状态
     */
    changeFormStatus(){
        //this.FormComp  表单对象

        this.FormComp.setFormStatus('head',this.state.isEdit?'edit':'browse');
        this.setState({
            isEdit:!this.state.isEdit,
        });
    }

    /**
     * 获得表单全部数据
     */
    getFormData(){

        console.log(this.FormComp.getFormValue());

    }

    /***
     * 提交前校验
     */
    validate(){
        alert(this.FormComp.beforeSubmitValidate())
    }
    render() {
        return (
            <div>

                <input type="button" value="改变表单状态" onClick={this.changeFormStatus.bind(this)}/>
                &nbsp;
                <input type="button" value="获得表单数据" onClick={this.getFormData.bind(this)}/>
                &nbsp;
                <input type="button" value="提交前校验" onClick={this.validate.bind(this)}/>
                <br/>
                <NCC_HR_Form
                    formIds={this.state.formIds}
                    formMeta={this.state.formMeta}
                    isEditFormStatus={this.state.isEditFormStatus}
                    formData={this.state.formData}
                    ref={(FormComp) => this.FormComp = FormComp}
                />
            </div>
        )
    }
}

ReactDOM.render(<FormDemo/>, document.querySelector('#app'))