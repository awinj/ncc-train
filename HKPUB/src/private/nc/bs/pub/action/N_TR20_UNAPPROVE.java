
package nc.bs.pub.action;

import nc.bs.framework.common.NCLocator;
import nc.bs.hk.pub.plugin.bpplugin.SalesQuotationVOPluginPoint;
import nc.bs.pubapp.pf.action.AbstractPfAction;
import nc.bs.pubapp.pub.rule.UnapproveStatusCheckRule;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pub.VOStatus;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public class N_TR20_UNAPPROVE extends AbstractPfAction<AggSalesQuotationVO> {

    @Override
    protected CompareAroundProcesser<AggSalesQuotationVO> getCompareAroundProcesserWithRules(
            Object userObj) {
        CompareAroundProcesser<AggSalesQuotationVO> processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                SalesQuotationVOPluginPoint.UNAPPROVE);

        processor.addBeforeRule(new UnapproveStatusCheckRule());

        return processor;
    }

    @Override
    protected AggSalesQuotationVO[] processBP(Object userObj,
                                              AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills) {
        for (int i = 0; clientFullVOs != null && i < clientFullVOs.length; i++) {
            clientFullVOs[i].getParentVO().setStatus(VOStatus.UPDATED);
        }
        AggSalesQuotationVO[] bills = null;
        try {
            ISalesquotationvoMaintain operator = NCLocator.getInstance()
                    .lookup(ISalesquotationvoMaintain.class);
            bills = operator.unapprove(clientFullVOs, originBills);
        } catch (BusinessException e) {
            ExceptionUtils.wrappBusinessException(e.getMessage());
        }
        return bills;
    }

}
