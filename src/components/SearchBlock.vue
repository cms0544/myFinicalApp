<template>
        <ion-list class="searchBlock">
                <ion-item>
                       <ion-label>价格范围</ion-label>
                       <ion-input class="priceinput" :value="tempsearchCondition.pricestart" v-model="tempsearchCondition.pricestart"></ion-input> - <ion-input class="priceinput" :value="tempsearchCondition.priceend"  v-model="tempsearchCondition.priceend"></ion-input>
                </ion-item>
                 <ion-item>
                       <ion-label>时间范围</ion-label>
                        <DateSelect v-model:value="tempsearchCondition.datestart" dateid="datestart"   ></DateSelect> -  <DateSelect  v-model:value="tempsearchCondition.dateend" dateid="dateend"  ></DateSelect>
                </ion-item>
                 <ion-item>
                       <ion-label>关键字</ion-label>
                       <ion-input class="keyinput" :value="tempsearchCondition.searchkey"  v-model="tempsearchCondition.searchkey"></ion-input>
                </ion-item>
                  <ion-item>
                       <ion-label>收入类型</ion-label>
                       <ion-select :value="tempsearchCondition.costType" okText="确定" cancelText="取消" v-model="tempsearchCondition.costType">
                              <ion-select-option :value="-1">全部</ion-select-option>
                               <ion-select-option :value="0">收入</ion-select-option>
                                <ion-select-option :value="1">支出</ion-select-option>
                        </ion-select>

                </ion-item>
                 <div style="text-align: center;">
                 
                  <ion-button @click="searchFinish">
                     搜索
                 </ion-button>
            </div>
                
           </ion-list>
</template>


<script lang="ts">
import { defineComponent,ref } from 'vue';
import { IonList,IonItem,IonLabel,IonSelect,IonInput,IonSelectOption } from '@ionic/vue';
import {  calendar} from 'ionicons/icons';
import DateSelect from  '@/components/DateSelect.vue'
import { searchCondition } from '../store/searchCondition';
import { CostType } from '../enum/costType';
export default defineComponent({
  name: 'SearchBlock',
  props: {
    mySearchCondition:{
        type:searchCondition,
        default: function () {
                  return new searchCondition(0,0,'','','',CostType.All);
         }
    }
  },
  setup(props,{emit}){

    const changeVal= (e:CustomEvent,attr:string)=>{
      alert('11');
      console.log(e)
      tempsearchCondition.value[attr]= e.detail.value;
    }
    const tempsearchCondition = ref(props.mySearchCondition);
     

     const searchFinish =()=>{
        emit('searchFinish',tempsearchCondition.value);
     }
    return {calendar,searchFinish,tempsearchCondition,changeVal};
  },
  components:{IonList,IonItem,IonLabel,IonSelect,DateSelect,IonInput,IonSelectOption }
});
</script>

<style scoped>
.searchBlock .priceinput{
    border: 1px solid #3880ff;
    height: 30px;
    text-align: right;
}

.searchBlock .keyinput{
  text-align: right;
}
      
</style>