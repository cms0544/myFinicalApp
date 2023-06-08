<template>
        <ion-item-divider >
            <ion-label>{{keyitem}}</ion-label>   
              <ion-label slot="end">花费:{{-total}}</ion-label>  
         </ion-item-divider>
         <ion-item v-for="(item,index) of value" :key="index" @click="showModal(item)"    @touchstart="touchlong(item)"   @touchend="touchlongend"      >
             <ion-label>
              {{item.descript}}
                 <ion-badge :color="item.costtype==0?'primary':'danger'">
                      {{item.costtype==0?"收入":"支出"}}
                  </ion-badge>
              </ion-label>
            
              
             <ion-label slot="end">   {{item.price}}</ion-label> 
            
              
         </ion-item>  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cost } from '@/store/cost';
import { IonItemDivider,IonLabel,IonItem,alertController,IonBadge } from '@ionic/vue';
import { CostArr } from '@/store/costArr';
import { useFinical } from '@/composables/useFinical'
import store from '@/store';


export default defineComponent({
  name: 'DateItemContainer',
  props: {
    keyitem: String,
    total:String,
    value:Array<Cost> 
  },
  setup(props,{emit}){
    let longtimer:number ;
    let costArr = new CostArr();
    const touchlong = (tempitem:Cost)=>{
       debugger
      longtimer = window.setTimeout( ()=>{

      store.dispatch("confirmRemoveCost",{updateCostItem:tempitem,callback:()=>{
        emit('valchange');
      }});
      //  debugger
 
      
      },1000);
    }

    const touchlongend = ()=>{
      clearTimeout(longtimer);
    }

    const showModal = (item:Cost)=>{
      useFinical(item,()=>{emit('valchange')}).addFinical();
    }
  

    return {touchlong,touchlongend,showModal,costArr};
  },
  components:{IonItemDivider,IonLabel,IonItem,IonBadge}
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
