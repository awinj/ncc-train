import { asyncComponent } from 'nc-lightapp-front';
import List from '../components/list';
import Card from '../components/card';

/**
* @description: 页面路由
* 保留注释 webpackChunkName:项目名/模块名/组件名/...
*/
// const card = asyncComponent(() =>
// 	import( '../components/card')
// );



const routes = [
	{
		path: '/',
		component: List,
		exact: true
	},
	{
		path: '/list',
		component: List
	},
	{
		path: '/card',
		component: Card
	}
];

export default routes;
