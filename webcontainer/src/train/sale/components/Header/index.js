import {render} from 'src/hrpub/common/frame/index'
import heaerAction from '../../actions/header'

let handleConfig = {
    actions: {
        header: heaerAction
    }
}

let createDom = ({props, action, state, scope})=>{
    debugger
    return (
        <div>
            <button onClick={action.header.reverseName}>reverse name</button>
            {
                scope.name
            }
        </div>
    )
}

export default render(handleConfig)(createDom)