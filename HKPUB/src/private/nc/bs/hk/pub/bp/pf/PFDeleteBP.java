package nc.bs.hk.pub.bp.pf;
 
 import nc.bs.hk.pub.bp.BaseAbstractDeleteBP;
 import nc.bs.pubapp.pub.rule.BillDeleteStatusCheckRule;
 import nc.impl.pubapp.pattern.rule.IRule;
 import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public class PFDeleteBP<T extends AbstractBill> extends BaseAbstractDeleteBP<T>
 {
   protected void addBeforeRule(AroundProcesser<T> processer)
   {
     IRule rule = null;
     rule = new BillDeleteStatusCheckRule();
 
     processer.addBeforeRule(rule);
   }
 
   protected void addAfterRule(AroundProcesser<T> processer)
   {
   }
 }
