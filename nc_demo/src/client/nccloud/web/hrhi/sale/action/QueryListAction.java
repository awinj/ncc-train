package nccloud.web.hrhi.sale.action;

import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.web.container.IRequest;
import nccloud.web.hk.pub.action.BaseQueryListAction;

/**
 * 列表查询（查询方案）操作
 *
 * @version @since v3.5.6-1903
 */
public class QueryListAction extends BaseQueryListAction<AggSalesQuotationVO> {

    @Override
    public Object doAction(IRequest paramIRequest) {

        // 转换grid信息，返回前端
        return super.doAction(paramIRequest);
    }

    @Override
    protected AbstractBill getAggVO() {
        return new AggSalesQuotationVO();
    }
}