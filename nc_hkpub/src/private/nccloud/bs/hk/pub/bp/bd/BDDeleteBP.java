package nccloud.bs.hk.pub.bp.bd;

import nccloud.bs.hk.pub.bpplugin.BasePluginPoint;
import nccloud.bs.hk.pub.rule.AbstractBDExtendRuleChain;
import nc.impl.pubapp.pattern.data.bill.template.DeleteBPTemplate;
import nc.impl.pubapp.pattern.rule.IRule;
import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public class BDDeleteBP<T extends AbstractBill> implements IBDBaseBP<T> {
    private AbstractBDExtendRuleChain<T> chain;

    @Override
    public void setExRuleChain(AbstractBDExtendRuleChain<T> chain) {
        this.chain=chain;
    }

    protected void addBeforeRule(AroundProcesser<T> processor) {
        if ((this.chain != null) && (this.chain.getDeleteBeforeRules() != null))
            for (IRule rule : this.chain.getDeleteBeforeRules())
                processor.addBeforeRule(rule);
    }

    protected void addAfterRule(AroundProcesser<T> processor) {
        if ((this.chain != null) && (this.chain.getDeleteAfterRules() != null))
            for (IRule rule : this.chain.getDeleteAfterRules())
                processor.addAfterRule(rule);
    }

    public void delete(T[] bills) {
        DeleteBPTemplate bp = new DeleteBPTemplate(BasePluginPoint.DELETE);

        addBeforeRule(bp.getAroundProcesser());

        addAfterRule(bp.getAroundProcesser());
        bp.delete(bills);
    }
}
