
package nccloud.web.hrhi.sale.action;

import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.web.hk.pub.action.bd.BDSaveAction;
import nccloud.web.hk.pub.action.pf.PFSaveAction;

/**
 * 主子表保存
 *
 * @version @since v3.5.6-1903
 */
public class SaveAction extends PFSaveAction<AggSalesQuotationVO> {

    @Override
    protected String getBillType() {
        return "HK01";
    }
}