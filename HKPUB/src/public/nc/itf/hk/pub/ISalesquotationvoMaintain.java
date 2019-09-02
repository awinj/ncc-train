
package nc.itf.hk.pub;

import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;

public interface ISalesquotationvoMaintain {

    public void delete(AggSalesQuotationVO[] clientFullVOs,
                       AggSalesQuotationVO[] originBills) throws BusinessException;

    public AggSalesQuotationVO[] insert(AggSalesQuotationVO[] clientFullVOs,
                                        AggSalesQuotationVO[] originBills) throws BusinessException;

    public AggSalesQuotationVO[] update(AggSalesQuotationVO[] clientFullVOs,
                                        AggSalesQuotationVO[] originBills) throws BusinessException;

    public AggSalesQuotationVO[] query(IQueryScheme queryScheme)
            throws BusinessException;

    public AggSalesQuotationVO[] save(AggSalesQuotationVO[] clientFullVOs,
                                      AggSalesQuotationVO[] originBills) throws BusinessException;

    public AggSalesQuotationVO[] unsave(AggSalesQuotationVO[] clientFullVOs,
                                        AggSalesQuotationVO[] originBills) throws BusinessException;

    public AggSalesQuotationVO[] approve(AggSalesQuotationVO[] clientFullVOs,
                                         AggSalesQuotationVO[] originBills) throws BusinessException;

    public AggSalesQuotationVO[] unapprove(AggSalesQuotationVO[] clientFullVOs,
                                           AggSalesQuotationVO[] originBills) throws BusinessException;
}
