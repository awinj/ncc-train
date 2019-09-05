import { high } from 'nc-lightapp-front';

const { Refer } = high;

/**
 * author zhenmx
 * @param props
 * @returns {*}
 */
export default function (props = {}) {
    return <Refer {...Object.assign({
        refType: 'grid',
        refName:props.json['batchedit-000002'],/* 国际化处理： 批改页签*/
        placeholder: props.json['batchedit-000002'],/* 国际化处理： 批改页签*/
        refCode: 'uapbd.custBatchEdit.tabRefer',
        queryGridUrl: '/nccloud/uapbd/custBatchEdit/tabRefer.do',
        columnConfig: [{name: [ props.json['batchedit-000003']],code: ['refname']}],/* 国际化处理： 页签名称*/
        isMultiSelectedEnabled: false
    }, props)} />
}
