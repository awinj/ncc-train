/**
 * 工具类集合
 * @author  yinshb
 *
 * 使用说明：
 *
 * import  Utils from '../../../public/utils';
 *
 * 深复制简单实用
 * let new_obj =   Utils.clone(obj);
 *
 * 将保存后返回的数据更新到页面中
 * 调用完方法后，allD为更新后的数据结构对象
 * Utils.filterResult(allD,data[tableid].rows);
 *
 *
 * 表格数查询启用状态值转化
 * 改方法在获取后台数据放置到页面时调用，已经获取页面数据传递给后台时调用
 * let  rows = Utils.convertGridEnablestate(rows);
 *
 * 过来表格删除的行
 * @param  rows 页面表格中行数据的数组
 * Utils.filterDelRows(tableData.rows);
 *
 *
 * 后台返回表格数处理
 * @param   props   prpos参数
 * @param   tableid 表格id
 * @param   data    后台返回数据对象
 * @param   empty   数据为空时执行回调方法
 * @param   notEmpty    数据不为空时执行回调方法
 * @param   after   处理完成后执行回到方法
 * Utils.handleTableReData({
 		data : data,
		tableid : tableid,
		props : this.props,
		empty : (data) => {

		},
		notEmpty : (data)=>{
			data[tableid].rows.forEach(function(item, index, array){
				if (item.values['doclevel'].value === '1') {
					item.values['code'].disabled = 'on';
					item.values['name'].disabled = 'on';
					item.values['mngctlmode'].disabled = 'on';
					item.values['isgrade'].disabled = 'on';
				}
			});

		},
		after : (data)=> {
			allTableData = data[tableid];
			this.updateButtonStatus();
		}
	});
 */

import {filterResult,convertGridEnablestate,filterDelRows,handleTableReData,filterArraybyAttr,filterArraybyPks,convertDelData} from './tableUtil';
import deepClone from './deepClone';

import BaseUtils from './base.js'
import DateUtils from './dateUtil';

import {checkHasChildren,dealTreeData} from './treeUtil';
import {checkHasProps,convertEnableState} from './formUtil';
import BillCodeUtil from './billCodeUtil.js';
import queryToastFunc from './queryToastFunc';


import BDselect  from './bdselected.js';
import initPage  from './initPage.js';
var Utils = {
    clone : deepClone,
    filterResult : filterResult,
    convertGridEnablestate : convertGridEnablestate,
    filterDelRows : filterDelRows,
    handleTableReData : handleTableReData,
    checkHasChildren:checkHasChildren,
    checkHasProps:checkHasProps,
	dealTreeData:dealTreeData,
	filterArraybyAttr:filterArraybyAttr,
	filterArraybyPks:filterArraybyPks,
    convertEnableState:convertEnableState,
	dealTreeData:dealTreeData,
	BDselect: BDselect,
    convertDelData: convertDelData,
    BillCodeUtil:BillCodeUtil,
    queryToastFunc:queryToastFunc,
	initPage:initPage
};

export default Utils;
export {BaseUtils};
export {DateUtils}

