import {login,register} from '@/api/user'
import store from '@/store';
import { alertController } from '@ionic/core';
export default {
    namespace:true,
    state:{
        //变量
        token:localStorage.getItem("token"),
        user:localStorage.getItem("user")
    },
    getters:{
        token(state){
    
            return state.token;
        },
        user(state){
            if(state.user == null){
                return null;
            }else{
                return JSON.parse(state.user);
            }
            
        }
    },
    mutations:{
        //设置变量方法
        SET_TOKEN:(state,token)=>{
            localStorage.setItem("token",token);
            state.token = token;
        },
        SET_USER:(state,user)=>{
            if(user == null){
                localStorage.setItem("user",null);
                state.user= null;
            }else{
                localStorage.setItem("user",JSON.stringify(user));
                state.user= JSON.stringify(user);
            }
          
        }
    },
    actions:{
        //函数
        login({commit},userInfo){
            const {username,password} = userInfo;
            return new Promise((resolve,reject)=>{
           
                login({username:username.trim(),password}).then((res)=>{
                    const result = res as any;
                    if(result.success ==1){
                        commit('SET_TOKEN',result.token);
                        commit('SET_USER',result.user);
                        store.dispatch("StartInserCost");
                        resolve(result);
                    }else{
                        reject(result.message);
                    }
                   
                }).catch((err)=>{
                    reject(err);
                });
            });
        },
        register({commit},userInfo){
            userInfo.username = userInfo.username.trim();
           
                register(userInfo).then(async (res)=>{
                    const result = res as any;
                    if(result.success ==1){
                        commit('SET_TOKEN',result.token);
                        // commit('SET_USER',result.user);
                        store.commit("SET_USER",result.user);
              
                        //插入支出
                       store.dispatch("StartInserCost");
                   
                    }else{
                        const alert = await alertController
                            .create({
                            header: '确认!',
                            message: '登录失败,'+result.msg+'!!!',
                            buttons: ['确定']
                            });
                            alert.present();
                     
                    }
                   
                });
          
        },
        async logout({commit}){

            await store.dispatch("StartInserCost");
            await store.dispatch("removeCost");
            commit('SET_USER',null);
            commit('SET_TOKEN',null);
       
     
        }
    }
}