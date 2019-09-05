import React, { Component } from 'react';
import {base,ajax } from 'nc-lightapp-front';

/**
 * author zhenmx
 * 客户向导批改，向导分配 查询区组件
 *
 */
class AssignFilter extends Component {
    constructor(props) {
        super(props);
    }
    clickSearchBtn=()=>{}
    render() {
        const{search} = this.props.pageprops;
        const {NCCreateSearch} = search;
        return (
            <div>
                <div className="nc-singleTable-search-area nc-singleTable-search-area-assign-self-style"> {
                    NCCreateSearch(this.props.modalSerchId, {
                        clickSearchBtn:this.clickSearchBtn.bind(this),
                        oid:this.props.pageprops.meta.getMeta()[this.props.modalSerchId].oid,
                        onlyShowAdvArea:true,
                        showAdvBtn:true,
                        hideBtnArea:true
                })}
                </div>
            </div>
        )
    }
}
export default AssignFilter;