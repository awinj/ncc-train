import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {   ajax, } from 'platform-login';
import "./../row/index.less";
import PropTypes from 'prop-types';

class Col extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    colClick() {
        if(!this.props.onClick) return ;
        this.props.onClick();
    }

    render() {
        const {span, hor} = this.props;
        let classList = ['ps-col'];
        ['offset', 'pull', 'push'].forEach( (prop) => {
            if(this.props[prop] || this.props[prop] === 0) {
                classList.push(`col-${prop}-${this.props[prop]}`)
            }
        })
        return (
            <div className={classList.join(' ')} style={{flex:span,textAlign:hor}} onClick={this.colClick.bind(this)}>
               {this.props.children}
            </div>
        )
    }
}

Col.propTypes = {
    hor: PropTypes.string,//水平子元素对齐方式
    span: PropTypes.string,//元素占宽度
    offset: PropTypes.number,//栅格左侧的间隔格数
    pull: PropTypes.number,//栅格向左移动格数
    push: PropTypes.number,//栅格向右移动格数
};

//指定默认值:
Col.defaultProps = {
    hor: 'left',
    span: 1
};


export default Col;