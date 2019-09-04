import React from 'react';
import { createPage } from 'nc-lightapp-front';
import BaseCardPage from 'src/hk/pub/bill/components/card/cardpage'

import {configExt} from "../../constant/"


class CardPage extends BaseCardPage{

    constructor(props){
        super(props);
    }

    onButtonClick (props, id, hotkey)  {
        super.onButtonClick(props,id,hotkey)
    }

    render() {
        return super.render();
    }
}

class Card extends React.Component{
    render() {
        return <CardPage  {...this.props} configExt={configExt} />
    }
}

export default createPage({})(Card)