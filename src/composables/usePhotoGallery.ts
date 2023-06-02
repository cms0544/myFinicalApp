import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { ref } from 'vue';
import { FileTransfer, FileUploadOptions, FileTransferObject  } from "@ionic-native/file-transfer"
import { Directory, Filesystem} from '@capacitor/filesystem';


export function usePhotoGallery(img){
    const photos = ref<UserPhoto>({
        base64data: "",
        webviewPath: img
    });
    
    
    const takePhoto = async () => {
        // alert("test");
         const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri
        });

        const response =await fetch(photo.webPath);
        const blob = await response.blob();
        const base64Data =(await convertBlobToBase64(blob)) as string;

        const savedFile = await Filesystem.writeFile({
            path:new Date().getTime() + '.jpeg',
            data:base64Data,
            directory:Directory.Data
        })
        alert(JSON.stringify(photo));
        alert(JSON.stringify(savedFile));
        // if(photourl){
        //     // const base64url =  'data:image/jpeg;base64,' + photourl;

        //     const savedFileImage:UserPhoto  = await savePicture(photourl);
        //     photos.value = savedFileImage;
        // }
        
      
      
    
    }

    const convertBlobToBase64 = (blob:Blob) =>{
        return new Promise((resolve,reject)=>{
            const reader  = new FileReader();
            reader.onerror = reject;
            reader.onload = ()=>{
                resolve(reader.result);
            }
            reader.readAsDataURL(blob)
        });
    }

    const savePicture = async(photoStr: string):Promise<UserPhoto> =>{
    
        const options: FileUploadOptions = {
            fileKey: 'file',
            fileName: "test.jpg",
            mimeType:"image/jpeg",
            httpMethod:"post",
            headers: {}
          
         }

       
   
         try{
            const fileTransfer: FileTransferObject = await FileTransfer.create();
            const data = await fileTransfer.upload(photoStr,"http://192.168.1.101:9999/upload",options);
            console.log(data);
         }catch(ex){
            console.log(ex);
         }
       
        return {
            base64data:"",
            webviewPath:photoStr
        }

    }





    return{
        takePhoto,
        photos
    }
}

export interface UserPhoto{
    base64data?:string;
    webviewPath?:string;
}