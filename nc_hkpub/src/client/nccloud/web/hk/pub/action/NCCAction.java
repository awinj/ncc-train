package nccloud.web.hk.pub.action;

import nc.bs.logging.Logger;
import nc.vo.pub.IColumnMeta;
import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.json.JsonFactory;
import nccloud.web.hk.pub.pager.PageQueryInfo;
import nccloud.web.hk.pub.util.ReflectUtil;

/**
 * NCC 动作按钮接口
 * @param <T>
 */
public abstract class NCCAction<T extends AbstractBill> implements ICommonAction {

    //主要目的用于获取元数据信息
    private T tmpAggVO;
    public NCCAction(){

        Class clazz=ReflectUtil.getActualTypeArgument(getClass());
        tmpAggVO= (T) ReflectUtil.newInstance(clazz);
    }


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

    /**
     * 获取查询参数
     *
     * @param paramIRequest
     * @return
     */
    protected Object getQueryParam(IRequest paramIRequest) {
        String strRead = paramIRequest.read();
        PageQueryInfo queryParam =
                JsonFactory.create().fromJson(strRead, PageQueryInfo.class);
        return queryParam;
    }

    protected  T getAggVO(){
        return tmpAggVO;
    }

}
