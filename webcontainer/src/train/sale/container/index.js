import React from 'react';


import { createPage } from 'nc-lightapp-front';


import './index.less';
import Card from './Card';
import List from './List';

class Homepage extends React.Component {


    constructor(props) {
        super(props);
        this.config = props.config;
        props.createUIDom(this.config, data => {
            this.props.meta.setMeta(data && data.template ? data.template : {});
            this.props.button.setButtons(data && data.button ? data.button : {});
        })

        this.state = {
            iscard: false
        }
    }

    setIsCard=(iscard)=>{
        this.setState(
            {iscard:iscard}
        )
    }

    

    render() {
        let iscard = this.state.iscard;
        return <div>
            {
                iscard ? <Card  {...this.props} showList={()=>this.setIsCard(false)}></Card>:
            <List {...this.props} showCard={()=>this.setIsCard(true)}></List>
            }
        </div>
    }

}


export default createPage({})(Homepage)