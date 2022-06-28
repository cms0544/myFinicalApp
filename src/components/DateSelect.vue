<template>
        <ion-input  :value="value"/>
                    <ion-button fill="clear" :id="dateid" expand="block">
                        <ion-icon :icon="calendar"  />
                    </ion-button>
                    <ion-modal class="smallModal" :trigger="dateid"  >
                        <ion-content force-overscroll="false">   
                                <ion-datetime
                                presentation="date"
                                :show-default-buttons="true"
                                cancelText="取消"
                                doneText="确定"
                                    @ionChange="selectDate"
                                />
                          </ion-content>
                    </ion-modal>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { IonInput,IonDatetime,IonButton,IonIcon,IonModal,IonContent } from '@ionic/vue';
import {  calendar} from 'ionicons/icons';
import { format, parseISO } from  'date-fns'
export default defineComponent({
  name: 'DateSelect',
  props: {
    value:String,
    dateid:{
                type: String,
                default: function () {
                  return "open-date";
                }
    },
  },
  setup(props,{emit}){
     const formatDate = (value: string) => {
        return format(parseISO(value), 'yyyy-MM-dd');
      };

    const selectDate=(e)=>{
        emit("update:value",formatDate(e.detail.value));
    }

    return {calendar,selectDate};
  },
  components:{IonInput,IonDatetime,IonButton,IonIcon,IonModal,IonContent }
});
</script>

<style scoped>
   .smallModal {
        --height: 350px;
        --border-radius: 16px;
        --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .smallModal::part(backdrop) {
        background: rgba(0, 0, 0);
        --backdrop-opacity:0.5;
    }
</style>