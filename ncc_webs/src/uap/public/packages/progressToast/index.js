import React, {Component, Fragment} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import Utils from '../../utils'
import "./index.less";
const { NCRow, NCCol, NCProgressBar } = base;

class ProgressToast extends Component{
    constructor(props){
        super(props);
        this.state = {
            dealPro: 0
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log(nextProps.initProNum, this.props.initProNum)
        if(!!nextProps.initProNum && nextProps.initProNum != this.props.initProNum) {
            this.begDealingProgress();
        }
    }

    begDealingProgress() {//获取保存tree后台处理进度
        const {url, paramObj} = this.props;
        let timer = null,
            that = this;
        
        timer = setTimeout( () => {
            ajax({
                data:paramObj,
                url:url,
                loading: false,
                success:function(res){
                    let{Success,data} = res;
                    that.setState({
                        dealPro: data
                    })
                    if(that.state.dealPro == 100) {
                        clearTimeout(timer);
                    }else {
                        that.begDealingProgress();
                    }
                },
                error: function(res) {
                    that.setState({
                        dealPro: 100
                    })
                    clearTimeout(timer);
                }
            })
        }, 500);
        
    }

    render() {
        let {dealPro} = this.state;
        return (
            <Fragment>
                {dealPro == '0' || dealPro == '100' ? null : <section className="toast-progress-container">
                    <NCProgressBar active now = {dealPro} label={`${dealPro}%`} />
                </section>}
            </Fragment>
        )
    }
}

//指定默认值:
ProgressToast.defaultProps = {
    frontProgress: false,//进度由前端控制返回
    ajaxProgress: true,//进度由后端控制返回
    url: '',//请求后台ajax接口地址
    paramObj: {}//请求后台接口传递参数
};

ProgressToast = createPage({
    // initTemplate: initTemplate,
})(ProgressToast);

export default ProgressToast;
