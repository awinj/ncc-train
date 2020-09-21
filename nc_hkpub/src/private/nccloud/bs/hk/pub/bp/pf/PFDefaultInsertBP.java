package nccloud.bs.hk.pub.bp.pf;
 
 import nccloud.bs.hk.pub.bp.BaseAbstractInsertBP;
 import nc.impl.pubapp.pattern.rule.processer.AroundProcesser;
 import nc.vo.pubapp.pattern.model.entity.bill.AbstractBill;

public class PFDefaultInsertBP<T extends AbstractBill> extends BaseAbstractInsertBP<T>
 {
   protected void addAfterRule(AroundProcesser<T> processor)
   {
//     IRule rule = null;
//     rule = new BillCodeCheckRule();
//     ((BillCodeCheckRule)rule).setCbilltype("DO05");
//     ((BillCodeCheckRule)rule).setCodeItem("vbillno");
//     ((BillCodeCheckRule)rule).setGroupItem("pk_group");
//     ((BillCodeCheckRule)rule).setOrgItem("pk_org");
//
//     processor.addAfterRule(rule);
   }
 
   protected void addBeforeRule(AroundProcesser<T> processer)
   {
//     IRule rule = null;
//     rule = new FillInsertDataRule();
//     processer.addBeforeRule(rule);
//     rule = new CreateBillCodeRule();
//     ((CreateBillCodeRule)rule).setCbilltype("DO05");
//     ((CreateBillCodeRule)rule).setCodeItem("vbillno");
//     ((CreateBillCodeRule)rule).setGroupItem("pk_group");
//     ((CreateBillCodeRule)rule).setOrgItem("pk_org");
//     processer.addBeforeRule(rule);
//     rule = new FieldLengthCheckRule();
//     processer.addBeforeRule(rule);
//     rule = new CheckNotNullRule();
//     processer.addBeforeRule(rule);
   }
 }
