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
            conditionArr: [{label: '并且',logic:'and'},{label: '或者',logic:'or'}],
            conditonVal: 'and'
        }
    }

    componentDidMount() {
        if(!this.props.logic) return ;
        this.setState((prevState, props) => ({
            conditonVal: props.logic
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
        const ItemList = this.state.conditionArr.map( (item, index) => 
                <NCOption value={item.logic} key={item.logic} disabled={item.logic == titleInfo}> {item.label}</NCOption>)

        return (
            <div className="title-wrapper condition-title">
                <NCSelect
                    defaultValue={this.state.conditonVal}
                    value={this.state.conditonVal}
                    style={{ width: 100 }}
                    onSelect={this.onSelectCondition.bind(this)}
                    dropdownClassName={'refer-asdfasdfsad'}
                >
                    {ItemList}
                </NCSelect>
            </div>
        )
    }
}

RenderConditionTitle = createPage({
    // initTemplate: initTemplate,
})(RenderConditionTitle);

export default RenderConditionTitle;