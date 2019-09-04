import { listCreate, listRefresh } from './listOperator';
import { LIST_BUTTON } from '../../constant';

//列表头部按钮操作
export function buttonClick(props, id, text, record, index) {
	switch (id) {
		//新增
		case LIST_BUTTON.create:
			listCreate(props);
			break;

		case LIST_BUTTON.refresh:
			listRefresh(props);
			break;
	}
}