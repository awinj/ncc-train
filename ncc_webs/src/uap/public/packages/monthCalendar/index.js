import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { createPage, base, ajax, high } from 'nc-lightapp-front';

import './index.less';
import moment from 'moment';

const { NCButton, NCRow, NCCol, NCCheckbox } = base;

class MonthCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selctedArr: [],//this.props.selectedDay
            lastDay: false
        }
    }

    componentWillReceiveProps(newProps) {
        const selectedDay = newProps.selectedDay;
        if(selectedDay && selectedDay.length) {
            this.syncSetData(newProps)
        }
    }
     
    syncSetData(newProps) {
        this.setState({
            selctedArr: newProps.selectedDay, 
            lastDay: newProps.selectedDay.includes('0')
        }, () => {
           // console.log(this.state.selctedArr)
            this.render();
        })
        
    }

    selItem(val) {
        const selArr = this.state.selctedArr;
        debugger
        this.state.selctedArr.includes(val.toString()) ? selArr.splice(selArr.indexOf(val.toString()), 1): selArr.push(val.toString());
        this.setState({
            selctedArr: selArr
        }, () => {
            this.ensureInfo();
        })
    }

    choosePreDefineTime(value) {//选中预定义时间
        this.setState({
            lastDay: value
        })
        const selArr = this.state.selctedArr;
        value == true ? this.state.selctedArr.unshift('0') : this.state.selctedArr.shift();
        this.setState({
            selctedArr: selArr
        }, () => {
            this.ensureInfo();
        })
    }

    ensureInfo() {//确定保存当前日历信息
        console.log('select', this.state.selctedArr)
        this.props.onChange(this.state.selctedArr);
    }

    render() {
        let calendList = [];
        for(let i=1;i<=31;i++) {
            calendList.push(<NCCol key={i.toString(36)} md={2} className="calendar-list"
                onClick={this.selItem.bind(this, i)}><p className={this.state.selctedArr.includes(i.toString()) ? 'calendar-active' : ''}>{i}</p></NCCol>)
        }

        return (
            <div className="calendar-contain">
                <NCRow>
                    {calendList}
                </NCRow>
                <NCRow>
                    <NCCol md={6}>
                       {/* <NCButton onClick={this.choosePreDefineTime.bind(this,'now')}>今日</NCButton>  */}
                       {/* <NCButton onClick={this.choosePreDefineTime.bind(this,'last')}>最后一天</NCButton>  */}
                       <NCCheckbox checked={this.state.lastDay} onChange={this.choosePreDefineTime.bind(this)}>最后一天</NCCheckbox>
                    </NCCol>
                    <NCCol md={6}>
                        {/* <NCButton onClick={this.ensureInfo.bind(this)}>确定</NCButton>  */}
                    </NCCol>
                </NCRow>
            </div>
        )
    }
}

export default MonthCalendar = createPage({
	// initTemplate: initTemplate
})(MonthCalendar);

ReactDOM.render(<MonthCalendar  />, document.querySelector('#app'));


