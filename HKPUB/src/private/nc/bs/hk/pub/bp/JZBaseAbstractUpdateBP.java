package nc.bs.hk.pub.bp;
 
 import nc.bs.hk.pub.bpplugin.JZBasePluginPoint;
 import nc.impl.pubapp.pattern.data.bill.template.UpdateBPTemplate;
 import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public abstract class JZBaseAbstractUpdateBP<T extends AbstractBill>
 {
   public T[] update(T[] bills, T[] originBills)
   {
     UpdateBPTemplate bp = new UpdateBPTemplate(JZBasePluginPoint.UPDATE);
 
     addBeforeRule(bp.getAroundProcesser());
 
     addAfterRule(bp.getAroundProcesser());
 
     return (T[])bp.update(bills, originBills);
   }
 
   protected abstract void addAfterRule(CompareAroundProcesser<T> paramCompareAroundProcesser);
 
   protected abstract void addBeforeRule(CompareAroundProcesser<T> paramCompareAroundProcesser);
 }
