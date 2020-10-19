import React from 'react';

const renderSearch=(props,area,config)=>{
    const { search} = props;
    const {NCCreateSearch} = search;
    debugger
    return <div className="nc-bill-search-area">
        {NCCreateSearch(area,config)}
    </div>
}


const renderButton=(props,config)=>{
    const {button}=props;
    const {createButtonApp}=button;
    return  <div className="header-button-area">
        {createButtonApp(config)}
    </div>
}

const renderTable=(props,area,config)=>{
    const {editTable, } = props;
    const {createEditTable} = editTable;
    return  <div className="table-area">
        {createEditTable(area,config)}
    </div>
}


export {renderSearch,renderButton,renderTable}