import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from "@microsoft/sp-http";

export class CalendarOperations{

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
        let restApiUrl : string = context.pageContext.web.absoluteUrl + "/_api/web/lists/getByTitle('"+calName+"')/items?$select=ID,Title,EventDate,EndDate,Location,Description,fAllDayEvent,fRecurrence,RecurrenceData&$orderby=EventDate desc&$top=1000";
        var calEvents : {}[] = [] ;

        return new Promise <{}[]> (async(resolve, reject) =>{
            context.spHttpClient
                .get(restApiUrl, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse)=>{
                    response.json().then((results:any)=>{
                        results.value.map((result:any)=>{
                            calEvents.push({
                                id: result.ID,
                                title: result.Title,
                                start: result.EventDate,
                                end: result.EndDate,
                                allDay: result.fAllDayEvent,
                                recurr: result.fRecurrence,
                                recurrData: result.RecurrenceData,
                                //rrule: this.parseRecurrentEvent(result.RecurrenceData, result.EventDate, result.EndDate),
                                rrule: result.fRecurrence ? this.parseRecurrentEvent(result.RecurrenceData, result.EventDate, result.EndDate) : null
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
                : {dtstart:string, until:string, count:number, interval:number, freq:string, bymonth:number[], bymonthday:string, byweekday:{}[]} 
                = {dtstart:startDate, until:endDate, count:null, interval:1, freq:null, bymonth:null, bymonthday:null, byweekday:null}, 
            weekDay :[] = [], $recurrFreq:any, $repeatInstances:any, isRepeatForever:string, firstDayOfWeek:string;

        if (recurrXML.indexOf("<recurrence>") != -1) {
            let $recurrTag : HTMLElement = document.createElement("div");
            $recurrTag.innerHTML = recurrXML;

            console.log($recurrTag)

            switch (true) {
                case ($recurrTag.getElementsByTagName('yearly').length != 0):                
                    rruleObj.freq = "yearly";        
                    rruleObj.interval = parseInt($recurrTag.getElementsByTagName('yearly')[0].getAttribute('yearfrequency'));
                    break;
                case ($recurrTag.getElementsByTagName('yearlybyday').length != 0):
                    rruleObj.freq = "yearly";
                    rruleObj.interval = parseInt($recurrTag.getElementsByTagName('yearlybyday')[0].getAttribute('yearfrequency'));
                    break;
                case ($recurrTag.getElementsByTagName('monthly').length != 0):
                    rruleObj.freq = "monthly";
                    rruleObj.interval = parseInt($recurrTag.getElementsByTagName('monthly')[0].getAttribute('monthfrequency'));
                    break;
                case ($recurrTag.getElementsByTagName('monthlybyday').length != 0):
                    rruleObj.freq = "monthly";
                    rruleObj.interval = parseInt($recurrTag.getElementsByTagName('monthlybyday')[0].getAttribute('monthfrequency'));
                    rruleObj.byweekday = [{
                        weekday: this.getWeekDay(this.getElemAttrs($recurrTag.getElementsByTagName('monthlybyday')[0])), 
                        n: this.getDayOrder($recurrTag.getElementsByTagName('monthlybyday')[0].getAttribute('weekdayofmonth'))
                    }] ;
                    break;
                case ($recurrTag.getElementsByTagName('weekly').length != 0):
                    rruleObj.freq = "weekly";
                    rruleObj.interval = parseInt($recurrTag.getElementsByTagName('weekly')[0].getAttribute('weekfrequency'));
                    rruleObj.byweekday = this.getWeekDays(this.getElemAttrs($recurrTag.getElementsByTagName('weekly')[0]));
                    break;
                case ($recurrTag.getElementsByTagName('daily').length != 0):
                    rruleObj.freq = "daily";
                    rruleObj.interval = parseInt($recurrTag.getElementsByTagName('daily')[0].getAttribute('dayfrequency'));
                    break;
            }

            if ($recurrTag.getElementsByTagName('repeatInstances').length != 0)
                rruleObj.count = parseInt($recurrTag.getElementsByTagName('repeatInstances')[0].innerHTML);

            
            console.log("rruleObj", rruleObj);

            //return rruleObj;
            return { dtstart: startDate, until: endDate, freq: "daily", interval: 1 }

        } else return { dtstart: startDate, until: endDate, freq: "daily", interval: 1 }
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
        let weekDay:number,
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
            }
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