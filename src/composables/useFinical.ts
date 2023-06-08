import { modalController } from '@ionic/vue'
import  addModal  from '@/modal/addModal.vue'
import { Cost } from '@/store/cost';

export function useFinical(cost:Cost, callback:()=>void){
    const addFinical = async ()=>{
       const costItem = Object.assign({},cost);
        const modal = await modalController
            .create({
            component: addModal,
            canDismiss:true,
            cssClass: 'my-custom-class',
            mode:'ios',
            componentProps: {
                costItem
                
            },
            
            });

            
         
        await modal.present();

         await modal.onDidDismiss();

      
        // if(modalRepson.data.success == true){
            callback();
        // }
        
        
       
    }

    

    return {
        addFinical
    }
}