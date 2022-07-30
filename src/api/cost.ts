import request from '@/utils/request'

export function insert(data){
   return request({
      url:"/insertCost",
      method:"post",
      data
   })
}


export function get(lastUpdateTime){
   if(lastUpdateTime == null){
      return request({
         url:"/getCost",
         method:"get"
       
      })
   }else{
      return request({
         url:"/getCost",
         method:"get",
         params:{lastUpdateTime}
      })
   }
 
}