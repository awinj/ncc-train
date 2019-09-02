
import React from 'react';

import ReactDom from 'react-dom';



import Test from '../container/test'

let config = {
    appcode: '60080010',
    pagecode: '60080010p',
    node_type: '0'
}


ReactDom.render(<Test config={config}/>, document.getElementById('app'));