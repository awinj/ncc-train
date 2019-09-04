import React from 'react';

import { createPage, base, ajax, toast, NCScrollElement,cardCache } from 'nc-lightapp-front';
import BaseListPage from './listpage'
const { NCAffix } = base
import {initTemplate} from "./event/initTemlate";
import {listDidMount,handleDoubleClick,pageInfoClick} from "./event/listOperator"
import {searchBtnClick,buttonClick} from "./event/buttonClick"
import {configExt} from "../../constant";


//
class List extends React.Component{
    render() {
        return <BaseListPage {...this.props} configExt={configExt}  />
    }
}

export default createPage({})(List) ;