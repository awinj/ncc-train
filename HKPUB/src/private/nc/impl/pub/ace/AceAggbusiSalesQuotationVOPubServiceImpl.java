
package nc.impl.pub.ace;

import nc.bs.hk.pub.ace.bp.AceSalesQuotationVOApproveBP;
import nc.bs.hk.pub.ace.bp.AceSalesQuotationVODeleteBP;
import nc.bs.hk.pub.ace.bp.AceSalesQuotationVOInsertBP;
import nc.bs.hk.pub.ace.bp.AceSalesQuotationVOSendApproveBP;
import nc.bs.hk.pub.ace.bp.AceSalesQuotationVOUnApproveBP;
import nc.bs.hk.pub.ace.bp.AceSalesQuotationVOUnSendApproveBP;
import nc.bs.hk.pub.ace.bp.AceSalesQuotationVOUpdateBP;
import nc.impl.pubapp.pattern.data.bill.BillLazyQuery;
import nc.impl.pubapp.pattern.data.bill.tool.BillTransferTool;
import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.hrhi.sale.AggSalesQuotationVO;
import nc.vo.pub.BusinessException;
import nc.vo.pub.VOStatus;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;

public abstract class AceAggbusiSalesQuotationVOPubServiceImpl {
    // 新增
    public AggSalesQuotationVO[] pubinsertBills(AggSalesQuotationVO[] clientFullVOs,
                                                AggSalesQuotationVO[] originBills) throws BusinessException {
        try {
            // 数据库中数据和前台传递过来的差异VO合并后的结果
            BillTransferTool<AggSalesQuotationVO> transferTool = new BillTransferTool<AggSalesQuotationVO>(
                    clientFullVOs);
            // 调用BP
            AceSalesQuotationVOInsertBP action = new AceSalesQuotationVOInsertBP();
            AggSalesQuotationVO[] retvos = action.insert(clientFullVOs);
            // 构造返回数据
//                      return transferTool.getBillForToClient(retvos);
            return retvos;
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
        return null;
    }

    // 删除
    public void pubdeleteBills(AggSalesQuotationVO[] clientFullVOs,
                               AggSalesQuotationVO[] originBills) throws BusinessException {
        try {
            // 调用BP
            new AceSalesQuotationVODeleteBP().delete(clientFullVOs);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
    }

    // 修改
    public AggSalesQuotationVO[] pubupdateBills(AggSalesQuotationVO[] clientFullVOs,
                                                AggSalesQuotationVO[] originBills) throws BusinessException {
        try {
            // 加锁 + 检查ts
            BillTransferTool<AggSalesQuotationVO> transferTool = new BillTransferTool<AggSalesQuotationVO>(
                    clientFullVOs);
            AceSalesQuotationVOUpdateBP bp = new AceSalesQuotationVOUpdateBP();
            AggSalesQuotationVO[] retvos = bp.update(clientFullVOs, originBills);
            // 构造返回数据
//                      return transferTool.getBillForToClient(retvos);
            return retvos;
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
        return null;
    }

    public AggSalesQuotationVO[] pubquerybills(IQueryScheme queryScheme)
            throws BusinessException {
        AggSalesQuotationVO[] bills = null;
        try {
            this.preQuery(queryScheme);
            BillLazyQuery<AggSalesQuotationVO> query = new BillLazyQuery<AggSalesQuotationVO>(
                    AggSalesQuotationVO.class);
            bills = query.query(queryScheme, null);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
        return bills;
    }

    /**
     * 由子类实现，查询之前对queryScheme进行加工，加入自己的逻辑
     *
     * @param queryScheme
     */
    protected void preQuery(IQueryScheme queryScheme) {
        // 查询之前对queryScheme进行加工，加入自己的逻辑
    }

    // 提交
    public AggSalesQuotationVO[] pubsendapprovebills(
            AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills)
            throws BusinessException {
        AceSalesQuotationVOSendApproveBP bp = new AceSalesQuotationVOSendApproveBP();
        AggSalesQuotationVO[] retvos = bp.sendApprove(clientFullVOs, originBills);
        return retvos;
    }

    // 收回
    public AggSalesQuotationVO[] pubunsendapprovebills(
            AggSalesQuotationVO[] clientFullVOs, AggSalesQuotationVO[] originBills)
            throws BusinessException {
        AceSalesQuotationVOUnSendApproveBP bp = new AceSalesQuotationVOUnSendApproveBP();
        AggSalesQuotationVO[] retvos = bp.unSend(clientFullVOs, originBills);
        return retvos;
    }

    ;

    // 审批
    public AggSalesQuotationVO[] pubapprovebills(AggSalesQuotationVO[] clientFullVOs,
                                                 AggSalesQuotationVO[] originBills) throws BusinessException {
        for (int i = 0; clientFullVOs != null && i < clientFullVOs.length; i++) {
            clientFullVOs[i].getParentVO().setStatus(VOStatus.UPDATED);
        }
        AceSalesQuotationVOApproveBP bp = new AceSalesQuotationVOApproveBP();
        AggSalesQuotationVO[] retvos = bp.approve(clientFullVOs, originBills);
        return retvos;
    }

    // 弃审

    public AggSalesQuotationVO[] pubunapprovebills(AggSalesQuotationVO[] clientFullVOs,
                                                   AggSalesQuotationVO[] originBills) throws BusinessException {
        for (int i = 0; clientFullVOs != null && i < clientFullVOs.length; i++) {
            clientFullVOs[i].getParentVO().setStatus(VOStatus.UPDATED);
        }
        AceSalesQuotationVOUnApproveBP bp = new AceSalesQuotationVOUnApproveBP();
        AggSalesQuotationVO[] retvos = bp.unApprove(clientFullVOs, originBills);
        return retvos;
    }

}