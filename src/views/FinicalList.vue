<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>账单详情</ion-title>
      </ion-toolbar>
      
    </ion-header>
    <ion-content :fullscreen="true">
          <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
            <ion-refresher-content
              :pulling-icon="chevronDownCircleOutline"
              pulling-text="Pull to refresh"
              refreshing-spinner="circles"
              refreshing-text="Refreshing...">
            </ion-refresher-content>
          </ion-refresher>
       

       <ion-list>
           <DateItemContainer v-for="(item,key) of finialArr" :key="key" :keyitem="key" :value="item" @valchange="valchange"></DateItemContainer>
       </ion-list>
       <ion-fab vertical="bottom" sasd="asdas" horizontal="center" slot="fixed">
        <ion-fab-button @click="addFinical()">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  
  </ion-page>
   
</template>
<style>
  ion-refresher{
    background: #fff;
  }

  .ion-page{
    background: #fff;;
  }
</style>
<script lang="ts">
import { defineComponent,onBeforeMount,Ref,ref} from 'vue';
import { Cost } from '@/store/cost';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonList,IonFab,IonFabButton,IonIcon,IonRefresher,IonRefresherContent, RefresherCustomEvent} from '@ionic/vue';
import { add,chevronDownCircleOutline } from 'ionicons/icons';
import { useFinical } from '@/composables/useFinical'
import  DateItemContainer  from '@/components/DateItemContainer.vue'
import { CostArr } from '@/store/costArr';
import { format} from  'date-fns'
export default  defineComponent({
  name: 'FinicalListPage', 
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonList,IonFab,IonFabButton,IonIcon,DateItemContainer,IonRefresher,IonRefresherContent},
   setup(){
    // let item:Cost = new Cost( 0,  "",0, new Date());
    
     let costArr = new CostArr();
    // let finialArr = {'2022-06-05':[

    //   new Cost( 1,  "2333","222", '2022-06-05')
    // ],"2022-06-06":[new Cost( 2,  "122","222", '2022-06-06'),new Cost( 2,  "122","222", '2022-06-06')]
    // };
    let finialArr = ref({}) as Ref<Record<string,Cost[]>> ;
    const doRefresh =async (event: RefresherCustomEvent)=>{
       finialArr.value =await costArr.getlist();
       event.target.complete();
     
    }
    const valchange = async ()=>{
     
       finialArr.value =await costArr.getlist();

    };
    onBeforeMount(async ()=>{
     

       finialArr.value =await costArr.getlist();

    })


    const addCost = new Cost( 0,  "","0", format(new Date(),"yyyy-MM-dd"),1);
    const { addFinical } =useFinical(addCost );

    return { finialArr,add,addFinical,valchange,doRefresh,chevronDownCircleOutline};
  }
});
</script>
