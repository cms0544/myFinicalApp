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
      url:"/costs/remove/"+id,
      method:"delete"
   })
}

export function getSum(params){
   return request({
      url:"/costs/getsum",
      method:"get",
      params
   })
}

export function getMonthTotal(params){
   return request({
      url:"/costs/getSumByMonth",
      method:"get",
      params
   })
}
