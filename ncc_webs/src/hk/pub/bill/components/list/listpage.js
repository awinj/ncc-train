import {initTemplate} from "./event/initTemlate";
import {handleDoubleClick, listDidMount, pageInfoClick} from "./event/listOperator";
import {buttonClick, searchBtnClick} from "./event/buttonClick";
import {SEARCHCACHE} from "../../../../../hrhi/hrhi/60080010/constant";


export  default class BaseListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            json:{}/* 多语数据 */
        }
    }

    componentWillMount() {
        initTemplate(this.props, {});
    }

    componentDidMount() {
        listDidMount(this.props);
    }

    handlePageInfoChange(props, config, pks) {
        pageInfoClick({ ...props,configExt:this.props.configExt, json: this.state.json }, config, pks);
    }

    onRowDoubleClick(record, index, props) {
        handleDoubleClick(record, index, { ...props,configExt:this.props.configExt, json: this.state.json });
    }

    clickSearchBtn  (props)  {
        searchBtnClick({ ...props,configExt:this.props.configExt, json: this.state.json });
    }

    // clickSearchBtn  (props) {
    //     searchBtnClick({ ...props,configExt:this.props.configExt, json: this.state.json });
    // }

    onButtonClick (props, id) {
        buttonClick({ ...props,configExt:this.props.configExt, json: this.state.json },id);
    }




    render() {
        const { button, search, editTable, form, cardTable, modal, cardPagination } = this.props;
        const { createButtonApp } = button;
        let { createEditTable } = editTable;
        let { createCardTable } = cardTable;
        let { NCCreateSearch } = search;
        let { createSimpleTable } = this.props.table;



        const {ListArea,SearchCache,PrimaryKey} = this.props.configExt;
        let param = {
            showFlag: true
        }
        return <div>

            <div className="nc-bill-list">
                <div className="nc-bill-header-area">
                    <div className="header-title-search-area">
                        {/* {createPageIcon()} */}
                        <h2 className="title-search-detail">{"title"}</h2>
                    </div>

                    <div className="header-button-area">
                        {this.props.button.createButtonApp({
                            area: ListArea.headBtn,
                            onButtonClick: this.onButtonClick.bind(this)
                        })}
                    </div>
                </div>

                <div className="nc-bill-search-area">
                    {NCCreateSearch(ListArea.query, {
                        dataSource: SearchCache.dataSource,
                        clickSearchBtn: this.clickSearchBtn.bind(this)
                    })}
                </div>

                <div className="table-area">
                    {createSimpleTable(ListArea.head, {
                        showCheck: true,
                        dataSource: SearchCache.dataSource,
                        pkname: PrimaryKey.head,
                        handlePageInfoChange: this.handlePageInfoChange.bind(this),
                        onRowDoubleClick: this.onRowDoubleClick.bind(this)
                    })}
                    {
                        console.log("wsw"+this.props.myTable)
                    }
                </div>
            </div>

        </div>
    }
}