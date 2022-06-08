<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">test</ion-title>
        </ion-toolbar>
      </ion-header>
      
        <ion-fab-button >
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { add } from 'ionicons/icons';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonFabButton,IonIcon } from '@ionic/vue';
// import ExploreContainer from '@/components/ExploreContainer.vue';

export default defineComponent({
  name: 'Tab2Page',
  components: {  IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonFabButton,IonIcon },
    setup(){
       return {add}

    }
});
</script>
