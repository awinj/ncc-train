package nc.impl.hk.pub;

import nc.bs.hk.pub.bp.bd.BDDeleteBP;
import nc.bs.hk.pub.bp.bd.BDInsertBP;
import nc.bs.hk.pub.bp.bd.BDUpdateBP;
import nc.bs.hk.pub.rule.AbstractBDExtendRuleChain;
import nc.impl.pubapp.pattern.data.bill.tool.BillTransferTool;
import nc.itf.hk.pub.IDataOperationService;
import nc.itf.hk.pub.IBDExtendBP;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.pubapp.pattern.model.entity.bill.IBill;

public class DataOperationImpl implements IDataOperationService {

    public IBill[] insert(IBill[] value)
            throws BusinessException {
        BillTransferTool transferTool = new BillTransferTool((AbstractBill[]) value);

        BDInsertBP bp = new BDInsertBP();

        if ((value != null) && (value.length > 0) && ((value[0] instanceof IBDExtendBP))) {
            IBDExtendBP extendsBP = (IBDExtendBP) value[0];
            try {
                AbstractBDExtendRuleChain chainEx = (AbstractBDExtendRuleChain) Class.forName(extendsBP.getExtendChainClassName()).newInstance();
                chainEx.setBills(value);
                bp.setExRuleChain(chainEx);
            } catch (Exception e) {
                throw new BusinessException(e);
            }
        }

        AbstractBill[] bills = bp.insert((AbstractBill[]) value);

        return transferTool.getBillForToClient(bills);
    }

    public IBill[] update(IBill[] value) throws BusinessException {
        BillTransferTool transferTool = new BillTransferTool((AbstractBill[]) value);

        AbstractBill[] bills = (AbstractBill[]) transferTool.getClientFullInfoBill();

        AbstractBill[] originBills = (AbstractBill[]) transferTool.getOriginBills();

        BDUpdateBP bp = new BDUpdateBP();

        if ((value != null) && (value.length > 0) && ((value[0] instanceof IBDExtendBP))) {
            IBDExtendBP extendsBP = (IBDExtendBP) value[0];
            try {
                AbstractBDExtendRuleChain chainEx = (AbstractBDExtendRuleChain) Class.forName(extendsBP.getExtendChainClassName()).newInstance();
                chainEx.setBills(value);
                bp.setExRuleChain(chainEx);
            } catch (Exception e) {
                throw new BusinessException(e);
            }
        }

        bills = bp.update(bills, originBills);

        return transferTool.getBillForToClient(bills);
    }

    public IBill[] delete(IBill[] value)
            throws BusinessException {
        BDDeleteBP bp = new BDDeleteBP();

        if ((value != null) && (value.length > 0) && ((value[0] instanceof IBDExtendBP))) {
            IBDExtendBP extendsBP = (IBDExtendBP) value[0];
            try {
                AbstractBDExtendRuleChain chainEx = (AbstractBDExtendRuleChain) Class.forName(extendsBP.getExtendChainClassName()).newInstance();
                chainEx.setBills(value);
                bp.setExRuleChain(chainEx);
            } catch (Exception e) {
                throw new BusinessException(e);
            }
        }

        bp.delete((AbstractBill[]) value);
        return value;
    }
}
