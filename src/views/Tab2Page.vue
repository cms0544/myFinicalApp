<template>
  <ion-page id="main">
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
              <ion-list>
                <ion-item style="padding:20px 0;">
                  <ion-avatar>
                    <img  :src="photoUrl">
                  </ion-avatar>
                  <ion-label slot="end" v-if="userInfo==null" router-link="/LoginPage" router-direction="forword">登录</ion-label>
                  <ion-label slot="end" v-if="userInfo!=null" :router-link="'/RegisterPage/'+userInfo.id" router-direction="forword">{{userInfo.username}}</ion-label>
                  <ion-icon slot="end" :icon="chevronForwardOutline"></ion-icon>
                </ion-item>
              </ion-list>
        </ion-toolbar>
      </ion-header>
      
        <ion-grid class="total">

              <ion-row>
                 <ion-col class="firstColumn" v-if="currMoney!=null">  
                      <div class="smalltxt">钱包余额</div>
                         <div class="valtxt">{{currMoney.toFixed(2)}}</div>
                  </ion-col>
                  <ion-col class="firstColumn">
                     <div class="smalltxt">总净收入</div>
                     <div class="valtxt">{{total.toFixed(2)}}</div>
                  </ion-col>
              </ion-row>
             <ion-row>
               <ion-col>
                   <div class="smalltxt" >月收入</div>
                   <div class="valtxt">{{mouthIncome.toFixed(2)}}</div>
                </ion-col>
                <ion-col>
                     <div class="smalltxt">月支出</div>
                     <div class="valtxt">{{mouthExpenditure.toFixed(2)}}</div>
                </ion-col>
                  
                <ion-col>
                    <div  class="smalltxt">月净收入</div>
                    <div class="valtxt">{{mouthTotal.toFixed(2)}}</Div>
                </ion-col>
            
              </ion-row>
              <ion-row>
                
                  <ion-col class="text-center" router-link="/TotalReport" router-direction="forword">
                          查看月度报告
                  
                  </ion-col>
                  <ion-col class="text-center" id="purseModal" >
                          设置钱包
                  
                  </ion-col>
                    <ion-modal class="purseModal" trigger="purseModal" ref="purseModal">
                        <ion-header>
                             <ion-toolbar>
                                 <ion-title>
                                     设置钱包
                                 </ion-title>
                             </ion-toolbar>
                        </ion-header>
                        <ion-content>
                             <ion-list>
                                     <ion-item>
                                        <ion-label>开始日期</ion-label>
                                        <DateSelect v-model:value="purse.begindate"  ></DateSelect>
                                    </ion-item>
                                    <ion-item>
                                        <ion-label>金额</ion-label>
                                        <ion-input :value="purse.beginmoney"  v-model="purse.beginmoney"></ion-input>
                                    </ion-item>
                            
                                    
                                        <ion-buttons class="tempbottom">
                                            <ion-button color="danger" @click="cancelPurse">取消</ion-button>
                                            <ion-button color="primary" @click="confirmPurse">确定</ion-button>
                                        </ion-buttons>
                                   
                                       
                                       
                                  
                             </ion-list>
                          
                        </ion-content>
                    </ion-modal>
              </ion-row>
        </ion-grid>
    </ion-content>
  </ion-page>
</template>
<style>
  p{
    margin: 0px;
    text-align:left;
  }

  ion-grid.total {
    border-radius: 10px;
    background:  #b8cdf1;
    color:#000;
    margin: 0 10px;
  }

  .firstColumn{
        font-size: 30px;
        margin: 5px;
  
  }

  .text-center{
    text-align: center;
          color:#3279f3
  }

  .smalltxt{
    font-size: 12px;
  }

  .valtxt{
    font-weight: bold;
  }


   .purseModal {
        --height: 170px;
        --border-radius: 16px;
        --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .purseModal::part(backdrop) {
        background: rgba(0, 0, 0);
        --backdrop-opacity:0.5;
    }

    .tempbottom{
      justify-content:space-between;
      padding-inline-start: 15px;
    }
</style>
<script lang="ts">
import { computed, defineComponent,Ref,ref } from 'vue';
import { add } from 'ionicons/icons';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonGrid,IonRow,IonCol, onIonViewWillEnter,IonModal,IonList,IonItem,IonLabel,IonInput,IonButtons,IonButton,IonAvatar,IonIcon } from '@ionic/vue';
// import ExploreContainer from '@/components/ExploreContainer.vue';
import { CostArr } from '@/store/costArr';
import { Cost } from '@/store/cost';
import { CostType } from '@/enum/costType'
import DateSelect from '@/components/DateSelect.vue'
import { Purse,PurseArr } from '@/store/purse'
import { chevronForwardOutline } from 'ionicons/icons';
import store from '@/store';
import { getFirstDate,getLastDate} from "@/utils/dateUtils"


export default defineComponent({
  name: 'Tab2Page',
  components: {  IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonGrid,IonRow,IonCol,IonModal,IonList,IonItem,IonLabel,DateSelect,IonInput,IonButtons,IonButton,IonAvatar,IonIcon },
    setup(){
      let mouthIncome=ref(0) as Ref<number>;
      let mouthExpenditure = ref(0) as Ref<number> ;
      let mouthTotal = ref(0) as Ref<number>;
      let costArr = new CostArr();
      let total = ref(0);
      let currMoney = ref(null);
      const purseArr = new PurseArr();
      const purse = ref(purseArr.purse) as Ref<Purse>;

      

      const purseModal = ref();
    
      onIonViewWillEnter(async ()=>{

            // let finialArr = await store.getters.cost((item:Cost)=>{
            // return new Date(item.date).getMonth() == new Date().getMonth()
            // });
            let finialArr = await store.dispatch('getCost',{
              datefrom:getFirstDate(new Date()),
              dateto:getLastDate(new Date())
            });

          
            mouthIncome.value = 0;
            mouthExpenditure.value = 0;
            mouthTotal.value = 0;
            total.value = 0;
            finialArr.forEach((item)=>{
              if(item.costtype == CostType.Income){
                  mouthIncome.value = mouthIncome.value+parseFloat(item.price);
              }

              if(item.costtype == CostType.Expenditure){
                  mouthExpenditure.value = mouthExpenditure.value+parseFloat(item.price);
              }

              
            });

             mouthTotal.value =  mouthIncome.value - mouthExpenditure.value ;
            //总收入

             total.value = await costArr.getSumBySearch();
       
             purse.value = await purseArr.getPurse();
             currMoney.value = await purseArr.calcuTotal();
      })

  
      const confirmPurse =async ()=>{

        currMoney.value = await purseArr.calcuTotal(true);
        purseModal.value.$el.dismiss();
      }

      const cancelPurse = ()=>{
        purseModal.value.$el.dismiss();
      }

      const userInfo = computed(()=>{
          return store.getters.user == null ? null:store.getters.user;
      })

      const photoUrl = computed(()=>{
      
        return userInfo.value == null ||userInfo.value.photourl == "" ||userInfo.value.photourl == null?"/assets/img/avatar.svg":process.env.VUE_APP_BASE_API+'/'+userInfo.value.photourl;
      })

      
    
       return {add,mouthIncome,mouthExpenditure,mouthTotal,total,currMoney,purse,confirmPurse,purseModal,cancelPurse,chevronForwardOutline,userInfo,photoUrl}

    }
   
});
</script>
