import React from 'react';
import { createPage } from 'nc-lightapp-front'
import ListPage from 'src/hk/pub/bill/components/list'
import {configExt} from "../../constant/"


class List extends React.Component{

    render() {
        return <ListPage  {...this.props} configExt={configExt} />
    }
}


export default createPage({})(List)