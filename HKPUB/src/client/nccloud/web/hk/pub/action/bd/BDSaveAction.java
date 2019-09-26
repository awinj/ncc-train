package nccloud.web.hk.pub.action.bd;

import nc.bs.logging.Logger;
import nc.itf.hk.pub.IDataOperationService;
import nc.vo.pub.BusinessException;
import nc.vo.pub.CircularlyAccessibleValueObject;
import nc.vo.pub.IColumnMeta;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.pubapp.pattern.model.entity.bill.IBill;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.ui.pattern.billcard.BillCardOperator;
import nccloud.web.hk.pub.util.CommonUtil;

import java.util.Collection;

public abstract class BDSaveAction extends NCCAction {


    @Override
    public Object doAction(IRequest paramIRequest) {
        try {
            BillCardOperator billCardOperator = new BillCardOperator();
            // 1、获取AGGVO （request转换主子VO）
            AbstractBill vo = billCardOperator.toBill(paramIRequest);
            this.doBefore(vo);
            // 2、调用单据的保存动作脚本（savebase），得到保存后结果
            AbstractBill rtnObj = doSave(vo);
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
     * 调用动作脚本
     *
     * @param
     * @param aggVOs
     * @return
     * @throws BusinessException
     */
    private AbstractBill doSave(AbstractBill... aggVOs)
            throws BusinessException {


        String pk = aggVOs[0].getParentVO().getPrimaryKey();
        String parentPkFiled = getPrimaryField();
        IBill[] result;
        if (pk == null) {
            result = ServiceLocator.find(IDataOperationService.class).insert(aggVOs);
        } else {
            result = ServiceLocator.find(IDataOperationService.class).update(aggVOs);
        }


        String wheresql =
                parentPkFiled + "='"
                        + ((AbstractBill) result[0]).getPrimaryKey() + "'";
        Collection<AbstractBill> bills =
                CommonUtil.getMDQueryService().queryBillOfVOByCond(
                        aggVOs[0].getClass(), wheresql, true, false);
        return bills.toArray(new AbstractBill[0])[0];
    }

    /**
     *
     * 修改增行保存时，新增行的
     * @param vo
     */
    private void doBefore(AbstractBill vo) {
        String parentPk = vo.getPrimaryKey();
        String parentPkFiled = getPrimaryField();
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


}
