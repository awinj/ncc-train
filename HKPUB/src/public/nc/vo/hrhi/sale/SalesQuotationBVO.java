package nc.vo.hrhi.sale;

import nc.vo.pub.IVOMeta;
import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFBoolean;
import nc.vo.pub.lang.UFDate;
import nc.vo.pub.lang.UFDateTime;
import nc.vo.pub.lang.UFDouble;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

/**
 * <b> �˴���Ҫ�������๦�� </b>
 * <p>
 *   �˴�����۵�������Ϣ
 * </p>
 *  ��������:2019-8-28
 * @author yonyouBQ
 * @version NCPrj ??
 */
 
public class SalesQuotationBVO extends SuperVO {
	
/**
*�ϲ㵥������
*/
public static final String PK_QUOTATION="pk_quotation";
/**
*ʱ���
*/
public static final String TS="ts";;
    
    
/**
* ���� �����ϲ�������Getter����.���������ϲ�����
*  ��������:2019-8-28
* @return String
*/
public String getPk_quotation(){
return (String)this.getAttributeValue(SalesQuotationBVO.PK_QUOTATION);
}
/**
* ���������ϲ�������Setter����.���������ϲ�����
* ��������:2019-8-28
* @param newPk_quotation String
*/
public void setPk_quotation(String pk_quotation){
this.setAttributeValue(SalesQuotationBVO.PK_QUOTATION,pk_quotation);
} 
/**
* ���� ����ʱ�����Getter����.��������ʱ���
*  ��������:2019-8-28
* @return nc.vo.pub.lang.UFDateTime
*/
public UFDateTime getTs() {
return (UFDateTime)this.getAttributeValue(SalesQuotationBVO.TS);
}
/**
* ��������ʱ�����Setter����.��������ʱ���
* ��������:2019-8-28
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
    