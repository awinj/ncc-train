
package nccloud.web.hk.pub.action;

import java.util.Collection;

import nc.bs.logging.Logger;
import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.md.model.MetaDataException;
import nc.md.persist.framework.IMDPersistenceQueryService;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
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
import nccloud.web.hk.pub.pager.PageQueryInfo;
import nccloud.web.hk.pub.util.CommonUtil;

/**
 * 删除（支持批量）
 *
 * @version @since v3.5.6-1903
 */
public class DeleteAction implements ICommonAction {

    @Override
    public Object doAction(IRequest paramIRequest) {
        PageQueryInfo queryParam = this.getQueryParam(paramIRequest);
        try {
            // 1、根据前端传递的pks查询数据,获取AGGVO
            AggSalesQuotationVO[] bills = this.queryBills(queryParam);
            // 2、调用单据的保存动作脚本（delete），得到保存后结果
            this.callActionScript(bills);
            // 3、返回Null 到前端
            return null;
        } catch (BusinessException ex) {
            // 处理异常信息
            Logger.error(ex);
            ExceptionUtils.wrapException(ex);
        }
        return null;
    }

    /**
     * 动作编码
     *
     * @return
     */
    protected String getActionCode() {
        return SalesQuotationVOConst.CONST_ACTION_DELETE;
    }

    /**
     * 调用动作脚本
     *
     * @param
     * @param aggVOs
     * @return
     * @throws BusinessException
     */
    private Object callActionScript(AggSalesQuotationVO... aggVOs)
            throws BusinessException {

        if ((aggVOs == null) || (aggVOs.length == 0)) {
            return null;
        }

        String actionCode = this.getActionCode();
        String billType = CommonUtil.getBillTypeCode();



        String pk=aggVOs[0].getParentVO().getPrimaryKey();
        Object[] result;
        ServiceLocator.find(ISalesquotationvoMaintain.class).delete(aggVOs,null);
        return aggVOs;

//        CloudPFlowContext context = new CloudPFlowContext();
//        context.setActionName(actionCode);
//        context.setBillType(billType);
//        context.setBillVos(aggVOs);
//        Logger.debug("开始调用动作脚本 ActionName[" + actionCode + "] BillType[" + billType
//                + "]...");
//
//        ICloudScriptPFlowService service =
//                ServiceLocator.find(ICloudScriptPFlowService.class);
//
//        Object[] result = service.exeScriptPFlow(context);
//
//        Logger.debug("调用动作脚本 ActionName[" + actionCode + "] BillType[" + billType
//                + "]结束");
//
//        return result;
    }

    /**
     * 获取查询参数
     *
     * @param paramIRequest
     * @return
     */
    private PageQueryInfo getQueryParam(IRequest paramIRequest) {
        String strRead = paramIRequest.read();
        PageQueryInfo queryParam =
                JsonFactory.create().fromJson(strRead, PageQueryInfo.class);
        return queryParam;
    }

    /**
     * 查询业务数据
     *
     * @param queryParam
     * @return
     * @throws MetaDataException
     */
    private AggSalesQuotationVO[] queryBills(PageQueryInfo queryParam)
            throws MetaDataException {
        // 1、根据参数查询结果
        IMDPersistenceQueryService service = CommonUtil.getMDQueryService();
        String wheresql =
                SQLUtil.buildSqlForIn("pk_quotation",
                        queryParam.getPks());
        Collection<AggSalesQuotationVO> bills =
                service.queryBillOfVOByCond(AggSalesQuotationVO.class, wheresql, true,
                        false);
        if ((bills == null) || (bills.size() == 0)) {
            return null;
        }
        return bills.toArray(new AggSalesQuotationVO[0]);
    }
}
