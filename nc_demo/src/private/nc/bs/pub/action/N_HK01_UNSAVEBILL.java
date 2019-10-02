
package nc.bs.pub.action;

import nc.bs.framework.common.NCLocator;
import nc.bs.hrhi.plugin.bpplugin.SalesQuotationPluginPoint;
import nc.bs.pubapp.pf.action.AbstractPfAction;
import nc.bs.pubapp.pub.rule.UncommitStatusCheckRule;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.itf.hk.pub.IBaseMaintainService;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public class N_HK01_UNSAVEBILL extends AbstractPfAction<AggSalesQuotationVO> {

    @Override
    protected CompareAroundProcesser<AggSalesQuotationVO> getCompareAroundProcesserWithRules(
            Object userObj) {
        CompareAroundProcesser<AggSalesQuotationVO> processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                SalesQuotationPluginPoint.UNSEND_APPROVE);

        processor.addBeforeRule(new UncommitStatusCheckRule());

        return processor;
    }

    @Override
    protected AggSalesQuotationVO[] processBP(Object userObj,
                                              AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills) {
        IBaseMaintainService<AggSalesQuotationVO> operator = NCLocator.getInstance().lookup(
                IBaseMaintainService.class);
        AggSalesQuotationVO[] bills = null;
        try {
            bills = operator.unsave(clientFullVOs, originBills);
        } catch (BusinessException e) {
            ExceptionUtils.wrappBusinessException(e.getMessage());
        }
        return bills;
    }

}
