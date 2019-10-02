package nc.bs.hk.pub.bp;
 
 import nc.impl.pubapp.pattern.data.bill.BillUpdate;
 import nc.vo.pub.CircularlyAccessibleValueObject;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public abstract class BaseAbstractUnApproveBP<T extends AbstractBill>
 {
   public T[] unApprove(T[] clientBills, T[] originBills)
   {
     setHeadVOStatus(clientBills);
     BillUpdate update = new BillUpdate();
     AbstractBill[] returnVos = (AbstractBill[])update.update(clientBills, originBills);
     return (T[]) returnVos;
   }
 
   private void setHeadVOStatus(T[] clientBills) {
     for (AbstractBill clientBill : clientBills)
       clientBill.getParentVO().setStatus(1);
   }
 }
