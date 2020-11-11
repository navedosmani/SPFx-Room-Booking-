import * as moment from 'moment';

export class EventFormat{
    
    public formateDate (ipDate:any) :any{
        return moment.utc(ipDate).format('YYYY-MM-DD hh:mm A'); 
    }
    public formatStartDate (ipDate:any) : any{
        let startDateMod = new Date(ipDate);
        startDateMod.setTime(startDateMod.getTime());
        
        return moment.utc(startDateMod).format('YYYY-MM-DD') + "T" + moment.utc(startDateMod).format("hh:mm") + ":00Z";
    }
    public formatEndDate (ipDate:any) :any {
        let endDateMod = new Date(ipDate);
        endDateMod.setTime(endDateMod.getTime());

        let nextDay = moment(endDateMod).add(1, 'days');
        return moment.utc(nextDay).format('YYYY-MM-DD') + "T" + moment.utc(nextDay).format("hh:mm") + ":00Z";
    }
}