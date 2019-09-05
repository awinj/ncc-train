import React, {Component, Fragment} from 'react';
import { createPage, ajax, base,toast } from 'nc-lightapp-front';
const { NCButton, NCRow, NCCol, NCTree, NCPopconfirm, NCModal } = base;

class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {

    }

    render() {
        let {title='穿梭树'} = this.props;
        return (
            <Fragment>
                <NCModal
                    show = { this.state.showModal }
                    onHide = { this.close } >
                        <NCModal.Header>
                            <NCModal.Title>{title}</NCModal.Title>
                        </NCModal.Header>

                        <NCModal.Body>
                            
                        </NCModal.Body>

                        <NCModal.Footer>
                            <NCButton onClick={ this.close } colors="primary">确认</NCButton>
                            <NCButton onClick={ this.close } colors="primary">取消</NCButton>
                        </NCModal.Footer>
                </NCModal>
            </Fragment>
        )
    }
}

Transfer = createPage({
    // initTemplate: initTemplate,
})(Transfer);

export default Transfer;