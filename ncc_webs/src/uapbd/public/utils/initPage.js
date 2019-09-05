/*
**初始化应用页面（加载多语，初始化模板，加工模板数据，初始化节点数据）
*/
export default (function(props,pageCode,nodeResourceCode,modifierMeta,initData,_this){
    let callback=(json,status,inlt)=>{
        _this.setState({json:json});
        props.createUIDom(
            {
                pagecode: pageCode
            }, 
            function (data){
                if(data){
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    if(data.template){
                        let meta = data.template;
                        props.meta.setMeta(meta);//设置两次，用于回调使用
                        if(modifierMeta instanceof Function){
                            meta=modifierMeta(data);
                            if(meta){
                                props.meta.setMeta(meta);
                            }
                        }                       
                    }
                    if(initData instanceof Function){
                        initData();
                    }
                }   
            }
        )
    }
    props.MultiInit.getMultiLang({moduleId:nodeResourceCode,/*currentLocale:'zh-CN',*/domainName:'uapbd',callback});
}
)
