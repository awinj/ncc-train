import Utils   from '../../public/utils';
var EMPTY_FN = function(){};
var CompUtils = {
    dataPlatToTinper : (datas = [], handlerdata = EMPTY_FN) => {
        return datas.map( data => {
            var values = data.values,
                newValues = {};
            for (let [name, vals] of Object.entries(values)) {
                newValues[name] =   vals.value || vals.display || '';
                newValues[name+'_name'] =    vals.display || vals.value || '';
                handlerdata(newValues, name, newValues[name], vals);
            }
            return newValues;
        });
    },

    tempPlatToTinper : (items = []) =>{
        return items.map(item => {
            var label  =  item.label,
                dataIndex = item.attrcode,
                render = function(text, record){
                    return text[dataIndex] + '';
                },
            column =  {
                title: item.label,
                dataIndex: item.attrcode
               // render: render
            }
            return col;
        });
    },

    //innercode
    listDataToTreeDataByInnercode : (datas = []) => {
        var sortdatas = datas.sort( ( d1, d2) => {
            return  ('' + d1) > (''+ d2 );
        });

        var treedata = [],
            queue   = {
                array: [],
                porinter: -1,
                push:function(node){
                    this.porinter = this.array.push(node) - 1;
                },
                pop: function(){
                    if(this.porinter < 0)
                        return undefined;
                    this.porinter = this.porinter--;
                    return this.array.pop(node);
                },
                currect: function(){
                    if(this.porinter < 0)
                        return undefined;
                    return this.array[this.porinter];
                }
            };
        
        for(var i = 0; i < sortdatas.length; i++){
            var node = sortdatas[i],
                queueNode = queue.currect();

            if(!queueNode){
                treedata.push(node);
                queueNode.push(node);
                continue;
            }

            var  curInnercode = queueNode.innercode,
                 nodeInncode  = node.innercode;
            
            if(nodeInncode.indexOf(curInnercode) == 0 && curInnercode.length < nodeInncode){//当前堆栈节点的子节点
                queueNode.children.push(node);
                queueNode.push(node);
            }else{
                var isContine = true;
                do{
                    var lastQueueNode = queue.pop();
                    if(!lastQueueNode){
                        treedata.push(node);
                        queueNode.push(node);
                        isContine = false;
                    }else{
                        var lastInnercode = lastQueueNode.innercode;
                        if(nodeInncode.indexOf(lastInnercode) == 0 && lastInnercode.length < nodeInncode){//当前堆栈节点的子节点
                            lastInnercode.children.push(node);
                            isContine = false;
                        }
                    }
                }while(isContine);
            }
        } 
        return treedata;
    },

    listDataToTreeData : (datas = [], idname, pidname ) => {
        var copyData =  datas;//Utils.clone(datas);
        var dataObj = [];
        copyData.forEach(d => {
            d.children = [];
            var id = '' + d[idname]; //确保是一个字符串
            dataObj[id] = d;
        });

        var newDatas = [];
        copyData.forEach(d => {
            var pid = d[pidname],
                pobj = dataObj[pid];
            if(pobj)
                pobj.children.push(d);
            else
                newDatas.push(d);
        });


        var loop = (ds) =>{
            ds.map(d => {
                if(d.children.length == 0)
                    delete d.children;
                else
                    loop(d.children);
            });
        };

        loop(newDatas);

        return newDatas;
    }
    
};

export default CompUtils;



