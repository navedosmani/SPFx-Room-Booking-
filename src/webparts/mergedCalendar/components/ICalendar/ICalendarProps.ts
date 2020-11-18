export interface ICalendarProps{
    showWeekends: boolean;
    eventSources: {}[];
    calSettings: {}[];
    openPanel: any;
    handleDateClick: (args:any) => void;
}