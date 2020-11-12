import { WebPartContext } from "@microsoft/sp-webpart-base";

import {getCalSettings, getCalsData} from '../Services/CalendarRequests';

export class CalendarOperations{
    

    public displayCalendars(context: WebPartContext , calSettingsListName:string): Promise <{}[]>{
        const eventSources : {}[] = []; var eventSrc  : {} ;

        // `async` is needed since we're using `await`
        return getCalSettings(context, calSettingsListName).then(async (settings:any) => {
            const dataFetches = settings.map(setting => {
                // This `return` is needed otherwise `undefined` is returned in this `map()` call.
                if(setting.ShowCal){
                    return getCalsData(context, setting).then((events: any) => {
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