package nccloud.web.hk.pub.action;

import nc.bs.logging.Logger;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.service.ServiceLocator;
import nccloud.pubitf.riart.pflow.CloudPFlowContext;
import nccloud.pubitf.riart.pflow.ICloudScriptPFlowService;

public abstract class PFNCCAction<T extends AbstractBill> extends NCCAction<T> {

    /**
     * 动作编码
     *
     * @return
     */
    protected abstract String getActionCode();

    protected abstract String getBillType();


    /**
     * 调用动作脚本
     *
     * @param
     * @param aggVOs
     * @return
     * @throws BusinessException
     */
    protected T callActionScript(T... aggVOs)
            throws BusinessException {

        String actionCode = this.getActionCode();
        String billType = getBillType();

        CloudPFlowContext context = new CloudPFlowContext();
        context.setActionName(actionCode);
        context.setBillType(billType);
        context.setBillVos(aggVOs);
        Logger.debug("开始调用动作脚本 ActionName[" + actionCode + "] BillType[" + billType
                + "]...");

        ICloudScriptPFlowService service =
                ServiceLocator.find(ICloudScriptPFlowService.class);

        Object[] result = service.exeScriptPFlow(context);

        Logger.debug("调用动作脚本 ActionName[" + actionCode + "] BillType[" + billType
                + "]结束");

       return (T) result[0];
    }
}
