package nc.vo.hrhi.sale;

import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.pubapp.pattern.model.meta.entity.bill.BillMetaFactory;
import nc.vo.pubapp.pattern.model.meta.entity.bill.IBillMeta;

@nc.vo.annotation.AggVoInfo(parentVO = "nc.vo.trainncc.salesquotation.SalesQuotationVO")

public class AggSalesQuotationVO extends AbstractBill {

	@Override
	public IBillMeta getMetaData() {
		IBillMeta billMeta =BillMetaFactory.getInstance().getBillMeta(AggSalesQuotationVOMeta.class);
		return billMeta;
	}

	@Override
	public SalesQuotationVO getParentVO(){
		return (SalesQuotationVO)this.getParent();
	}

}