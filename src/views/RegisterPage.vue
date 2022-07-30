<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
                <ion-back-button></ion-back-button>
        </ion-buttons>
        
        <ion-title>注册</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="avatorblock">
          <ion-avatar>
              <img src="/assets/img/avatar.svg">
        </ion-avatar>
      </div>
       
       <ion-list class="registerForm">
          <ion-item>
              <ion-label class="registerlabel">用户名</ion-label>
              <ion-input :value="userModel.username" v-model="userModel.username" ></ion-input>
          </ion-item>
          <ion-item>
              <ion-label class="registerlabel" >性别</ion-label>
               <ion-select slot="end"  v-model="userModel.sex" :value="userModel.sex">
                    <ion-select-option value="0">女</ion-select-option>
                    <ion-select-option value="1">男</ion-select-option>
              </ion-select>

          </ion-item>
          <ion-item>
              <ion-label class="registerlabel">所属城市</ion-label>
             
              <ion-input :value="userModel.city" @click="openPicker()"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label class="registerlabel">密码</ion-label>
              <ion-input :value="userModel.password" type="password" v-model="userModel.password"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label class="registerlabel">确认密码</ion-label>
              <ion-input :value="userModel.repassword" type="password" v-model="userModel.repassword"></ion-input>
          </ion-item>
          <div class="flexblock" >
            <div style="flex:1">
              <ion-button  expand="full" @click="register">
                        {{userid==null? '注册':'保存'}}
              </ion-button>
            </div> 
            <div style="flex:1"  v-if="userid!=null">
            <ion-button expand="full"   @click="logout">
                        {{'注销'}}
              </ion-button>
            </div>
          
          </div>
         
       </ion-list>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent,onMounted,ref } from 'vue';
import {User} from '@/store/user'
  import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
// import Highcharts from 'highcharts/highstock'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonBackButton,IonButtons,IonItem,IonList,IonLabel,IonInput,IonButton,IonAvatar,IonSelect,IonSelectOption,pickerController, loadingController, alertController } from '@ionic/vue';
import store from '@/store';


export default defineComponent({
  name: 'RegisterPage',
  components: {  IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonBackButton,IonButtons,IonItem,IonList,IonLabel,IonInput,IonButton,IonAvatar,IonSelect,IonSelectOption },
  setup(){
    const userModel=ref(new User("",""));
     const route = useRoute();

     const userid = route.params.id;  //判断是注册还是修改
    
    onBeforeRouteUpdate(()=>{
      alert('test2');
    });
    const openPicker = async ()=>{
     
        const picker = await pickerController.create({
          columns: [
            {
              name: 'province',
              options: [
                {
                  text: '广东省',
                  value: '广东省',
                }
              ],
            },
            {
              name: 'city',
              options: [
                {
                  text: '深圳市',
                  value: '深圳市',
                }
              ],
            }
          ],
          buttons: [
            {
              text: '取消',
              role: 'cancel',
            },
            {
              text: '确定',
              handler: (value) => {
             
                userModel.value.city = value.province.text+value.city.text;
              },
            },
          ],
        });
        await picker.present();
    }

    onMounted(()=>{
        if(userid !=null){
          let userInfo = store.getters.user;
       
          userModel.value = {...userInfo};
          userModel.value.id = parseInt(userid.toString()) ;
          userModel.value.password = "";
          userModel.value.repassword = "";
        }else{
          userModel.value.id = 0;
        }
     })

    const router = useRouter();

    const register = async ()=>{
      if(userModel.value.password == ""){
         let alert = await alertController.create({header:"提示",message:"请填写密码",buttons:['确定']});
            alert.present();
            return ;
      }

      if(userModel.value.password != userModel.value.repassword){
         let alert = await alertController.create({header:"提示",message:"密码不一致",buttons:['确定']});
            alert.present();
            return;
      }
        const loading = await loadingController.create({
          message: '保存中',
          duration: 3000
        });
         loading.present();

        let res = await store.dispatch("register",userModel.value).catch(async (err)=>{
             loading.dismiss();

            let alert = await alertController.create({header:"提示",message:err,buttons:['确定']});
            alert.present();
        })

        if(res!=null){
               loading.dismiss();

                
              let alert = await alertController.create({header:"提示",message:res.msg,buttons:['确定']});
              store.commit("SET_USER",userModel.value);
              alert.present();
             
               router.go(-2);
          }
        
       

    }

    const logout = async ()=>{
      const alert = await alertController
        .create({
          header: '确认!',
          message: '是否要登出,原有的消费记录将会消失!!!',
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
              handler: async () => {
                store.dispatch("logout");
                 router.push("/tabs/tab2");
              },
            },
          ],
        });
        alert.present();
    }
     
    return {userModel,openPicker,userid,register,logout};
  }

  
});
</script>
<style lang="scss">
    .avatorblock ion-avatar{
      width: 60px;
      height: 60px;
      margin: 0 auto;
  }
    .avatorblock{
          text-align: center;
          height: 20%;
          line-height: 10;
    }

    .registerlabel{
      width: 100px;
    }

   .registerForm{
      ion-input{
        text-align: right;
      }
   }

   .flexblock{
    display:flex;
   }

   .flexblock>div{
     flex:1;
   }
</style>
