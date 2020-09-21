package nccloud.web.hk.pub.action.bd;

import nc.bs.logging.Logger;
import nccloud.itf.hk.pub.IDataOperationService;
import nc.md.model.MetaDataException;
import nc.md.persist.framework.IMDPersistenceQueryService;
import nc.vo.pf.pub.util.SQLUtil;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.container.IRequest;
import nccloud.web.hk.pub.action.NCCAction;
import nccloud.web.hk.pub.pager.PageQueryInfo;
import nccloud.web.hk.pub.util.CommonUtil;

import java.util.Collection;

/**
 * 普通的删除，不涉及平台动作脚本
 * @param <T>
 */
public abstract class BDDeleteAction<T extends AbstractBill> extends NCCAction {


    @Override
    public Object doAction(IRequest paramIRequest) {
        PageQueryInfo queryParam = (PageQueryInfo) this.getQueryParam(paramIRequest);
        try {
            // 1、根据前端传递的pks查询数据,获取AGGVO
            AbstractBill[] bills = this.queryBills(queryParam);
            // 2、调用单据的保存动作脚本（delete），得到保存后结果
            this.doDelete(bills);
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
     * 调用动作脚本
     *
     * @param
     * @param aggVOs
     * @return
     * @throws BusinessException
     */
    private Object doDelete(AbstractBill... aggVOs)
            throws BusinessException {

        if ((aggVOs == null) || (aggVOs.length == 0)) {
            return null;
        }

        String pk = aggVOs[0].getParentVO().getPrimaryKey();
        Object[] result;
        ServiceLocator.find(IDataOperationService.class).delete(aggVOs);
        return aggVOs;
    }


    /**
     * 查询业务数据
     *
     * @param queryParam
     * @return
     * @throws MetaDataException
     */
    private AbstractBill[] queryBills(PageQueryInfo queryParam)
            throws MetaDataException {
        // 1、根据参数查询结果
        IMDPersistenceQueryService service = CommonUtil.getMDQueryService();
        String wheresql =
                SQLUtil.buildSqlForIn(getPrimaryField(),
                        queryParam.getPks());
        Collection<T> bills =
                service.queryBillOfVOByCond(getAggVO().getClass(), wheresql, true,
                        false);
        if ((bills == null) || (bills.size() == 0)) {
            return null;
        }
        return bills.toArray(new AbstractBill[0]);
    }
}