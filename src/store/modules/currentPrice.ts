
import {getCurrentPrice,insertCurrentPrice} from '@/api/currentPrice'
import { formatDate } from '@/utils/dateUtils';
import { alertController } from '@ionic/core';
import { Purse } from '../purse';


export default {
    namespace:true,
    state:{
        currentPriceObj:Purse
    },
    getters:{
        currentPriceObj:(state)=>{
            return state.currentPriceObj
        }
    },
    mutations:{
       SET_CURRENTPRICEOBJ:(state,currentPriceObj)=>{
            state.currentPriceObj = currentPriceObj
       }
    },    

    actions:{
          //保存支出
            async getCurrentPrice({commit,getters}){
               
                const res:any = await getCurrentPrice();
                 if(res.success == 1){
                    if(res.res !=null){
                        commit("SET_CURRENTPRICEOBJ",res.res);
                    }else{
                        commit("SET_CURRENTPRICEOBJ",new Purse(0,formatDate(new Date())));
                    }
                   
                 }

               
                 return getters.currentPriceObj;
               
                
            },
            async insertCurrentPrice({commit},purse:Purse): Promise<any>{
                if(purse.insertdate==""){
                    const alert1:HTMLIonAlertElement =await alertController.create({
                        header:"提示",
                        message:"请输入开始日期",
                        buttons:["确定"]
                    });

                    alert1.present();
                    
                }

                if(purse.currentprice == ""){
                    const alert2:HTMLIonAlertElement  =await alertController.create({
                        header:"提示",
                        message:"请输入金额",
                        buttons:["确定"]
                    });

                    alert2.present();
                }
                if(Number.isNaN(Number(purse.currentprice))){
                    const alert3:HTMLIonAlertElement  =await alertController.create({
                        header:"提示",
                        message:"请输入正确的金额",
                        buttons:["确定"]
                    });

                    alert3.present();
                }

                
                const res:any = await insertCurrentPrice(purse);
               
                if(res.success == 1){
                    return purse;
                }else{
                    const alert4 =await alertController.create({
                        header:"提示",
                        message:res.message,
                        buttons:["确定"]
                    });

                    alert4.present();
                    return null;
                }
            }
    
    
        
    }

}