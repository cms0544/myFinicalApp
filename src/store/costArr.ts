import { Cost} from "@/store/cost"
import { alertController } from '@ionic/vue';
import { Storage } from '@capacitor/storage';
import { CostType } from '@/enum/costType'
import { format} from  'date-fns'
export  class CostArr{
 
    //获取内存上的数组 condtion 格式 date=2
    async get(callback?:(item:Cost)=>boolean): Promise<Cost[]>{
        let myFinicalArr:Cost[] = [];
        const {value}  = await Storage.get({
            key: 'myFinical'
        });
        if(value!=null){
            myFinicalArr = JSON.parse(value.toString());
        }

        if(callback!=null){
             //有条件
             myFinicalArr = myFinicalArr.filter((item)=>{
                return callback(item);
               

            })
        }
           
       
        return myFinicalArr;
    }


       //获取内存上的数组（新增和修改）
    async add(updateCostItem:Cost): Promise<boolean>{
        if(updateCostItem.decript == ""){
            const alert = await alertController
                .create({
                header: '确认!',
                message: '请输入备注!!!',
                buttons: ['确定']
                });
                alert.present();
            return false;
        }
        if(updateCostItem.price == "0" || updateCostItem.price == ""){
            const alert = await alertController
                .create({
                header: '确认!',
                message: '请输入价格!!!',
                buttons: ['确定']
                });
                alert.present();
                return false;
        }
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
        return true;
        
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
    async getlist(callback?:(item:Cost)=>boolean):Promise<Record<string,Cost[]>>{
        const finialArr:Record<string,Cost[]>= {} ;

        const  myFinicalArr:Cost[] = await this.get(callback);
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

  
        return returnJson;
    
    }
    
    //获得每月份数据
    async getlistByMonth(callback?:(item:Cost)=>boolean):Promise<Array<Record<string,number>>>{
        const result:Record<string,number>= {} ;

        const  myFinicalArr:Cost[] = await this.get(callback);

        myFinicalArr.forEach((item:Cost)=>{
            const month = item.date.substring(0,7);
            if(result[month]==null){
                result[month]  = 0 ;
            }
            result[month]+=this.getTotal(item);
        });

        const ret = [];
        for(const month in result){
            ret.push({
                "name":month,
                "y":result[month]
            });
        }

        return ret;
    
    }

    async getSumBySearch(callback?:(item:Cost)=>boolean){
        const  myFinicalArr:Cost[] = await this.get(callback);
        let total = 0;
        myFinicalArr.forEach((item:Cost)=>{
            total+= this.getTotal(item);
            
        });

        return total;

    }
    //每一次收入的收入支出
    getTotal(item:Cost):number{
        let total = 0;
        if(item.costtype == CostType.Expenditure){
            total -= parseFloat(item.price);
        }else{
            total+= parseFloat(item.price);
        }
        return total;
    }


    formatdate(dateStr?:string){
        if(dateStr!="" && dateStr !=null){
            return format(new Date(dateStr),"yyyy-MM-dd");
        }else{
            return format(new Date(),"yyyy-MM-dd");
        }
        
    }

} 

 