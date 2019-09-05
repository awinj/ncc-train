import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast } from 'nc-lightapp-front';
import "./index.less";
import PropTypes from 'prop-types';

export default class BaseContain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedVal: ''
        }
    }

    renderDetail(url, json) {
        if(!url) return ;
        //"./../../../rbac/dataAuthority/discret/tableTypeContent"
        const transUrl = require(`${url}`);
        return transUrl;
    }

    ensureInfo(selectedVal) {
        if(this.props.beSureBtnClick && typeof this.props.beSureBtnClick == 'function') {
            this.props.beSureBtnClick(selectedVal);
        }
    }

    render() {
        const {url, jsonData} = this.props;
        let DynamicDetail = '<div></div>'
        if(this.renderDetail(url, jsonData)) {
            DynamicDetail = this.renderDetail(url, jsonData);
        }
        return (
            <div>
                <DynamicDetail onEnsureInfo={this.ensureInfo.bind(this)}
                    jsonData={jsonData}/>
            </div>
        )
    }
}












