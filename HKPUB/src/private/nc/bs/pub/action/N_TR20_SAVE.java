
package nc.bs.pub.action;

import nc.bs.framework.common.NCLocator;
import nc.bs.hk.pub.plugin.bpplugin.SalesQuotationVOPluginPoint;
import nc.bs.pubapp.pf.action.AbstractPfAction;
import nc.bs.pubapp.pub.rule.CommitStatusCheckRule;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public class N_TR20_SAVE extends AbstractPfAction<AggSalesQuotationVO> {

    protected CompareAroundProcesser<AggSalesQuotationVO> getCompareAroundProcesserWithRules(
            Object userObj) {
        CompareAroundProcesser<AggSalesQuotationVO> processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                SalesQuotationVOPluginPoint.SEND_APPROVE);

        IRule<AggSalesQuotationVO> rule = new CommitStatusCheckRule();
        processor.addBeforeRule(rule);
        return processor;
    }

    @Override
    protected AggSalesQuotationVO[] processBP(Object userObj,
                                              AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills) {
        ISalesquotationvoMaintain operator = NCLocator.getInstance().lookup(
                ISalesquotationvoMaintain.class);
        AggSalesQuotationVO[] bills = null;
        try {
            bills = operator.save(clientFullVOs, originBills);
        } catch (BusinessException e) {
            ExceptionUtils.wrappBusinessException(e.getMessage());
        }
        return bills;
    }

}
