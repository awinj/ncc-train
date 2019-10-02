package nccloud.web.hrhi.sale.action;

import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.web.container.IRequest;
import nccloud.web.hk.pub.action.bd.BDDeleteAction;
import nccloud.web.hk.pub.action.pf.PFDeleteAction;

/**
 * 删除（支持批量）
 *
 * @version @since v3.5.6-1903
 */
public class DeleteAction extends PFDeleteAction<AggSalesQuotationVO> {


    @Override
    protected String getBillType() {
        return "HK01";
    }

}