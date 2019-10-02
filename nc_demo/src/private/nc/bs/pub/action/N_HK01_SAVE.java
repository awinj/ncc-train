
package nc.bs.pub.action;

import nc.bs.framework.common.NCLocator;
import nc.bs.hrhi.plugin.bpplugin.SalesQuotationPluginPoint;
import nc.bs.pubapp.pf.action.AbstractPfAction;
import nc.bs.pubapp.pub.rule.CommitStatusCheckRule;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.itf.hk.pub.IBaseMaintainService;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public class N_HK01_SAVE extends AbstractPfAction<AggSalesQuotationVO> {

    protected CompareAroundProcesser<AggSalesQuotationVO> getCompareAroundProcesserWithRules(
            Object userObj) {
        CompareAroundProcesser<AggSalesQuotationVO> processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                SalesQuotationPluginPoint.SEND_APPROVE);

        IRule<AggSalesQuotationVO> rule = new CommitStatusCheckRule();
        processor.addBeforeRule(rule);
        return processor;
    }

    @Override
    protected AggSalesQuotationVO[] processBP(Object userObj,
                                              AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills) {
        IBaseMaintainService<AggSalesQuotationVO> operator = NCLocator.getInstance().lookup(
                IBaseMaintainService.class);
        AggSalesQuotationVO[] bills = null;
        try {
            bills = operator.save(clientFullVOs, originBills);
        } catch (BusinessException e) {
            ExceptionUtils.wrappBusinessException(e.getMessage());
        }
        return bills;
    }

}
