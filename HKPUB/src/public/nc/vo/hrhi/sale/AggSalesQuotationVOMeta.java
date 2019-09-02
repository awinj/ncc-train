package nc.vo.hrhi.sale;

import nc.vo.pubapp.pattern.model.meta.entity.bill.AbstractBillMeta;

public class AggSalesQuotationVOMeta extends AbstractBillMeta{
	
	public AggSalesQuotationVOMeta(){
		this.init();
	}
	
	private void init() {
		this.setParent(nc.vo.hrhi.sale.SalesQuotationVO.class);
		this.addChildren(nc.vo.hrhi.sale.SalesQuotationBVO.class);
	}
}