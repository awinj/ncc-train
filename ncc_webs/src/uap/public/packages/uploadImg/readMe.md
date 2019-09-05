传入参数                  含义                               是否必填
imgModalShow          控制上传组件Modal显示与否                  Y
uploadAction          上传请求ajax地址(组件内有默认地址)          N
uploadTitle           Modal title文字显示                       N
uploadImgSrc          上传成功后回显的图片utl地址                 Y


action方法
onCloseModal          点击模态框触发事件(val)
                        val包含一个值,单个含义字段('ensure','del','close'),只需判断为del(删除上传图片)时清空   uploadImgSrc值，另外两种清空直接关闭模态框
uploadSuccess         图片上传成功回调函数(info)
                        包含返回img url,直接赋值给 uploadImgSrc即可                  







