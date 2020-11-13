import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMergedCalendarProps {
  description: string;
  showWeekends: boolean;
  context: WebPartContext;  
  eventSources: {}[];
  calSettings : {}[];
  calSettingsList: string;
}
