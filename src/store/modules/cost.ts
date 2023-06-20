
import {insert,get,del,getSum, getMonthTotal} from '@/api/cost'

import { Cost } from '../cost'
import { Storage } from '@capacitor/storage';
import { alertController } from '@ionic/core'
import { CostType} from '@/enum/costType'
import store from '..'
export default {
    namespace:true,
    state:{
        cost:null,
        storageCost:null,
        sumCost:0,
        monthSeries:null

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
        //将支出转成日期:数组的格式
        costJson(state){
            return ()=>{
                const returnJson = {};
                const totalJson = {};
                let total = 0;
                state.cost.forEach((item)=>{
                    const date = item.date.substr(0,10);
                    if( returnJson[date]== null){
                        returnJson[date] = [];
                     
                    }
                    if( totalJson[date]== null){
                        totalJson[date] = {total:0};
                    }

                    returnJson[date].push(item);
                    const val =  item.costtype == CostType.Income ? item.price : - item.price;
                    totalJson[date].total  += val;
                    total+= val;
                });
            
                return {incomeval:total,data:returnJson,total:totalJson};
            }
        },
        storageCost(state){
            return ()=>{
           
               return state.storageCost ;
            }
              
        },
        sumCost:(state)=>{
            return state.sumCost;
        },
        monthSeries:(state)=>{
            return state.monthSeries;
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
          
            state.storageCost = costArr;
           
        },
        SET_SUMCOST:(state,sum)=>{
            state.sumCost = sum;
        },
        SET_MONTHSERIES:(state,monthseries)=>{
            state.monthSeries = monthseries;
        }
    },    

    actions:{
          //保存支出
            async addCost({state},updateCostItem:Cost): Promise<any>{
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

        //确认是否要删除消费记录
 
        confirmRemoveCost:({dispatch},data:{updateCostItem:Cost,callback:()=>void})=>{
       
                alertController
                .create({
                  header: '确认!',
                  message: '确认要删除"'+data.updateCostItem.descript+'"记录!!!',
                  buttons: [
                    {
                      text: '取消',
                      role: 'cancel',
                      cssClass: 'secondary',
                      id: 'cancel-button'
                     
                    },
                    {
                      text: '确定',
                      id: 'confirm-button',
                      handler:async()=>{
                       
                            if(data.updateCostItem!=null){
                                const res:any = await del(data.updateCostItem.id);
                                if(res.success == 1){
                                    data.callback();
                                }else{
                                    const alert = await alertController
                                    .create({
                                    header: '确认!',
                                    message: '删除失败!!!',
                                    buttons: ['确定']
                                    });
                                    alert.present();
                                  
                                }
                            }
                           
                       
                      }
                    
                    },
                  ],
                }).then(confirmAlert=>{
                    confirmAlert.present();
                });
         
                

        },
         //获取内存上的数组（新增和修改）
        getCost:async ({state},params)=>{
        
                if(store.getters.user!=null && store.getters.user!="null"){
                   const {res}:any = await get(params);
                       
                   state.cost = res;

                   return state.cost;
                    
                }else{
                    return null;
                }
        },
        StartInserCost:async ({dispatch,commit,getters,state})=>{
            // if(getters.timer1==null){
            //     const timer1 = setTimeout(async function(){
                    const {value} =await Storage.get({key:"myFinical"});
                    let myFinicalArr = [];
                    if(value!=null){
                        myFinicalArr = JSON.parse(value);
                    }
                    await commit("SET_StorageCost",myFinicalArr);
                    
                    if(getters.storageCost !=null){
                        getters.storageCost.forEach(async (item,index)=>{
                            const res = await dispatch("insertCost",item);
                            if(res.success == 1){
                                getters.storageCost.splice(index,1);
                                await Storage.set({key:"myFinical",value:getters.storageCost});
                                await commit("SET_StorageCost",getters.storageCost);
                            }
                           
                           });
       
       
                       
                    }
                  
                    return getters.storageCost;
                    
                //   },10000);

            //       commit('SET_TIMER1',timer1);

              
            // }
        
            // if(getters.timer2 == null){
            //     const  timer2 = setTimeout(()=>{
            //         dispatch("getCost");
             
            //      },10000);
            //    commit('SET_TIMER2',timer2);
            // }


           
        },
        GetSumCost:async ({getters,commit},params)=>{

            const res:any = await getSum(params);
            if(res.success == 1){
                commit('SET_SUMCOST',res.sum);
            }else{
                commit('SET_SUMCOST',0);
            }
            return getters.sumCost;
            
        },
        GetMonthData:async({getters,commit},params)=>{
            const res:any = await getMonthTotal(params);
            if(res.success == 1){
                commit('SET_MONTHSERIES',res.res);
            }else{
                commit('SET_MONTHSERIES',[]);
            }
            return getters.monthSeries;
        }
    }

}