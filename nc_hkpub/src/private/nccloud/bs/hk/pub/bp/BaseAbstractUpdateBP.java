package nccloud.bs.hk.pub.bp;
 
 import nccloud.bs.hk.pub.bpplugin.BasePluginPoint;
 import nc.impl.pubapp.pattern.data.bill.template.UpdateBPTemplate;
 import nc.impl.pubapp.pattern.rule.processer.CompareAroundProcesser;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public abstract class BaseAbstractUpdateBP<T extends AbstractBill>
 {
   public T[] update(T[] bills, T[] originBills)
   {
     UpdateBPTemplate<T> bp = new UpdateBPTemplate<T>(BasePluginPoint.UPDATE);
 
     addBeforeRule(bp.getAroundProcesser());
 
     addAfterRule(bp.getAroundProcesser());
 
     return bp.update(bills, originBills);
   }
 
   protected abstract void addAfterRule(CompareAroundProcesser<T> paramCompareAroundProcesser);
 
   protected abstract void addBeforeRule(CompareAroundProcesser<T> paramCompareAroundProcesser);
 }
