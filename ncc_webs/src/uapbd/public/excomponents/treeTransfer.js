/**
 * 封装简单穿梭框
 * @author  yinshb
 */
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
let {NCButton} = base;
import './treeTransfer.less';
class Treetransfer extends Component {
    constructor(props) {
		super(props);
        this.props = props;
	}
    render(){
        return (
            <div className = 'transfer-main'>
                <div className = 'left-area'>{this.props.leftArea()}</div>
                <div className = 'button-area'>
                    <div className="opr-botton">
                        <NCButton onClick= {this.props.toRight}>加入右侧&nbsp;&gt;</NCButton>
                    </div>
                    <div className="opr-botton">
                        <NCButton onClick= {this.props.toLeft}>&lt;&nbsp;加入左侧</NCButton>
                    </div>
                </div>
                <div className = 'right-area'>{this.props.rightArea()}</div>
            </div>
        )
    }
}

export default Treetransfer;