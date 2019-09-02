
package nc.bs.hk.pub.ace.bp;

import nc.impl.pubapp.pattern.data.bill.BillUpdate;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.VOStatus;

/**
 * 标准单据弃审的BP
 */
public class AceSalesQuotationVOUnApproveBP {

    public AggSalesQuotationVO[] unApprove(AggSalesQuotationVO[] clientBills,
                                           AggSalesQuotationVO[] originBills) {
        for (AggSalesQuotationVO clientBill : clientBills) {
            clientBill.getParentVO().setStatus(VOStatus.UPDATED);
        }
        BillUpdate<AggSalesQuotationVO> update = new BillUpdate<AggSalesQuotationVO>();
        AggSalesQuotationVO[] returnVos = update.update(clientBills, originBills);
        return returnVos;
    }
}
