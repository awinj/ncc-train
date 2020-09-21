package nccloud.bs.hk.pub.rule;
 
 import java.util.List;
 import nc.impl.pubapp.pattern.rule.IRule;
 import nc.vo.pubapp.pattern.model.entity.bill.IBill;
 
 public abstract class AbstractBDExtendRuleChain<T>
 {
   protected IBill[] bills;
 
   public void setBills(IBill[] bills)
   {
     this.bills = bills;
   }
 
   public abstract List<IRule<T>> getInsertBeforeRules();
 
   public abstract List<IRule<T>> getInsertAfterRules();
 
   public abstract List<IRule<T>> getUpdateBeforeRules();
 
   public abstract List<IRule<T>> getUpdateAfterRules();
 
   public abstract List<IRule<T>> getDeleteBeforeRules();
 
   public abstract List<IRule<T>> getDeleteAfterRules();
 }
