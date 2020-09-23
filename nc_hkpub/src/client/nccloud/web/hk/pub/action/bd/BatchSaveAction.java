package nccloud.web.hk.pub.action.bd;


import nc.bs.bd.baseservice.md.BatchBaseService;
import nc.bs.logging.Logger;
import nc.vo.bd.meta.BatchOperateVO;
import nc.vo.pub.SuperVO;
import nccloud.framework.core.exception.ExceptionUtils;
import nccloud.framework.core.json.IJson;
import nccloud.framework.service.ServiceLocator;
import nccloud.framework.web.action.itf.ICommonAction;
import nccloud.framework.web.container.IRequest;
import nccloud.framework.web.convert.translate.Translator;
import nccloud.framework.web.json.JsonFactory;
import nccloud.framework.web.ui.pattern.grid.Grid;
import nccloud.framework.web.ui.pattern.grid.GridFormulaHandler;
import nccloud.itf.hk.pub.IDataOperationService;
import nccloud.vo.batchVOToolForWeb.util.BatchVOToolForWebUtil;
import nccloud.web.hk.pub.action.NCCAction;
import nccloud.web.hk.pub.util.ReflectUtil;
import nccloud.web.uapbd.commons.web.GridModelConvertUtils;

//import nccloud.vo.utils.BatchVOTool;


public class BatchSaveAction<T extends SuperVO> implements ICommonAction {

    @Override
    public Object doAction(IRequest paramIRequest) {

        try{
            String str = paramIRequest.read();
            IJson json = JsonFactory.create();
            Grid grid = json.fromJson(str, Grid.class);
            GridModelConvertUtils gridConvUtl = new GridModelConvertUtils();
            T[] vos = gridConvUtl.toVOs(getVOClass(), grid.getModel());

            SuperVO[] savedBatchVO = ServiceLocator.find(IDataOperationService.class).batchSave(vos);
            T[] saveVOs = (T[]) savedBatchVO;
            if (saveVOs != null && saveVOs.length > 0) {
                grid = gridConvUtl.toGridOpe(paramIRequest.readSysParam().getPagecs(), saveVOs);
            }
            // 处理显示公式
            GridFormulaHandler gridFormulaHandler = new GridFormulaHandler(grid);
            gridFormulaHandler.handleLoadFormula();
            // 翻译器，将主键翻译成名称
            Translator translator = new Translator();
            translator.translate(grid);
            return grid;
        }catch (Exception ex){
            // 处理异常信息
            Logger.error(ex);
            ExceptionUtils.wrapException(ex);
        }
        return null;
    }



    protected Class<T> getVOClass() {
        return (Class) ReflectUtil.getActualTypeArgument(getClass());
    }


}
