package nccloud.vo.pubitf.book;

import nc.vo.pubapp.pattern.model.meta.entity.bill.AbstractBillMeta;

public class AggBookVOMeta extends AbstractBillMeta{

	public AggBookVOMeta(){
		this.init();
	}

	private void init() {
		this.setParent(nccloud.vo.pubitf.book.BookVO.class);
	}
}