<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>增加收入</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="dismissModal()">
                    关闭
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
      
    </ion-header>
    <ion-content>
 
        <ion-list class="addInput">
             <ion-item>
                  <ion-label>
                      类型
                  </ion-label>
                   <ion-label slot="end">
                       收入
                      <ion-toggle color="primary" v-model="updateCostItem.costtype" :checked="updateCostItem.costtype==0"></ion-toggle>
                      支出
                  </ion-label>
             </ion-item>
               <ion-item>
                  <ion-label>
                     时间
                  </ion-label>

                  <DateSelect v-model:value="updateCostItem.date"  ></DateSelect>
      
             </ion-item>
              <ion-item>
                  <ion-label>
                      备注
                  </ion-label>
                  <ion-input   v-model="updateCostItem.descript" v-bind:value="updateCostItem.descript"   ></ion-input>
                 
             </ion-item>
             <ion-item>
                  <ion-label>
                      金额
                  </ion-label>
                  <ion-label slot="end">{{updateCostItem.price}}</ion-label>
                  
             </ion-item>
             <ion-item>
                 <ion-grid class="inputNumber">
                   <ion-row  v-for="row of 3" v-bind:key="row">
                       <ion-col v-for="col of 3" v-bind:key="col" @click="ClickNumber( ((row-1)*3 + col))">
                           {{(row-1)*3 + col}}
                       </ion-col>
                   </ion-row>
                   <ion-row>
                        <ion-col @click="ClickNumber('.')">.</ion-col>
                        <ion-col @click="ClickNumber(0)">0</ion-col>
                        <ion-col  @click="BackSpaceNumber()"><ion-icon :icon="backspace" ></ion-icon></ion-col>
                   </ion-row>
                 </ion-grid>
             </ion-item>
            <div style="text-align: center;">
                 <ion-button  @click="confirm">
                     确定
                 </ion-button>
                  <ion-button @click="add">
                     再记一笔
                 </ion-button>
            </div>
                
        </ion-list>
    </ion-content>
</template>
<style>
    .inputNumber ion-col{
            text-align: center;
            width: 50px;
            height: 50px;
            line-height: 40px;
            background: rgb(159, 159, 221);
            margin: 2px;
    }

    .addInput ion-input{
        text-align: right;
       
    }

 

 
  
</style>
<script lang="ts">
import { IonContent, IonHeader, IonTitle, IonToolbar,modalController,IonButtons,IonButton,IonList,IonItem,IonLabel,IonGrid,IonCol,IonRow,IonInput,IonToggle,IonIcon} from '@ionic/vue';
import {  defineComponent,ref } from 'vue';
import {  backspace ,calendar} from 'ionicons/icons';
import { Cost } from '@/store/cost';
import { CostArr } from '@/store/costArr';
import { format } from  'date-fns'
import  DateSelect  from '@/components/DateSelect.vue'
import store from '@/store';

export default defineComponent({
  name: 'addModal',
  props: {
     costItem: {  type:Cost,default:new Cost(0,"","0",format(new Date(),"yyyy-MM-dd"),0) }
  },
 
  setup(props) {
    const dismissModal= ()=>{

      
        modalController.dismiss({success:true});
    };

    const costArr = new CostArr();
  
  
    const  updateCostItem = ref(props.costItem);
     
    
    

    const selectDate =  (value) => { 
        updateCostItem.value.date =value;
    }


    return {
      backspace,dismissModal,calendar,updateCostItem,selectDate,costArr
    }
  },
  methods:{
        ClickNumber : function(value:any){
            if(value == "."){
                    if( this.updateCostItem.price.toString().indexOf(".")!=-1){
                      return;
                    }  
            }
                         
            if(this.updateCostItem.price == "0" && value!="."){
                 this.updateCostItem.price = value;
            }else{
                this.updateCostItem.price = this.updateCostItem.price.toString() + value;   
                
            }
          
        },
        BackSpaceNumber:function(){
            let temprice = this.updateCostItem.price.toString().substring(0,this.updateCostItem.price.toString().length-1);
            this.updateCostItem.price = temprice==""?"0":temprice;
        
        },
        confirm:async function(){

            if(typeof this.updateCostItem.costtype == "boolean"){
                this.updateCostItem.costtype =this.updateCostItem.costtype?1:0;
            }
             let  returnVal = await store.dispatch("addCost",this.updateCostItem);
                if(returnVal){
                         this.dismissModal();
                         this.$emit("valchange");
                }
            
        },
        add:async function(){
           
            
                let returnVal = await store.dispatch("addCost",this.updateCostItem);
                if(returnVal){
                        this.updateCostItem = new Cost();
                }
            
          
            
           
      
        },

  },
 
  components: { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonButton,IonList,IonItem,IonLabel,IonGrid,IonCol,IonRow,IonInput,IonToggle,IonIcon,DateSelect }
});
</script>