/**
 * 日期处理工具类
 * @author  yinshb
 */
import moment from 'moment';

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

export default {
    /**
     * 获取当前日期
     * @param format    日期格式
     */
    getCurrentDate : function(format){
        return moment().format(format);
    },
    /**
     * 是否闰年
     * @param date    日期
     * @param format    日期的格式 
     * zouj
     */
    isLeapYear : function(date, format){
        return moment(date, format).isLeapYear();
    },
    /**
     * 本月最后一天
     * @param date    日期
     * @param format    日期的格式 
     * zouj
     */
    endOfMonth : function(date, format){
        return moment(date, format).endOf('month').format(format);
    },
    /**
     * 日期格式转换
     * @param date  需要转换的日期
     * @param old_format    原来日期格式
     * @param new_format    目标日期格式
     */
    convertFormat : function(date,old_format,new_format){
        return moment(date,old_format).format(new_format);
    },
    /**
     * 得到某个日期后几天是哪天
     * @param date  传入的日期
     * @param number    几天后
     * @param format    日期的格式
     */
    getAfterDay : function(date, number, format){
        let newDate = moment(date,format).add(number, 'days').format(format);
        // 相同说明跨年
        if (date == newDate) {
            let year = this.getDateFactor(date, format).getYear() + 1;
            newDate = this.setDateFactor(year + '-01-01', format);
        }
        return newDate;
    },

    /**
     * 得到某个日期前几天是哪天
     * @param date  传入的日期
     * @param number    几天前
     * @param format    日期格式
     */
    getBeforeDay : function(date,number,format){
        let newDate = moment(date,format).subtract(number, 'days').format(format);
        return newDate;
    },
    /**
     * isBefore方法，date1早于date2,则返回true
     * @param date1 第一个日期
     * @param date2 第二个日期
     * @param format    日期格式
     * @param param 比较参数，不传则日期全比较，y：只比较到年，m：比较到月,d:比较到日
     */
    isBefore : function(date1,date2,format,param){
        if(param){
            return moment(date1,format).isBefore(date2,param);
        }else{
            return moment(date1,format).isBefore(date2);
        }
    },
    /**
     * isAfter方法，date1晚于date2，则返回true
     * @param date1 第一个日期
     * @param date2 第二个日期
     * @param format    日期格式
     * @param param 比较参数，不传则日期全比较，y：只比较到年，m：比较到月,d:比较到日
     */
    isAfter : function(date1,date2,format,param){
        if(param){
            return moment(date1,format).isAfter(date2,param);
        }else{
            return moment(date1,format).isAfter(date2);
        }
    },
    /**
     * 比较两个日期是否相同
     * @param date1 第一个日期
     * @param date2 第二个日期
     * @param format    日期格式
     * @param param 比较参数，不传则日期全比较，y：只比较到年，m：比较到月,d:比较到日
     */
    isSame : function(date1,date2,format,param){
        if(param){
            return moment(date1,format).isSame(date2,param);
        }else{
            return moment(date1,format).isSame(date2);
        }
    },
    /**
     * 时间区间比较，如果date在first between second区间，则返回true
     * @param date  传入的时间
     * @param first 区间开始时间
     * @param second    区间结束时间
     * @param format    日期格式
     * @param param 比较参数，不传则日期全比较，y：只比较到年，m：比较到月,d:比较到日
     */
    isBetween : function(date,first,second,format,param){
        if(param){
            return moment(date,format).isBetween(first,second,param);
        }else{
            return moment(date,format).isBetween(first,second);
        }
    },
    /**
     * 获取日期中的年月日时分秒等信息
     * @param date  传入的日期
     * @param format    日期 格式
     */
    getDateFactor : function(date,format){
        const momentDate = moment(date,format);
        momentDate.local();
        return {
            /**
             * 获取年份
             */
            getYear : ()=> {
                return momentDate.year();
            },
            /**
             * 获取月份
             */
            getMonth : () => {
                return momentDate.month()+1;
            },
            /**
             * 获取天
             */
            getDate : () => {
                return momentDate.date();
            },
            /**
             * 小时
             */
            getHour : () => {
                return momentDate.hour();
            },
            /**
             * 分
             */
            getMinute : () => {
                return momentDate.minute();
            },
            /**
             * 秒
             */
            getSecond : () => {
                return momentDate.second();
            },
            /**
             * 星期几
             * 获取的为数组角标，0代表星期日
             */
            getDay : () => {
                return momentDate.day();
            },
            /**
             * 当前月有多少天
             * zouj
             */
            getDaysInMonth : () => {
                return momentDate.daysInMonth();
            }
        }
    },
    /**
     * 设置日期中的年月日时分秒信息
     */
    setDateFactor : function(date,format){
        const momentDate = moment(date,format);
        momentDate.local();
        return {
            /**
             * 年
             */
            setYear : (year) => {
                momentDate.year(year);
                return this.setDateFactor(momentDate.format(),format);
            },
            /**
             * 月
             */
            setMonth : (month) => {
                if (typeof month === 'string') {
                    if (/^\d+$/.test(month)) {
                        month = toInt(month);
                    } else {
                        console.log('月份传入错误');
                    }
                }
                momentDate.month(month-1);
                return this.setDateFactor(momentDate.format(),format);
            },
            /**
             * 日
             */
            setDate : (d) => {
                momentDate.date(d);
                return this.setDateFactor(momentDate.format(),format);
            },
            /**
             * 时
             */
            setHour : (hour) => {
                momentDate.hour(hour);
                return this.setDateFactor(momentDate.format(),format);
            },
            /**
             * 分
             */
            setMinute : (minute) => {
                momentDate.minute(minute);
                return this.setDateFactor(momentDate.format(),format);
            },
            /**
             * 秒
             */
            setSecond : (second) => {
                momentDate.second(second);
                return this.setDateFactor(momentDate.format(),format);
            },
            /**
             * 格式化
             */
            format : () => {
                return momentDate.format(format);
            }
        }
    }

}