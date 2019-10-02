//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package nccloud.pubimpl.platform.template;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import nc.bs.framework.common.NCLocator;
import nc.vo.ml.NCLangRes4VoTransl;
import nc.vo.platform.appsystemplate.AreaVO;
import nc.vo.platform.appsystemplate.QueryPropertyVO;
import nc.vo.pub.BusinessException;
import nc.vo.pub.CircularlyAccessibleValueObject;
import nc.vo.pub.query.QueryConditionVO;
import nc.vo.pub.query.QueryTempletTotalVO;
import nc.vo.pub.query.QueryTempletVO;
import nc.vo.pubapp.pattern.exception.ExceptionUtils;
import nccloud.dto.baseapp.querytree.dataformat.Condition;
import nccloud.dto.baseapp.querytree.dataformat.QueryTreeFormatVO;
import nccloud.impl.platform.common.util.StringUtils;
import nccloud.pubitf.platform.template.IArea;
import nccloud.pubitf.platform.template.ISearchAreaVOConvert;

public class SearchAreaVOConvertImpl implements ISearchAreaVOConvert {
    public SearchAreaVOConvertImpl() {
    }


    public QueryTempletTotalVO getTempletVOByPk(String areaPk, QueryTreeFormatVO queryTreeFormatVO) throws BusinessException {
        IArea service = (IArea)NCLocator.getInstance().lookup(IArea.class);
        AreaVO areaVO = service.queryAreaByPk(areaPk);
        if (areaVO == null) {
            ExceptionUtils.wrappBusinessException(NCLangRes4VoTransl.getNCLangRes().getStrByID("workbench999_0", "0workbench999-0043"));
        }

        QueryTempletTotalVO totalVO = this.convertToSearch(areaVO);
        if (queryTreeFormatVO != null) {
            this.initQueryTreeCon(totalVO, queryTreeFormatVO.getQuerycondition().getConditions());
        }

        return totalVO;
    }

    private QueryTempletTotalVO convertToSearch(AreaVO vo) {
        QueryTempletVO parent = new QueryTempletVO();
        parent.setId(vo.getPk_area());
        parent.setModelCode(vo.getCode());
        parent.setModelName(vo.getName());
        parent.setResid(vo.getResid());
        parent.setMetaclass(vo.getMetaid());
        parent.setPkCorp("@@@@");
        List<QueryConditionVO> children = new ArrayList();
        List<QueryPropertyVO> items = vo.getQueryPropertyList();
        if (items != null && items.size() != 0) {
            int i = 0;

            for(Iterator i$ = items.iterator(); i$.hasNext(); ++i) {
                QueryPropertyVO item = (QueryPropertyVO)i$.next();
                QueryConditionVO child = new QueryConditionVO();
                child.setFieldName(item.getLabel());
                child.setFieldCode(item.getCode());
                child.setMaxLength(item.getMaxlength());
                child.setPkTemplet(vo.getPk_area());
                child.setIfNotMDCondition(item.getIsnotmeta());
                child.setIfUsed(item.getIsuse());
                child.setTableCode(item.getTablecode());
                child.setTableName(item.getQuerytablename());
                if (item.getOpersign() != null) {
                    child.setOperaCode(this.getOperaCode(item.getOpersign()));
                }

                child.setIsCondition(item.getIsquerycondition());
                if (item.getDatatype() != null) {
                    child.setDataType(this.convertDataType(item.getDatatype()));
                }

                child.setDispSequence(i);
                if (item.getReturntype() != null) {
                    child.setReturnType(this.getReturnType(item.getReturntype()));
                }

                if (item.getVisible() != null) {
                    child.setDispType(this.getDisp(item.getVisible().booleanValue()));
                }

                child.setTs(item.getTs());
                child.setDr(item.getDr());
                children.add(child);
            }

            QueryTempletTotalVO total = new QueryTempletTotalVO();
            total.setTemplet(parent);
            total.setChildrenVO((CircularlyAccessibleValueObject[])children.toArray(new QueryConditionVO[children.size()]));
            return total;
        } else {
            QueryTempletTotalVO total = new QueryTempletTotalVO();
            total.setTemplet(parent);
            total.setChildrenVO((CircularlyAccessibleValueObject[])children.toArray(new QueryConditionVO[children.size()]));
            return total;
        }
    }

    private boolean IsStrNullOrEmpty(String field) {
        return field == null || field.trim().isEmpty();
    }

    public void initQueryTreeCon(QueryTempletTotalVO totalVO, List<Condition> condition) {
        Map<String, QueryConditionVO> map = new HashMap();
        QueryConditionVO[] conditionVOs = totalVO.getConditionVOs();
        QueryConditionVO[] arr$ = conditionVOs;
        int len$ = conditionVOs.length;

        for(int i$ = 0; i$ < len$; ++i$) {
            QueryConditionVO conditionVO = arr$[i$];
            map.put(conditionVO.getFieldCode(), conditionVO);
        }

        if (condition != null && condition.size() >= 1) {
            for(int i = 0; i < condition.size(); ++i) {
                Condition condition_c = (Condition)condition.get(i);
                if (!this.IsStrNullOrEmpty(condition_c.getField())) {
                    QueryConditionVO conditionVO = (QueryConditionVO)map.get(condition_c.getField());
                    if (conditionVO != null) {
                        String datatype = condition_c.getDatatype();
                        if (!StringUtils.isEmpty(datatype)) {
                            conditionVO.setDataType(this.convertDataType(Integer.parseInt(datatype)));
                        }
                    }
                } else {
                    List<Condition> conditions_c = ((Condition)condition.get(i)).getConditions();
                    if (conditions_c == null || conditions_c.size() < 1) {
                        return;
                    }

                    this.initQueryTreeCon(totalVO, conditions_c);
                }
            }

        }
    }

    private Integer getDisp(boolean visible) {
        return visible ? 0 : 1;
    }

    private String getOperaCode(String opera) {
        StringBuffer code = new StringBuffer();
        if (opera.equals("==")) {
            code.append("=").append("@");
        } else if (opera.equals("=")) {
            code.append("in").append("@");
        } else {
            code.append(opera).append("@");
        }

        return code.toString();
    }

    private Integer getReturnType(String type) {
        if ("refcode".equals(type)) {
            return 0;
        } else if ("refname".equals(type)) {
            return 1;
        } else {
            return "refpk".equals(type) ? 2 : 3;
        }
    }

    private Integer convertDataType(Integer datatype) {
        Integer multidatatype = 7;
        switch(datatype) {
        case 1:
            multidatatype = 0;
            break;
        case 2:
            multidatatype = 2;
            break;
        case 4:
            multidatatype = 1;
            break;
        case 30:
            multidatatype = 7;
            break;
        case 32:
            multidatatype = 4;
            break;
        case 33:
            multidatatype = 3;
            break;
        case 34:
            multidatatype = 3;
            break;
        case 36:
            multidatatype = 8;
            break;
        case 37:
            multidatatype = 3;
            break;
        case 38:
            multidatatype = 3;
            break;
        case 52:
            multidatatype = 7;
            break;
        case 56:
            multidatatype = 7;
            break;
        case 57:
            multidatatype = 7;
            break;
        case 58:
            multidatatype = 9;
            break;
        case 203:
            multidatatype = 6;
            break;
        case 204:
            multidatatype = 5;
            break;
        case 400:
            multidatatype = 7;
        }

        return multidatatype;
    }
}
