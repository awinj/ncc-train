package nc.bs.hk.pub.bp;
 
 import nc.bs.hk.pub.bpplugin.JZBasePluginPoint;
 import nc.impl.pubapp.pattern.data.bill.template.InsertBPTemplate;
 import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
 import nc.vo.pub.BusinessException;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public abstract class JZBaseAbstractInsertBP<T extends AbstractBill>
 {
   public T[] insert(T[] bills)
     throws BusinessException
   {
     InsertBPTemplate bp = new InsertBPTemplate(JZBasePluginPoint.INSERT);
     addBeforeRule(bp.getAroundProcesser());
     addAfterRule(bp.getAroundProcesser());
     return (T[])bp.insert(bills);
   }
 
   protected abstract void addBeforeRule(AroundProcesser<T> paramAroundProcesser);
 
   protected abstract void addAfterRule(AroundProcesser<T> paramAroundProcesser);
 }
