import { Cost} from "@/store/cost"

import { Storage } from '@capacitor/storage';
export  class CostArr{
 
    //获取内存上的数组
    async get(): Promise<Cost[]>{
        let myFinicalArr:Cost[] = [];
        const {value}  = await Storage.get({
            key: 'myFinical'
        });
        if(value!=null){
            myFinicalArr = JSON.parse(value.toString());
        }
        return myFinicalArr;
    }


       //获取内存上的数组（新增和修改）
    async add(updateCostItem:Cost): Promise<void>{
      
        const  myFinicalArr:Cost[] = await this.get();
        if(updateCostItem.id == 0){
            //id为0新增
            updateCostItem.id = myFinicalArr.length==0?0:myFinicalArr[0].id+1;
            myFinicalArr.splice(0,0,updateCostItem);
        }else{
            let updateIndex = 0;
            myFinicalArr.forEach((item,index)=>{
                if(item.id ==  updateCostItem.id){
                    updateIndex = index;
                    return true;
                }
            });
            myFinicalArr[updateIndex] = updateCostItem;
        }
       
       
        await Storage.set({
            key: 'myFinical',
            value: JSON.stringify(myFinicalArr),
        });

    }
    //删除
    async delete(id:number): Promise<void>{
        let  myFinicalArr:Cost[] = await this.get();

         console.log(id);
        myFinicalArr = myFinicalArr.filter((item)=>{
           return item.id !=id;
        })
       
        await Storage.set({
            key: 'myFinical',
            value: JSON.stringify(myFinicalArr),
        });

    }

    //获取转换后的日期格式列表
    async getlist():Promise<Record<string,Cost[]>>{
        const finialArr:Record<string,Cost[]>= {} ;

        const  myFinicalArr:Cost[] = await this.get();
        let DateKey:string[] = [];
        myFinicalArr.forEach((item:Cost)=>{
          if(finialArr[item.date]==null){
            finialArr[item.date] = [];
          }
          finialArr[item.date].push(item);
          if(DateKey.indexOf(item.date)==-1){
            DateKey.push(item.date);
          }
        });

        DateKey = DateKey.sort((a,b)=>{
            return new Date(b.toString()).getTime()- new Date(a.toString()).getTime()
        });

        const returnJson:Record<string,Cost[]> = {};
        DateKey.forEach((item)=>{
            returnJson[item.toString()] = finialArr[item.toString()];
        })

        console.log(finialArr);

        return returnJson;
    
    }
    
   
}
 