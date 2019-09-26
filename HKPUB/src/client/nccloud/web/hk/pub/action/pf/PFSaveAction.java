
package nccloud.web.hk.pub.action.pf;

import nc.bs.logging.Logger;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pub.CircularlyAccessibleValueObject;
import nc.vo.pub.IColumnMeta;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.ui.pattern.billcard.BillCardOperator;
import nccloud.pubitf.riart.pflow.CloudPFlowContext;
import nccloud.pubitf.riart.pflow.ICloudScriptPFlowService;

/**
 * 主子表保存
 *
 * @version @since v3.5.6-1903
 */
public abstract class PFSaveAction implements ICommonAction {


    @Override
    public Object doAction(IRequest paramIRequest) {
        try {
            BillCardOperator billCardOperator = new BillCardOperator();
            // 1、获取AGGVO （request转换主子VO）
            AggSalesQuotationVO vo = billCardOperator.toBill(paramIRequest);
//            this.doBefore(vo);
            // 2、调用单据的保存动作脚本（savebase），得到保存后结果
            AbstractBill rtnObj = this.callActionScript(vo);
            // 3、处理返回结果（包含功能：根据模板转换前端BillCard，参照翻译，显示公式处理）
            Object billcard = billCardOperator.toCard(rtnObj);
            // 4、返回结果到前端
            return billcard;
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
    protected  String getActionCode() {
        return "SAVEBASE";
    }

    protected abstract String getBillType();

    /**
     * 调用动作脚本
     *
     * @param
     * @param aggVOs
     * @return
     * @throws BusinessException
     */
    private AbstractBill callActionScript(AggSalesQuotationVO... aggVOs)
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

//        String parentPkFiled = getPrimaryField(aggVOs[0]);
//        String wheresql =
//                parentPkFiled + "='"
//                        + ((AggSalesQuotationVO) result[0]).getPrimaryKey() + "'";
//        Collection<AggSalesQuotationVO> bills =
//                CommonUtil.getMDQueryService().queryBillOfVOByCond(
//                        AggSalesQuotationVO.class, wheresql, true, false);
        return (AbstractBill) result[0];
    }

    /**
     * 判断新增或修改
     *
     * @param vo
     */
    private void doBefore(AggSalesQuotationVO vo) {
        String parentPk = vo.getPrimaryKey();
        String parentPkFiled = getPrimaryField(vo);
        // 根据是否有主键信息判断是新增保存还是修改保存
        if ((parentPk != null) && !"".equals(parentPk)) {
            // 设置单据默认值
            CircularlyAccessibleValueObject[] allchildren = vo.getAllChildrenVO();
            if (allchildren != null) {
                for (CircularlyAccessibleValueObject obj : allchildren) {
                    obj.setAttributeValue(parentPkFiled, parentPk);
                }
            }
        }
    }

    //暂时认为子表存主表主键的字段与主表的主键字段名称一致。后续优化
    private String getPrimaryField(AbstractBill aggvo) {
        IColumnMeta column = aggvo.getParent().getMetaData().getPrimaryAttribute().getColumn();
        if (column != null) {
            return column.getName();
        }
        return null;
    }

}
