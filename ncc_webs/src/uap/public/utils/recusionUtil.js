/**
 * @desc 获取导出功能参数 //
 * @param 
 * @param 
 * @return 
 */

const getrecusionUtil =(rightTreeData)=> {
//     debugger
//     let exportdata = '';
//     if(rightTreeData&&rightTreeData.length>0){
//           rightTreeData.map((item, index) => {
//             debugger
//             exportdata += item.id+",[";
//             let children = item.children?getrecusionUtil(item.children):'';
//             exportdata += children+"];";
//       })

//     }

//   return exportdata;

    debugger
    let exportdata = '';
    if(rightTreeData&&rightTreeData.length>0){
          rightTreeData.map((item, index) => {
            // debugger
            exportdata += item.id+",[";
            let childrens = '';
            if(item.children){
                if(item.children&&item.children.length>0){
                    item.children.map((item, index) => {
                      // debugger
                      childrens = childrens+item.id+",";
 
                })
          
              }
            }
            exportdata += childrens+";";
      })

    }

  return exportdata;
};

export {getrecusionUtil}











