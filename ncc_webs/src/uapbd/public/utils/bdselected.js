import {ajax} from 'nc-lightapp-front';

var emptyfn = function(){};

var BDSelected  = function(classid = 'classid'){
    var modeDatas = [],
        fns = [],
        init = false;
    ajax({
        url: '/nccloud/uapbd/common/BDModeSelectedServiceAction.do',
        data: {
            classid: classid
        },
        success:(res) => {
            init = true;
            modeDatas = res.data || [];
            fns.forEach( fn => {
                fn();
            });
        }
    });

    this.getModeByClassid = (classid, callback) => {
        if(init){
            callback(modeData.filter( m => {return m.classid == classid}));
        }else{
            var  fn = function(){
                return callback(modeDatas.filter( m => {return m.mdclassid == classid}));
            }
            fns.push(fn);
        }
    };
}; 
BDSelected.SCOPE_GLOBE = 1; //全局
BDSelected.SCOPE_GLOBE_GROUP = 2; //全局+集团
BDSelected.SCOPE_GLOBE_GROUP_ORG = 3; //全局+集团+组织
BDSelected.SCOPE_GLOBE_ORG = 4; //全局+组织
BDSelected.SCOPE_GROUP = 5; //集团
BDSelected.SCOPE_GROUP_ORG = 6; //集团+组织
BDSelected.SCOPE_ORG = 7;//组织

export default BDSelected
