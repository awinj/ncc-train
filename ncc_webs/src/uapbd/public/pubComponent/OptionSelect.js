import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
let {NCCol,NCRow,NCRadio} = base;

/**
 * author zhenmx
 */
class OptionSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue:'assign'
        };
    }
    onCheckFreeze(value){
        debugger;
        this.setState({
            selectedValue:value
        });
        this.props.oncheckAssignOrCancel(value);
    }
    render() {
        return (
            <NCRow md={12} xs={12} sm={12}>
                <NCCol md={12} xs={12} sm={12}>
                    <div style={{height:'400px', overflow:'scroll'}}>
                        <NCRadio.NCRadioGroup
                            name="freeSum"
                            selectedValue={this.state.selectedValue}
                            onChange={this.onCheckFreeze.bind(this)}>
                            <NCRadio value="assign">{this.props.json['10140CUST-000004Y']}</NCRadio>{/* 国际化处理： 分配*/}
                            <NCRadio value="cancelAssign">{this.props.json['10140CUST-000004N']}</NCRadio>{/* 国际化处理： 取消分配*/}
                        </NCRadio.NCRadioGroup>
                    </div>
                </NCCol>
            </NCRow>
        )
    }
}
export default OptionSelect;
