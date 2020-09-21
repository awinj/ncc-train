package nccloud.bs.hk.pub.bp.bd;

import nccloud.bs.hk.pub.bpplugin.BasePluginPoint;
import nccloud.bs.hk.pub.rule.AbstractBDExtendRuleChain;
import nc.bs.pubapp.pub.rule.FieldLengthCheckRule;
import nc.bs.pubapp.pub.rule.FillUpdateDataRule;
import nc.impl.pubapp.pattern.data.bill.template.UpdateBPTemplate;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public class BDUpdateBP<T extends AbstractBill> implements IBDBaseBP<T> {
    private AbstractBDExtendRuleChain<T> chain;

    protected void addAfterRule(CompareAroundProcesser<T> processor) {
        if ((this.chain != null) && (this.chain.getUpdateAfterRules() != null))
            for (IRule rule : this.chain.getUpdateAfterRules())
                processor.addAfterRule(rule);
    }

    protected void addBeforeRule(CompareAroundProcesser<T> processor) {
        processor.addBeforeRule(new FieldLengthCheckRule());
        processor.addBeforeRule(new FillUpdateDataRule());
        if ((this.chain != null) && (this.chain.getUpdateBeforeRules() != null))
            for (IRule rule : this.chain.getUpdateBeforeRules())
                processor.addBeforeRule(rule);
    }

    public void setExRuleChain(AbstractBDExtendRuleChain<T> chain) {
        this.chain = chain;
    }

    public T[] update(T[] bills, T[] originBills) {
        UpdateBPTemplate bp = new UpdateBPTemplate(BasePluginPoint.UPDATE);

        addBeforeRule(bp.getAroundProcesser());

        addAfterRule(bp.getAroundProcesser());

        return (T[]) bp.update(bills, originBills);
    }
}
