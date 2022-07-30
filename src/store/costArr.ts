import { Cost} from "@/store/cost"
import { Storage } from '@capacitor/storage';
import { CostType } from '@/enum/costType'
import { format} from  'date-fns'
export  class CostArr{
 
    // //获取内存上的数组 condtion 格式 date=2
    async get(callback?:(item:Cost)=>boolean): Promise<Cost[]>{
        let myFinicalArr:Cost[] = [];
        const {value}  = await Storage.get({
            key: 'myFinical'
        });
        if(value!=null && value!="null"){
            myFinicalArr = JSON.parse(value.toString());
        }

        if(callback!=null){
             //有条件
             if(myFinicalArr!=null){
                myFinicalArr = myFinicalArr.filter((item)=>{
                    return callback(item);
                });
             }
             
        }
           
       
        return myFinicalArr;
    }


    
    //删除
    async delete(id:number): Promise<void>{
        let  myFinicalArr:Cost[] = await this.get();

        if(myFinicalArr !=null){
            myFinicalArr = myFinicalArr.filter((item)=>{
                return item.id !=id;
             })
        }
       
       
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

        return parseFloat(total.toFixed(2));

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

 