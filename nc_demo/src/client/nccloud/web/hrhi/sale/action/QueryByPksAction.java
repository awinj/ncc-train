package nccloud.web.hrhi.sale.action;

import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.web.container.IRequest;
import nccloud.web.hk.pub.action.BaseQueryByPksAction;

/**
 * 列表翻页查询
 *
 * @version @since v3.5.6-1903
 */
public class QueryByPksAction extends BaseQueryByPksAction<AggSalesQuotationVO> {

    @Override
    public Object doAction(IRequest paramIRequest) {
        return super.doAction(paramIRequest);
    }

    @Override
    protected AbstractBill getAggVO() {
        return new AggSalesQuotationVO();
    }
}