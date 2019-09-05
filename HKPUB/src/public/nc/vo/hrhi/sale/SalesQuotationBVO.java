package nc.vo.hrhi.sale;

import nc.vo.pub.IVOMeta;
import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFBoolean;
import nc.vo.pub.lang.UFDate;
import nc.vo.pub.lang.UFDateTime;
import nc.vo.pub.lang.UFDouble;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

/**
 * <b> 此处简要描述此类功能 </b>
 * <p>
 *   此处添加累的描述信息
 * </p>
 *  创建日期:2019-8-28
 * @author yonyouBQ
 * @version NCPrj ??
 */

public class SalesQuotationBVO extends SuperVO {

    /**
     *上层单据主键
     */
    public static final String PK_QUOTATION="pk_quotation";
    /**
     *时间戳
     */
    public static final String TS="ts";;


    /**
     * 属性 生成上层主键的Getter方法.属性名：上层主键
     *  创建日期:2019-8-28
     * @return String
     */
    public String getPk_quotation(){
        return (String)this.getAttributeValue(SalesQuotationBVO.PK_QUOTATION);
    }
    /**
     * 属性生成上层主键的Setter方法.属性名：上层主键
     * 创建日期:2019-8-28
     * @param newPk_quotation String
     */
    public void setPk_quotation(String pk_quotation){
        this.setAttributeValue(SalesQuotationBVO.PK_QUOTATION,pk_quotation);
    }
    /**
     * 属性 生成时间戳的Getter方法.属性名：时间戳
     *  创建日期:2019-8-28
     * @return nc.vo.pub.lang.UFDateTime
     */
    public UFDateTime getTs() {
        return (UFDateTime)this.getAttributeValue(SalesQuotationBVO.TS);
    }
    /**
     * 属性生成时间戳的Setter方法.属性名：时间戳
     * 创建日期:2019-8-28
     * @param newts nc.vo.pub.lang.UFDateTime
     */
    public void setTs(UFDateTime ts){
        this.setAttributeValue(SalesQuotationBVO.TS,ts);
    }

    @Override
    public IVOMeta getMetaData() {
        return VOMetaFactory.getInstance().getVOMeta("hrhi.SalesQuotationBVO");
    }
}
    