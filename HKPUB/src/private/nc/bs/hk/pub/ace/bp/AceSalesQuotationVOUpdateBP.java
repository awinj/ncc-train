
package nc.bs.hk.pub.ace.bp;

import nc.bs.hk.pub.plugin.bpplugin.SalesQuotationVOPluginPoint;
import nc.impl.pubapp.pattern.data.bill.template.UpdateBPTemplate;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.vo.hrhi.sale.AggSalesQuotationVO;

/**
 * 修改保存的BP
 */
public class AceSalesQuotationVOUpdateBP {

    public AggSalesQuotationVO[] update(AggSalesQuotationVO[] bills,
                                        AggSalesQuotationVO[] originBills) {
        // 调用修改模板
        UpdateBPTemplate<AggSalesQuotationVO> bp = new UpdateBPTemplate<AggSalesQuotationVO>(
                SalesQuotationVOPluginPoint.UPDATE);
        // 执行前规则
        this.addBeforeRule(bp.getAroundProcesser());
        // 执行后规则
        this.addAfterRule(bp.getAroundProcesser());
        return bp.update(bills, originBills);
    }

    private void addAfterRule(CompareAroundProcesser<AggSalesQuotationVO> processer) {
        // TODO 后规则
        IRule<AggSalesQuotationVO> rule = null;
        rule = new nc.bs.pubapp.pub.rule.BillCodeCheckRule();
        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule).setCbilltype("TR20");
        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule)
                .setCodeItem("billno");
        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule)
                .setGroupItem("pk_group");
        ((nc.bs.pubapp.pub.rule.BillCodeCheckRule) rule).setOrgItem("pk_org");
        processer.addAfterRule(rule);

    }

    private void addBeforeRule(CompareAroundProcesser<AggSalesQuotationVO> processer) {
        // TODO 前规则
        IRule<AggSalesQuotationVO> rule = null;
        rule = new nc.bs.pubapp.pub.rule.FillUpdateDataRule();
        processer.addBeforeRule(rule);
        nc.impl.pubapp.pattern.rule.ICompareRule<AggSalesQuotationVO> ruleCom = new nc.bs.pubapp.pub.rule.UpdateBillCodeRule();
        ((nc.bs.pubapp.pub.rule.UpdateBillCodeRule) ruleCom)
                .setCbilltype("TR20");
        ((nc.bs.pubapp.pub.rule.UpdateBillCodeRule) ruleCom)
                .setCodeItem("billno");
        ((nc.bs.pubapp.pub.rule.UpdateBillCodeRule) ruleCom)
                .setGroupItem("pk_group");
        ((nc.bs.pubapp.pub.rule.UpdateBillCodeRule) ruleCom)
                .setOrgItem("pk_org");
        processer.addBeforeRule(ruleCom);
    }

}
