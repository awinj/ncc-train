// import React from 'react';
// import { base,createPage } from 'nc-lightapp-front';
// import {configExt} from '../../constant'
// import {CardPage} from './cardpage'
// import {initTemplate} from "./event/initTemlate";
// import {pageClick,cardCreate,getCardData} from "./event/cardOperator"
// import {buttonClick,bodyButtonClick} from "./event/buttonClick"
// import {afterEvent} from "./event/afterEvent"
// /**
// * @description: 卡片
// */
// const { NCAffix } = base;
//
//
//
// class Card extends React.Component{
//     render() {
//         return <CardPage {...this.props} configExt={configExt}  />
//     }
// }
//
//
// export default createPage({
//     billinfo: {
//         billtype: 'card',
//         pagecode: configExt.PageConfig.CardPage,
//         headcode: configExt.CardArea.head,
//         bodycode: configExt.CardArea.body[0]
//     }
// })(Card) ;