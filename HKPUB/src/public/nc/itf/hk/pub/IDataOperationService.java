package nc.itf.hk.pub;

import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.IBill;

public interface IDataOperationService {

    IBill[] insert(IBill[] paramArrayOfIBill) throws BusinessException;

    IBill[] update(IBill[] paramArrayOfIBill) throws BusinessException;

    IBill[] delete(IBill[] paramArrayOfIBill) throws BusinessException;
}
