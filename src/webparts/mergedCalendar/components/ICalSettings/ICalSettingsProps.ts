import {IDropdownOption} from "@fluentui/react";

export interface ICalSettingsProps{
    dpdOptions: IDropdownOption[];
    calSettings: {}[];
    onChkChange: (calSettings:{}) => ((ev: any, checked: boolean)=>void);
    onDpdChange: (calSettings:{}) => ((ev: any, item: IDropdownOption)=>void);
}