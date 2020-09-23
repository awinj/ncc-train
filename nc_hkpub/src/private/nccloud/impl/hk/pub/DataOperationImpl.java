package nccloud.impl.hk.pub;

import nc.bs.bd.baseservice.md.BatchBaseService;
import nc.bs.bd.baseservice.md.VOArrayUtil;
import nc.bs.dao.BaseDAO;
import nc.bs.logging.Logger;
import nc.bs.uif2.VersionConflictException;
import nc.bs.uif2.validation.ValidationException;
import nc.vo.bd.meta.BatchOperateVO;
import nc.vo.pub.SuperVO;
import nccloud.bs.hk.pub.bp.bd.BDDeleteBP;
import nccloud.bs.hk.pub.bp.bd.BDInsertBP;
import nccloud.bs.hk.pub.bp.bd.BDUpdateBP;
import nccloud.bs.hk.pub.bp.bd.IBDBaseBP;
import nccloud.bs.hk.pub.rule.AbstractBDExtendRuleChain;
import nc.impl.pubapp.pattern.data.bill.tool.BillTransferTool;
import nccloud.itf.hk.pub.IDataOperationService;
import nccloud.itf.hk.pub.IBDExtendBP;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.pubapp.pattern.model.entity.bill.IBill;

import java.util.ArrayList;
import java.util.List;

public class DataOperationImpl<T extends AbstractBill> implements IDataOperationService<T> {

    public T[] insert(T[] value)
            throws BusinessException {
        BillTransferTool<T> transferTool = new BillTransferTool<>(value);

        BDInsertBP<T> bp = new BDInsertBP<>();

        addBDExtendRuleChain(bp, value);

        T[] bills = bp.insert(value);

        return transferTool.getBillForToClient(bills);
    }

    private void addBDExtendRuleChain(IBDBaseBP bp, IBill[] bills) throws BusinessException {
        if ((bills != null) && (bills.length > 0) && ((bills[0] instanceof IBDExtendBP))) {
            IBDExtendBP extendsBP = (IBDExtendBP) bills[0];
            try {
                AbstractBDExtendRuleChain chainEx = (AbstractBDExtendRuleChain) Class.forName(extendsBP.getExtendChainClassName()).newInstance();
                chainEx.setBills(bills);
                bp.setExRuleChain(chainEx);
            } catch (Exception e) {
                throw new BusinessException(e);
            }
        }
    }

    public T[] update(T[] value) throws BusinessException {
        BillTransferTool<T> transferTool = new BillTransferTool<>(value);

        T[] bills =  transferTool.getClientFullInfoBill();

        T[] originBills =  transferTool.getOriginBills();

        BDUpdateBP<T> bp = new BDUpdateBP<>();

        addBDExtendRuleChain(bp, value);

        bills = bp.update(bills, originBills);

        return transferTool.getBillForToClient(bills);
    }

    public T[] delete(T[] value)
            throws BusinessException {
        BDDeleteBP<T> bp = new BDDeleteBP<>();

        addBDExtendRuleChain(bp, value);

        bp.delete(value);
        return value;
    }

    @Override
    public T save(T aggVO) throws BusinessException {
        return null;
    }

    @Override
    public  SuperVO[]  batchSave(SuperVO[] vos) throws BusinessException {
        if (vos == null) {
            return null;
        } else {
            BaseDAO dao=new BaseDAO();
            List<SuperVO> addVOs = new ArrayList();
            List<SuperVO> updateVOs = new ArrayList();
            List<SuperVO> deleteVOs = new ArrayList();
            List<SuperVO> unchangeVOs = new ArrayList();

            for(int i = 0; i < vos.length; ++i) {
                if (vos[i].getStatus() == 2) {
                    addVOs.add(vos[i]);
                } else if (vos[i].getStatus() == 1) {
                    updateVOs.add(vos[i]);
                } else if (vos[i].getStatus() == 3) {
                    deleteVOs.add(vos[i]);
                } else if (vos[i].getStatus() == 0) {
                    unchangeVOs.add(vos[i]);
                }
            }

            dao.insertVOList(addVOs);
            dao.updateVOList(updateVOs);
            dao.deleteVOList(unchangeVOs);

            List<SuperVO> allVos=new ArrayList<>();
            allVos.addAll(addVOs);
            addVOs.addAll(updateVOs);
            return allVos.toArray(new SuperVO[0]);


        }
    }
}
