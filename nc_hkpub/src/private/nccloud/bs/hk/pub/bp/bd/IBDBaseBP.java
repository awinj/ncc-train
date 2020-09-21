package nccloud.bs.hk.pub.bp.bd;

import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.bs.hk.pub.rule.AbstractBDExtendRuleChain;

public interface IBDBaseBP<T extends AbstractBill> {
    void setExRuleChain(AbstractBDExtendRuleChain<T> chain);
}
