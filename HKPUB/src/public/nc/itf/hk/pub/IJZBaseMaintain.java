package nc.itf.hk.pub;

import nc.ui.querytemplate.querytree.IQueryScheme;
import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public abstract interface IJZBaseMaintain<T extends AbstractBill>
{

  public abstract void delete(T[] paramArrayOfT1, T[] paramArrayOfT2)
    throws BusinessException;

  public abstract T[] insert(T[] paramArrayOfT1, T[] paramArrayOfT2)
    throws BusinessException;

  public abstract T[] update(T[] paramArrayOfT1, T[] paramArrayOfT2)
    throws BusinessException;


  public abstract T[] save(T[] paramArrayOfT1, T[] paramArrayOfT2)
    throws BusinessException;

  public abstract T[] unsave(T[] paramArrayOfT1, T[] paramArrayOfT2)
    throws BusinessException;

  public abstract T[] approve(T[] paramArrayOfT1, T[] paramArrayOfT2)
    throws BusinessException;

  public abstract T[] unapprove(T[] paramArrayOfT1, T[] paramArrayOfT2)
    throws BusinessException;

   T[] query(IQueryScheme queryScheme)
          throws BusinessException;
}
