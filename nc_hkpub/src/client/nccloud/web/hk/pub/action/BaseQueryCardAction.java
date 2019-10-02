package nccloud.web.hk.pub.action;

import java.util.Collection;

import nc.bs.logging.Logger;
import nc.md.model.MetaDataException;
import nc.md.persist.framework.IMDPersistenceQueryService;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nccloud.framework.web.ui.pattern.billcard.BillCard;
import nccloud.framework.web.ui.pattern.billcard.BillCardOperator;
import nccloud.web.hk.pub.pager.PageQueryInfo;
import nccloud.web.hk.pub.util.CommonUtil;

/**
 * 卡片查询（查询方案）操作
 *
 * @version @since v3.5.6-1903
 */
public abstract class BaseQueryCardAction<T extends AbstractBill> extends NCCAction {

    @Override
    public Object doAction(IRequest paramIRequest) {
        PageQueryInfo queryParam = this.getQueryParam(paramIRequest);
        try {
            // 查询数据
            Collection<T> bills = this.queryBills(queryParam);
            if (bills == null) {
                return null;
            }
            // 转换前端需要的billCard
            return this.transBillCardFormVO(queryParam,
                    bills.toArray(new AbstractBill[0])[0]);
        } catch (BusinessException ex) {
            // 处理异常信息
            Logger.error(ex);
            ExceptionUtils.wrapException(ex);
        }
        return null;
    }

    /**
     * 获取查询参数
     *
     * @param paramIRequest
     * @return
     */
    protected PageQueryInfo getQueryParam(IRequest paramIRequest) {
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
    protected Collection<T> queryBills(PageQueryInfo queryParam)
            throws MetaDataException {
        IMDPersistenceQueryService service = CommonUtil.getMDQueryService();
        // 注意：业务提供查询方法（元数据查询默认查询到dr=1的数据了）
        String wheresql =
                getPrimaryField() + "='" + queryParam.getPk() + "'";
        Collection<T> bills =
                service.queryBillOfVOByCond(getAggVO().getClass(), wheresql, true,
                        false);
        return bills;
    }

    /**
     * VO 转换
     *
     * @param queryParam
     * @param bill
     * @return
     */
    protected BillCard transBillCardFormVO(PageQueryInfo queryParam,
                                         AbstractBill bill) {
        BillCardOperator operator = new BillCardOperator(queryParam.getPagecode());
        return operator.toCard(bill);
    }
}
