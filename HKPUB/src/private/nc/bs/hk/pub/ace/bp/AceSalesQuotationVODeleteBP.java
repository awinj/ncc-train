
package nc.bs.hk.pub.ace.bp;


import nc.bs.hk.pub.plugin.bpplugin.SalesQuotationVOPluginPoint;
import nc.impl.pubapp.pattern.data.bill.template.DeleteBPTemplate;
import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
import nc.vo.hrhi.sale.AggSalesQuotationVO;


/**
 * 标准单据删除BP
 */
public class AceSalesQuotationVODeleteBP {

    public void delete(AggSalesQuotationVO[] bills) {

        DeleteBPTemplate<AggSalesQuotationVO> bp = new DeleteBPTemplate<AggSalesQuotationVO>(
                SalesQuotationVOPluginPoint.DELETE);
        // 增加执行前规则
//        this.addBeforeRule(bp.getAroundProcesser());
        // 增加执行后业务规则
//        this.addAfterRule(bp.getAroundProcesser());
        bp.delete(bills);
    }

    private void addBeforeRule(AroundProcesser<AggSalesQuotationVO> processer) {
        // TODO 前规则
//              IRule<AggSalesQuotationVO> rule = null;
//              rule = new nc.bs.pubapp.pub.rule.BillDeleteStatusCheckRule();
//              processer.addBeforeRule(rule);
    }

    /**
     * 删除后业务规则
     *
     * @param processer
     */
    private void addAfterRule(AroundProcesser<AggSalesQuotationVO> processer) {
        // TODO 后规则

    }
}
