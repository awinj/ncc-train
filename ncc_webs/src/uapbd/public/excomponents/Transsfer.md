 >**引入**
 
```
import Transfer from '../../public/excomponents/Transfer';
```
>**使用**

```
<Transfer 
    TransferId={'org_transferid'}  //id,必填
	leftTreeData={this.state.firstStepOrgValue.leftTreeData} 
	rightTreeData={this.state.firstStepOrgValue.rightTreeData}
    value={this.state.firstStepOrgValue} 
    oprType={this.state.oprType}/>
```
> 传参说明

---
    TransferId          id,必填
    leftTreeData        左侧树初始化数据
    rightTreeData       右侧树初始化数据，没有可传入[]
    value               返回树的数据结构  {leftTreeData:[],rightTreeData:[]}
    oprType             树节点移动方式，目前支持四种：'0':包含所有下级 ,'1':仅自己 ,'2':仅直接下级 ,'3':仅末级
    beforeMove          移动前事件，返回bool,返回false时不移动；beforeMove(nodes,value,'br2l')
    afterMove           移动后事件，无返回值afterMove(nodes,value,'ar2l')

*注：*移动前(beforeMove)与移动后(afterMove)都会返回移动事件类型，移动事件类型分4类：{'br2l'：右树到左树移动前事件；'ar2l'：有数到左树移动后事件；'bl2r'：左树到右数移动前事件；'al2r'：左树到右树移动后事件}

