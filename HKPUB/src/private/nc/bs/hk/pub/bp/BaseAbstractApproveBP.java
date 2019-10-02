package nc.bs.hk.pub.bp;
 
 import nc.impl.pubapp.pattern.data.bill.BillUpdate;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public class BaseAbstractApproveBP<T extends AbstractBill>
 {
   public T[] approve(T[] clientBills, T[] originBills)
   {
     BillUpdate update = new BillUpdate();
     AbstractBill[] returnVos = (AbstractBill[])update.update(clientBills, originBills);
     return (T[]) returnVos;
   }
 }
