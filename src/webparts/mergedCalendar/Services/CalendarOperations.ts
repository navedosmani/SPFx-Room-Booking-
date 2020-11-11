import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from "@microsoft/sp-http";
import * as moment from 'moment';
import {EventFormat} from '../Services/EventFormat';

export class CalendarOperations{

    public _evtFormat : EventFormat;

    public getCalSettings(context:WebPartContext, listName: string) : Promise <{}[]>{
        let restApiUrl : string = context.pageContext.web.absoluteUrl + "/_api/web/lists/getByTitle('"+listName+"')/items" ;
        var calSettings : {}[] = [];

        return new Promise <{}[]> (async(resolve, reject)=>{
            context.spHttpClient
                .get(restApiUrl, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse)=>{
                    response.json().then((results:any)=>{
                        calSettings = results.value;
                        resolve(calSettings);
                    })
                })
        })
    }

    public getCalsData(context: WebPartContext, calName:string) : Promise <{}[]>{
        let restApiUrl : string = context.pageContext.web.absoluteUrl + "/_api/web/lists/getByTitle('"+calName+"')/items?$select=ID,Title,EventDate,EndDate,Location,Description,fAllDayEvent,fRecurrence,RecurrenceData&$orderby=EventDate desc&$top=1000",
            calEvents : {}[] = [] ;

        return new Promise <{}[]> (async(resolve, reject) =>{
            context.spHttpClient
                .get(restApiUrl, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse)=>{
                    response.json().then((results:any)=>{
                        results.value.map((result:any)=>{
                            calEvents.push({
                                id: result.ID,
                                title: result.Title,
                                start: result.fAllDayEvent ? this.formatStartDate(result.EventDate) : result.EventDate,
                                end: result.fAllDayEvent ? this.formatEndDate(result.EndDate) : result.EndDate,
                                allDay: result.fAllDayEvent,
                                recurr: result.fRecurrence,
                                recurrData: result.RecurrenceData,
                                rrule: result.fRecurrence ? this.parseRecurrentEvent(result.RecurrenceData, this.formatStartDate(result.EventDate), this.formatEndDate(result.EndDate)) : null
                            })
                        })
                        resolve(calEvents);
                    })
                })
        })
    }

    public displayCalendars(context: WebPartContext , calSettingsListName:string): Promise <{}[]>{
        const eventSources : {}[] = []; var eventSrc  : {} ;

        // `async` is needed since we're using `await`
        return this.getCalSettings(context, calSettingsListName).then(async (settings:any) => {
            const dataFetches = settings.map(setting => {
                // This `return` is needed otherwise `undefined` is returned in this `map()` call.
                return this.getCalsData(context, setting.CalName).then((events: any) => {
                    const eventSrc = {
                        events: events,
                        color: this.getColorHex(setting.BgColor),
                        textColor: this.getColorHex(setting.FgColor)
                    }
                    eventSources.push(eventSrc);
                    //console.log("Pushed data for event source: " + setting.CalName);
                });
            });
            await Promise.all(dataFetches);
            //console.log("Total event sources fetched", eventSources.length);
            // The next then takes the eventSources array and it becomes the return value.
            // Its a one-liner so `return` is implicitly known here
        }).then(() => eventSources)
        
        /*return new Promise <{}[]> (async(resolve, reject) =>{
            this.getCalSettings(context, calSettingsListName).then((settings:any)=>{
                for (let i=0; i<settings.length; i++){     
                    this.getCalsData(context, settings[i].CalName).then((events:any)=>{
                        eventSrc = {
                            events: events,
                            color: settings[i].BgColor,
                            textColor: settings[i].FgColor
                        }
                        eventSources.push(eventSrc);
                    })
                }
                resolve(eventSources);
            })
        })*/
    }

    public parseRecurrentEvent(recurrXML:string, startDate:string, endDate:string) : {}{
        let rruleObj  
                : {dtstart:string, until:string, count:number, interval:number, freq:string, bymonth:number[], bymonthday:number[], byweekday:{}[], bysetpos:number[]} 
                = {dtstart:startDate, until:endDate, count:null, interval:1, freq:null, bymonth:null, bymonthday:null, byweekday:null, bysetpos:null};

        if (recurrXML.indexOf("<recurrence>") != -1) {
            let $recurrTag : HTMLElement = document.createElement("div");
            $recurrTag.innerHTML = recurrXML;

            //console.log($recurrTag)

            switch (true) {
                //yearly
                case ($recurrTag.getElementsByTagName('yearly').length != 0):                
                    let $yearlyTag = $recurrTag.getElementsByTagName('yearly')[0];
                    rruleObj.freq = "yearly";        
                    rruleObj.interval = parseInt($yearlyTag.getAttribute('yearfrequency'));
                    rruleObj.bymonth = [parseInt($yearlyTag.getAttribute('month'))];
                    rruleObj.bymonthday = [parseInt($yearlyTag.getAttribute('day'))];
                    break;

                //yearly by day
                case ($recurrTag.getElementsByTagName('yearlybyday').length != 0):
                    let $yearlybydayTag = $recurrTag.getElementsByTagName('yearlybyday')[0];
                    rruleObj.freq = "yearly";
                    rruleObj.interval = parseInt($yearlybydayTag.getAttribute('yearfrequency'));
                    rruleObj.bymonth = [parseInt($yearlybydayTag.getAttribute('month'))];

                    //attribute mo=TRUE or su=TRUE etc.
                    if ($yearlybydayTag.getAttribute('mo') || 
                        $yearlybydayTag.getAttribute('tu') ||
                        $yearlybydayTag.getAttribute('we') ||
                        $yearlybydayTag.getAttribute('th') ||
                        $yearlybydayTag.getAttribute('fr')){
                            rruleObj.byweekday = [{
                                weekday: this.getWeekDay(this.getElemAttrs($yearlybydayTag)), 
                                n: this.getDayOrder($yearlybydayTag.getAttribute('weekdayofmonth'))
                            }]; 
                        }
                    
                    //attribute day=TRUE
                    if($yearlybydayTag.getAttribute('day')){
                        rruleObj.bymonthday = [this.getDayOrder($yearlybydayTag.getAttribute('weekdayofmonth'))];
                    }

                    //attribute weekday=TRUE
                    if($yearlybydayTag.getAttribute('weekday')){
                        rruleObj.bysetpos = [this.getDayOrder($yearlybydayTag.getAttribute('weekdayofmonth'))];
                        rruleObj.byweekday = [0,1,2,3,4]; 
                    }

                    //attribute weekend_day=TRUE
                    if($yearlybydayTag.getAttribute('weekend_day')){
                        rruleObj.bysetpos = [this.getDayOrder($yearlybydayTag.getAttribute('weekdayofmonth'))];
                        rruleObj.byweekday = [5,6]; 
                    }
                    break;

                //monthly
                case ($recurrTag.getElementsByTagName('monthly').length != 0):
                    let $monthlyTag = $recurrTag.getElementsByTagName('monthly')[0];
                    rruleObj.freq = "monthly";
                    rruleObj.interval = parseInt($monthlyTag.getAttribute('monthfrequency'));
                    rruleObj.bymonthday = $monthlyTag.getAttribute('day') ? [parseInt($monthlyTag.getAttribute('day'))]: null;
                    break;

                //monthly by day
                case ($recurrTag.getElementsByTagName('monthlybyday').length != 0):
                    let $monthlybydayTag = $recurrTag.getElementsByTagName('monthlybyday')[0];
                    rruleObj.freq = "monthly";
                    rruleObj.interval = parseInt($monthlybydayTag.getAttribute('monthfrequency'));
                    
                    //attribute mo=TRUE or su=TRUE etc.
                    if ($monthlybydayTag.getAttribute('mo') || 
                        $monthlybydayTag.getAttribute('tu') ||
                        $monthlybydayTag.getAttribute('we') ||
                        $monthlybydayTag.getAttribute('th') ||
                        $monthlybydayTag.getAttribute('fr')){
                            rruleObj.byweekday = [{
                                weekday: this.getWeekDay(this.getElemAttrs($monthlybydayTag)), 
                                n: this.getDayOrder($monthlybydayTag.getAttribute('weekdayofmonth'))
                            }]; 
                        }

                    //attribute day=TRUE
                    if($monthlybydayTag.getAttribute('day'))
                        rruleObj.bymonthday = [this.getDayOrder($monthlybydayTag.getAttribute('weekdayofmonth'))];
                    
                    //attribute weekday=TRUE
                    if($monthlybydayTag.getAttribute('weekday')){
                        rruleObj.bysetpos = [this.getDayOrder($monthlybydayTag.getAttribute('weekdayofmonth'))];
                        rruleObj.byweekday = [0,1,2,3,4]; 
                    }

                    //attribute weekend_day=TRUE
                    if($monthlybydayTag.getAttribute('weekend_day')){
                        rruleObj.bysetpos = [this.getDayOrder($monthlybydayTag.getAttribute('weekdayofmonth'))];
                        rruleObj.byweekday = [5,6]; 
                    }
                    break;

                //weekly
                case ($recurrTag.getElementsByTagName('weekly').length != 0):
                    let $weeklyTag = $recurrTag.getElementsByTagName('weekly')[0];
                    rruleObj.freq = "weekly";
                    rruleObj.interval = parseInt($weeklyTag.getAttribute('weekfrequency'));
                    rruleObj.byweekday = this.getWeekDays(this.getElemAttrs($weeklyTag));
                    break;

                //daily
                case ($recurrTag.getElementsByTagName('daily').length != 0):
                    let $dailyTag = $recurrTag.getElementsByTagName('daily')[0];
                    rruleObj.freq = "daily";
                    rruleObj.interval = $dailyTag.getAttribute('dayfrequency') ? parseInt($dailyTag.getAttribute('dayfrequency')): 1;
                    rruleObj.byweekday = this.getWeekDays(this.getElemAttrs($dailyTag));
                    break;
            }

            if ($recurrTag.getElementsByTagName('repeatInstances').length != 0)
                rruleObj.count = parseInt($recurrTag.getElementsByTagName('repeatInstances')[0].innerHTML);
            
            //console.log("rruleObj", rruleObj);

            return rruleObj;
            //return { dtstart: startDate, until: endDate, freq: "daily", interval: 1 }

        } else return { dtstart: startDate, until: endDate, freq: "daily", interval: 1 }
    }

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

    public getElemAttrs(el:any) :string[]{
        let attributesArr :string[] = [];
        for (let i = 0; i < el.attributes.length; i++){
            attributesArr.push(el.attributes[i].nodeName);
        }
        return attributesArr;
    }

    public getWeekDay (tagAttrs:string[]) : number{
        let weekDay:number;
        for(let i=0; i<tagAttrs.length; i++){
            switch (tagAttrs[i]) {
                case ('mo'):
                    weekDay = 0;
                    break;
                case ('tu'):
                    weekDay = 1;
                    break;
                case ('we'):
                    weekDay = 2;
                    break;
                case ('th'):
                    weekDay = 3;
                    break;
                case ('fr'):
                    weekDay = 4;
                    break;
                case ('sa'):
                    weekDay = 5;
                    break;
                case ('su'):
                    weekDay = 6;
                    break;
            }
        }
        return weekDay;
    }

    public getWeekDays (tagAttrs:string[]) : number[]{
        let weekDay:number = -1,
            weekDays: number[] = [];
        for(let i=0; i<tagAttrs.length; i++){
            switch (tagAttrs[i]) {
                case ('mo'):
                    weekDay = 0;
                    break;
                case ('tu'):
                    weekDay = 1;
                    break;
                case ('we'):
                    weekDay = 2;
                    break;
                case ('th'):
                    weekDay = 3;
                    break;
                case ('fr'):
                    weekDay = 4;
                    break;
                case ('sa'):
                    weekDay = 5;
                    break;
                case ('su'):
                    weekDay = 6;
                    break;
                case ('weekday'):
                    weekDays = [0, 1, 2, 3, 4];
                    break;
            }
            if(weekDay != -1)
                weekDays.push(weekDay);
        }
        return weekDays;
    }

    public getDayOrder(weekDayOfMonth:any):number{
        let dayOrder:number;
        switch (weekDayOfMonth) {
            case ("first"):
                dayOrder = 1;
                break;
            case ("second"):
                dayOrder = 2;
                break;
            case ("third"):
                dayOrder = 3;
                break;
            case ("fourth"):
                dayOrder = 4;
                break;
            case ("last"):
                dayOrder = -1;
                break;
        }
        return dayOrder;
    }

    public getColorHex(colorName:string) : string{
        let colorHex : string;
        switch (colorName) {
            case ("Black"):
                colorHex = "#000000";
                break;
            case ("Blue"):
                colorHex = "#0096CF";
                break;
            case ("Green"):
                colorHex = "#27AE60";
                break;
            case ("Grey"):
                colorHex = "#9FA7A7";
                break;
            case ("Mint"):
                colorHex = "#1C9A82";
                break;
            case ("Navy"):
                colorHex = "#4C5F79";
                break;
            case ("Orange"):
                colorHex = "#EA8020";
                break;
            case ("Pink"):
                colorHex = "#F46C9E";
                break;
            case ("Purple"):
                colorHex = "#A061BA";
                break;
            case ("Red"):
                colorHex = "#D7574A";
                break;
            case ("Teal"):
                colorHex = "#38A8AC";
                break;
            case ("White"):
                colorHex = "#FFFFFF";
                break;
            case ("Yellow"):
                colorHex = "#DAA62F";
                break;
        }
        return colorHex;
    }
}