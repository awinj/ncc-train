
package nc.bs.pub.action;

import nc.bs.framework.common.NCLocator;
import nc.bs.hrhi.plugin.bpplugin.SalesQuotationVOPluginPoint;
import nc.bs.pubapp.pf.action.AbstractPfAction;
import nc.bs.pubapp.pub.rule.UncommitStatusCheckRule;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public class N_TR20_UNSAVEBILL extends AbstractPfAction<AggSalesQuotationVO> {

    @Override
    protected CompareAroundProcesser<AggSalesQuotationVO> getCompareAroundProcesserWithRules(
            Object userObj) {
        CompareAroundProcesser<AggSalesQuotationVO> processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                SalesQuotationVOPluginPoint.UNSEND_APPROVE);

        processor.addBeforeRule(new UncommitStatusCheckRule());

        return processor;
    }

    @Override
    protected AggSalesQuotationVO[] processBP(Object userObj,
                                              AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills) {
        ISalesquotationvoMaintain operator = NCLocator.getInstance().lookup(
                ISalesquotationvoMaintain.class);
        AggSalesQuotationVO[] bills = null;
        try {
            bills = operator.unsave(clientFullVOs, originBills);
        } catch (BusinessException e) {
            ExceptionUtils.wrappBusinessException(e.getMessage());
        }
        return bills;
    }

}
