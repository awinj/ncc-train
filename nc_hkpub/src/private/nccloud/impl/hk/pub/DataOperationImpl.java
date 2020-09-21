package nccloud.impl.hk.pub;

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
}
