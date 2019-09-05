import React, {Component} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import Utils from '../../utils'
import "./index.less";
import CheckTree from './checkTree';
const { NCRow, NCCol } = base;

class ModelTree extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    } 

    componentDidMount() {
        this.props.modal.show('addNode');
    }

    beSureBtnClick() {//model 确认事件

    }
    render() {
        const {modal } = this.props;
        let { createModal } = modal;
        return (
            <div>
                {createModal('addNode', {
                    title: '选中信息',// 弹框表头信息
                    content: <CheckTree/>, //弹框内容，可以是字符串或dom
                    beSureBtnClick: this.beSureBtnClick, //点击确定按钮事件
                    size:'lg', //  模态框大小 sm/lg/xlg
                })}
            </div>
        )
    }
}

export default ModelTree = createPage({
	// initTemplate: initTemplate
})(ModelTree);