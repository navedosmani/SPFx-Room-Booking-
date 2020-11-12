import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, HttpClientResponse, HttpClient, IHttpClientOptions, MSGraphClient} from "@microsoft/sp-http";

import {formatStartDate, formatEndDate} from '../Services/EventFormat';
import {parseRecurrentEvent} from '../Services/RecurrentEventOps';

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

    public resolveCalUrl(context: WebPartContext, calType:string, calUrl:string, calName:string) : string{
        let resolvedCalUrl:string,
            azurePeelSchoolsUrl :string = "https://pdsb1.azure-api.net/peelschools",
            restApiUrl :string = "/_api/web/lists/getByTitle('"+calName+"')/items",
            restApiParams :string = "?$select=ID,Title,EventDate,EndDate,Location,Description,fAllDayEvent,fRecurrence,RecurrenceData&$orderby=EventDate desc&$top=1000";

        switch (calType){
            case "Internal":
            case "Rotary":
                resolvedCalUrl = calUrl + restApiUrl + restApiParams;
                break;
            case "My School":
                resolvedCalUrl = context.pageContext.web.absoluteUrl + restApiUrl + restApiParams;
                break;
            case "External":
                resolvedCalUrl = azurePeelSchoolsUrl + calUrl.substring(calUrl.indexOf('.org/') + 4, calUrl.length) + restApiUrl + restApiParams;
                break;
        }
        return resolvedCalUrl;
    }

    public getCalsData(context: WebPartContext, calSettings:{CalType:string, Title:string, CalName:string, CalURL:string}) : Promise <{}[]>{
        if(calSettings.CalType == 'Graph'){
            return this.getGraphCals(context, calSettings);
        }else{
            return this.getDefaultCals(context, calSettings);
        }
    }

    public getGraphCals(context: WebPartContext, calSettings:{CalType:string, Title:string, CalName:string, CalURL:string}) : Promise <{}[]> {
        
        let graphUrl :string = calSettings.CalURL.substring(32, calSettings.CalURL.length),
            calEvents : {}[] = [];

        return new Promise <{}[]> (async(resolve, reject)=>{
            context.msGraphClientFactory
                .getClient()
                .then((client :MSGraphClient)=>{
                    client
                        .api(graphUrl)
                        .get((error, response: any, rawResponse?: any)=>{
                            response.value.map((result:any)=>{
                                calEvents.push({
                                    id: result.id,
                                    title: result.subject,
                                    start: formatStartDate(result.start.dateTime),
                                    end: formatStartDate(result.end.dateTime),
                                    _location: result.location.displayName,
                                    _body: result.body.content
                                })
                            })
                            resolve(calEvents);
                        })
                })
        })
    }

    public getDefaultCals(context: WebPartContext, calSettings:{CalType:string, Title:string, CalName:string, CalURL:string}) : Promise <{}[]>{
        
        let calUrl :string = this.resolveCalUrl(context, calSettings.CalType, calSettings.CalURL, calSettings.CalName),
            calEvents : {}[] = [] ;

        const myOptions: IHttpClientOptions = {
            headers : { 
                'Accept': 'application/json;odata=verbose'
            }
        };

        return new Promise <{}[]> (async(resolve, reject) =>{
            context.httpClient
                .get(calUrl, HttpClient.configurations.v1, myOptions)
                .then((response: HttpClientResponse) =>{
                   response.json().then((results:any)=>{
                        results.d.results.map((result:any)=>{
                            calEvents.push({
                                id: result.ID,
                                title: result.Title,
                                start: result.fAllDayEvent ? formatStartDate(result.EventDate) : result.EventDate,
                                end: result.fAllDayEvent ? formatEndDate(result.EndDate) : result.EndDate,
                                allDay: result.fAllDayEvent,
                                recurr: result.fRecurrence,
                                recurrData: result.RecurrenceData,
                                rrule: result.fRecurrence ? parseRecurrentEvent(result.RecurrenceData, formatStartDate(result.EventDate), formatEndDate(result.EndDate)) : null
                            })
                        })
                        resolve(calEvents);
                    })
                }, (error:any):void=>{
                    reject("Error occured: " + error);
                    console.log(error);
                })
        })
        
    }

    public displayCalendars(context: WebPartContext , calSettingsListName:string): Promise <{}[]>{
        const eventSources : {}[] = []; var eventSrc  : {} ;

        // `async` is needed since we're using `await`
        return this.getCalSettings(context, calSettingsListName).then(async (settings:any) => {
            const dataFetches = settings.map(setting => {
                // This `return` is needed otherwise `undefined` is returned in this `map()` call.
                if(setting.ShowCal){
                    return this.getCalsData(context, setting).then((events: any) => {
                        const eventSrc = {
                            events: events,
                            color: this.getColorHex(setting.BgColor),
                            textColor: this.getColorHex(setting.FgColor)
                        }
                        eventSources.push(eventSrc);
                    });
                }
            });
            await Promise.all(dataFetches);
            // The next then takes the eventSources array and it becomes the return value.
            // Its a one-liner so `return` is implicitly known here
        }).then(() => eventSources)
    }

    public getColorHex (colorName:string) : string {
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