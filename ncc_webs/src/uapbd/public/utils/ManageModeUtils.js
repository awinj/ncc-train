export default  function(nodetype,pk_org,pk_group,pk_orgs,curGroup){
    var resultMessage = nodetype==='GLOBE_NODE'&&!!pk_org&&pk_org!=='GLOBLE00000000000000'?
            {message:'全局节点只能维护全局的数据！',editFlag:false}:
            nodetype==='GROUP_NODE'&&!!pk_org&&pk_org!==curGroup?
                {message:'集团节点只能维护集团的数据！',editFlag:false}:
                nodetype==='ORG_NODE'&&!( pk_orgs.length >0 && !!pk_org && pk_orgs.includes(pk_org) )?
                    {message:'组织节点只能维护当前节点有权限组织的数据！',editFlag:false}:{message:'',editFlag:true};
    return resultMessage;
}