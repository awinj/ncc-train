
package nc.impl.hk.pub;

import nc.bs.hk.pub.bp.pf.*;
import nc.impl.pubapp.pattern.data.bill.BillLazyQuery;
import nc.impl.pubapp.pattern.data.bill.tool.BillTransferTool;
import nc.itf.hk.pub.IBaseMaintainService;
import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public class BaseMaintainImpl<T extends AbstractBill>
        implements IBaseMaintainService<T> {



    public void delete(T[] clientFullVOs, T[] originBills)
            throws BusinessException {
        try {
            new PFDeleteBP().delete(clientFullVOs);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
    }

    public T[] insert(T[] clientFullVOs, T[] originBills)
            throws BusinessException {
        try {
            BillTransferTool transferTool = new BillTransferTool(clientFullVOs);

            PFDefaultInsertBP action = new PFDefaultInsertBP();
            AbstractBill[] retvos = action.insert(clientFullVOs);

            return (T[]) transferTool.getBillForToClient(retvos);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
        return null;
    }

    public T[] update(T[] clientFullVOs, T[] originBills)
            throws BusinessException {
        try {
            BillTransferTool transferTool = new BillTransferTool(clientFullVOs);

            PFBaseUpdateBP bp = new PFBaseUpdateBP();
            AbstractBill[] retvos = bp.update(clientFullVOs, originBills);

            return (T[]) transferTool.getBillForToClient(retvos);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
        return null;
    }

    public T[] save(T[] clientFullVOs, T[] originBills)
            throws BusinessException {
        PFSendApproveBP bp = new PFSendApproveBP();
        AbstractBill[] retvos = bp.sendApprove(clientFullVOs, originBills);
        return (T[]) retvos;
    }

    public T[] unsave(T[] clientFullVOs, T[] originBills)
            throws BusinessException {
        PFUnSendApproveBP bp = new PFUnSendApproveBP();
        AbstractBill[] retvos = bp.unSend(clientFullVOs, originBills);
        return (T[]) retvos;
    }

    public T[] approve(T[] clientFullVOs, T[] originBills)
            throws BusinessException {
        for (int i = 0; (clientFullVOs != null) && (i < clientFullVOs.length); i++) {
            clientFullVOs[i].getParentVO().setStatus(1);
        }
        PFApproveBP bp = new PFApproveBP();
        AbstractBill[] retvos = bp.approve(clientFullVOs, originBills);
        return (T[]) retvos;
    }

    public T[] unapprove(T[] clientFullVOs, T[] originBills)
            throws BusinessException {
        if (clientFullVOs == null) {
            throw new BusinessException("数据已经被删除，请刷新数据");
        }
        for (int i = 0; i < clientFullVOs.length; i++) {
            clientFullVOs[i].getParentVO().setStatus(1);
        }
        PFUnApproveBP bp = new PFUnApproveBP();
        return (T[]) bp.unApprove(clientFullVOs, originBills);
    }

    public T[] query(IQueryScheme queryScheme)
            throws BusinessException {
        T[] bills = null;
        try {
            this.preQuery(queryScheme);
            Class headVoClass = (Class) queryScheme.get("aggVOClass");
            BillLazyQuery<T> query = new BillLazyQuery<T>(
                    headVoClass);
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
}
