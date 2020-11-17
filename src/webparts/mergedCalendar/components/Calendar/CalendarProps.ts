import { WebPartContext } from "@microsoft/sp-webpart-base";
import {IDropdownOption} from "@fluentui/react"

export interface CalendarProps{
    showWeekends: boolean;
    context: WebPartContext;  
    calSettingsList: string;
    dpdOptions: IDropdownOption[];
    eventSources: {}[];
    calSettings: {}[];
    onChkChange: (calSettings:{}) => ((ev: any, checked: boolean)=>void);
    onDpdChange: (calSettings:{}) => ((ev: any, item: IDropdownOption)=>void);
}