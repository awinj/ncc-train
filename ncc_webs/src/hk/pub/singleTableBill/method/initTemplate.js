

function initTemplate(props, {pagecode,appcode}, json)  {
    props.createUIDom({
            pagecode,       //页面code
            appcode
        }, (data) => {
            if (data) {
                if (data.button) {
                    //将请求回来的按钮组数据设置到页面的 buttons 属性上
                    let button = data.button;
                    props.button.setButtons(button);
                }
                if (data.template) {
                    let meta = data.template;
                    props.meta.setMeta(meta);
                }
            }
        }
    );
}

export {initTemplate}