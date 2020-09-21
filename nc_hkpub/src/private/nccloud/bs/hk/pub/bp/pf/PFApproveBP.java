package nccloud.bs.hk.pub.bp.pf;

import nc.impl.pubapp.pattern.data.bill.BillUpdate;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public class PFApproveBP<T extends AbstractBill> {
    public T[]  approve(T[] clientBills, T[] originBills) {
        for (int i = 0; (clientBills != null) && (i < clientBills.length); i++) {
            clientBills[i].getParentVO().setStatus(1);
        }

        BillUpdate update = new BillUpdate();
        AbstractBill[] returnVos = (AbstractBill[]) update.update(clientBills, originBills);

        return (T[]) returnVos;
    }
}
