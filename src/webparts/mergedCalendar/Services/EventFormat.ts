import * as moment from 'moment';


export const formateDate = (ipDate:any) :any => {
    return moment.utc(ipDate).format('YYYY-MM-DD hh:mm A'); 
}

export const formatStartDate = (ipDate:any) : any => {
    let startDateMod = new Date(ipDate);
    startDateMod.setTime(startDateMod.getTime());
    
    return moment.utc(startDateMod).format('YYYY-MM-DD') + "T" + moment.utc(startDateMod).format("hh:mm") + ":00Z";
}

export const formatEndDate = (ipDate:any) :any => {
    let endDateMod = new Date(ipDate);
    endDateMod.setTime(endDateMod.getTime());

    let nextDay = moment(endDateMod).add(1, 'days');
    return moment.utc(nextDay).format('YYYY-MM-DD') + "T" + moment.utc(nextDay).format("hh:mm") + ":00Z";
}

export const formatStrHtml = (str: string) : any => {
    let parser = new DOMParser();
    let htmlEl = parser.parseFromString(str, 'text/html');
    console.log(htmlEl.body)
    return htmlEl.body;
}


