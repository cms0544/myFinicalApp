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
 
        <ion-list>
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
                 <ion-input  :value="updateCostItem.date"/>
                    <ion-button fill="clear" id="open-date-input-2">
                        <ion-icon :icon="calendar" />
                    </ion-button>
                    <ion-popover trigger="open-date-input-2" :show-backdrop="false">
                        <ion-datetime
                            presentation="date"
                             @ionChange="(ev: DatetimeCustomEvent) => updateCostItem.date = formatDate(ev.detail.value)"
                        />
                    </ion-popover>
             </ion-item>
              <ion-item>
                  <ion-label>
                      备注
                  </ion-label>
                  <ion-input   v-model="updateCostItem.decript" v-bind:value="updateCostItem.decript"   ></ion-input>
                 
             </ion-item>
             <ion-item>
                  <ion-label>
                      金额
                  </ion-label>
                  <ion-label slot="end">{{updateCostItem.price}}</ion-label>
                  
             </ion-item>
             <ion-item>
                 <ion-grid>
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
    ion-col{
            text-align: center;
            width: 50px;
            height: 50px;
            line-height: 40px;
            background: rgb(159, 159, 221);
            margin: 2px;
    }

    ion-input{
        text-align: right;
       
    }

  
</style>
<script lang="ts">
import { IonContent, IonHeader, IonTitle, IonToolbar,modalController,IonButtons,IonButton,IonList,IonItem,IonLabel,IonGrid,IonCol,IonRow,IonInput,IonToggle,IonDatetime,IonPopover,IonIcon} from '@ionic/vue';
import {  defineComponent } from 'vue';
import {  backspace ,calendar} from 'ionicons/icons';
import { Cost } from '@/store/cost';
import { format, parseISO } from  'date-fns'
import { CostArr } from '@/store/costArr';


export default defineComponent({
  name: 'addModal',
  props: {
     costItem: {  type:Cost,default:new Cost(0,"","0",format(new Date(),"yyyy-MM-dd"),0) }
  },
  data(){
      let costArr = new CostArr();

      return {
          updateCostItem:this.costItem,costArr
      }
  },
  setup() {
    const dismissModal= ()=>{
        modalController.dismiss();
    };
    
     const formatDate = (value: string) => {
        return format(parseISO(value), 'yyyy-MM-dd');
      };

    return {
      backspace,dismissModal,calendar,formatDate
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
        confirm:function(){
             this.costArr.add(this.updateCostItem);
             this.dismissModal();
        },
        add:async function(){
           
           this.costArr.add(this.updateCostItem);
            this.updateCostItem = new Cost();
            
        },

  },
 
  components: { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonButton,IonList,IonItem,IonLabel,IonGrid,IonCol,IonRow,IonInput,IonToggle,IonDatetime,IonPopover,IonIcon }
});
</script>