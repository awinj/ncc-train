//   pagecode:props.config.pageCode?props.config.pageCode:pagecode
//  getMultiLang({moduleId: "10140ADRB",domainName: 'uapbd',callback})


import { toast} from 'nc-lightapp-front';
export default function(props){
     return ( pageCfg = {} , langCfg = {}, callback ) => {

         var count = 0;
         var result = {};

         var hander = () => {
             if(count == 2){
                 callback && callback(result.templateData || {} , result.langData || {},result.inlt||{});
             }
         }
         if(langCfg.callback){
             console.log('咱们自己createUIDom会同时获取多语和单据模板,并通过一个回调函数返回, langCfg中的回调函数将被忽略');
         }

         var newLangCfg = { ...langCfg, callback: (data, success,inlt) => {
                    count = count + 1;
                 if(!success){
                     toast({content:'load muti lang error',color:'warning'});
                 }
                 result.langData = data || {};
                 result.inlt = inlt || {};
                 hander();
         }};
         props.MultiInit.getMultiLang(newLangCfg);

         props.createUIDom(pageCfg, (data) => {
             count = count + 1;
             result.templateData = data || {};
             hander();
         });
    };
};