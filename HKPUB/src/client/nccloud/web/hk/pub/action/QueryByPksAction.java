
package nccloud.web.hk.pub.action;

import java.util.Collection;

import nc.bs.logging.Logger;
import nc.md.model.MetaDataException;
import nc.md.persist.framework.IMDPersistenceQueryService;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pf.pub.util.SQLUtil;
import nc.vo.pub.BusinessException;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nccloud.framework.web.ui.pattern.grid.Grid;
import nccloud.framework.web.ui.pattern.grid.GridOperator;
import nccloud.web.hk.pub.pager.PageQueryInfo;
import nccloud.web.hk.pub.util.CommonUtil;

/**
 * 列表翻页查询
 *
 * @version @since v3.5.6-1903
 */
public class QueryByPksAction implements ICommonAction {

    @Override
    public Object doAction(IRequest paramIRequest) {
        PageQueryInfo queryParam = this.getQueryParam(paramIRequest);
        try {
            // 根据前端传递的pks查询数据
            Collection<AggSalesQuotationVO> bills = this.queryBills(queryParam);
            // 返回查询信息
            return this.toBillData(queryParam, bills);
        } catch (BusinessException ex) {
            // 处理异常信息
            Logger.error(ex);
            ExceptionUtils.wrapException(ex);
        }
        return null;
    }

    /**
     * 将VO转换前端Grid信息
     *
     * @param info
     * @param bills
     * @return
     */
    protected Object toBillData(PageQueryInfo info,
                                Collection<AggSalesQuotationVO> bills) {
        if ((bills == null) || (bills.size() == 0)) {
            return null;
        }

        Object[] heads = new Object[bills.size()];
        int i = 0;
        for (AggSalesQuotationVO bill : bills) {
            heads[i++] = bill.getParent();
        }

        GridOperator operator = new GridOperator(info.getPagecode());
        Grid grid = operator.toGrid(heads);
        return grid;
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
    private Collection<AggSalesQuotationVO> queryBills(PageQueryInfo queryParam)
            throws MetaDataException {
        // 1、根据参数查询结果
        IMDPersistenceQueryService service = CommonUtil.getMDQueryService();
        String wheresql =
                SQLUtil.buildSqlForIn("pk_quotation", queryParam.getPks());
        Collection<AggSalesQuotationVO> bills =
                service.queryBillOfVOByCond(AggSalesQuotationVO.class, wheresql, false,
                        false);
        return bills;
    }
}
