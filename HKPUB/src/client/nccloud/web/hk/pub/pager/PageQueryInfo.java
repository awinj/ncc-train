
package nccloud.web.hk.pub.pager;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Map;

import nc.vo.pub.lang.UFDate;

/**
 * 单条或多条数据查询用
 */
public class PageQueryInfo {

    private String pk;
    private String[] pks;
    private String pagecode;

    private Map<String, String> userObj;

    public String getPk() {
        return pk;
    }

    public void setPk(String pk) {
        this.pk = pk;
    }

    public String getPagecode() {
        return pagecode;
    }

    public void setPagecode(String pagecode) {
        this.pagecode = pagecode;
    }

    public Map<String, String> getUserObj() {
        return userObj;
    }

    public void setUserObj(Map<String, String> userObj) {
        this.userObj = userObj;
    }

    public String[] getPks() {
        return pks;
    }

    public void setPks(String[] pks) {
        this.pks = pks;
    }
}
