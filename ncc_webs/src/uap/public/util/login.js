
function setBg(flag){
    debugger;
    if(flag){
        document.querySelector('#login_div').setAttribute("class","bg2");
        flag=false;
    }else{
        document.querySelector('#login_div').setAttribute("class","bg1");
        flag=true;
    }    
    setTimeout("setBg("+flag+")",5000);
}
