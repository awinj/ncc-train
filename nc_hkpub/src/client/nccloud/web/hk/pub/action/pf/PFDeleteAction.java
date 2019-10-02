package nccloud.web.hk.pub.action.pf;

import nc.bs.logging.Logger;
import nc.md.model.MetaDataException;
import nc.md.persist.framework.IMDPersistenceQueryService;
import nc.vo.pf.pub.util.SQLUtil;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nccloud.web.hk.pub.action.PFNCCAction;
import nccloud.web.hk.pub.pager.PageQueryInfo;
import nccloud.web.hk.pub.util.CommonUtil;

import java.util.Collection;

/**
 * 调用平台脚本删除单据
 * @param <T>
 */
public abstract class PFDeleteAction<T extends AbstractBill> extends PFNCCAction {

    @Override
    public Object doAction(IRequest paramIRequest) {
        PageQueryInfo queryParam = getQueryParam(paramIRequest);
        try {
            // 1、根据前端传递的pks查询数据,获取AGGVO
            AbstractBill[] bills = this.queryBills(queryParam);
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
    protected  String getActionCode() {
        return "DELETE";
    }

    protected abstract String getBillType();


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
    protected AbstractBill[] queryBills(PageQueryInfo queryParam)
            throws MetaDataException {
        // 1、根据参数查询结果
        IMDPersistenceQueryService service = CommonUtil.getMDQueryService();
        String wheresql =
                SQLUtil.buildSqlForIn(getPrimaryField(),
                        queryParam.getPks());
        Collection<AbstractBill> bills =
                service.queryBillOfVOByCond(getAggVO().getClass(), wheresql, true,
                        false);
        if ((bills == null) || (bills.size() == 0)) {
            return null;
        }
        return bills.toArray(new AbstractBill[0]);
    }
}