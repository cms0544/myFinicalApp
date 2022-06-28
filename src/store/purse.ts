import { CostArr} from '@/store/costArr'
import { Cost} from '@/store/cost'
import { alertController } from '@ionic/vue';
import { Storage } from '@capacitor/storage';
export class Purse{
    begindate:string;
    beginmoney:string;

    constructor(begindate,beginmoney){
        this.begindate = begindate;
        this.beginmoney = beginmoney;
    }
}
export class PurseArr{
    purse:Purse =  new Purse("","");
  

    getPurse = async ():Promise<Purse>=>{
        const temppurse = await Storage.get({key:"purse"});
        if(temppurse !=null){
            this.purse = JSON.parse(temppurse.value.toString())
            return this.purse;
        }else{
            return new Purse("","");
        }
    }
    //计算钱包   开始日期+钱
    calcuTotal= async ():Promise<number>=>{
        
        if(this.purse.begindate == ""){
             const alert = await alertController.create({
                header:"提示",
                message:"请输入开始日期",
                buttons:["确定"]
            });
            alert.present();
            return null;
        }

        if(this.purse.beginmoney == ""){
            const alert2 = await alertController.create({
               header:"提示",
               message:"请输入开始金钱",
               buttons:["确定"]
           });
           alert2.present();
           return null;
       }
        const costArr = new CostArr();
        const money=await costArr.getSumBySearch((item:Cost)=>{
            return item.date>this.purse.begindate;
        });

        Storage.set({
            key:"purse",
            value:JSON.stringify(this.purse)
        });

        return parseFloat(this.purse.beginmoney)+money;
    }
}