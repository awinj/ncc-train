package nccloud.bs.hk.pub.bp.bd;

import nccloud.bs.hk.pub.bpplugin.BasePluginPoint;
import nccloud.bs.hk.pub.rule.AbstractBDExtendRuleChain;
import nc.bs.pubapp.pub.rule.FieldLengthCheckRule;
import nc.bs.pubapp.pub.rule.FillInsertDataRule;
import nc.impl.pubapp.pattern.data.bill.template.InsertBPTemplate;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public class BDInsertBP<T extends AbstractBill> implements IBDBaseBP<T>{
    private AbstractBDExtendRuleChain<T> chain;

    protected void addBeforeRule(AroundProcesser<T> processor) {
        processor.addBeforeRule(new FieldLengthCheckRule());
        processor.addBeforeRule(new FillInsertDataRule());

        if ((this.chain != null) && (this.chain.getInsertBeforeRules() != null))
            for (IRule rule : this.chain.getInsertBeforeRules())
                processor.addBeforeRule(rule);
    }

    protected void addAfterRule(AroundProcesser<T> processor) {
        if ((this.chain != null) && (this.chain.getInsertAfterRules() != null))
            for (IRule rule : this.chain.getInsertAfterRules())
                processor.addAfterRule(rule);
    }

    public void setExRuleChain(AbstractBDExtendRuleChain<T> chain) {
        this.chain = chain;
    }

    public T[] insert(T[] bills) throws BusinessException {
        InsertBPTemplate bp = new InsertBPTemplate(BasePluginPoint.INSERT);
        addBeforeRule(bp.getAroundProcesser());
        addAfterRule(bp.getAroundProcesser());
        return (T[]) bp.insert(bills);
    }
}
