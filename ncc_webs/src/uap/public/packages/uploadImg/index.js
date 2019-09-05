import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast, promptBox  } from 'nc-lightapp-front';
import "./index.less"

const {NCUpload, NCButton, NCIcon, NCModal} = base;
const NCDragger = NCUpload.NCDragger;

const props = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    }
};

class UploadImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldDel: false,
            json: {},
            inlt: null
        }
    }

    componentWillMount() {
        let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
          if (status) {
            //   intemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
                this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
          } else {
              console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
          }
    
        }
        this.props.MultiInit.getMultiLang({moduleId: 'rbac-uploadimg',domainName: 'uap',callback})
    }
    

    closeModal(val) {
        if('del' == val) {
            if(!this.props.uploadImgSrc) {
                toast({ color: 'warning', content: this.state.json['1880000025-000020'] })
                return ;
            }
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['1880000025-000017'],//"已成功",                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                content: this.state.json['1880000025-000013'],//'显示内容',             // 提示内容,非必输
                hasCloseBtn:true,             //显示“X”按钮，默认不显示，不显示是false，显示是true
                beSureBtnClick: this.confirmDel.bind(this),   // 确定按钮点击调用函数,非必输
                cancelBtnClick: this.cancelDel.bind(this),  // 取消按钮点击调用函数,非必输
                closeBtnClick:this.cancelDel.bind(this), //关闭按钮点击调用函数，非必输
                zIndex:210//遮罩的层级为zIndex，弹框默认为zIndex+1。默认为200，非比传项
            })
        }else {
            this.props.onCloseModal(val);
        }
    }

    confirmDel(){
        this.setState({
            shouldDel: false
        });
        this.begDelImgAjax();
    }

    cancelDel(){
        this.setState({
            shouldDel: false
        });
    }

    beforeUpload(file, fileList) {//上传前数据过滤
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        if (!isJPG && !isPNG) {
            toast({content:`${this.state.json['1880000025-000007']}`, color: 'info'})
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 > 10;
        if (isLt10M) {
            toast({content: `${this.state.json['1880000025-000008']}`, color: 'info'})
            return false;
        }
        return !isLt10M;
    }

    begDelImgAjax() {
        const that = this;
        ajax({
            loading: true,
            url: this.props.delImgAction,
            async: false,
            data: this.props.delParamObj,
            success: function (res) {
                if (res) {
                    that.props.onCloseModal('del');
                    toast({ color: 'success', content: `${this.state.json['1880000025-000009']}` });  
                    
                } else {
                    // alert(res.message)
                }
            },
            error: function (res) {
                // alert(res.message)
            }
        })
    }

    uploadChange(info) {
        let response = info.file.response;
        if (response) {
            if(response.success) {
                toast({ color: 'success', content: this.state.json['1880000025-000010'] });
                this.props.onUploadSuccess(response);
            }else {
                toast({ color: 'danger', content: this.state.json['1880000025-000011'] });
            }
        }
        //  else{
        //     toast({ color: 'danger', content: "上传失败！" });
        //     console.log(`${resData.file.name} file upload failed.`);
        // }
    }

    componentDidMount() {
    }

    render() {
        const {uploadModalShow, uploadTitle, uploadImgSrc, uploadAction, paramObj} = this.props;
        return (
            <div>
                {uploadModalShow && <NCModal dialogClassName="upload-model"
                    show = { uploadModalShow }
                    onHide = { this.closeModal.bind(this, 'close') } >
                    <NCModal.Header closeButton>
                        <NCModal.Title>{uploadTitle || this.state.json['1880000025-000012']}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <NCUpload {...props} beforeUpload={this.beforeUpload}
                            data={{...paramObj}}    
                            action={uploadAction || '/upload.do'}
                            NcUploadOnChange={this.uploadChange.bind(this)}>
                            <NCButton shape="border" colors="second">
                                <NCIcon type="uf-upload" /> {this.state.json['1880000025-000014']}
                            </NCButton>
                            <section className="img-container">
                                <img className="preview-img"
                                    src={uploadImgSrc || ''}/>
                            </section>
                        </NCUpload>
                    </NCModal.Body>

                    <NCModal.Footer>
                        <NCButton onClick={ this.closeModal.bind(this, 'ensure') } colors="second">{this.state.json['1880000025-000015']}</NCButton>
                        <NCButton onClick={ this.closeModal.bind(this, 'del') } colors="primary" disabled={!uploadImgSrc}>{this.state.json['1880000025-000016']}</NCButton>
                        {/* <NCButton onClick={ this.closeModal.bind(this, 'close') } colors="primary">取消</NCButton> */}
                    </NCModal.Footer>
                </NCModal>}
            </div>
        )
    }
}

UploadImg = createPage({
    // initTemplate: initTemplate,
})(UploadImg);

export default UploadImg;
