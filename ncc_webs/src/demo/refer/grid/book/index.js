import { high } from 'nc-lightapp-front';

const { Refer } = high;

export default function (props = {}) {
    var conf = {
        multiLang: {
            domainName: 'pubitf',
            currentLocale: 'zh-CN',
            moduleId: 'refer_pubitf',
        },
        refType: 'grid',
        refName: '图书档案',
        placeholder: '图书档案',/* 国际化处理： 客户税类*/
        refCode: 'pubitf.book.BookGridRef',
        queryGridUrl: '/nccloud/pubitf/ref/BookGridRef.do',
        columnConfig: [{ name: ['isbn', '图书名称'], code: ['code', 'name'] }],/* 国际化处理： 税类编码,税类名称*/
        isMultiSelectedEnabled: false,
        isHasDisabledData: false
    };

    return <Refer {...conf} {...props} />
}