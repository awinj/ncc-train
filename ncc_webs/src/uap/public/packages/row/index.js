import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import {ajax } from 'platform-login';
import "./index.less";
import PropTypes from 'prop-types';

const generateStyle = (props) => {
    const ret = {};
    
    if(props.gutter) {
        ret.marginLeft = `-${props.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
    }
    return ret;
}

class Row extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const {justify, align, className} = this.props;
        const classNameArr = [
            justify !== 'start' ? 'is-justify-' + justify : '',
            align !== 'top' ? 'is-align-' + align : '',
            'ps-row',
            className ? className : ''
        ]
        return (
            <div className={classNameArr.join(' ')} style={generateStyle(this.props)}>
                {this.props.children}
            </div>
        )
    }
}

Row.propTypes = {
    align: PropTypes.string,//垂直对齐方式
    justify: PropTypes.string,//水平对齐方式
    gutter: PropTypes.oneOfType([//使用最小默认768
        PropTypes.number,
        PropTypes.object,
      ]),//栅格间隔
    className: PropTypes.string,
};

//指定默认值:
Row.defaultProps = {
    align: 'middle',
    justify: 'center',
    className: ''
};


export default Row;


























