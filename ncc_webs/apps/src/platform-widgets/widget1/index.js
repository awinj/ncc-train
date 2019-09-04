import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './style.css';
// 引入 ECharts 模块
import echarts from 'echarts';

export default class Test2 extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('test2'));
		// 绘制图表
		myChart.setOption({
			title: {
				text: '小部件2',
				left: 'center'
			},
			tooltip: {},
			xAxis: {
				data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
			},
			yAxis: {},
			series: [{
				name: '销量',
				type: 'bar',
				data: [5, 20, 36, 10, 10, 20]
			}]
		});
	}

	render() {
	return (<div id="test2" ></div>);
	}
}

ReactDOM.render(<Test2 />, document.querySelector('#module1_component1_widget1'));