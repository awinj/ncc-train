package nccloud.itf.hk.pub;

import nc.vo.bd.meta.BatchOperateVO;
import nc.vo.pub.BusinessException;
import nc.vo.pub.SuperVO;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nc.vo.pubapp.pattern.model.entity.bill.IBill;

public interface IDataOperationService<T extends AbstractBill> {

    T[] insert(T[] aggVOs) throws BusinessException;

    T[] update(T[] aggVOs) throws BusinessException;

    T[] delete(T[] aggVOs) throws BusinessException;

    T save(T aggVO) throws BusinessException;


    SuperVO[] batchSave(SuperVO[] vos) throws BusinessException;
}
