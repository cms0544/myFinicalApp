import request from '@/utils/request'

export function insert(data){
   return request({
      url:"/costs/insertCost",
      method:"post",
      data
   })
}


export function get(params){
   
      return request({
         url:"/costs",
         method:"get",
         params
      })
   
}

export function del(id){
   return request({
      url:"/costs/delete/"+id,
      method:"delete"
   })
}