
package nccloud.web.hk.pub.util;


import nc.itf.hk.pub.ISalesquotationvoMaintain;
import nc.md.persist.framework.IMDPersistenceQueryService;
import nc.vo.trainncc.demo.SalesQuotationVOConst;
import nc.vo.pub.lang.UFDate;
import nc.vo.pub.lang.UFDateTime;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.container.SessionContext;
import nccloud.pubitf.riart.pflow.ICloudScriptPFlowService;

public class CommonUtil {

    private static ISalesquotationvoMaintain maintain = null;

    private static IMDPersistenceQueryService persistenceQueryService = null;

    private static ICloudScriptPFlowService PFlowService = null;

    /**
     * 单据类型编码
     *
     * @return
     */
    public static String getBillTypeCode() {
        return SalesQuotationVOConst.CONST_BILLTYPE_COST;
    }


    /**
     * 获取当前业务时间
     *
     * @return
     */
    public static UFDate getBusiDate() {
        return new UFDate(SessionContext.getInstance().getClientInfo()
                .getBizDateTime());
    }

    /**
     * 获取当前业务日期时间
     *
     * @return
     */
    public static UFDateTime getBusiDateTime() {
        return new UFDateTime(SessionContext.getInstance().getClientInfo()
                .getBizDateTime());
    }

    /**
     * 平台脚本服务类
     *
     * @return
     */
    public static synchronized ICloudScriptPFlowService getCPFlowService() {
        if (CommonUtil.PFlowService == null) {
            CommonUtil.PFlowService =
                    ServiceLocator.find(ICloudScriptPFlowService.class);
        }
        return CommonUtil.PFlowService;
    }

    /**
     * 管理服务
     *
     * @return
     */
    public static ISalesquotationvoMaintain getMaintainService() {
        if (CommonUtil.maintain == null) {
            CommonUtil.maintain = ServiceLocator.find(ISalesquotationvoMaintain.class);
        }
        return CommonUtil.maintain;
    }

    /**
     * 元数据查询服务
     *
     * @return
     */
    public static IMDPersistenceQueryService getMDQueryService() {
        if (CommonUtil.persistenceQueryService == null) {
            CommonUtil.persistenceQueryService =
                    ServiceLocator.find(IMDPersistenceQueryService.class);
        }
        return CommonUtil.persistenceQueryService;
    }


}
