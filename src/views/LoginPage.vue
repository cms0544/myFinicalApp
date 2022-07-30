<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
                <ion-back-button></ion-back-button>
        </ion-buttons>
        
        <ion-title>登录</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="avatorblock">
          <ion-avatar>
              <img src="/assets/img/avatar.svg">
        </ion-avatar>
      </div>
       
       <ion-list>
          <ion-item>
              <ion-label class="loginlabel">用户名</ion-label>
              <ion-input :value="userModel.username" v-model="userModel.username"></ion-input>
          </ion-item>
          <ion-item>
              <ion-label class="loginlabel">密码</ion-label>
              <ion-input :value="userModel.password" type="password" v-model="userModel.password"></ion-input>
          </ion-item>
          <ion-button  expand="full" @click="login">
                    登录
          </ion-button>
          <ion-text class="pull-right" router-link="/RegisterPage" router-direction="forword" ><a >还没账号?点击注册</a></ion-text>
       </ion-list>
      
    </ion-content>
  </ion-page>
</template>
<style>

</style>
<script lang="ts">
import { defineComponent } from 'vue';
import {User} from '@/store/user'

// import Highcharts from 'highcharts/highstock'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonBackButton,IonButtons,IonItem,IonList,IonLabel,IonInput,IonButton,IonAvatar,IonText, alertController,loadingController,} from '@ionic/vue';
import store from '@/store';

import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  components: {  IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonBackButton,IonButtons,IonItem,IonList,IonLabel,IonInput,IonButton,IonAvatar,IonText },
  setup(){
    const userModel:User=new User("","");
    const router = useRouter();

    const login = async ()=>{
        const loading = await loadingController.create({
          message: '登录中',
          duration: 3000
        });
        
        loading.present();

       let res = await store.dispatch('login',userModel).catch(async (err)=>{
          loading.dismiss();
          let alert = await alertController.create({header:"提示",message:err,buttons:['确定']});
          alert.present();
       });

     
         if(res!=null){
             await store.dispatch("confirmRemoveCost");
               loading.dismiss();
 
               router.go(-1);
          }
      
         
    }
    return {userModel,login};
  }

  
});
</script>
<style>
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

    .loginlabel{
      width: 60px;
    }

    .pull-right{
      float: right;
    }
</style>
