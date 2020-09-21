package nccloud.bs.hk.pub.bp;
 
 import nc.impl.pubapp.pattern.data.bill.BillUpdate;
 import nc.vo.pub.CircularlyAccessibleValueObject;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public abstract class BaseAbstractUnApproveBP<T extends AbstractBill>
 {
   public T[] unApprove(T[] clientBills, T[] originBills)
   {
     setHeadVOStatus(clientBills);
     BillUpdate<T> update = new BillUpdate<T>();
     T[] returnVos = update.update(clientBills, originBills);
     return  returnVos;
   }
 
   private void setHeadVOStatus(T[] clientBills) {
     for (AbstractBill clientBill : clientBills)
       clientBill.getParentVO().setStatus(1);
   }
 }
