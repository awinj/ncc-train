package nccloud.bs.hk.pub.bp;
 
 import nccloud.bs.hk.pub.bpplugin.BasePluginPoint;
 import nc.impl.pubapp.pattern.data.bill.template.DeleteBPTemplate;
 import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public abstract class BaseAbstractDeleteBP<T extends AbstractBill>
 {
   public void delete(T[] bills)
   {
     DeleteBPTemplate<T> bp = new DeleteBPTemplate<T>(BasePluginPoint.DELETE);
 
     addBeforeRule(bp.getAroundProcesser());
 
     addAfterRule(bp.getAroundProcesser());
     bp.delete(bills);
   }
 
   protected abstract void addBeforeRule(AroundProcesser<T> paramAroundProcesser);
 
   protected abstract void addAfterRule(AroundProcesser<T> paramAroundProcesser);
 }
