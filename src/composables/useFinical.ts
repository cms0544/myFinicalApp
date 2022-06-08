import { modalController } from '@ionic/vue'
import  addModal  from '@/modal/addModal.vue'
import { Cost } from '@/store/cost';

export function useFinical(cost:Cost){
    console.log(cost);
    const addFinical = async ()=>{
        console.log('test22');
        const modal = await modalController
            .create({
            component: addModal,
            canDismiss:true,
            cssClass: 'my-custom-class',
            mode:'ios',
            componentProps: {
                costItem:cost
                
            },
            
            });

            
      
        return modal.present();
    }

    

    return {
        addFinical
    }
}