/*    */
package nc.bs.hk.pub.bpplugin;

import nc.impl.pubapp.pattern.rule.plugin.IPluginPoint;

public enum JZBasePluginPoint
        implements IPluginPoint
{
    APPROVE,

    DELETE,

    INSERT,

    SEND_APPROVE,

    UNAPPROVE,

    UNSEND_APPROVE,

    UPDATE;

    public String getComponent()
    {
        return "hk";
    }

    public String getModule()
    {
        return "hk";
    }

    public String getPoint()
    {
        return getClass().getName() + "." + name();
    }
}
