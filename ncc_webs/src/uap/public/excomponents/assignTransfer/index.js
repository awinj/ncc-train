import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import './index.less';
const { NCModal, NCTransfer, NCMenu, NCCheckbox, NCButton, NCTextArea} = base;
const SubMenu = NCMenu.NCSubMenu;

export default class AssignTransfer extends Component {
    constructor(props){
        super(props);
        // console.log('data', props.data);
        this.menuData=[];
        this.initTransferData=[];
        this.mapTransfer = {};
        this.usersResult = {};
        this.defaultSelectedKeys;
        this.falseMap = {};
        this.prepareData(props.data.content);
        this.isMultiSelect = this.props.data.muplityWithOutAssgin;
        let _this = this;
        this.state = {
            showModal: this.props.display,
            source: this.initTransferData,
            currentMenu: this.defaultSelectedKeys,
            target: [],
            textValue: '',
            mapCheck: (function(obj){
                Object.keys(_this.mapTransfer).map((item, index) => {
                    obj[item] = props.data.content[index].isChoice || false;
                });
                return obj;
            })({})
        };
        this.handleTransferChange = this.handleTransferChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    prepareData(data){
        let _this = this;
        data.forEach((element, index)=> {
            _this.falseMap[element.selectpath] = false;
            _this.menuData[_this.menuData.length] = {name: element.desc, id: element.selectpath};
            if(element.isAssgin){
                _this.mapTransfer[element.selectpath] = element.assginUsers.map(item => {
                    return {title: item.name, code: item.code, key: element.selectpath + "_" + item.pk};
                });
            }else{
                _this.mapTransfer[element.selectpath] = [];
            }
        });
        let firstKey = Object.keys(_this.mapTransfer)[0];
        _this.initTransferData = _this.mapTransfer[firstKey];
        _this.defaultSelectedKeys = firstKey;
    }

    componentWillReceiveProps(nextProps){
        // console.log('nextProps',nextProps.data)
        this.menuData=[];
        this.initTransferData=[];
        this.mapTransfer = {};
        this.usersResult = {};
        this.falseMap = {};
        this.isMultiSelect = nextProps.data.muplityWithOutAssgin;
        this.prepareData(nextProps.data.content);
        let _this = this;
        this.state = {
            showModal: nextProps.display,
            source: this.initTransferData,
            currentMenu: this.defaultSelectedKeys,
            target: [],
            mapCheck: (function(obj){
                Object.keys(_this.mapTransfer).map((item, index) => {
                    obj[item] = nextProps.data.content[index].isChoice||false;
                });
                return obj;
            })({})
        };
    }

    handleCheckboxChange(id){
        // console.log('id',id);
        let changeObj = {}
        changeObj[id] = !this.state.mapCheck[id];
        this.setState({
            mapCheck: this.isMultiSelect ? Object.assign({},this.state.mapCheck,changeObj) : Object.assign({}, this.falseMap, changeObj)
        });
    }

    handleTransferChange(targetKeys, direction, moveKeys){
        // console.log('transferChange,direction,moveKeys', targetKeys, direction, moveKeys);
        if(!this.usersResult[this.state.currentMenu]) this.usersResult[this.state.currentMenu] = [];
        if(direction == 'right'){
            moveKeys.forEach(item => {
                if(item.indexOf(this.state.currentMenu) > -1){
                    this.usersResult[this.state.currentMenu].push(item);
                }
            });
        }else if(direction == 'left'){
            moveKeys.forEach(item => {
                if(item.indexOf(this.state.currentMenu) > -1){
                    let index = this.usersResult[this.state.currentMenu].indexOf(item);
                    this.usersResult[this.state.currentMenu].splice(index,1) ;
                }
            }); 
        }
        // console.log('usersResult', this.usersResult);
        this.setState({
            target: targetKeys
        });
        
    }

    handleMenuClick(e){
        // console.log('menu-click',e);
        this.setState({
            currentMenu: e.key,
            source: this.mapTransfer[e.key]
        });
    }

    confirm(){
        this.props.data.content.forEach(processItem => {
            processItem.isChoice = this.state.mapCheck[processItem.selectpath];
            if(processItem.isAssgin){
                if(!this.usersResult[processItem.selectpath]){
                    processItem.assginUsers = [];
                }
                processItem.assginUsers = processItem.assginUsers.filter(item => {
                    return this.usersResult[processItem.selectpath].includes(processItem.selectpath +'_'+item.pk);
                });
            }
        });
        // console.log(this.props.data);
        this.props.getResult(this.props.data, this.state.textValue);
    }

    cancel(){
        this.props.cancel();
    }

    render(){
        let _this = this;
        let menuItemList = this.menuData.map(item => {
            return <NCMenu.Item key={item.id}><NCCheckbox colors="info" checked={this.state.mapCheck[item.id]}  onChange={_this.handleCheckboxChange.bind(_this, item.id)}/>{item.name}</NCMenu.Item>
        });

        return (
            <div>
                <NCModal show={this.state.showModal} size="lg">
                    <NCModal.Header>
                        <NCModal.Title>{this.props.title}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div className="wrap">
                            { this.menuData.length != 1 ? <div className="menuBox">
                                <div className="menuContent">
                                    <NCMenu mode="inline" selectedKeys={[this.state.currentMenu]} defaultOpenKeys={['sub1']} onClick={this.handleMenuClick}  style={{width: 150}}>
                                        <SubMenu key="sub1" title={<span><span>选择流程</span></span>}>
                                            {menuItemList}
                                        </SubMenu>
                                    </NCMenu>
                                </div>
                            </div> : ''}
                            <div style={{float: 'left'}}>
                                <NCTransfer 
                                titles={['用户','已选']} 
                                dataSource={this.state.source} 
                                targetKeys={this.state.target} 
                                listStyle={{height: 330,width: 200}} 
                                onChange={this.handleTransferChange} 
                                render={item => item.title} 
                                lazy={{ container: "modal" }}
                                />
                                { !this.props.hideNote ? <NCTextArea value={this.state.textValue} onChange={val=>{this.setState({textValue: val});}} className='textArea'/> : ''}
                            </div>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={this.cancel}  style={{marginRight: 50}}>取消</NCButton>
                        <NCButton onClick={this.confirm} colors="primary">确定</NCButton>
                    </NCModal.Footer>
                </NCModal>
            </div>
        );
    }
}