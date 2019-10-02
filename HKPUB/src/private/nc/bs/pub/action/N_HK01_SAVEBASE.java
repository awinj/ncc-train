
package nc.bs.pub.action;

import nc.bs.framework.common.NCLocator;
import nc.bs.hrhi.plugin.bpplugin.SalesQuotationPluginPoint;
import nc.bs.pubapp.pf.action.AbstractPfAction;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.itf.hk.pub.IBaseMaintainService;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.jcom.lang.StringUtil;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public class N_HK01_SAVEBASE extends AbstractPfAction<AggSalesQuotationVO> {

    @Override
    protected CompareAroundProcesser<AggSalesQuotationVO> getCompareAroundProcesserWithRules(
            Object userObj) {
        CompareAroundProcesser<AggSalesQuotationVO> processor = null;
        AggSalesQuotationVO[] clientFullVOs = (AggSalesQuotationVO[]) this.getVos();
        if (!StringUtil.isEmptyWithTrim(clientFullVOs[0].getParentVO()
                .getPrimaryKey())) {
            processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                    SalesQuotationPluginPoint.SCRIPT_UPDATE);
        } else {
            processor = new CompareAroundProcesser<AggSalesQuotationVO>(
                    SalesQuotationPluginPoint.SCRIPT_INSERT);
        }

        IRule<AggSalesQuotationVO> rule = null;

        return processor;
    }

    @Override
    protected AggSalesQuotationVO[] processBP(Object userObj,
                                              AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills) {

        AggSalesQuotationVO[] bills = null;
        try {
            IBaseMaintainService<AggSalesQuotationVO> operator = NCLocator.getInstance().lookup(
                    IBaseMaintainService.class);
            if (!StringUtil.isEmptyWithTrim(clientFullVOs[0].getParentVO()
                    .getPrimaryKey())) {
                bills = operator.update(clientFullVOs, originBills);
            } else {
                bills = operator.insert(clientFullVOs, originBills);
            }
        } catch (BusinessException e) {
            ExceptionUtils.wrappBusinessException(e.getMessage());
        }
        return bills;
    }
}
