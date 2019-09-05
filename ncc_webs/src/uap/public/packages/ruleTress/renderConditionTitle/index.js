import React, {Component} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import Utils from '../../../../public/utils'
import "./index.less";

const { NCButton, NCRow, NCCol, NCPopconfirm, NCIcon, NCInput, NCSelect } = base;
const NCOption = NCSelect.NCOption;

class RenderConditionTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {},
            inlt: null,
            conditionArr: [],
            conditonVal: 'and'
        }
    }

    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            debugger
            if (status) {
                // intemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({json, inlt},() => {
                    this.setState({
                        conditionArr: [{label: json['1880000025-000004'],logic:'and'},{label: json['1880000025-000005'],logic:'or'}]
                    }, () => {
                        console.log('conditionArr', this.state.conditionArr)
                    })
                })       // 保存json和inlt到页面state中并刷新页面
            } else {
                console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
            }
      
        }
        this.props.MultiInit.getMultiLang({moduleId: 'rbac-ruleTress',domainName: 'uap',callback})
      
    }

    componentDidMount() {
        if(!this.props.nodeInfo) return ;
        this.setState((prevState, props) => ({
            conditonVal: props.nodeInfo.logic
        }))
    }
    
    onSelectCondition(val) {
        this.setState({
            conditonVal: val
        })
        this.props.onChange(val);
    }

    render() {
        const {titleInfo, nodeInfo} = this.props;
        const ItemList = this.state.conditionArr.length && this.state.conditionArr.map( (item, index) => 
                <NCOption value={item.logic} key={item.logic} disabled={item.logic == titleInfo}> {item.label}</NCOption>)

        return (
            <div className="title-wrapper condition-title">
                {Object.keys(this.state.conditionArr).length ? <NCSelect
                    // defaultValue={this.state.conditonVal}
                    value={this.state.conditonVal}
                    style={{ width: 100 }}
                    onSelect={this.onSelectCondition.bind(this)}
                    dropdownClassName={'refer-asdfasdfsad'}
                >
                    {ItemList}
                </NCSelect> : null}
            </div>
        )
    }
}

RenderConditionTitle = createPage({
    // initTemplate: initTemplate,
})(RenderConditionTitle);

export default RenderConditionTitle;