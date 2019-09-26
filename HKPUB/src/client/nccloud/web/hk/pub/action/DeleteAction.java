
package nccloud.web.hk.pub.action;

import java.util.Collection;

import nc.bs.logging.Logger;
import nc.itf.hk.pub.IDataOperationService;
import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.md.model.MetaDataException;
import nc.md.persist.framework.IMDPersistenceQueryService;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.trainncc.demo.SalesQuotationVOConst;
import nc.vo.pf.pub.util.SQLUtil;
import nc.vo.pub.BusinessException;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nccloud.pubitf.riart.pflow.CloudPFlowContext;
import nccloud.pubitf.riart.pflow.ICloudScriptPFlowService;
import nccloud.web.hk.pub.action.bd.BDDeleteAction;
import nccloud.web.hk.pub.pager.PageQueryInfo;
import nccloud.web.hk.pub.util.CommonUtil;

/**
 * 删除（支持批量）
 *
 * @version @since v3.5.6-1903
 */
public class DeleteAction extends BDDeleteAction {

    @Override
    public Object doAction(IRequest paramIRequest) {
        return super.doAction(paramIRequest);
    }

    @Override
    protected AbstractBill getAggVO() {
        return new AggSalesQuotationVO();
    }
}
