
import React from 'react';


import { RenderRouter } from 'nc-lightapp-front';
import routes from './router';






(function main(routers, htmlTagid) {
	RenderRouter(routers, htmlTagid);
})(routes, 'app');

function main(routers, htmlTagid) {
        RenderRouter(routers, htmlTagid);
}


main(routes, 'app');



// ReactDom.render(<HomePage />, document.getElementById('app'));