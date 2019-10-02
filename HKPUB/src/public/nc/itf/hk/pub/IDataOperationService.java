package nc.itf.hk.pub;

import nc.vo.pub.BusinessException;
import nc.vo.pubapp.pattern.model.entity.bill.IBill;

public interface IDataOperationService {

    IBill[] insert(IBill[] aggvos) throws BusinessException;

    IBill[] update(IBill[] aggvos) throws BusinessException;

    IBill[] delete(IBill[] aggvos) throws BusinessException;
}
