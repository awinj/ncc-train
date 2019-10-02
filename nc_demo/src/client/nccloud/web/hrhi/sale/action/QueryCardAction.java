package nccloud.web.hrhi.sale.action;

import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.web.container.IRequest;
import nccloud.web.hk.pub.action.BaseQueryCardAction;

/**
 * 卡片查询（查询方案）操作
 *
 * @version @since v3.5.6-1903
 */
public class QueryCardAction extends BaseQueryCardAction<AggSalesQuotationVO> {

    @Override
    public Object doAction(IRequest paramIRequest) {
        return super.doAction(paramIRequest);
    }


    @Override
    protected AbstractBill getAggVO() {
        return new AggSalesQuotationVO();
    }
}