package nccloud.bs.hk.pub.bp.pf;
 
 import nccloud.bs.hk.pub.bp.BaseAbstractUpdateBP;
 import nc.bs.pubapp.pub.rule.FieldLengthCheckRule;
 import nc.bs.pubapp.pub.rule.FillUpdateDataRule;
 import nc.impl.pubapp.pattern.rule.IRule;
 import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public class PFBaseUpdateBP<T extends AbstractBill> extends BaseAbstractUpdateBP<T>
 {
   protected void addAfterRule(CompareAroundProcesser<T> processer)
   {
     IRule rule = null;
 
     processer.addAfterRule(rule);
   }
 
   protected void addBeforeRule(CompareAroundProcesser<T> processer)
   {
     IRule rule = null;
     rule = new FillUpdateDataRule();
     processer.addBeforeRule(rule);
 
     rule = new FieldLengthCheckRule();
     processer.addBeforeRule(rule);
   }
 }