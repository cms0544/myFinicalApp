import { format } from  'date-fns'
export  class Cost{
    id: number;
    descript:string;
    price:string;
    date:string;
    costtype: number;
    isupload:boolean;

   
    constructor(id=0,descript="",price="0",date=format(new Date(),"yyyy-MM-dd"),costtype=1){
        this.id = id;
        this.descript = descript;
        this.price = price;
        this.date = date;
        this.costtype = costtype;
    }

   

   
}
 