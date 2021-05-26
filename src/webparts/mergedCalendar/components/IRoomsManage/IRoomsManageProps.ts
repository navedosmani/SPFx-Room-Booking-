import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRoomsManageProps{
    context: WebPartContext;
    roomsList: string;
    periodsList: string;
    guidelinesList: string;
    onRoomsManageAdd: any;    
}