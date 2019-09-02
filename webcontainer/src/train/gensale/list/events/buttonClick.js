import { listCreate, listRefresh } from './listOperator';
import  {LIST_BUTTON}  from '../../constant';
const lsit_button=LIST_BUTTON;

//列表头部按钮操作
export function buttonClick(props, id, text, record, index) {
	
	switch (id) {
		//新增
		case lsit_button.create:
			listCreate(props);
			break;

		case LIST_BUTTON.refresh:
			listRefresh(props);
			break;
	}
}