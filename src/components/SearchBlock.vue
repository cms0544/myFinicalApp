<template>
        <ion-list class="searchBlock">
                <ion-item>
                       <ion-label>价格范围</ion-label>
                       <ion-input class="priceinput" :value="tempsearchCondition.pricefrom" v-model="tempsearchCondition.pricefrom"></ion-input> - <ion-input class="priceinput" :value="tempsearchCondition.priceto"  v-model="tempsearchCondition.priceto"></ion-input>
                </ion-item>
                 <ion-item>
                       <ion-label>开始日期</ion-label>
                        <DateSelect v-model:value="tempsearchCondition.dateto" dateid="datestart"   ></DateSelect> 
                </ion-item>
                <ion-item>
                       <ion-label>结束日期</ion-label>
                        <DateSelect  v-model:value="tempsearchCondition.datefrom" dateid="dateend"  ></DateSelect>
                </ion-item>
                 <ion-item>
                       <ion-label>关键字</ion-label>
                       <ion-input class="keyinput" :value="tempsearchCondition.key"  v-model="tempsearchCondition.key"></ion-input>
                </ion-item>
                  <ion-item>
                       <ion-label>收入类型</ion-label>
                       <ion-select :value="tempsearchCondition.costtype" okText="确定" cancelText="取消" v-model="tempsearchCondition.costtype">
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
import { searchCondition } from '../entity/searchCondition';
import { CostType } from '../enum/costType';
import { getFirstDate, getLastDate } from '@/utils/dateUtils';
export default defineComponent({
  name: 'SearchBlock',
  props: {
    mySearchCondition:{
        type:searchCondition,
        default: function () {
                  return new searchCondition(0,0,getFirstDate(new Date()),getLastDate(new Date()),'',CostType.All);
         }
    }
  },
  setup(props,{emit}){

    const changeVal= (e:CustomEvent,attr:string)=>{
      if(tempsearchCondition.value!=null){
        tempsearchCondition.value[attr]= e.detail.value;
      }
    
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