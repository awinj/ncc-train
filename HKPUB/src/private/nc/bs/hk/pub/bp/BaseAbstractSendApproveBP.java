package nc.bs.hk.pub.bp;
 
 import nc.impl.pubapp.pattern.data.bill.BillUpdate;
 import nc.vo.pub.CircularlyAccessibleValueObject;
 import nc.vo.pub.pf.BillStatusEnum;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
 
 public abstract class BaseAbstractSendApproveBP<T extends AbstractBill>
 {
   public T[] sendApprove(T[] clientBills, T[] originBills)
   {
     for (AbstractBill clientFullVO : clientBills) {
       clientFullVO.getParentVO().setAttributeValue("ibillstatus", BillStatusEnum.COMMIT.value());
 
       clientFullVO.getParentVO().setStatus(1);
     }
 
     AbstractBill[] returnVos = (AbstractBill[])new BillUpdate().update(clientBills, originBills);
     return (T[]) returnVos;
   }
 }
