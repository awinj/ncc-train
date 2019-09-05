import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';
const {NCButton}=base;

/**
 * author zhenmx
 * 客户向导分配，向导批改,以及岗位批量新增要用到的列表模板组件
 *（勿动）
 */
class ResultGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPKs:[],
            simpleOrEdit:props.simpleOrEdit,
            gridId:props.gridId,
            selectAllFlag:false
        };

    }
    onSelected = (props, moduleId, record, index, status) => {
        if(status){
            this.state.selectedPKs.push(record.pk_customer.value);
        }else{
            let index = this.state.selectedPKs.indexOf(record.pk_customer.value);
            if (index > -1) {
                this.state.selectedPKs.splice(index, 1);
            }
        }
        this.setState(this.state);
    }
    onSelectedAll = (props, moduleId, status, length) => {

        if(status){
            let tablecheckrows = props.table.getCheckedRows(moduleId);
            tablecheckrows.map((e)=>{
                this.state.selectedPKs.push(e.data.values.pk_customer.value);
            });
        }else{
            let alltabledata = props.table.getAllTableData(moduleId);
            alltabledata.rows.map((e)=>{
                let index = this.state.selectedPKs.indexOf(e.values.pk_customer.value);

                if(index> -1){
                    this.state.selectedPKs.splice(index,1);
                }
            })
        }
        this.setState(this.state);
    }
    handlePageCheck =()=>{
        this.props.pageprops.table.selectAllRows(this.state.gridId,true);
        this.props.table.getCheckedRows(this.state.gridId).map((e)=>{
            this.state.selectedPKs.push(e.data.pk_customer.value);
        })


    }
    handlePageCancel = ()=>{
        this.props.pageprops.table.selectAllRows(this.state.gridId,false);
        let alltabledata = this.props.pageprops.table.getAllTableData(this.state.gridId);
        alltabledata.rows.map((e)=>{
            var index = this.state.selectedPKs.indexOf(e.values.pk_customer.value);
            if(index > -1){
                this.state.selectedPKs.splice(index,1);
            }
        });
        this.setState(this.state);

    }
    handleAllCheck=()=>{
        this.props.pageprops.table.selectAllRows(this.state.gridId,true);
        let alltabledata = this.props.pageprops.table.getAllTableData(this.state.gridId);
        this.state.selectedPKs = alltabledata.allpks;
        this.state.selectAllFlag = true;
        this.setState(this.state);


    }
    handleAllCancel =()=>{
        this.props.pageprops.table.selectAllRows(this.state.gridId,false);
        this.state.selectedPKs = [];
        this.state.selectAllFlag = false;
        this.setState(this.state);
    }

    onClickPageInfo =(props,config,pks)=>{
        this.props.loadResutlGridData(pks,()=>{
            if(this.state.selectAllFlag){
                this.props.pageprops.table.selectAllRows(this.state.gridId,true);
            }
        });
    }
    render() {
        const {table,editTable} = this.props.pageprops;
        const{createSimpleTable} = table;
        const{createEditTable} = editTable;

        if(this.state.simpleOrEdit==='simple'){
            return (
               <div>
                   <div style={{display: this.props.showHeadButtons === false ? 'none' : ''}}>
                       <NCButton style={{backgroundColor:'#e4e4e4'}} shape="border" colors="accent" onClick={ this.handleAllCheck.bind(this) }>{this.props.json['resultgrid-000000']}</NCButton>{/* 国际化处理： 全部选择*/}
                       <NCButton style={{backgroundColor:'#e4e4e4'}} shape="border" colors="accent" onClick={ this.handleAllCancel.bind(this) }>{this.props.json['resultgrid-000001']}</NCButton>{/* 国际化处理： 全部取消*/}
                       <NCButton style={{backgroundColor:'#e4e4e4'}} shape="border" colors="accent" onClick={ this.handlePageCheck.bind(this) }>{this.props.json['resultgrid-000002']}</NCButton>{/* 国际化处理： 本页选择*/}
                       <NCButton style={{backgroundColor:'#e4e4e4'}} shape="border" colors="accent" onClick={ this.handlePageCancel.bind(this) }>{this.props.json['resultgrid-000003']}</NCButton>{/* 国际化处理： 本页取消*/}
                   </div>
                <div className="nc-singleTable-table-area">
                    {createSimpleTable(this.props.gridId, {
                        handlePageInfoChange: this.onClickPageInfo.bind(this),
                        onSelected:this.props.onSelected || this.onSelected.bind(this),
                        onSelectedAll:this.props.onSelectedAll || this.onSelectedAll.bind(this),
                        height: this.props.height || '450px',
                        showIndex:true,
                        showCheck:true
                    })}
                </div>
               </div>
            )
        }else{
            return(
                <div className="nc-singleTable-table-area">
                    {createEditTable(this.props.gridId, {
                        showIndex:true,
                        height: this.props.height || '450px',
                    })}
                </div>
                )
        }

    }
}
export default ResultGrid;
