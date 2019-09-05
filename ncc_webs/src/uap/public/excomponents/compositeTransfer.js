import React, { Component } from 'react';
import { base, toast } from 'nc-lightapp-front';
const { NCModal, NCTransfer, NCSelect, NCButton } = base;
const Option = NCSelect.Option;
// import Utils from '../../../utils';

export default class CompositeTransfer extends Component {
    constructor(props) {
        super(props);
        let data = this.props.data.content ? this.props.data.content : [];
        console.log('data', data)
        let selectDataSource = [];
        let sourceKeys = [];
        let targetKeys = [];
        this.mapSource = {};
        this.result = {};
        data.forEach((item, index) => {
            selectDataSource[selectDataSource.length] = { key: item.desc, value: item.activitydefid };
            this.mapSource[item.activitydefid] = item.uservos.map(el => {
                return { key: item.activitydefid + "_" + el.userpk, title: el.username };
            });
        });
        // console.log('mapSource', this.mapSource);
        sourceKeys = this.mapSource[selectDataSource[0].value];
        console.log('sourceKeys', sourceKeys)
        this.state = {
            showModal: this.props.display,
            selectDataSource: selectDataSource,
            source: sourceKeys,
            target: targetKeys,
            currenttab: selectDataSource.length > 0 ? selectDataSource[0].value : ''
        };
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleTransferChange = this.handleTransferChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let data = nextProps.data.content ? nextProps.data.content : [];
        console.log('data_async', data);
        let selectDataSource = [];
        let sourceKeys = [];
        let targetKeys = [];
        this.mapSource = {};
        this.result = {};
        data.forEach((item, index) => {
            selectDataSource[selectDataSource.length] = { key: item.desc, value: item.activitydefid };
            this.mapSource[item.activitydefid] = item.uservos.map(el => {
                return { key: item.activitydefid + "_" + el.userpk, title: el.username };
            });
        });
        // console.log('mapSource', this.mapSource);
        sourceKeys = this.mapSource[selectDataSource[0].value];
        console.log('sourceKeys_async', sourceKeys)
        this.state = {
            showModal: nextProps.display,
            selectDataSource: selectDataSource,
            source: sourceKeys,
            target: targetKeys,
            currenttab: selectDataSource.length > 0 ? selectDataSource[0].value : ''
        };
    }
    confirm() {
        console.log('confirm', this.result);
        if(this.state.target.length == 0){
            toast({content:'没有为活动指派参与者!'});
            return;
        }
        this.props.data.content.forEach(idItem => {
            if (!this.result[idItem.activitydefid]) {
                idItem.uservos = [];
            }
            idItem.uservos = idItem.uservos.filter(item => {
                return this.result[idItem.activitydefid].includes(idItem.activitydefid + "_" + item.userpk);
            });
        });
        this.props.getResult(this.props.data);
        //    this.setState({
        //        showModal: false
        //    });
    }
    cancel() {
        console.log('cancel');
        this.props.cancel();
        //    this.setState({
        //        showModal: false
        //    });
    }
    handleSelectChange(value) {
        console.log('change', value, this.mapSource);
        this.setState({
            source: this.mapSource[value],
            currenttab: value
        });
    }
    handleTransferChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys, this.state.source);
        if (!this.result[this.state.currenttab]) this.result[this.state.currenttab] = [];
        if (direction == 'right') {
            moveKeys.forEach(item => {
                if (item.indexOf(this.state.currenttab) > -1) {
                    this.result[this.state.currenttab].push(item);
                }
            });
        } else if (direction == 'left') {
            moveKeys.forEach(item => {
                if (item.indexOf(this.state.currenttab) > -1) {
                    let index = this.result[this.state.currenttab].indexOf(item);
                    this.result[this.state.currenttab].splice(index, 1);
                }
            });
        }
        this.setState({
            target: targetKeys
        });
    }
    render() {
        console.log('render_source', this.state.source)
        let selectDataSource = this.state.selectDataSource;
        let optionList = selectDataSource.map(item => {
            return <Option value={item.value}>{item.key}</Option>
        });
        let defaultSelect = selectDataSource.length > 0 ? selectDataSource[0].value : '';
        return (
            <div>
                <NCModal show={this.state.showModal} >
                    <NCModal.Header>
                        <NCModal.Title>{this.props.title}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div style={{margin: "0 auto", display: "table", width: "82%"}}>
                            <NCSelect style={{ width: "100%" }} defaultValue={defaultSelect} onChange={this.handleSelectChange}>
                                {optionList}
                            </NCSelect>
                        </div>
                        
                        <div style={{ margin: "0 auto", marginTop: "10px", display: "table" }}>
                            <NCTransfer
                                lazy={{ container: "modal" }}
                                listStyle={{
                                    width:200,
                                    height: 250,
                                }}
                                dataSource={this.state.source}
                                onChange={this.handleTransferChange}
                                targetKeys={this.state.target}
                                render={item => item.title} />
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={this.confirm} colors="primary">确定</NCButton>
                        <NCButton onClick={this.cancel} style={{ marginRight: 50 }}>取消</NCButton>
                    </NCModal.Footer>

                </NCModal>
            </div>
        );
    }
}