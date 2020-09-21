
package nccloud.impl.hk.pub;

import nc.impl.pubapp.pattern.data.bill.BillLazyQuery;
import nc.impl.pubapp.pattern.data.bill.tool.BillTransferTool;
import nccloud.itf.hk.pub.IBaseMaintainService;
import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.bs.hk.pub.bp.pf.*;

public class BaseMaintainImpl<T extends AbstractBill>
        implements IBaseMaintainService<T> {


    public void delete(T[] clientFullVOs, T[] originBills) throws BusinessException {
        try {
            new PFDeleteBP<T>().delete(clientFullVOs);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
    }

    public T[] insert(T[] clientFullVOs, T[] originBills) throws BusinessException {
        try {
            BillTransferTool<T> transferTool = new BillTransferTool<>(clientFullVOs);

            PFDefaultInsertBP<T> action = new PFDefaultInsertBP<>();
            T[] retVos = action.insert(clientFullVOs);

            return transferTool.getBillForToClient(retVos);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
        return null;
    }

    public T[] update(T[] clientFullVOs, T[] originBills) throws BusinessException {
        try {
            BillTransferTool<T> transferTool = new BillTransferTool<>(clientFullVOs);

            PFBaseUpdateBP<T> bp = new PFBaseUpdateBP<>();
            T[] retVos = bp.update(clientFullVOs, originBills);

            return transferTool.getBillForToClient(retVos);
        } catch (Exception e) {
            ExceptionUtils.marsh(e);
        }
        return null;
    }

    public T[] save(T[] clientFullVOs, T[] originBills) throws BusinessException {
        if (clientFullVOs == null) {
            throw new BusinessException("数据已经被删除，请刷新数据");
        }
        PFSendApproveBP<T> bp = new PFSendApproveBP<>();
        return bp.sendApprove(clientFullVOs, originBills);
    }

    public T[] unSave(T[] clientFullVOs, T[] originBills) throws BusinessException {
        if (clientFullVOs == null) {
            throw new BusinessException("数据已经被删除，请刷新数据");
        }
        PFUnSendApproveBP<T> bp = new PFUnSendApproveBP<>();
        return bp.unSend(clientFullVOs, originBills);
    }

    public T[] approve(T[] clientFullVOs, T[] originBills) throws BusinessException {
        if (clientFullVOs == null) {
            throw new BusinessException("数据已经被删除，请刷新数据");
        }
        for (int i = 0; i < clientFullVOs.length; i++) {
            clientFullVOs[i].getParentVO().setStatus(1);
        }
        PFApproveBP<T> bp = new PFApproveBP<>();
        T[] retVos = bp.approve(clientFullVOs, originBills);
        return retVos;
    }

    public T[] unApprove(T[] clientFullVOs, T[] originBills) throws BusinessException {
        if (clientFullVOs == null) {
            throw new BusinessException("数据已经被删除，请刷新数据");
        }
        for (int i = 0; i < clientFullVOs.length; i++) {
            clientFullVOs[i].getParentVO().setStatus(1);
        }
        PFUnApproveBP<T> bp = new PFUnApproveBP();
        return bp.unApprove(clientFullVOs, originBills);
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
