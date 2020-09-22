package nccloud.web.pubitf.ref;

import nccloud.framework.web.processor.refgrid.RefQueryInfo;
import nccloud.framework.web.ui.meta.RefMeta;
import nccloud.web.refer.DefaultGridRefAction;

public class BookGridRef extends DefaultGridRefAction {
    @Override
    public RefMeta getRefMeta(RefQueryInfo refQueryInfo) {
        RefMeta meta = new RefMeta();

        meta.setCodeField("code");
        meta.setNameField("name");
        meta.setPkField("pk_book");
        meta.setTableName("train_book");
        meta.setExtraFields(new String[]{"code", "name"});
//        meta.setMutilLangNameRef(true);
        return meta;
    }
}
