import React, { Component } from 'react';
import Utils, {BaseUtils} from '../utils'
import {base} from 'nc-lightapp-front';
let { NCTable,NCCheckbox } = base;
import  Record  from './Record.js';
var EMPTY_FN = function(){};
//行选择模型
var SelectedModel  = function(table,config){
    var table = table,
        recordid = undefined,
        cssSelected = config.cssSelected || 'extable-selected-row',
        listeners = config.listeners,
        handerSelected = function(operRecord, suppressEvent = true){
            var mode = table.getMode(),
                record  = recordid ? undefined: (mode === 'edit' ? table.getDirtyOperation().findRecordById(recordid) :table.findRecordById(recordid)),
                bfeListener = suppressEvent ? listeners['beforeselected'] : EMPTY_FN,
                afeListener = suppressEvent ? listeners['selected'] : EMPTY_FN,
                chgListener = suppressEvent ? listeners['selectedchange']  : EMPTY_FN;
            if(bfeListener(operRecord,record, this, table) === false){
                return false;
            }
            recordid = operRecord == undefined ? undefined :  operRecord.getId();
            table.setState(table.state, ()=>{
                afeListener(operRecord, this, table);
                chgListener(operRecord, this, table);
            });
        };

        this.selected = (record0, suppressEvent = true) => {
            var recordid0 = record0 ? record0.getId() : undefined;
            if(recordid == recordid0)
            return;
            handerSelected(record0, suppressEvent);
        };
        
        this.clearSelected = (suppressEvent = true) => {
            handerSelected(undefined, suppressEvent);
        };

        this.getSelected = () => {
            return table.getMode()  === 'edit' ? table.getDirtyOperation().findRecordById(recordid) : table.findRecordById(recordid)
        };

        this.getCssSelected = () => cssSelected;
};

//行多选选择模型
var CheckBoxSelectModel = function(table,config){
    var table = table,
        selectAll = false,
        recordids = [],
        classname = config.classname || 'table-checkbox',
        listeners = config.listeners,
        handerChecked, createCheckBoxColumn;
    
    handerChecked = function(operRecords, operaiton = 'checked', suppressEvent = true){
        var records = table.getMode() === 'edit' ? table.getDirtyOperation().findRecordByIds(recordids) : table.findRecordByIds(recordids),
            bfeListener = suppressEvent ? listeners[operaiton === 'checked' ? 'beforechecked' : 'beforedechecked'] : EMPTY_FN,
            afeListener = suppressEvent ? listeners[operaiton === 'checked' ? 'checked' : 'dechecked'] : EMPTY_FN,
            chgListener = suppressEvent ? listeners['checkedchange']  : EMPTY_FN;
    
        if(bfeListener(operRecords,records, this, table) === false){
            return false;
        }
        if(operaiton === 'checked'){ //过滤出当前选中中不存在记录,并添加
            var addRecords = operRecords.filter( rcd  => records.indexOf(rcd) === -1 );
            records = records.concat(addRecords)
        }else{ //在选中中移除存在的记录
            records = records.filter( rcd => operRecords.indexOf(rcd) < 0 );
        }
        recordids = records.map( r => {return r.getId()});
        selectAll = (records.length == table.state.records.length) && table.state.records.length != 0;

        table.setState(table.state, ()=>{
            afeListener(records, this, table);
            chgListener(records, this, table);
        });
    };

    this.checked = (records, suppressEvent = true) => {
        handerChecked(BaseUtils.isArray(records) ? records : [records], 'checked', suppressEvent);
        
    };
   
    this.dechecked = (records, suppressEvent = true) => {
        handerChecked(BaseUtils.isArray(records) ? records : [records], 'dechecked', suppressEvent);
    };

    this.checkedAll = (suppressEvent = true ) => {
        handerChecked(table.state.records || [], 'checked', suppressEvent);
    };

    this.decheckedAll = (suppressEvent = true ) => {
        handerChecked(table.state.records, 'dechecked', suppressEvent);
    };

    this.getChecked = () => {
        return table.getMode() === 'edit' ? table.getDirtyOperation().findRecordByIds(recordid) : table.findRecordByIds(recordids)
    };
    
    this.isSelectAll  = () => selectAll;


    this.createCheckBoxColumn = createCheckBoxColumn = function(){
        return {
            title: (
                <NCCheckbox
                    // className={classname}
                    checked={ table.state.checkedModel.isSelectAll()}
                    onChange={(value) => {
                        value ?  table.state.checkedModel.checkedAll():  table.state.checkedModel.decheckedAll();
                    }} />
            ),
            key: "checkbox",
            dataIndex: "checkbox",
            width: "5%",
            render: (text, record, index) => {
                return (
                    <NCCheckbox
                        className="table-checkbox"
                        checked={recordids.indexOf(record.getId()) !== -1 }
                        onChange={(value) => {
                            value ? table.state.checkedModel.checked(record) : table.state.checkedModel.dechecked(record);
                        }} />
                );
            }
        }
    };
}


import './Table.less';
//表组件
class Table extends Component {

    constructor(props) {
        super(props);
        this.config = props;
        var state = this.state = {};
  

        //init data and eidtMode;
        state.records = [];
        state.dirtyRecords = [];
        state.mode = 'browse';

        //init listeners
        var listeners = props.listeners || {},
            listenerNames = ['beforemodechange','modechange','onRowDoubleClick', 'selectedchange','selected','deselected','beforeselected','beforedselected','onRowClick','load', 'addDirtyRecord','updateDirtyRecord','removeDirtyRecord'];
        listenerNames.forEach( name => {
            listeners[name] = listeners[name] ? listeners[name] : EMPTY_FN;
        });
        var onrowclick = () => {
            var  listener = listeners['onRowClick'];
            return (record, index, e) => {
                var selModel = this.state.selectedModel;
                listener(record, index, e);
                selModel.selected(record);
            }
        };
        listeners['onRowClick'] = onrowclick();
        state.listeners = listeners;

        
        //init selectedModel
        var selectedModelConfig = {
            listeners:{
                selectedchange: listeners['selectedchange'],
                selected: listeners['selected'],
                beforeselected: listeners['beforeselected']
            }
        };
        state.selectedModel = new SelectedModel(this, selectedModelConfig);

        //init checkedModel
        if(props.checkedModel){   
            var listenerNames = ['checkedchange','checked','dechecked','beforechecked','beforedechecked'],
                checkedlisteners = props.checkedModel.listeners || {},
                checkedModelConfig, checkedModel;

            listenerNames.forEach( name => {
                checkedlisteners[name] = checkedlisteners[name] ? checkedlisteners[name] : EMPTY_FN;
            });

            checkedModelConfig = {
                listeners:checkedlisteners
            };
            checkedModel = state.checkedModel = new CheckBoxSelectModel(this, checkedModelConfig);
            //state.columns = state.columns.concat(checkedModel.createCheckBoxColumn());
        }

        //init column
        var cfgColumns = props.columns || {},
            initColumns = () => {
                var cols = cfgColumns.map( (col) => {
                    var dataIndex = col.dataIndex || function(){},
                        render = (text, record, index) => {
                            var value = BaseUtils.isFunction(dataIndex) ? dataIndex(record, index) : record.getData()[dataIndex],
                                mode = this.getMode(),
                                editer  =  !col.editer  ? undefined : (BaseUtils.isFunction(col.editer) ? col.editer: createEditer(col.editer));  
                                if(  !(mode==='edit' && editer )  )
                                    return col.render ? col.render(value, record, index) : value;
                                return editer(record, index, this);  
                        };
                    var title = col.require  && this.getMode() == 'edit' ? <span><span style={{color:'red'}}>*</span>{col.title}</span>  : col.title;
                    return { ...col ,...{dataIndex: dataIndex,render:render}, title: title};
                });
                if(state.checkedModel)
                    cols.unshift(checkedModel.createCheckBoxColumn());
                return cols;
        };
        state.initColumns = initColumns;

        this.tableConfig = {
            onRowClick:  listeners['onRowClick'],
            onRowDoubleClick:listeners['onRowDoubleClick'] || EMPTY_FN,
            rowKey: (record, index) => record.getId(),
            rowClassName: (record, index)=>{
                var state = this.state,
                    selModel = state.selectedModel,
                    selRecord = selModel.getSelected();
                return selRecord && selRecord.getId() == record.getId()  ?  selModel.getCssSelected() : '';
            },
            useFixedHeader:true,
            scroll:this.config.scroll || { x: true, y: 400 }
        };
    }

    loadData(datas){
        var records = datas.map( (data) =>{
            return new Record(data);
        });
        this.state.records = records;
        this.state.selectedModel.clearSelected();
        this.state.checkedModel && this.state.checkedModel.decheckedAll();
        this.setState(this.state, () =>{
            this.state.listeners['load'](this,  this.state.records);

        });
    }

    editMode(callback){
        var state = this.state,
            oldMode = this.getMode(),
            newMode = 'edit',
            editRecords = state.editRecords,
            records = state.records,
            beforeListener = state.listeners['beforemodechange'], 
            afterListener  = state.listeners['modechange'] ;

        if(oldMode === 'edit') return; 
        if( beforeListener(this, oldMode, newMode) === false)
            return;
        state.dirtyRecords = Record.copyRecords(state.records) 
        state.mode = newMode;
        //清理选中行
        this.setState(state, () => {
            afterListener(this, oldMode, newMode);
            callback && callback(oldMode, newMode);
        });
    }

    cancelEditMode(callback){
        var state = this.state,
            oldMode = this.getMode(),
            newMode = 'browse',
            editRecords = state.editRecords,
            records = state.records,
            beforeListener = state.listeners['beforemodechange'], 
            afterListener  = state.listeners['modechange'] ;

        if(oldMode === 'browse') return;  //相同状态改变退出
        if( beforeListener(this, oldMode, newMode) === false)
            return;
        state.dirtyRecords = []
        state.mode = newMode;
        this.setState(state, () => {
            afterListener(this, oldMode, newMode);
            callback && callback(oldMode, newMode);
        });
    }

    synEditMode( callback){
        var state = this.state,
            oldMode = this.getMode(),
            newMode = 'browse',
            editRecords = state.editRecords,
            records = state.records,
            beforeListener = state.listeners['beforemodechange'], 
            afterListener  = state.listeners['modechange'] ;

        if(oldMode === 'browse') return;  //相同状态改变退出
        if( beforeListener(this, oldMode, newMode) === false)
            return;
       
        state.records = Record.copyRecords(state.dirtyRecords);
        state.records = state.records.filter( rcd =>  rcd.getStatus() !== 'del');
        state.records = state.records.map( rcd => {
              rcd._setStatus('common');
              return rcd;
        } );
        state.mode = newMode;
        this.setState(state, () => {
            afterListener(this, oldMode, newMode);
            callback && callback(oldMode, newMode);
        });
       
    }

    getMode(){
        return this.state.mode;
    }

    getRecords(){
        return this.state.records;
    }

    findRecordById(id){
        if(!id) return undefined;
        var records = this.findRecordByIds([id]);
        return records === undefined || records.length == 0 ? undefined : records[0];
    }

    findRecordByIds(ids){
        var results = [];
        this.state.records.forEach((r) => {
            if(ids.indexOf(r.getId() ) !== -1)
            results.push(r);
        });
        return results;

        // return this.state.records.filter((r) => {
        //     return ids.indexOf(r.getId() ) !== -1;
        // } );
    }

    getSelectRecord(){
        return this.state.selectedModel.getSelected();
    }

    getCheckedRecords(){
        return this.state.checkedModel.getChecked();
    }
    clearTableData = (callback)=>{
        this.setState({records:[],dirtyRecords:[]},()=>{
            callback && callback();
        })
    }
    //脏数据record 操作
    getDirtyOperation(){
        var state = this.state,
            me = this;
        if(state.mode !== 'edit' && state.mode !== 'add')  return;
        return {
            findRecordById: (id) => {
                if(!id) return undefined;
                var records = me.getDirtyOperation().findRecordByIds([id]);
                return records === undefined || records.length == 0 ? undefined : records[0];
            },
            findRecordByIds(id){
                return state.dirtyRecords.filter(r => {
                    return id.indexOf(r.getId()) !== -1;
                });
            },
            findRecordByIndex: (index) => {
                return state.dirtyRecords[index];
            },
            
            findRecordByCond(filterfn){
                state.dirtyRecords.filter(filterfn || EMPTY_FN);
            },

            getRecords: () => {
                return state.dirtyRecords;
            },

            addData: ( datas ) =>{
                var datas = BaseUtils.isArray(datas) ? datas : [datas];
                if(datas.length == 0) return;
                state.dirtyRecords = state.dirtyRecords.concat( datas.map(d =>new Record(d, 'add') ) );
                this.setState(state, () => {
                    state.listeners['addDirtyRecord']();//参数以后再加
                });

            },
            updateRecord: (records) => {
                var tempRecords = BaseUtils.isArray(records) ? records : [records];
                state.dirtyRecords.forEach( dr => {
                    tempRecords.forEach(tr => {
                        if(dr.getId() === tr.getId()){
                            dr.setData(tr.getData());
                            if(dr.getStatus() != 'add' && dr.getStatus() != 'del'){
                                dr._setStatus('edit');
                            }
                        }
                    });
                });
                this.setState(state, ()=>{
                    state.listeners['updateDirtyRecord']();//参数以后再加
                });
            },
            removeRecord: (records) => {
                var tempRecords = BaseUtils.isArray(records) ? records : [records];
                var tempids = tempRecords.map( tr => tr.getId() );
                    
                // state.dirtyRecords = state.dirtyRecords.filter(dr => {
                //    return tempids.indexOf(dr.getId()) == -1;
                // })
                state.dirtyRecords = state.dirtyRecords.map(dr => {
                    if(tempids.indexOf(dr.getId()) != -1){
                        dr._setStatus('del');
                    }
                    return dr;
                 })
                me.setState(state, ()=>{
                    state.listeners['removeDirtyRecord'](); //参数以后再加
                });
            }
        }
    }

    render() {
       return (
            <NCTable 
                className='excom-table'
                columns={this.state.initColumns()} 
                data={this.state.mode === 'browse' ? this.state.records : this.state.dirtyRecords.filter(e => e.getStatus() !== 'del') }
                 {...this.tableConfig}/>
       )
    }  
}
export default Table;