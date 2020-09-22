package nccloud.vo.pubitf.book;

import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.pubapp.pattern.model.meta.entity.bill.BillMetaFactory;
import nc.vo.pubapp.pattern.model.meta.entity.bill.IBillMeta;

@nc.vo.annotation.AggVoInfo(parentVO = "nccloud.vo.pubitf.book.BookVO")

public class AggBookVO extends AbstractBill {

	@Override
	public IBillMeta getMetaData() {
		IBillMeta billMeta =BillMetaFactory.getInstance().getBillMeta(AggBookVOMeta.class);
		return billMeta;
	}

	@Override
	public BookVO getParentVO(){
		return (BookVO)this.getParent();
	}

}