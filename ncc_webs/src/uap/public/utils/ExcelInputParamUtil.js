
import UpDownProgress from '../packages/upDownProgress';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
import { toastArr } from './libVariable';

/**
 * @desc 获取导出功能参数//
 * @param 
 * @param 
 * @return 
 */
 const getImportConfig =(moduleName,billType, importSign, importUrl, importOtherParams, callback)=> {
    let previousStatus;
    let excelimportconfig = {
        name: 'file',
        showUploadList: false,
        action: importUrl || '/nccloud/uapdr/trade/excelimport.do',
        headers: {
            authorization: 'authorization-text'
        }
    };
    let resultStr = ''
    let  data = {
        moduleName:moduleName,
        billType:billType,
        importSign: new Date().getTime()//importSign,
    };

    excelimportconfig.data = (importOtherParams && Object.keys(importOtherParams).length) ? {...data, ...importOtherParams} : {...data};
    excelimportconfig.NcUploadOnChange = (info,dataParma) => {
        let response = info.file.response;
        
        if(info.file.status == 'uploading' && info.file.status != previousStatus) {
            // console.log('data', data.importSign)
            previousStatus = 'uploading';
            callback({upStaus: 'beginUpload', sysTs: dataParma.sendChildDate});
        }
        
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            let receiveData = response.data || response;//或者后面的处理供应链错误信息直接放在error里
            if(receiveData.success){
                callback(receiveData.success, true);
            }
            if(receiveData.error){
                callback(receiveData.error, false);
            }
            console.log(`${info.file.name} file uploaded successfully`);
            previousStatus = null;
        } else if (info.file.status === 'error') {
            console.log(`${info.file.name} file upload failed.`);
            previousStatus = null;
        }
  };

  return {...excelimportconfig};
};

const ProcessArr = (props) => {
    const {upParams, sysTs} = props;
    return (
        <div key={sysTs}>
	 		<UpDownProgress initProNum={1} listUrl=""  url="/nccloud/uapdr/trade/excelimportproduce.do" 
	 		paramObj={{...upParams, importSign: sysTs.toString()}}/>
	 	</div>
    )

}

const getErrorList = (arr) => {
    let lineLogs;
    if(Object.prototype.toString.call(arr).slice(8, -1) === 'Array') {
        lineLogs = arr.map((item)=> {
            return item.linelog;
        })
    }else {
        lineLogs = [arr.message];
    } 
    return lineLogs;
}

const excelImportconfig = (props, moduleName="uapbd",billType="customer", canUpload = true, importUrl = '', importOtherParams = {}, callback) => {
    if(!canUpload) return ; 
    return getImportConfig(moduleName,billType, toastArr.length, importUrl, importOtherParams, (resultinfo, isSuccess) => {
        console.log('resultinfo',resultinfo);
        if(resultinfo.upStaus == 'beginUpload') {
            //公共产品暂时没提供可动态替换content的方法
            props.modal.close('importModal');
            props.modal.show('importModal', {
                content: <ProcessArr sysTs={resultinfo.sysTs} upParams={{"moduleName":moduleName,"billType":billType}} />
            });
		}else {
            if((Object.prototype.toString.call(resultinfo) ==='[object Array]' && resultinfo.length) || Object.prototype.toString.call(resultinfo) ==='[object Object]'){
                const ErrorList = getErrorList(resultinfo);
                if(isSuccess){
                    toast({
                        duration: 500,
                        groupOperationMsg: ErrorList,
                        groupOperation: true,
                        TextArr: ['展开','收起','我知道了'],
                        color:"success"
                    });
                }else{
                    toast({
                        duration: 500,
                        // content: ErrorList, 
                        groupOperationMsg: ErrorList,
                        groupOperation: true,
                        TextArr: ['展开','收起','我知道了'],
                        color:"danger"
                    });
                }
                
            }else if(resultinfo == 'success' || resultinfo === true) {
                toast({
                    duration: 500,
                    content: '导入成功，请刷新界面!', 
                    color:"success"
                })
            }else if(Object.prototype.toString.call(resultinfo) === '[object String]'){
                toast({
                    duration: 500,
                    content: resultinfo,
                    color: "info"
                });
            }
            //成功操作回调
            if(callback && typeof callback == 'function') {
                callback('importDone');
            }
        }
    })
}

export {getImportConfig, ProcessArr, getErrorList, excelImportconfig}











