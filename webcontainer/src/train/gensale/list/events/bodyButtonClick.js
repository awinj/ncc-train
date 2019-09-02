import { PRIMARTKEY, LIST_BUTTON } from '../../constant';
import { listEdit, listDelete } from './listOperator';

//列表操作列按钮操作
export function bodyButtonClick(props, key, text, record, index) {
    let pk = record[PRIMARTKEY.head_id] && record[PRIMARTKEY.head_id].value;

    switch (key) {
        //修改
        case LIST_BUTTON.bodyUpdate:
            listEdit(props, pk)
            break;
        //删除
        case LIST_BUTTON.bodyDelete:
            listDelete(props, pk, index);
            break;
    }
}
