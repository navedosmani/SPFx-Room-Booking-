import {IDropdownOption} from "@fluentui/react"

export interface IPanelProps{
    dpdOptions: IDropdownOption[];
    calSettings: {}[];
    isOpen: boolean;
    dismissPanel: any;
    onChkChange: (calSettings:{}) => ((ev: any, checked: boolean)=>void);
    onDpdChange: (calSettings:{}) => ((ev: any, item: IDropdownOption)=>void);
}