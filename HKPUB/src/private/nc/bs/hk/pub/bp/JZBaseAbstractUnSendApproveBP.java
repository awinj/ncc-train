package nc.bs.hk.pub.bp;
 
 import nc.impl.pubapp.pattern.data.bill.BillUpdate;
 import nc.vo.pub.CircularlyAccessibleValueObject;
 import nc.vo.pub.pf.BillStatusEnum;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public abstract class JZBaseAbstractUnSendApproveBP<T extends AbstractBill>
 {
   public T[] unSend(T[] clientBills, T[] originBills)
   {
     setHeadVOStatus(clientBills);
     BillUpdate update = new BillUpdate();
     AbstractBill[] returnVos = (AbstractBill[])update.update(clientBills, originBills);
     return (T[]) returnVos;
   }
 
   private void setHeadVOStatus(T[] clientBills) {
     for (AbstractBill clientBill : clientBills) {
       clientBill.getParentVO().setAttributeValue("ibillstatus", BillStatusEnum.FREE.value());
 
       clientBill.getParentVO().setStatus(1);
     }
   }
 }
