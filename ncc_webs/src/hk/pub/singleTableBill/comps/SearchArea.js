import React from 'react'

class SearchArea extends React.Component{

    constructor(props){
        super(props)
    }





    render() {
        let {search,area,dataSource}=this.props;
        let {NCCreateSearch}=search;
        return <div className="nc-bill-search-area">
            {NCCreateSearch(area, {
                dataSource: dataSource,
                clickSearchBtn: this.clickSearchBtn.bind(this)
            })}
        </div>
    }

}