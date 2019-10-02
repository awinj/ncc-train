
package nccloud.web.hk.pub.action.pf;

import nc.bs.logging.Logger;
import nc.md.model.MetaDataException;
import nc.vo.pub.BusinessException;
import nc.vo.pub.CircularlyAccessibleValueObject;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.ui.pattern.billcard.BillCardOperator;
import nccloud.web.hk.pub.action.PFNCCAction;
import nccloud.web.hk.pub.util.CommonUtil;

import java.util.Collection;

/**
 * 调用平台脚本，保存主子表
 *
 * @version @since v3.5.6-1903
 */
public abstract class PFSaveAction<T extends AbstractBill> extends PFNCCAction<T> {


    @Override
    public Object doAction(IRequest paramIRequest) {
        try {
            BillCardOperator billCardOperator = new BillCardOperator();
            // 1、获取AGGVO （request转换主子VO）
            T vo = billCardOperator.toBill(paramIRequest);
//            this.doBefore(vo);
            // 2、调用单据的保存动作脚本（savebase），得到保存后结果
            T rtnObj = callActionScript(vo);
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



    /**
     * 判断新增或修改
     *
     * @param vo
     */
    private void doBefore(T vo) {
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

    @Override
    protected T callActionScript(T... aggVOs) throws BusinessException {

        return refresh(super.callActionScript(aggVOs));

    }

    private T refresh(AbstractBill aggvo) throws MetaDataException {
        String parentPkFiled = getPrimaryField();
        String wheresql =
                parentPkFiled + "='"
                        + aggvo.getPrimaryKey() + "'";
        Collection<T> bills =
                CommonUtil.getMDQueryService().queryBillOfVOByCond(
                        getAggVO().getClass(), wheresql, true, false);
        return (T) bills.toArray(new AbstractBill[0])[0];
    }


}
