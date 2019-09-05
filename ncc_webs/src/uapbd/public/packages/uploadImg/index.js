import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax, toast } from 'nc-lightapp-front';
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

        }
        
    }

    closeModal(val) {
        if('del' == val) {
            this.begDelImgAjax();
        }else {
            this.props.onCloseModal(val);
        }
    }

    beforeUpload(file, fileList) {//上传前数据过滤
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        if (!isJPG && !isPNG) {
            alert('只支持图片格式文件')
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 > 10;
        if (isLt10M) {
            alert('上传大小大于10M')
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
                    toast({ color: 'success', content: "删除成功！" });  
                    that.props.onCloseModal('del');
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
        console.log('info', info)
        if (info.file.status === 'done') {
            if(info.file.response.success) {
                toast({ color: 'success', content: "上传成功！" });
            }else {
                toast({ color: 'danger', content: "上传失败！" });
            }
            this.props.onUploadSuccess(info.file.response);
        } else if (info.file.status === 'error') {
            toast({ color: 'danger', content: "上传失败！" });
            console.log(`${info.file.name} file upload failed.`);
        }
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
                        <NCModal.Title>{uploadTitle || '图片上传'}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <NCUpload {...props} beforeUpload={this.beforeUpload}
                            data={{...paramObj}}    
                            action={uploadAction || '/upload.do'}
                            onChange={this.uploadChange.bind(this)}>
                            <NCButton shape="border" colors="primary">
                                <NCIcon type="uf-upload" /> 上传
                            </NCButton>
                            <section className="img-container">
                                <img className="preview-img"
                                    src={uploadImgSrc || ''}/>
                            </section>
                        </NCUpload>
                    </NCModal.Body>

                    <NCModal.Footer>
                        <NCButton onClick={ this.closeModal.bind(this, 'ensure') } colors="primary">确定</NCButton>
                        <NCButton onClick={ this.closeModal.bind(this, 'del') } colors="primary" disabled={!uploadImgSrc}>删除</NCButton>
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
