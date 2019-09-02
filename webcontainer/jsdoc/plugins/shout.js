
exports.handlers ={

     newDoclet : function(e){
      //  console.log(e.meta)
      // console.log(e.doclet.description)
     },
     parseBegin : function(e){
        // console.log(e.sourcefiles)
     },
     fileBegin :  function(e){
        //  console.log(e.filename)
     },
     beforeParse : function(e){
        //  console.log(e.filename)
        //  console.log(e.source)
        var extraDoc = [
            '/**',
            ' * Function provided by a superclass.',
            ' * @name superFunc',
            ' * @memberof ui.mywidget',
            ' * @function',
            ' */'
        ];
        e.source += extraDoc.join('\n');
     },
     jsdocCommentFound : function(e){
        // console.log(e.filename)
        // console.log(e.comment)
     },
     symbolFound : function(e){
         // console.log(e.range)
         // console.log(e.astnode)
         // console.log(e.code)
     },
     fileComplete : function(e){
        
     }
}


exports.defineTags = function(dictionary) {
   

}