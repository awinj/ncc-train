package nc.itf.hk.pub;

import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public interface IBaseMaintainService<T extends AbstractBill> {

    void delete(T[] clientFullVOs, T[] originBills) throws BusinessException;

    T[] insert(T[] clientFullVOs, T[] originBills) throws BusinessException;

    T[] update(T[] clientFullVOs, T[] originBills) throws BusinessException;

    T[] save(T[] clientFullVOs, T[] originBills) throws BusinessException;

    T[] unsave(T[] clientFullVOs, T[] originBills) throws BusinessException;

    T[] approve(T[] clientFullVOs, T[] originBills) throws BusinessException;

    T[] unapprove(T[] clientFullVOs, T[] originBills) throws BusinessException;

    T[] query(IQueryScheme queryScheme) throws BusinessException;
}
