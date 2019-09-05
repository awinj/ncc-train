import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {createPage} from 'nc-lightapp-front';
import {ExcelImport} from '../../../public/excelImport'


 class ExcelImExportDemo extends Component{

    constructor(props){
        super(props);
        this.props = props;
    }
  
    render(){

        return(
        <div>
           <ExcelImport 
                {...Object.assign(this.props)}
                moduleName = 'uapbd'//模块名
                billType = 'customer'//单据类型
                importProcess = 'nccloud.bs.excel.customer.plugin.CustomerBaseExcelProcess'//插件处理类
                />
        </div>)
      
    }

}
ExcelImExportDemo = createPage({
})(ExcelImExportDemo);

ReactDOM.render(<ExcelImExportDemo />, document.querySelector('#app'));