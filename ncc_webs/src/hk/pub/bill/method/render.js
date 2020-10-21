import React from 'react';

class BillRender{

    /**
     * 搜索区域
     * @param props
     * @param area
     * @param config
     * @returns {*}
     */
    renderSearch(props,area,config){
        const { search} = props;
        const {NCCreateSearch} = search;
        return <div className="nc-bill-search-area">
            {NCCreateSearch(area,config)}
        </div>
    }


    /**
     * 按钮区域
     * @param props
     * @param config
     * @returns {*}
     */
    renderButton(props,config){
        const {button}=props;
        const {createButtonApp}=button;
        return  <div className="header-button-area">
            {createButtonApp(config)}
        </div>
    }

    /**
     * 列表表格区域
     * @param props
     * @param area
     * @param config
     * @returns {*}
     */
    renderTable(props,area,config){
        const {editTable } = props;
        const {createEditTable} = editTable;
        return  <div className="table-area">
            {createEditTable(area,config)}
        </div>
    }


    /**
     * 卡片主单区域
     * @param props
     * @param area
     * @param config
     * @returns {*}
     */
    renderCardForm(props,area,config){
        let { form } = props;
        let { createForm } = form;
        return  <div className="nc-bill-form-area">
            {createForm(area, config)}
        </div>
    }

    /**
     * 卡片子表表格区域
     * @param props
     * @param area
     * @param config
     * @returns {*}
     */
    renderCardTable(props,area,config){
        let { cardTable } = props;
        let { createCardTable } = cardTable;
        return  <div className="table-area">
            {createCardTable(area,config)}
        </div>
    }

}

export default BillRender
