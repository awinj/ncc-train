
package nc.impl.hk.pub;

import nc.impl.pub.ace.AceAggbusiSalesQuotationVOPubServiceImpl;
import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;

public class SalesquotationvoMaintainImpl extends AceAggbusiSalesQuotationVOPubServiceImpl implements ISalesquotationvoMaintain {

    @Override
    public void delete(AggSalesQuotationVO[] clientFullVOs,
                       AggSalesQuotationVO[] originBills) throws BusinessException {
        super.pubdeleteBills(clientFullVOs, originBills);
    }

    @Override
    public AggSalesQuotationVO[] insert(AggSalesQuotationVO[] clientFullVOs,
                                        AggSalesQuotationVO[] originBills) throws BusinessException {
        return super.pubinsertBills(clientFullVOs, originBills);
    }

    @Override
    public AggSalesQuotationVO[] update(AggSalesQuotationVO[] clientFullVOs,
                                        AggSalesQuotationVO[] originBills) throws BusinessException {
        return super.pubupdateBills(clientFullVOs, originBills);
    }

    @Override
    public AggSalesQuotationVO[] query(IQueryScheme queryScheme)
            throws BusinessException {
        return super.pubquerybills(queryScheme);
    }

    @Override
    public AggSalesQuotationVO[] save(AggSalesQuotationVO[] clientFullVOs,
                                      AggSalesQuotationVO[] originBills) throws BusinessException {
        return super.pubsendapprovebills(clientFullVOs, originBills);
    }

    @Override
    public AggSalesQuotationVO[] unsave(AggSalesQuotationVO[] clientFullVOs,
                                        AggSalesQuotationVO[] originBills) throws BusinessException {
        return super.pubunsendapprovebills(clientFullVOs, originBills);
    }

    @Override
    public AggSalesQuotationVO[] approve(AggSalesQuotationVO[] clientFullVOs,
                                         AggSalesQuotationVO[] originBills) throws BusinessException {
        return super.pubapprovebills(clientFullVOs, originBills);
    }

    @Override
    public AggSalesQuotationVO[] unapprove(AggSalesQuotationVO[] clientFullVOs,
                                           AggSalesQuotationVO[] originBills) throws BusinessException {
        return super.pubunapprovebills(clientFullVOs, originBills);
    }

}
