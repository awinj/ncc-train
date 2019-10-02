
package nc.bs.pub.action;

import nc.bs.framework.common.NCLocator;
import nc.bs.hrhi.plugin.bpplugin.SalesQuotationPluginPoint;
import nc.bs.pubapp.pf.action.AbstractPfAction;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.itf.hk.pub.IBaseMaintainService;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public class N_HK01_DELETE extends AbstractPfAction<AggSalesQuotationVO> {

    @Override
    protected CompareAroundProcesser<AggSalesQuotationVO> getCompareAroundProcesserWithRules(
            Object userObj) {
        CompareAroundProcesser<AggSalesQuotationVO> processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                SalesQuotationPluginPoint.SCRIPT_DELETE);

        return processor;
    }

    @Override
    protected AggSalesQuotationVO[] processBP(Object userObj,
                                              AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills) {
        IBaseMaintainService<AggSalesQuotationVO> operator = NCLocator.getInstance().lookup(
                IBaseMaintainService.class);
        try {
            operator.delete(clientFullVOs, originBills);
        } catch (BusinessException e) {
            ExceptionUtils.wrappBusinessException(e.getMessage());
        }
        return clientFullVOs;
    }

}
