import React, {Component, Fragment} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import Utils from '../../utils'
import "./index.less";
const { NCButton, NCProgressBar, NCIcon, NCNotification, NCAffix } = base;
// const notification = NCNotification.newInstance({position: 'topRight'}, function(){});
class UpDownProgress extends Component{
    constructor(props){
        super(props);
        this.state = {
            dealPro: 0,
            hideNofication: false,
            errMsg: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.paramObj.importSign) {
            this.begDealingProgress();
        }   
    }

    begDealingProgress() {//获取后台接收解析文件进度
        const {url, paramObj} = this.props;
        const {hideNofication} = this.state;
        let timer = null,
            that = this;
        
        // timer = setTimeout( () => {
            ajax({
                data:paramObj,
                url:url,
                loading: false,
                success:function(res){
                    let{Success,data} = res;
                    that.setState({
                        dealPro: data
                    }, () => {
                        if(data == 100) {
                            if(!hideNofication) {//如果已经被关闭，则自动弹出
                                that.setState({
                                    hideNofication: false
                                })
                            }
                        }else{
                            that.begDealingProgress();
                        }
                    });
                },
                error: function(res) {
                    that.setState({
                        errMsg: res.data
                    })
                }
            })
        // }, 1000);
        
    }

    closeNotification() {//点击x关闭通知框
        this.setState({
            hideNofication: true
        })
    }

    goNotificationList() {//跳转通知中
        this.props.openTo("/uap/excelimport/excelImport/importListTable/main/index.html", {appcode: "10160501"});
    }

    render() {
        let {dealPro, hideNofication} = this.state;
        let progressContainer = null;
        if(dealPro == 1) {
            progressContainer = <p className="tips-txt">正在导入...</p>
        }else if(dealPro > 1 && dealPro < 100) {
            progressContainer = <Fragment>
                    <p className="tips-txt">导入成功，后台正在处理数据</p>
                    <NCProgressBar active now = {dealPro} label={`${dealPro}%`} />
                </Fragment>
        }else if(dealPro == 100) {
            progressContainer = <Fragment>
                <h4 className="tips-txt">{!this.state.errMsg ? '后台处理已完成': '后台处理已完成'}</h4>
                <span className="tips-txt go-import-detail" onClick={this.goNotificationList.bind(this)}>查看导入日志</span>
            </Fragment>
        }
        return (
            <Fragment>
                {dealPro == '0' || hideNofication ? null :  <section class="item-contain">
                        {progressContainer}
                        <NCIcon type="uf-close" onClick={this.closeNotification.bind(this)}></NCIcon>
                    </section>}  
            </Fragment>
        )
    }
}

//指定默认值:
UpDownProgress.defaultProps = {
    url: '',//请求后台ajax接口地址
    paramObj: {},//请求后台接口传递参数
    listUrl: '',//跳转至日志列表页路由
    toastArr: [1],//唯一key值，每次点击外部操作按钮+1
};

UpDownProgress = createPage({
    // initTemplate: initTemplate,
})(UpDownProgress);

export default UpDownProgress;
