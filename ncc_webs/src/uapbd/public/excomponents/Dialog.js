import React,{Component} from 'react';
import {base} from 'nc-lightapp-front';

const{NCRow,NCCol,NCButton} = base;
export default class Dialog extends Component{
    constructor(props){
        super(props);
        this.state = Object.assign({
            showDialog: false,
            dialogZIndex: '300',
            dialogWidth: '60%',
            dialogHeight: '80%',
            dialogTitle: null,
            showHeadButtonArea: false,
            sureButtonName:'确认',
            cancelButtonName: '取消',
            bottomAreaShow: true,
            disabledDomScoll: true,
            listener:{}
        },this.props);
    }
    /**
     * 设置dialog标题
     * @param title
     */
    setDialogTitle(title){
        this.setState({dialogTitle:title});
    }
    /**
     * 设置dialog的z-index
     * @param zIndex
     */
    setDialogZIndex(zIndex){
        this.setState({dialogZIndex:zIndex});
    }
    /**
     * 打开dialog
     * @param showDialog  true or false
     * @param disabledDomScoll 是否禁用document的滚动条
     */
    showDialog(disabledDomScoll){
        this.setState({showDialog:!this.state.showDialog,disabledDomScoll:disabledDomScoll || !this.state.disabledDomScoll},()=>{
           document.body.style.overflow = this.state.disabledDomScoll?'hidden':'auto';
        });
    }
    /**
     *  设置dialog的宽高
     * @param width 宽度 支持 %和px
     * @param height 高度 支持 %和px
     */
    setDialogSize(width,height){
        let size = {
            width:width || this.state.dialogWidth || '60%',
            height:height || this.state.dialogHeight || '80%'
        }
        this.setState(
            {
                dialogWidth:size.width,
                dialogHeight:size.height
            },
            ()=>{
                return size;
            }
        )
    }
    /**
     * dialog 关闭事件
     */
    onDialogClose(disabledDomScoll){
        this.setState({showDialog:!this.state.showDialog,disabledDomScoll:disabledDomScoll || !this.state.disabledDomScoll},()=>{
            document.body.style.overflow = this.state.disabledDomScoll?'hidden':'auto';
        });
    }
    /**
     * dialog 确认事件
     */
    onDialogCloseOk(disabledDomScoll){
        !!this.state.listener.onBeforeDialogCloseOk && typeof this.state.listener.onBeforeDialogCloseOk === 'function' && this.state.listener.onBeforeDialogCloseOk();
        this.setState({showDialog:!this.state.showDialog,disabledDomScoll:disabledDomScoll || !this.state.disabledDomScoll},()=>{
            document.body.style.overflow = this.state.disabledDomScoll?'hidden':'auto';
            !!this.state.listener.onAfterDialogCloseOk && typeof this.state.listener.onAfterDialogCloseOk === 'function' && this.state.listener.onAfterDialogCloseOk();
        });
    }

    /**
     * 渲染dialog的内容
     * 用户必须实现 方法名为 renderDialogContent 的方法，返回想要渲染的内容组件
     * @returns {*}
     */
    renderDialogContent(){
        if(this.state.listener.renderDialogContent && typeof this.state.listener.renderDialogContent === 'function'){
            return this.state.listener.renderDialogContent();
        }
        return ()=>{};
    }
    /**
     * 渲染底部区域 确认和取消 按钮
     * 后续可以在底部区域添加渲染别的小组件：例如显示停用组件等
     */
    renderBottomArea(){
        return(
            <div className="loading-container">
                {/*确定 取消 按钮 区域*/}
                <div className="refer-buttom" style={{textAlign:'right'}}>
                    <div className="buttons" style={{width:'100%'}} key="3">
                        <NCRow style={{width:'100%'}}>
                            <NCCol md={9} xs={9} sm={9}></NCCol>
                            <NCCol md={3} xs={3} sm={3}>
                                <NCButton
                                    style={{
                                        backgroundColor: '#E14C46',
                                        color: '#fff'
                                    }}
                                    onClick={this.onDialogCloseOk.bind(this,false)}
                                >
                                    {this.state.sureButtonName || '确认'}
                                </NCButton>
                                <NCButton
                                    style={{
                                        backgroundColor: '#eee',
                                        color: '#666',
                                        marginLeft: '9px'
                                    }}
                                    onClick={this.onDialogClose.bind(this,false)}
                                >
                                    {this.state.cancelButtonName || '取消'}
                                </NCButton>
                            </NCCol>
                        </NCRow>
                    </div>
                </div>
            </div>
        )
    }
    /**
     * 渲染头部按钮区域
     * NC的弹出框很多都带有头部按钮，在这里加一个区域，用户自定义渲染按钮区域的按钮
     */
    renderHeadButtonArea(){
        /**
         * 渲染头部按钮区域的按钮
         * 为了防止ref获取当前对象调用该方法，就不往外放了
         * 用户只要实现renderHeadButtons 就可以了
         * @returns {*}
         */
        const renderHeadButtons =()=>{
            if(this.state.listener.renderHeadButtons && typeof this.state.listener.renderHeadButtons === 'function'){
                return this.state.listener.renderHeadButtons();
            }
            return ()=>{};
        };
        return (
            <div className="refer-search">
                {renderHeadButtons()}
                {/*{createButton('edit', { name: '修改',buttonColor:'btn-color', onButtonClick:()=>{}} )}*/}
            </div>
        )
    }
    render(){
        return(
            <div
                className="refer-pop-window"
                style={{ display: this.state.showDialog ? 'flex' : 'none','z-index':this.state.dialogZIndex }}
                onMouseOver={(e) => {e.stopPropagation();}}>
                <div
                    className="refer-popover clearfix"
                    ref={(dom) => {this.popover = dom;}}
                    onClick={(e) => {e.stopPropagation();}}
                    style={{width:this.state.dialogWidth,height:this.state.dialogHeight}}>
                    <div className="refer-header">
                        <div className="refer-title" key="1">
                            {this.state.dialogTitle || ''}
                        </div>
                        <div className="refer-header-extend" key="2"/>
                        <div className="refer-close iconfont icon-guanbi" onClick={this.onDialogClose.bind(this,false)} key="5" />
                    </div>
                    {/*渲染head按钮*/}
                    {this.state.showHeadButtonArea &&this.renderHeadButtonArea()}
                    {/*渲染内容区*/}
                    <div className="refer-content-area" style={{ width: '100%' }}>
                        {this.renderDialogContent()}
                    </div>
                    {/*渲染bottom确认和取消按钮*/}
                    {this.state.bottomAreaShow && this.renderBottomArea()}
                </div>
            </div>
        )
    }
}