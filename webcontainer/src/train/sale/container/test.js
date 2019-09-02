import React from 'react';

import {render, HrContainer} from 'src/hrpub/common/frame/index';

import MainAction from '../actions/main';

import {createPage, base, ajax, toast} from 'nc-lightapp-front';
const {NCAffix} = base

import Header from '../components/Header';
import NCBackBtn from "src/hrpub/common/components/hr-back/index"
import './index.less';

import Card from './Card'


class Test extends React.Component{

    constructor(props){
        super(props);
        this.config = props.config
        props.createUIDom(this.config, data => {
            this.props.meta.setMeta(data && data.template ? data.template : {});
            this.props.button.setButtons(data && data.button ? data.button : {});
		}),
		this.state={
			iscard:true
		}
	}
	
	onButtonClick=(props, key, text, record, index)=>{
		let iscard=this.state.iscard;
		this.setState({
			iscard:!iscard
		})
	}

    render(){
       
        const { button, editTable, form, cardPagination } = this.props;
        let { createEditTable } = editTable;
        const { createCardPagination } = cardPagination;
        const { createButtonApp } = button;
        const { taxColumns, taxData } = this.state;
        let { createForm, setFormStatus } = form;
        return (
            <div>
                <div className="header">
                    <div className="Taxrate_header_button">
                        <div style={{ overflow: "hidden" }}>

                           
                            <div className="fr">
                                <span style={{ display: !this.state.iscard ? "" : "none" }}>
                                    {createButtonApp({
                                        area: 'list_card', 
                                        // onButtonClick: (props, btncode) => {
                                        //     this.onButtonClick(props, btncode, this);
                                        // },
                                    })}
                                </span>
                                <div className="ib" style={{ display: this.state.iscard ? "none" : "" }}>
                                    {createButtonApp({
                                        area: 'card_list', 
                                        // onButtonClick: (props, btncode) => {
                                        //     this.onButtonClick(props, btncode, this);
                                        // },
                                    })}
                                </div>
                                <div className="ib">
                                    {createButtonApp({
                                        area: 'list_head', 
                                        // onButtonClick: (props, btncode) => {
                                        //     this.onButtonClick(props, btncode, this);
                                        // },
                                    })}
                                </div>
                                <div className="fr" style={{ display: this.state.iscard && this.state.showCard ? "" : "none" }}>
                                    {createCardPagination({
                                        // handlePageInfoChange: this.pageInfoClick.bind(this)
                                    })}
                                </div>
                            </div>
                            <div className="fl back_btn">
                                <NCBackBtn
                                    style={{ display: this.state.iscard ? "" : "none" }}
                                    // onClick={this.handleClick.bind(this)}
                                >
                                </NCBackBtn>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-wrapper" style={{ display: this.state.iscard ? "" : "none" }}>
                    {
                        createForm("billhead", {
                            setVisibleByForm: true,
                            // onAfterEvent: this.taxrateOnAfterEvent.bind(this),
                            // expandArr: ["fixtax", "test"]
                        })
                    }
                </div>
                <div className="ta-content clearfix">
                    <div style={{ display: this.state.iscard ? "" : "none" }}>
                        {
                            createEditTable("billhead", {
                                // showCheck: this.state.showOrgDetailPFBtn,
                                // height: this.state.pageHeight,
                                // onRowClick: this.orgmanagerRowClick.bind(this),
                                // onRowDoubleClick: this.listRowDoubleClick.bind(this),
                                showIndex: true
                            })
                        }
                    </div>
                    <div className="fr editTableBtn">
                        {createButtonApp({
                            area: 'card_head',
                            //  onButtonClick: (props, btncode) => {
                            //     this.onButtonClick(props, btncode, this);
                            // },
                        })}
                    </div>
                    <div style={{ display: this.state.iscard  ? "" : "none" }}>
                        {
                            createEditTable("billtable", {
                                // showCheck: this.state.showOrgDetailPFBtn,
                                // onRowClick: this.orgmanagerRowClickCard.bind(this),
                                showIndex: true,
                                // onAfterEvent: this.tableEditAfterEvent.bind(this)
                            })
                        }
                    </div>

                </div>
            </div>

        )
    }
    
}



export default createPage({
    
 })(Test);
 