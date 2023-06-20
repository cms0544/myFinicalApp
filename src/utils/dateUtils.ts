export  function getLastDate(date:Date){
    const year = date.getFullYear();
    let month = (date.getMonth()+1).toString();
    let day = (new Date(year,parseInt(month),0).getDate()).toString();
    if(parseInt(month)<10) month ='0'+ month;
    if(parseInt(day)<10) day = '0'+date;
    return [year,month,day].join("-");
}

export  function getFirstDate(date:Date){
    const year = date.getFullYear();
    let month = (date.getMonth()+1).toString();
    const day = "01";
    if(parseInt(month)<10) month ='0'+ month;

    return [year,month,day].join("-");
}

export  function getYearFirstDate(date:Date){
    const year = date.getFullYear();
   

    return [year,"01","01"].join("-");
}

export function formatDate(date:Date){
    const year = date.getFullYear();
    let month = (date.getMonth()+1).toString();
    let day = date.getDate().toString();
    if(parseInt(month)<10) month ='0'+ month;
    if(parseInt(day)<10) day =  '0'+ day;
    return [year,month,day].join("-");
}