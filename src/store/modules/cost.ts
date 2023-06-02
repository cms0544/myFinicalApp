
import {insert,get,del} from '@/api/cost'

import { Cost } from '../cost'
import { Storage } from '@capacitor/storage';
import { alertController } from '@ionic/core'
import store from '..'
export default {
    namespace:true,
    state:{
        cost:null,
        storageCost:null

    },
    getters:{
        cost(state){
            return async ()=>{
                // const {value} =await Storage.get({key:"myFinical"});
                // let myFinicalArr = [];
                // if(value!=null){
                //     myFinicalArr = JSON.parse(value);
                // }
                // state.cost = myFinicalArr;
        
                // if(callback!=null){
                //      //有条件
                //      myFinicalArr = myFinicalArr.filter((item)=>{
                //         return callback(item);
                       
        
                //     })
                // }
                   
               
                return state.cost;
            }
           
        },
        storageCost(state){
            return async()=>{
                const {value} =await Storage.get({key:"myFinical"});
                let myFinicalArr = [];
                if(value!=null){
                    myFinicalArr = JSON.parse(value);
                }
                state.storageCost = myFinicalArr;
            }
              
        }
    },
    mutations:{
        // SET_COST:(state,cost)=>{
            
        //     if(cost !=null){
        //          Storage.set({key:"myFinical",value:JSON.stringify(cost)});
        //         // localStorage.setItem("CapacitorStorage.myFinical",JSON.stringify(cost));
        //         state.cost = cost;
        //     }else{
        //         Storage.set({key:"myFinical",value:null});
        //         // localStorage.setItem("CapacitorStorage.myFinical",null);
        //         state.cost = null;
        //     }
           
        // },
        // SET_COSTBYITIME:({state,commit},cost:Cost)=>{
           
        //     const costArr = state.cost;
        //     costArr.forEach((element,index) => {
        //         if(cost.id == element.id){
        //            costArr.splice(index,1);
        //         }
        //     });
        //     commit('SET_COST',costArr)


        // },
        // SET_COST_BY_ASYNC:({state,commit},arr)=>{
        //     let costArr = state.cost;
        //     arr.forEach((element) => {
        //         let len = 0;
        //         if(costArr!=null){
        //             len = costArr.filter((item)=>{
        //                 return item.descript == element.descript && item.date == element.date &&  item.price == element.price
        //             });
        //         }else{
        //             costArr = [];
        //         }

        //         //没有的才补数据
        //         if(len == 0){
        //             costArr.push({
        //                 id:costArr.length+1,
        //                 isupload:true,
        //                 descript:element.descript,
        //                 price:element.price,
        //                 date:element.date,
        //                 costtype: element.costtype
        //             });
        //         }


        //     });
        //     commit('SET_COST',costArr)



        // }

        SET_COST:(state,costArr)=>{
            
            state.cost = costArr;
           
        },
        SET_StorageCost:async (state,costArr)=>{
            await Storage.set({key:"myFinical",value:costArr});
            state.storageCost = costArr;
           
        }
    },    

    actions:{
          //保存支出
            async addCost({commit,getters},updateCostItem:Cost): Promise<any>{
                if(updateCostItem.descript == ""){
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
                // let  myFinicalArr:Cost[] = await getters.cost();
                // if(myFinicalArr == null) myFinicalArr = [];
                // if(updateCostItem.id == 0){
                //     //id为0新增
                //     updateCostItem.id = myFinicalArr.length==0?0:myFinicalArr[0].id+1;
                //     myFinicalArr.splice(0,0,updateCostItem);
                // }else{
                //     let updateIndex = 0;
                //     myFinicalArr.forEach((item,index)=>{
                //         if(item.id ==  updateCostItem.id){
                //             updateIndex = index;
                //             return true;
                //         }
                //     });
                //     myFinicalArr[updateIndex] = updateCostItem;
                // }
 

                // commit('SET_COST',myFinicalArr);
               
                return insert(updateCostItem);
              
               
                
            },
    
        //删除花费
        removeCost:async ({commit,getters},updateCostItem:Cost)=>{

            const res:any = await del(updateCostItem.id);
            if(res.success == 1){
                return true;
            }else{
                const alert = await alertController
                .create({
                header: '确认!',
                message: '删除失败!!!',
                buttons: ['确定']
                });
                alert.present();
                return false;
            }
            
        },
        //确认是否要删除消费记录
 
        confirmRemoveCost:({dispatch,state},updateCostItem:Cost)=>{
        
                 alertController
                .create({
                  header: '确认!',
                  message: '确认要删除该'+updateCostItem.descript+'记录!!!',
                  buttons: [
                    {
                      text: '取消',
                      role: 'cancel',
                      cssClass: 'secondary',
                      id: 'cancel-button',
                      handler:async()=>{
                        dispatch("removeCost");
                      }
                    },
                    {
                      text: '确定',
                      id: 'confirm-button'
                     
                    
                    },
                  ],
                }).then(confirmAlert=>{
                    confirmAlert.present();
                });

        },
         //获取内存上的数组（新增和修改）
        getCost:async ({commit,state},params)=>{
        
                if(store.getters.user!=null && store.getters.user!="null"){
                   const {res}:any = await get(params);
                       
                   state.cost = res;

                   return state.cost;
                    
                }else{
                    return null;
                }
        },
        StartInserCost:async ({dispatch,commit,getters})=>{
            // if(getters.timer1==null){
            //     const timer1 = setTimeout(async function(){
      
                    const uploadCost = await getters.storageCost();
                    uploadCost.forEach(async (item,index)=>{
                     await dispatch("insertCost",item);
                      uploadCost.splice(index,1);
                     await commit("SET_StorageCost",uploadCost);
                    });


                
                    
                //   },10000);

            //       commit('SET_TIMER1',timer1);

              
            // }
        
            // if(getters.timer2 == null){
            //     const  timer2 = setTimeout(()=>{
            //         dispatch("getCost");
             
            //      },10000);
            //    commit('SET_TIMER2',timer2);
            // }


           
        }
    }

}