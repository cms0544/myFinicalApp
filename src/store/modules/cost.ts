import {insert,get} from '@/api/cost'

import { Cost } from '../cost'

import { format} from  'date-fns'
import { alertController } from '@ionic/core'
export default {
    namespace:true,
    state:{
        cost:localStorage.getItem("CapacitorStorage.myFinical"),
        lastUpdateTime:localStorage.getItem("lastupdatetime"),
        timer1:null,
        timer2:null
    },
    getters:{
        cost(state){
            return (callback?:(item:Cost)=>boolean)=>{
                let myFinicalArr = state.cost == null || state.cost == "null"?[]:JSON.parse(state.cost);
              
        
                if(callback!=null){
                     //有条件
                     myFinicalArr = myFinicalArr.filter((item)=>{
                        return callback(item);
                       
        
                    })
                }
                   
               
                return myFinicalArr;
            }
           
        },

        timer1:(state)=>{
            return state.timer1;
        },
        timer2:(state)=>{
            return state.timer2;
        }
    },
    mutations:{
        SET_COST:(state,cost)=>{
            
            if(cost !=null){
                localStorage.setItem("CapacitorStorage.myFinical",JSON.stringify(cost));
                state.cost = JSON.stringify(cost);
            }else{
                localStorage.setItem("CapacitorStorage.myFinical",null);
                state.cost = null;
            }
        
        },
        SET_COSTBYITIME:(state,cost:Cost)=>{
            cost.isupload = true;
            const costArr = JSON.parse(state.cost);
            costArr.forEach((element,index) => {
                if(cost.id == element.id){
                    costArr[index] = cost;
                }
            });
            state.cost = JSON.stringify(costArr);
            localStorage.setItem("CapacitorStorage.myFinical",state.cost );

        },
        SET_COST_BY_ASYNC:(state,arr)=>{
            let costArr = JSON.parse(state.cost);
            arr.forEach((element) => {
                let len = 0;
                if(costArr!=null){
                    len = costArr.filter((item)=>{
                        return item.decript == element.descript && item.date == element.date &&  item.price == element.price
                    });
                }else{
                    costArr = [];
                }

                //没有的才补数据
                if(len == 0){
                    costArr.push({
                        id:costArr.length+1,
                        isupload:true,
                        decript:element.descript,
                        price:element.price,
                        date:element.date,
                        costtype: element.costtype
                    });
                }


            });
            state.cost = JSON.stringify(costArr);
            localStorage.setItem("CapacitorStorage.myFinical",state.cost );

            state.lastUpdateTime = format(new Date(),"yyyy-MM-dd hh:mm:ss");
            localStorage.setItem("lastupdatetime", state.lastUpdateTime  );

        },
        SET_TIMER1:(state,timer1)=>{
            state.timer1= timer1;
        },
        SET_TIMER2:(state,timer2)=>{
            state.timer2 = timer2;
        },
        SET_TIMERLIST:(state,timerList)=>{
            state.timerList = timerList;
        }
    },

    actions:{
          //保存支出
            async addCost({commit,getters},updateCostItem:Cost): Promise<boolean>{
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
                const  myFinicalArr:Cost[] = await getters.cost();
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
 

                commit('SET_COST',myFinicalArr);
                return true;
                
            },
            //插入支出到后台
        insertCost:({commit},cost)=>{
            return new Promise((resolve,reject)=>{
                insert(cost).then((res)=>{
                    commit('SET_COSTBYITIME',cost);
                    resolve(res);
                }).catch((err)=>{
                    reject(err);
                })
            });
        },
        //删除花费
        removeCost:({commit})=>{
            commit('SET_COST',null);
        },
        //确认是否要删除消费记录
        confirmRemoveCost:async ({dispatch,state})=>{
            if(state.cost!="" && state.cost!="null" && state.cost !=null){
          
                const confirmAlert = await alertController
                .create({
                  header: '确认!',
                  message: '账号是否要带上原有的消费记录!!!',
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
                });
                confirmAlert.present();
            }
            
        },
         //获取内存上的数组（新增和修改）
        getCost:({commit,state})=>{
            return new Promise((resolve,reject)=>{
                get(state.lastUpdateTime).then((res)=>{
                    commit('SET_COST_BY_ASYNC',res);
                    resolve(res);
                }).catch((err)=>{
                    reject(err);
                })
            });
        },
        StartTimer:({dispatch,commit,getters})=>{
            if(getters.timer1==null){
                const timer1 = setTimeout(function(){
      
                    const uploadCost = getters.cost((cost:Cost)=>{
                      return cost.isupload !=true;
                    });
                    uploadCost.forEach((item)=>{
                      dispatch("insertCost",item);
                      
                    });
                
                    
                  },10000);

                  commit('SET_TIMER1',timer1);

              
            }
        
            if(getters.timer2 == null){
                const  timer2 = setTimeout(()=>{
                    dispatch("getCost");
             
                 },10000);
               commit('SET_TIMER2',timer2);
            }


           
        },
        ClearTimer:({commit,state})=>{
            clearTimeout(state.timer1);
              commit('SET_TIMER1',null);
          
              clearTimeout(state.timer2);
              commit('SET_TIMER2',null);
        }
    }
}