
package nccloud.web.hk.pub.action;

import java.util.ArrayList;
import java.util.List;
import java.util.ServiceLoader;

import nc.bs.logging.Logger;
import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.itf.uap.IUAPQueryBS;
import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.hrhi.sale.SalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.pub.Constructor;
import nccloud.base.exception.ExceptionUtils;
import nccloud.dto.baseapp.querytree.dataformat.QueryTreeFormatVO;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nccloud.framework.web.querytemplet.QueryUtil4NCC;
import nccloud.framework.web.ui.pattern.grid.Grid;
import nccloud.framework.web.ui.pattern.grid.GridOperator;
import nccloud.web.hk.pub.pager.PageQueryVO;
import nccloud.web.hk.pub.util.CommonUtil;

/**
 * 列表查询（查询方案）操作
 *
 * @version @since v3.5.6-1903
 */
public class QueryListAction implements ICommonAction {

    @Override
    public Object doAction(IRequest paramIRequest) {
        PageQueryVO page = null;

        QueryTreeFormatVO queryParam = this.getQueryParam(paramIRequest);
        try {
            List<SalesQuotationVO> heads= (List<SalesQuotationVO>) ServiceLocator.find(IUAPQueryBS.class).retrieveAll(SalesQuotationVO.class);

            Grid grid = null;
            GridOperator operator = new GridOperator(queryParam.getPageCode());
            String[] pks=new String[heads.size()];
            for (int i=0;i<pks.length;i++) {
                pks[i]=heads.get(i).getPrimaryKey();
            }
            grid = operator.toGrid(heads.toArray(new SalesQuotationVO[0]));
            grid.getModel().setAllpks(pks);
            return grid;
        } catch (BusinessException e) {
            e.printStackTrace();
        }




//        try {
//
//            // 1、 获取scheme
////            IQueryScheme scheme = this.getScheme(queryParam);
//            // 2、调用服务,获取VO信息(平台默认生成方法，有效率问题，最佳实现要改掉)
//            AggSalesQuotationVO[] aggvos =
//                    CommonUtil.getMaintainService().query(null);
//            // 查询服务(scheme);
//            if ((aggvos != null) && (aggvos.length > 0)) {
//                // 3、处理分页
//                String[] pks = this.getPks(aggvos);
//                AggSalesQuotationVO[] bills =
//                        this.getDefaulePageBill(queryParam, aggvos);
//                page = new PageQueryVO(pks, bills);
//            } else {
//                page = this.createNullPage();
//            }
//        } catch (BusinessException ex) {
//            // 处理异常信息
//            Logger.error(ex);
//            ExceptionUtils.wrapException(ex);
//        }
//        // 转换grid信息，返回前端
        return this.transPageInfoToGrid(page, queryParam, queryParam.getPageCode());
    }

    /**
     * 转换Grid信息
     *
     * @param pagevo
     * @param pageSize
     * @param pagecode
     * @return
     */
    private Grid covert(PageQueryVO pagevo, int pageSize, String pagecode) {
        AggSalesQuotationVO[] bills =
                (AggSalesQuotationVO[]) pagevo.getCurrentPageBills();

        Grid grid = null;
        if (bills != null) {
            int size = bills.length > pageSize ? pageSize : bills.length;
            Object[] heads = new Object[size];

            for (int i = 0; i < size; i++) {
                heads[i] = bills[i].getParent();
            }
            GridOperator operator = new GridOperator(pagecode);
            grid = operator.toGrid(heads);
            grid.getModel().setAllpks(pagevo.getPks());
        }
        return grid;
    }

    /**
     * 创建空页面信息
     *
     * @return
     */
    private PageQueryVO createNullPage() {
        String[] ids = new String[0];
        AggSalesQuotationVO[] bills =
                Constructor.construct(AggSalesQuotationVO.class, 0);
        PageQueryVO page = new PageQueryVO(ids, bills);
        return page;
    }

    /**
     * 设置默认页面
     *
     * @param info
     * @param aggvos
     * @return
     */
    private AggSalesQuotationVO[] getDefaulePageBill(QueryTreeFormatVO info,
                                                     AggSalesQuotationVO... aggvos) {
        String pageSizeStr = info.getPageInfo().getPageSize();
        int pageSize = 10;
        if ((pageSizeStr != null) && (pageSizeStr.length() > 0)) {
            pageSize = Integer.parseInt(pageSizeStr);
        }
        info.getPageInfo().setPageIndex("0");
        List<AggSalesQuotationVO> billLst = new ArrayList<AggSalesQuotationVO>();
        for (int i = 0; (i < aggvos.length) && (i < pageSize); i++) {
            AggSalesQuotationVO bill = new AggSalesQuotationVO();

            bill.setParent(aggvos[i].getParent());
            billLst.add(bill);
        }
        return billLst.toArray(new AggSalesQuotationVO[0]);
    }

    /**
     * 获取主键信息
     *
     * @param aggvos
     * @return
     */
    private String[] getPks(AggSalesQuotationVO... aggvos) {
        List<String> pks = new ArrayList<String>();
        for (AggSalesQuotationVO bill : aggvos) {
            pks.add(bill.getPrimaryKey());
        }
        return pks.toArray(new String[0]);
    }

    /**
     * 获取查询参数
     *
     * @param paramIRequest
     * @return
     */
    private QueryTreeFormatVO getQueryParam(IRequest paramIRequest) {
        String strRead = paramIRequest.read();
        QueryTreeFormatVO queryParam =
                JsonFactory.create().fromJson(strRead, QueryTreeFormatVO.class);
        return queryParam;
    }

    /**
     * 获取查询方案
     *
     * @param queryParam
     * @return
     */
    private IQueryScheme getScheme(QueryTreeFormatVO queryParam) {
        QueryUtil4NCC queryutil = new QueryUtil4NCC(queryParam);
        IQueryScheme scheme = queryutil.convertCondition();
        return scheme;
    }

    /**
     * 总页数
     *
     * @param pageInfo
     * @param length
     * @return
     */
    private int getTotalPage(nccloud.framework.web.ui.model.PageInfo pageInfo,
                             int length) {
        int size = pageInfo.getPageSize();
        int total = 0;
        if ((length % size) == 0) {
            total = length / size;
        } else {
            total = (length / size) + 1;
        }
        return total;
    }

    /**
     * 页面设置
     *
     * @param retObj
     * @param pagevo
     * @param pageSize
     * @param pageIndex
     * @return
     */
    private Object pageSet(Object retObj, PageQueryVO pagevo, int pageSize,
                           int pageIndex) {
        Grid grid = null;
        if ((retObj instanceof Grid)) {
            grid = (Grid) retObj;
        }

        nccloud.framework.web.ui.model.PageInfo pageInfo =
                new nccloud.framework.web.ui.model.PageInfo();
        pageInfo.setTotal(pagevo.getPks().length);
        pageInfo.setPageSize(pageSize);
        pageInfo.setPageIndex(pageIndex);
        pageInfo.setTotalPage(this.getTotalPage(pageInfo, pagevo.getPks().length));

        grid.getModel().setPageinfo(pageInfo);
        return grid;
    }

    /**
     * page信息转前端需要的grid模型
     *
     * @param pagevo
     * @param info
     * @param pagecode
     * @return
     */
    private Object transPageInfoToGrid(PageQueryVO pagevo,
                                       QueryTreeFormatVO info, String pagecode) {
        Object grid = null;
        int pageSize = Integer.parseInt(info.getPageInfo().getPageSize());
        int pageIndex = Integer.parseInt(info.getPageInfo().getPageIndex());
        if (pagevo != null) {
            if (pagevo.getCurrentPageBills().length == 0) {
                return null;
            }
            grid = this.covert(pagevo, pageSize, pagecode);

            grid = this.pageSet(grid, pagevo, pageSize, pageIndex);
        }
        return grid;
    }
}
