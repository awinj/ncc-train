package nccloud.web.hk.pub.action.bd;

import nc.bs.logging.Logger;
import nc.vo.pub.IColumnMeta;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;

public abstract class NCCAction implements ICommonAction {



    //暂时认为子表存主表主键的字段与主表的主键字段名称一致。后续优化
    protected String getPrimaryField() {
       try{

           IColumnMeta column =getAggVO().getMetaData().getParent().getPrimaryAttribute().getColumn();
           if (column != null) {
               return column.getName();
           }
       }catch (Exception e){
           Logger.error(e.getMessage(),e);
       }
        return "";
    }

    protected abstract AbstractBill getAggVO();

}
