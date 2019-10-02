import React from 'react';
import {createPage} from 'nc-lightapp-front'
import BaseListPage from 'src/hk/pub/bill/components/list/listpage'
import {configExt} from "../../constant/"


class ListPage extends BaseListPage {

    constructor(props) {
        super(props);
    }

    onButtonClick(props, id, hotkey) {
        super.onButtonClick(props, id, hotkey)
    }

    render() {
        return super.render();
    }
}
//
class List extends React.Component {
    render() {
        return <ListPage  {...this.props} configExt={configExt}/>
    }
}


export default createPage({
})(List)