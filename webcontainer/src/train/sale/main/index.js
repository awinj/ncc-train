
import React from 'react';

import ReactDom from 'react-dom';

import HomePage from '../container/index'



import Test from '../container/test'

let config = {
    appcode: '60080010',
    pagecode: '60080010p',
    node_type: '0'
}



ReactDom.render(<HomePage config={config}/>, document.getElementById('app'));