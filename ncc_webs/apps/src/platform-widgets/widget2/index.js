import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './style.less';
import imgaaa  from './tmp2.png'
import axios from 'axios';
export default class Test233 extends Component {
	constructor(props) {
		super(props);
	};

	myClick(e){
		console.log(e);
		axios.get('/open/api/weather/json.shtml?city=%E5%8C%97%E4%BA%AC').then(function(response){
			alert(response);
		}).catch(function(error){
			alert(error);
		})
	}

	render() {
	return (<div id="test233"> 
	{/* ./../../platform-assets/tmp.jpg */}
	<div onClick={this.myClick.bind(this)}>1232123123123</div>
	<img src={imgaaa} alt=""/>
	</div>);
	}
}

ReactDOM.render(<Test233 />, document.querySelector('#module3_component3_widget2'));