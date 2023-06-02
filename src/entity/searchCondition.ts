import { CostType } from "@/enum/costType";

export class searchCondition{
    pricefrom:number;
    priceto:number;
    datefrom:string;
    dateto:string;
    key:string;
    costtype:CostType;

    constructor(pricefrom,priceto,datefrom,dateto,key,costtype){
        this.pricefrom = pricefrom;
        this.priceto = priceto;
        this.datefrom = datefrom;
        this.dateto = dateto;
        this.key = key;
        this.costtype = costtype;
    }
}