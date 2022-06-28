import { CostType } from "@/enum/costType";

export class searchCondition{
    pricestart:number;
    priceend:number;
    datestart:string;
    dateend:string;
    searchkey:string;
    costType:CostType;

    constructor(pricestart,priceend,datestart,dateend,searchkey,costType){
        this.pricestart = pricestart;
        this.priceend = priceend;
        this.datestart = datestart;
        this.dateend = dateend;
        this.searchkey = searchkey;
        this.costType = costType;
    }
}