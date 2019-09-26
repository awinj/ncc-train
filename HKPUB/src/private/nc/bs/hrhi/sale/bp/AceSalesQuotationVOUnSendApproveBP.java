
package nc.bs.hrhi.sale.bp;


import nc.impl.pubapp.pattern.data.bill.BillUpdate;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.VOStatus;
import nc.vo.pub.pf.BillStatusEnum;

/**
 * 标准单据收回的BP
 */
public class AceSalesQuotationVOUnSendApproveBP {

    public AggSalesQuotationVO[] unSend(AggSalesQuotationVO[] clientBills,
                                        AggSalesQuotationVO[] originBills) {
        // 把VO持久化到数据库中
        this.setHeadVOStatus(clientBills);
        BillUpdate<AggSalesQuotationVO> update = new BillUpdate<AggSalesQuotationVO>();
        AggSalesQuotationVO[] returnVos = update.update(clientBills, originBills);
        return returnVos;
    }

    private void setHeadVOStatus(AggSalesQuotationVO[] clientBills) {
        for (AggSalesQuotationVO clientBill : clientBills) {
            clientBill.getParentVO().setAttributeValue("${vmObject.billstatus}",
                    BillStatusEnum.FREE.value());
            clientBill.getParentVO().setStatus(VOStatus.UPDATED);
        }
    }
}
