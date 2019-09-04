
import { listEdit, listDelete,listSearch,listRefresh,listCreate } from './listOperator';


    //卡片操作按钮
      export function buttonClick(props, id, text, record, index){
        const {ButtonAction} =props.configExt;
        switch (id) {
            //新增
            case ButtonAction.add:
                listCreate(props);
                break;

            case ButtonAction.refresh:
                listRefresh(props);
                break;
        }
    }

    //列表操作列按钮操作
export function bodyButtonClick(props, key, text, record, index) {
        const {ListArea,PrimaryKey,ButtonAction} =props.configExt;
        let pk = record[ListArea.head] && record[PrimaryKey.head].value;
        switch (key) {
            //修改
            case ButtonAction.editLine:
                listEdit(props, pk)
                break;
            //删除
            case ButtonAction.delLine:
                listDelete(props, pk, index);
                break;
        }
    }


    //点击查询，获取查询区数据
export function searchBtnClick(props) {
        listSearch(props);
    }



