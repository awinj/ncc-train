
package nc.bs.hrhi.sale.bp;

import nc.impl.pubapp.pattern.data.bill.BillUpdate;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.VOStatus;

/**
 * 标准单据审核的BP
 */
public class AceSalesQuotationVOApproveBP {

    /**
     * 审核动作
     *
     * @param vos
     * @param script
     * @return
     */
    public AggSalesQuotationVO[] approve(AggSalesQuotationVO[] clientBills,
                                         AggSalesQuotationVO[] originBills) {
        for (AggSalesQuotationVO clientBill : clientBills) {
            clientBill.getParentVO().setStatus(VOStatus.UPDATED);
        }
        BillUpdate<AggSalesQuotationVO> update = new BillUpdate<AggSalesQuotationVO>();
        AggSalesQuotationVO[] returnVos = update.update(clientBills, originBills);
        return returnVos;
    }

}
