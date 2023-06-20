import { Purse } from '@/store/purse'
import request from '@/utils/request'


export function getCurrentPrice(){
    return request({
        url:"/curentprice/getTopOneCurrentPrice",
        method:"get"
    })
}

export function insertCurrentPrice(purse:Purse){
    return request({
        url:"/curentprice/insertCurrentPrice",
        method:"post",
        data:purse
    })
}