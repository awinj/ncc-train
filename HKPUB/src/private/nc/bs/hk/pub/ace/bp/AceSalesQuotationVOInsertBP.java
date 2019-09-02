
package nc.bs.hk.pub.ace.bp;

import nc.bs.hk.pub.plugin.bpplugin.SalesQuotationVOPluginPoint;
import nc.impl.pubapp.pattern.data.bill.template.InsertBPTemplate;
import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.vo.hrhi.sale.AggSalesQuotationVO;

/**
 * 标准单据新增BP
 */
public class AceSalesQuotationVOInsertBP {

    public AggSalesQuotationVO[] insert(AggSalesQuotationVO[] bills) {

        InsertBPTemplate<AggSalesQuotationVO> bp = new InsertBPTemplate<AggSalesQuotationVO>(
                SalesQuotationVOPluginPoint.INSERT);
        this.addBeforeRule(bp.getAroundProcesser());
        this.addAfterRule(bp.getAroundProcesser());
        return bp.insert(bills);

    }

    /**
     * 新增后规则
     *
     * @param processor
     */
    private void addAfterRule(AroundProcesser<AggSalesQuotationVO> processor) {
        IRule<AggSalesQuotationVO> rule = null;
//        rule = new nc.bs.pubapp.pub.rule.BillCodeCheckRule();
//        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule).setCbilltype("TR20");
//        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule)
//                .setCodeItem("billno");
//        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule)
//                .setGroupItem("pk_group");
//        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule).setOrgItem("pk_org");
//        processor.addAfterRule(rule);
    }

    /**
     * 新增前规则
     *
     * @param processor
     */
    private void addBeforeRule(AroundProcesser<AggSalesQuotationVO> processer) {
//        IRule<AggSalesQuotationVO> rule = null;
//        rule = new nc.bs.pubapp.pub.rule.FillInsertDataRule();
//        processer.addBeforeRule(rule);
//        rule = new nc.bs.pubapp.pub.rule.CreateBillCodeRule();
//        ((nc.bs.pubapp.pub.rule.CreateBillCodeRule) rule).setCbilltype("TR20");
//        ((nc.bs.pubapp.pub.rule.CreateBillCodeRule) rule)
//                .setCodeItem("billno");
//        ((nc.bs.pubapp.pub.rule.CreateBillCodeRule) rule)
//                .setGroupItem("pk_group");
//        ((nc.bs.pubapp.pub.rule.CreateBillCodeRule) rule).setOrgItem("pk_org");
//        processer.addBeforeRule(rule);
    }
}
