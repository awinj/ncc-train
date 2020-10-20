

function onButtonClick(props,key) {
    let { cardTable } = props;
    let { createCardTable } = cardTable;
    cardTable.setStatus(this.appConfig.cardArea.body,'edit')
    cardTable.addRow(this.appConfig.cardArea.body)
}

function searchClick(props,queryInfo) {

}

function buttonVisibleByStatus(props,btn) {
    const {button}=props;
    const {setButtonVisible,getButtons}=button;
    if(this.isCard()){
        setButtonVisible({'add':false,'refresh':true})
    }else{
        setButtonVisible({'add':false,'refresh':true})
    }


}

export {onButtonClick,searchClick,buttonVisibleByStatus}