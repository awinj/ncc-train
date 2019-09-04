// import React from 'react';
//
//
// import { createPage } from 'nc-lightapp-front';
//
//
// import './index.less';
// import Card from '../components/card';
// import List from '../components/list';
//
// //
// // const config = {
// //     appcode: '60080010',
// //     pagecode: '60080010p',
// //     node_type: '0'
// // }
//
// class Homepage extends React.Component {
//
//
//     constructor(props) {
//         super(props);
//         // this.config = config;
//         props.createUIDom(this.config, data => {
//             this.props.meta.setMeta(data && data.template ? data.template : {});
//             this.props.button.setButtons(data && data.button ? data.button : {});
//         })
//         this.state = {
//             display: "card"
//         }
//     }
//
//     componentWillMount() {
//
//         let display = this.props.getUrlParam('display');
//         let status=display=="card";
//         this.setIsCard(status);
//     }
//
//     setIsCard = (iscard)=>{
//         this.setState(
//             {iscard:iscard}
//         )
//     }
//
//
//
//     render() {
//
//         let iscard = this.state.iscard;
//         return <div>
//             {
//                 iscard ? <Card  {...this.props} showList={()=>this.setIsCard(false)}></Card>:
//             <List {...this.props} showCard={()=>this.setIsCard(true)}></List>
//             }
//         </div>
//     }
//
// }
//
//
// export default createPage()(Homepage)