import {toast} from 'nc-lightapp-front';

export default function (){
    return (resultLength)=>{
        if (typeof(resultLength) === 'object') {
            if (resultLength && resultLength.length > 0) {
                toast({
                    color: 'success',
                    content: `查询成功，共` + resultLength.length + `条。`
                });
            } else {
                toast({
                    color: 'warning',
                    content: `未查询出符合条件的数据！`
                });
            }
        }
        if(typeof(resultLength) === 'undefined'){
            toast({
                color:'success',
                title:'刷新成功！'
            })
        }
    }
}