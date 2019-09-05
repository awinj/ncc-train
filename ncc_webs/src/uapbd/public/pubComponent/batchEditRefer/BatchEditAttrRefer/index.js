import { high } from 'nc-lightapp-front';

const { Refer } = high;


/**
 * author zhenmx
 * @param props
 * @returns {*}
 */
export default function (props = {}) {
    return <Refer {...Object.assign(
        {
            refType: 'grid',
            refName: props.json['batchedit-000000'],/* 国际化处理： 批改属性*/
            placeholder: props.json['batchedit-000000'],/* 国际化处理： 批改属性*/
            refCode: 'uapbd.custBatchEdit.attrRefer',
            queryGridUrl: '/nccloud/uapbd/custBatchEdit/attrRefer.do',
            columnConfig: [{name: [  props.json['batchedit-000001']],code: ['refname']}],/* 国际化处理： 名称*/
            isMultiSelectedEnabled: true }, props)} />
}
