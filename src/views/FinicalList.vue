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
           <DateItemContainer v-for="(item,key) of finialArr" :key="key" :keyitem="key" :value="item" @valchange="valchange"></DateItemContainer>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonList,IonFab,IonFabButton,IonIcon,IonRefresher,IonRefresherContent, RefresherCustomEvent,IonMenu,menuController, onIonViewWillEnter, onIonViewWillLeave} from '@ionic/vue';
import { add,chevronDownCircleOutline } from 'ionicons/icons';
import { useFinical } from '@/composables/useFinical'
import  DateItemContainer  from '@/components/DateItemContainer.vue'
import { CostArr } from '@/store/costArr';


import SearchBlock from '@/components/SearchBlock.vue'
import {searchCondition} from '@/store/searchCondition'
import { CostType } from '@/enum/costType';
import store from '@/store';

export default  defineComponent({
  name: 'FinicalListPage', 
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonList,IonFab,IonFabButton,IonIcon,DateItemContainer,IonRefresher,IonRefresherContent,IonMenu,SearchBlock},
   setup(){
    // let item:Cost = new Cost( 0,  "",0, new Date());
    
     let costArr = new CostArr();
     const income = ref(0);

     const mySearchCondition= ref(new searchCondition(0,0,'','','',CostType.All));

     const SearchCallback = ref((item:Cost)=>{ return new Date(item.date).getMonth() == new Date().getMonth()});
    // let finialArr = {'2022-06-05':[

    //   new Cost( 1,  "2333","222", '2022-06-05')
    // ],"2022-06-06":[new Cost( 2,  "122","222", '2022-06-06'),new Cost( 2,  "122","222", '2022-06-06')]
    // };
    let finialArr = ref({}) as Ref<Record<string,Cost[]>> ;
    //重新刷新数据
    const resfreshList = async ( )=>{
 
        finialArr.value =await costArr.getlist(SearchCallback.value);
        income.value = await costArr.getSumBySearch(SearchCallback.value);
    }

    const doRefresh =async (event: RefresherCustomEvent)=>{
      resfreshList();
       event.target.complete();
     
    }
    const valchange = async ()=>{
      SearchCallback.value= (item:Cost)=>{ return new Date(item.date).getMonth() == new Date().getMonth()}; //编辑完出来
       resfreshList();
       addFinical.value = useFinical(new Cost( 0,  "","0", costArr.formatdate(),1),valchange ).addFinical;

    };
    
    const search = async ()=>{
       menuController.open('first');
    }
  



    let addFinical = ref(useFinical(new Cost( 0,  "","0", costArr.formatdate(),1),valchange ).addFinical)

    const searchFinish = (val)=>{
      mySearchCondition.value = val;
      console.log(new Date(mySearchCondition.value.datestart));
      let callback = (item:Cost)=>{
        
        let pricebool = true;
        if(mySearchCondition.value.pricestart!= 0 &&mySearchCondition.value.pricestart!= null){
          pricebool =pricebool && parseFloat(item.price)>=mySearchCondition.value.pricestart;
        }

       if(mySearchCondition.value.priceend!= 0 &&mySearchCondition.value.priceend!= null){
          pricebool =pricebool && parseFloat(item.price)<=mySearchCondition.value.priceend;
        }

         let datebool = true;
        if(mySearchCondition.value.datestart!= "" &&mySearchCondition.value.datestart!= null){
          datebool =datebool && new Date(item.date).getTime()>=new Date(mySearchCondition.value.datestart).getTime();
        }

         if(mySearchCondition.value.dateend!= "" &&mySearchCondition.value.dateend!= null){
          datebool =datebool && new Date(item.date).getTime()<=new Date(mySearchCondition.value.dateend).getTime();
        }
        let keybool = true;
        if(mySearchCondition.value.searchkey!="" && mySearchCondition.value.searchkey!= null){
          keybool = keybool && item.decript.indexOf(mySearchCondition.value.searchkey)!=-1;
        }

        let costtypebool = true;
        if( mySearchCondition.value.costType!= CostType.All){
          costtypebool = costtypebool && item.costtype == mySearchCondition.value.costType;
        }

        return pricebool && datebool && keybool && costtypebool;
      }

      SearchCallback.value = callback;
      menuController.close('first');
      resfreshList();
    }

    onIonViewWillEnter(()=>{
        store.dispatch("StartTimer");

        resfreshList();

    })

    onIonViewWillLeave(()=>{
        store.dispatch("ClearTimer");

    })
  
  
  
    onBeforeMount(async ()=>{
     
     
       resfreshList();


    });

 

    return { finialArr,add,addFinical,valchange,doRefresh,chevronDownCircleOutline,income,search,mySearchCondition,searchFinish};
  }
});
</script>
