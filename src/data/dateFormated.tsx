export const dateFormated=(date?:Date):String=>{
    var a:Date;

    if(date){
             a= date;

    }else{
             a= new Date();

    }
    console.log(JSON.stringify(a)); 
    var resultDate=''
    resultDate=
    [a.getFullYear(),
        a.getMonth()>9?(a.getMonth()+1):'0'+(a.getMonth()+1),
        a.getDate()>9?a.getDate():'0'+a.getDate(),
    ].join('-');
    resultDate= resultDate + ' ' +
    [
        a.getHours()>9?a.getHours():'0'+a.getHours(),
        a.getMinutes()>9?a.getMinutes():'0'+a.getMinutes(),
        a.getSeconds()>9?a.getSeconds():'0'+a.getSeconds(),
    ].join(':');

    return resultDate;
}

export const dateFormatedff=(date?:Date):String=>{
    var a:Date;
    if(date){
             a= date;

    }else{
             a= new Date();

    }
    var resultDate=''
    resultDate=
    [a.getFullYear(),
        a.getMonth()>9?(a.getMonth()+1):'0'+(a.getMonth()+1),
        a.getDate()>9?a.getDate():'0'+a.getDate(),
    ].join('-');
   resultDate=resultDate.substring(2,resultDate.length)
    return resultDate;
}

export const dateFormatedDateFiltered=(date?:Date):String|undefined=>{
    var a:Date;
    if(date){
             a= date;

    }else{
             return undefined;

    }
    var resultDate=''
    resultDate=
    [a.getFullYear(),
        a.getMonth()>9?(a.getMonth()+1):'0'+(a.getMonth()+1),
        a.getDate()>9?a.getDate():'0'+a.getDate(),
    ].join('-');
    return resultDate;
}