<template>
  <ion-page >
    <ion-header>
      <ion-toolbar>
        <ion-title>账单详情</ion-title>
      </ion-toolbar>
      
    </ion-header>
    <ion-content :fullscreen="true" id="main">
          <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
            <ion-refresher-content
              :pulling-icon="chevronDownCircleOutline"
              pulling-text="Pull to refresh"
              refreshing-spinner="circles"
              refreshing-text="Refreshing...">
            </ion-refresher-content>
          </ion-refresher>
       
       <div class="flexbox">
           <div>总收入:{{income}}</div>
           <div class="search" @click="search">筛选</div>
       </div>
       <ion-list>
           <DateItemContainer v-for="(item,key) of finialArr" :total="totalJson[key].total" :key="key" :keyitem="key" :value="item" @valchange="valchange"></DateItemContainer>
       </ion-list>
       <ion-fab vertical="bottom" sasd="asdas" horizontal="center" slot="fixed">
        <ion-fab-button @click="addFinical()">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>

    <ion-menu side="end" menu-id="first" content-id="main" class="my-custom-menu">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>搜索条件</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
            <SearchBlock :mySearchCondition="mySearchCondition" @searchFinish="searchFinish"></SearchBlock>
      </ion-content>
    </ion-menu>
  </ion-page>
  
</template>
<style>
  ion-refresher{
    background: #fff;
  }

  .ion-page{
    background: #fff;;
  }

  .flexbox{
    display: flex;
    padding: 10px;
  }

  .search{
    text-align: right;
    flex: 1;
  }

  .my-custom-menu {
    --width: 350px;
  }
</style>
<script lang="ts">
import { defineComponent,onBeforeMount,Ref,ref} from 'vue';
import { Cost } from '@/store/cost';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonList,IonFab,IonFabButton,IonIcon,IonRefresher,IonRefresherContent, RefresherCustomEvent,IonMenu,menuController, onIonViewWillEnter, onIonViewWillLeave,useBackButton, useIonRouter} from '@ionic/vue';
import { add,chevronDownCircleOutline } from 'ionicons/icons';
import { useFinical } from '@/composables/useFinical'
import  DateItemContainer  from '@/components/DateItemContainer.vue'
import { CostArr } from '@/store/costArr';

import { getFirstDate,getLastDate} from '@/utils/dateUtils'
import SearchBlock from '@/components/SearchBlock.vue'
import {searchCondition} from '@/entity/searchCondition'
import { CostType } from '@/enum/costType';
import store from '@/store';
import {App} from  '@capacitor/app';
import { Toast } from '@capacitor/toast';

export default  defineComponent({
  name: 'FinicalListPage', 
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonList,IonFab,IonFabButton,IonIcon,DateItemContainer,IonRefresher,IonRefresherContent,IonMenu,SearchBlock},
   setup(){
    // let item:Cost = new Cost( 0,  "",0, new Date());
    
     let costArr = new CostArr();
     const income = ref(0);

     const totalJson = ref({});

     const mySearchCondition= ref(new searchCondition(null,null,getFirstDate(new Date()),getLastDate(new Date()),'',CostType.All));

    //  const SearchCallback = ref((item:Cost)=>{ return new Date(item.date).getMonth() == new Date().getMonth()});
    // let finialArr = {'2022-06-05':[

    //   new Cost( 1,  "2333","222", '2022-06-05')
    // ],"2022-06-06":[new Cost( 2,  "122","222", '2022-06-06'),new Cost( 2,  "122","222", '2022-06-06')]
    // };
    let finialArr = ref({}) as Ref<Record<string,Cost[]>> ;
    //重新刷新数据
    const resfreshList = async ( )=>{
 
        await store.dispatch('getCost',mySearchCondition.value);
        let { incomeval,data,total} = store.getters.costJson();

        finialArr.value = data;
        income.value = incomeval;
        totalJson.value = total;
        // income.value = await costArr.getSumBySearch(SearchCallback.value);
    }

    const doRefresh =async (event: RefresherCustomEvent)=>{
      resfreshList();
       event.target.complete();
     
    }
    const valchange = async ()=>{
      // SearchCallback.value= (item:Cost)=>{ return }; //编辑完出来

       resfreshList();
       addFinical.value = useFinical(new Cost( 0,  "","0", costArr.formatdate(),1),valchange ).addFinical;

    };
    
    const search = async ()=>{
       menuController.open('first');
    }
  



    let addFinical = ref(useFinical(new Cost( 0,  "","0", costArr.formatdate(),1),valchange ).addFinical)

    const searchFinish = (val)=>{
      mySearchCondition.value = val;

    
      // SearchCallback.value = callback;
      menuController.close('first');
      resfreshList();
    }

    onIonViewWillEnter(()=>{
 
        resfreshList();

       
        addFinical = ref(useFinical(new Cost( 0,  "","0", costArr.formatdate(),1),valchange ).addFinical);
    })

    // onIonViewWillLeave(()=>{
      
    // })
  
  
  
    onBeforeMount(async ()=>{
     
     
       resfreshList();


    });

    const ionRouter = useIonRouter();
    let curBackTime =ref(0);
    useBackButton(-1,async ()=>{
      
      if(! ionRouter.canGoBack()){
        //当前按的时间和上一次对比
        
        if(new Date().getTime() - curBackTime.value> 2000){
            await Toast.show({
              text: '是否要退出app!',
            });
            curBackTime.value = new Date().getTime() ;
        }else{
        
             App.exitApp();
        }
      }


         

    });

 

    return { finialArr,add,addFinical,valchange,doRefresh,chevronDownCircleOutline,income,search,mySearchCondition,searchFinish,totalJson};
  }
});
</script>
