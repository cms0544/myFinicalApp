<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
                <ion-back-button></ion-back-button>
        </ion-buttons>
        
        <ion-title>月度报表</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
        <ion-input :value="selectYear" id="open-year-input" ></ion-input>
        <ion-modal class="yearModal" trigger="open-year-input">
          <ion-content  force-overscroll="false">
                <ion-datetime v-model="selectYear" @ionChange="confirmDate" doneText="确定" cancelText="取消" :show-default-buttons="true"  presentation="year"  >
                  <!-- <ion-buttons slot="buttons">
                    <ion-button color="danger" @click="cancelDate">取消</ion-button>
                    <ion-button color="primary" @click="confirmDate">确定</ion-button>
                  </ion-buttons> -->
                </ion-datetime>
          </ion-content>
        </ion-modal>
       
        <Chart :options="chartOptions"   ref="chart1"></Chart>
    </ion-content>
  </ion-page>
</template>
<style>
.highcharts-container {
  width: 200px;
  height: 100px;
  border: 1px solid #ddd;
  margin: auto;
}


</style>
<script lang="ts">
import { defineComponent,ref,onMounted  } from 'vue';

import {Chart} from 'highcharts-vue'

// import Highcharts from 'highcharts/highstock'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonBackButton,IonButtons,IonDatetime,IonInput,IonModal } from '@ionic/vue';
// import ExploreContainer from '@/components/ExploreContainer.vue';
import { Cost } from '@/store/cost';
import { CostArr } from '@/store/costArr';
import store from '@/store';
import { getYearFirstDate } from '@/utils/dateUtils';



export default defineComponent({
  name: 'TotalReport',
  components: {  IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonBackButton,IonDatetime,IonButtons,Chart,IonInput,IonModal },
  setup(){
      const selectYear = ref(new Date().getFullYear());
      const chartOptions = ref({});
      const chart1 = ref(null);
      const costArr:CostArr = new CostArr();
      const options = 	[{value: 10, name: "10KG"}, {value: 20, name: "20KG"}];
      const tempselect = ref(20);
      const loadChart=async ()=>{
      
        // let monthData = await costArr.getlistByMonth((item:Cost)=>{return new Date(item.date).getFullYear() == selectYear.value});
       let monthData =await store.dispatch("GetMonthData",{datefrom:getYearFirstDate(new Date(new Date().setFullYear(selectYear.value)))});
        let categories = [];
            monthData.forEach((item)=>{
              categories.push(item.name);
            })
            chartOptions.value = { 
            title:{
              text:"年报表"
            },
            xAxis:{
              categories:categories,
              title:{
                  text:'月份'
              }
            },
            yAxis:{
              title:{
                  text:'金额'
              }
            },
             chart: {
                type: 'column'
            },
            series:[{
              name:"收入",
              data:monthData 
            }]};
 
              setTimeout(function(){
                 if(chart1.value!=null){
                   
                    chart1.value.chart.reflow();
                  }
              
              },0);
      }
      onMounted(async ()=>{
            
            await loadChart();
     
      });

    

     const confirmDate=async ()=>{
        //选日期
         await loadChart();
      }

      return {chartOptions,chart1,selectYear,options,tempselect,confirmDate}
  }
  

  
});
</script>
<style>
  .yearModal {
        --height: 250px;
        --border-radius: 16px;
        --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .yearModal::part(backdrop) {
        background: rgba(0, 0, 0);
        --backdrop-opacity:0.5;
    }

    #open-year-input{
      text-align: center;
    }
</style>
