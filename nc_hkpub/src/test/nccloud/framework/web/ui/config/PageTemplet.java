package nccloud.framework.web.ui.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import nccloud.framework.core.env.Locator;
import nccloud.framework.core.log.ILog;
import nccloud.framework.core.log.ILogFactory;
import nccloud.framework.web.ui.meta.AreaRelation;
import nccloud.framework.web.ui.meta.AreaStatus;
import nccloud.framework.web.ui.meta.AreaType;
import nccloud.framework.web.ui.meta.PageType;

public class PageTemplet
        implements Cloneable
{
    private String appcode;
    private Map<String, Area> areas = new HashMap();
    private String clazz;
    private String code;
    private String headcode;
    private String metapath;
    private String name;
    private String oid;
    private String pagecode;
    private PageType pagetype;
    private String tailcode;
    private String ts;

    public void addArea(Area area)
    {
        this.areas.put(area.getCode(), area);
    }

    public Object clone()
    {
        PageTemplet ret = new PageTemplet();
        try {
            ret = (PageTemplet)super.clone();
            List<Area> newAreas = new ArrayList();
            Map oArea = getAreas();
            for (Iterator i = oArea.values().iterator(); i.hasNext(); ) {
                Area obj = (Area)i.next();
                newAreas.add((Area)obj.clone());
            }
            ret.resetArea();
            for (Area area : newAreas)
                ret.addArea(area);
        }
        catch (CloneNotSupportedException e)
        {
            ILog logger = ((ILogFactory)Locator.find(ILogFactory.class)).getLog("nccloud");
            logger.error(e);
        }
        return ret;
    }

    public Area[] getAllAreas()
    {
        int size = this.areas.size();
        Area[] vos = new Area[size];
        vos = (Area[])this.areas.values().toArray(vos);
        return vos;
    }

    public String getAppcode() {
        return this.appcode;
    }

    public Area getArea(String areacode)
    {
        return (Area)this.areas.get(areacode);
    }

    public Map<String, Area> getAreas() {
        return this.areas;
    }

    public String getClazz()
    {
        return this.clazz;
    }

    public String getCode()
    {
        return this.code;
    }

    public Map<String, String[]> getFormRelation()
    {
        if ((this.headcode == null) || ("".equals(this.headcode))) {
            return null;
        }
        Map map = new HashMap();
        List listarea = new ArrayList();
        for (Map.Entry entry : this.areas.entrySet()) {
            Area area = (Area)entry.getValue();
            if ((area.getRelationcode() != null) && (area.getRelationcode().equals(this.headcode)))
            {
                listarea.add(area);
            }
        }
        if (listarea.size() == 0) {
            return null;
        }
        ComparatorImpl com = new ComparatorImpl();
        Collections.sort(listarea, com);
        String[] areacodes = new String[listarea.size()];
        for (int i = 0; i < listarea.size(); i++) {
            areacodes[i] = ((Area)listarea.get(i)).getCode();
        }
        map.put(this.headcode, areacodes);
        return map;
    }

    public String getHeadcode()
    {
        return this.headcode;
    }

    public String getMetapath()
    {
        return this.metapath;
    }

    public String getName()
    {
        return this.name;
    }

    public String getOid()
    {
        return this.oid;
    }

    public String getPagecode() {
        return this.pagecode;
    }

    public PageType getPagetype()
    {
        return this.pagetype;
    }

    public Map<String, AreaRelation> getRelations()
    {
        Set<String> set_m = new HashSet();
        for (Map.Entry entry : this.areas.entrySet()) {
            Area area = (Area)entry.getValue();
            if ((area.getAreaType().equals(AreaType.Table)) && ("".equals(area.getRelationcode())||(area.getRelationcode() == null) || (area.getRelationcode().equals(area.getCode()))))
            {
                set_m.add(area.getCode());
            }
        }
        Map ret = new HashMap();

        for (String areacode : set_m) {
            List<Area> tabareas = new ArrayList();

            AreaRelation newrelation = new AreaRelation();
            newrelation.setSrcAreaCode(areacode);
            for (Map.Entry entry : this.areas.entrySet()) {
                Area area = (Area)entry.getValue();
                if (areacode.equals(area.getCode())) {
                    tabareas.add(area);
                }
                else if (areacode.equals(area.getRelationcode())) {
                    if (area.getAreaType().equals(AreaType.Table)) {
                        tabareas.add(area);
                    }
                    else if (area.getAreaType().equals(AreaType.Form)) {
                        if (AreaStatus.Browse.equals(area.getAreastatus())) {
                            newrelation.setDestBrowseAreaCode(area.getCode());
                        }
                        else if (AreaStatus.Edit.equals(area.getAreastatus())) {
                            newrelation.addDestEditAreaCode(area.getCode());
                        }
                    }
                }
            }
            ComparatorImpl com = new ComparatorImpl();
            Collections.sort(tabareas, com);
            List l = new ArrayList();
            for (Area e : tabareas) {
                l.add(e.getCode());
            }
            newrelation.setTabRelation((String[])l.toArray(new String[0]));
            ret.put(areacode, newrelation);
        }

        return ret;
    }

    public String getTailcode()
    {
        return this.tailcode;
    }

    public String getTs()
    {
        return this.ts;
    }

    public void resetArea() {
        this.areas = new HashMap();
    }

    public void setAppcode(String appcode) {
        this.appcode = appcode;
    }

    public void setClazz(String clazz)
    {
        this.clazz = clazz;
    }

    public void setCode(String code)
    {
        this.code = code;
    }

    public void setHeadcode(String headcode)
    {
        this.headcode = headcode;
    }

    public void setMetapath(String metapath)
    {
        this.metapath = metapath;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public void setOid(String oid)
    {
        this.oid = oid;
    }

    public void setPagecode(String pagecode) {
        this.pagecode = pagecode;
    }

    public void setPagetype(PageType pagetype)
    {
        this.pagetype = pagetype;
    }

    public void setTailcode(String tailcode)
    {
        this.tailcode = tailcode;
    }

    public void setTs(String ts)
    {
        this.ts = ts;
    }

    public class ComparatorImpl
            implements Comparator<Area>
    {
        public ComparatorImpl()
        {
        }

        public int compare(Area s1, Area s2)
        {
            int ord1 = s1.getOrder();
            int ord2 = s2.getOrder();
            if (ord1 > ord2) {
                return 1;
            }
            if (ord1 < ord2) {
                return -1;
            }

            return 0;
        }
    }
}