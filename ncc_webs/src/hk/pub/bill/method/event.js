import {CARD} from "../../../../hrhi/hrhi/60080010/constant";

class BillEvent {

    register(bill){
        //不要修改bill的值
        this.bill=bill;
    }

    /**
     * 按钮点击事件
     * @param props
     * @param key
     */
    onButtonClick(props, key) {
        const isCard = this.bill.isCard();
        if (isCard) {
            this.onCardButtonClick(props, key);
        } else {
            this.onListButtonClick(props, key);
        }
    }

    /**
     * 表体按钮事件
     * @param props
     * @param area 区域
     * @param key 按钮编码
     * @param record 行数据
     * @param index 行号
     */
    onBodyButtonClick(props, area, key,record, index) {
        const appConfig = this.bill.appConfig;
        const {cardTable}=props;
        if (appConfig.cardButton.addRow === key) {
            cardTable.addRow(area);
        }else if(appConfig.cardButton.insertRow === key){
            cardTable.addRow(area,index);
        }else if(appConfig.cardButton.delRow===key){
            cardTable.delRowsByIndex(area,index);
        }else if(appConfig.cardButton.expand===key){
            cardTable.openTabModel(area, 'edit', record, index);
        }else if(appConfig.cardButton.fold===key||appConfig.cardButton.unfold===key){
            cardTable.toggleTabRowView(area, record);
        }
    }

    /**
     * 表体选中行
     * @param props
     * @param area 区域
     * @param record 选中数据
     * @param index 选中行号
     * @param checked 选中值
     */
    onBodySelected(props,area,record,index,checked){
        const appConfig = this.bill.appConfig;
        let checkedRows = props.cardTable.getCheckedRows(area);
        props.button.setButtonDisabled(appConfig.cardButton.delRows, !(checkedRows.length > 0));
    }

    /**
     *
     * @param props
     * @param area 区域
     * @param checked 选中值
     * @param length 总行数
     */
    onBodySelectedAll(props,area,checked,length){
        const appConfig = this.bill.appConfig;
        props.button.setButtonDisabled(appConfig.cardButton.delRows, !checked);
    }

    /**
     * 卡片按钮事件
     * @param props
     * @param key
     */
    onCardButtonClick(props, key) {
        const appConfig = this.bill.appConfig;
        if (appConfig.cardButton.add === key) {
            this.toCard( {isEdit: true, selectPk: ''})
        }else if(appConfig.cardButton.cancel===key){
            this.toCard({isEdit: false})
        }
        else if ('back' === key) {
            this.toList()
        }
    }

    /**
     * 列表分页处理
     * @param props
     * @param config
     * @param pks
     */
    handleListPageChange(props,config,pks){

    }

    /**
     *
     * @param record 行数据
     * @param index 当前index
     * @param props
     * @param e 事件对象
     */
    onListRowDoubleClick(record,index,props,e){

    }

    editTableStatusChange(){

    }

    /**
     * 表单编辑后事件
     * @param props
     * @param area 区域
     * @param key 字段编码
     * @param value 值
     * @param oldValue old值
     */
    onAfterEvent(props, area, key, value,oldValue){

    }

    /**
     *
     * @param props
     * @param area 区域
     * @param key 字段编码
     * @param value 值
     * @param changedRows 新旧值集合
     * @param index 当前index
     * @param record 行数据
     * @param type 表格内为line，弹窗为modal
     * @param method 有blur有change
     */
    onBodyAfterEvent(props,area,key,value,changedRows,index,record,type,method){

    }

    /**
     * 列表按钮事件
     * @param props
     * @param key
     */
    onListButtonClick(props, key) {
        const appConfig = this.bill.appConfig;
        if (appConfig.listButton.add === key) {
            this.toCard( {isEdit: true})
        }
    }

    /**
     * 查询事件
     * @param props
     * @param queryInfo
     */
    searchClick(props, queryInfo) {

    }

    /**
     * 按钮显示控制
     * @param props
     * @param btn
     */
    buttonControlByStatus(props, btn) {

    }

    /**
     * 切换到列表界面
     */
    toList() {
        this.bill.setState(
            {
                selectPk: '',
                isEdit: false,
                showMode: 'list'
            }, this.bill.buttonVisibleRefresh
        )
    }

    /**
     * 切换到卡片
     * @param selectPk
     * @param isEdit
     */
    toCard({selectPk, isEdit = false}) {
        const appConfig = this.bill.appConfig;
        const {form, cardTable} = this.bill.props
        const {setFormStatus, EmptyAllFormValue} = form;
        const {setTableData} = cardTable;

        setFormStatus(appConfig.cardArea.head, isEdit?'edit':'browse');
        cardTable.setStatus(appConfig.cardArea.body,isEdit?'edit':'browse');
        if(selectPk){
            //TODO 根据pk重新查询数据，如果存了缓存则取缓存的数据
        }else{
            //清空表单数据
            EmptyAllFormValue(appConfig.cardArea.head);
            // setTableData(appConfig.cardArea.body, {rows: []})
        }
        this.bill.setState(
            {
                selectPk,
                isEdit,
                showMode: 'form'
            }, this.bill.buttonVisibleRefresh
        )
    }


    /**
     * 初始化模板
     * @param props
     * @param pageCode
     * @param appCode
     * @param json 多语
     * @param callback 回调函数
     */
    initTemplate(props, {pageCode, appCode}, json, callback) {
        //this 指向的应该是 BillEvent
        let _this=this;
        props.createUIDom({
                pagecode:pageCode,       //页面code
                appcode:appCode
            }, (data) => {
                if (data) {
                    if (data.button) {
                        //将请求回来的按钮组数据设置到页面的 buttons 属性上
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    if (data.template) {
                        let meta = data.template;
                        for (let area of Object.keys(meta.gridrelation)) {
                            meta[area].items.push({
                                attrcode: 'opr',
                                label: '操作',/* 国际化处理： 操作*/
                                itemtype: 'customer',
                                fixed: 'right',
                                className: 'table-opr',
                                visible: true,
                                width: 150,
                                render: (text, record, index) => {
                                    const isEdit = this.bill.state.isEdit;
                                    const {cardButton, cardArea} = this.bill.appConfig;
                                    let buttonAry = [];
                                    if (!isEdit) { //浏览态
                                        buttonAry = [record.expandRowStatus ? cardButton.fold : cardButton.unfold];
                                    } else { //编辑态
                                        buttonAry = [cardButton.expand, cardButton.insertRow, cardButton.delRow];
                                    }
                                    return props.button.createOprationButton(buttonAry, {
                                        area: cardArea.lineBtn,
                                        onButtonClick:(props, key)=>_this.onBodyButtonClick(props, area, key,record, index)
                                    });
                                }
                            })
                        }
                        props.meta.setMeta(meta, callback);
                    }
                }
            }
        );
    }

}

export default BillEvent
