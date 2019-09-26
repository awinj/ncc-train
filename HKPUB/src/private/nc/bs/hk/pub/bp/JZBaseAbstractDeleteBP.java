package nc.bs.hk.pub.bp;
 
 import nc.bs.hk.pub.bpplugin.JZBasePluginPoint;
 import nc.impl.pubapp.pattern.data.bill.template.DeleteBPTemplate;
 import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public abstract class JZBaseAbstractDeleteBP<T extends AbstractBill>
 {
   public void delete(T[] bills)
   {
     DeleteBPTemplate bp = new DeleteBPTemplate(JZBasePluginPoint.DELETE);
 
     addBeforeRule(bp.getAroundProcesser());
 
     addAfterRule(bp.getAroundProcesser());
     bp.delete(bills);
   }
 
   protected abstract void addBeforeRule(AroundProcesser<T> paramAroundProcesser);
 
   protected abstract void addAfterRule(AroundProcesser<T> paramAroundProcesser);
 }
