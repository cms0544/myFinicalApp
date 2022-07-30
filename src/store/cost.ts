import { format } from  'date-fns'
export  class Cost{
    id: number;
    decript:string;
    price:string;
    date:string;
    costtype: number;
    isupload:boolean;

   
    constructor(id=0,decript="",price="0",date=format(new Date(),"yyyy-MM-dd"),costtype=1){
        this.id = id;
        this.decript = decript;
        this.price = price;
        this.date = date;
        this.costtype = costtype;
    }

   

   
}
 