import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast } from 'nc-lightapp-front';
import "./index.less";
import PropTypes from 'prop-types';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleClick() {
        if(this.props.onEnsureInfo && typeof this.props.onEnsureInfo == 'function') {
            this.props.onEnsureInfo('被点击数据555')
        }
    }

    render() {
        const {jsonData} = this.props;
        return (
            <div>
                555
                <p onClick={this.handleClick.bind(this)}>我是测试点击按钮</p>
                {jsonData.val}
            </div>
        )
    }
}

module.exports = Test;