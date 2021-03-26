import {WebPartContext} from "@microsoft/sp-webpart-base";
import {SPHttpClient, ISPHttpClientOptions} from "@microsoft/sp-http";

export const getRooms = async (context: WebPartContext, roomsList: string) =>{
    console.log("Get Rooms Function");
    const restUrl = context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${roomsList}')/items`;
    const results = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(response => response.json());

    return results.value;
};

const adjustLocation = (arr: []): {}[] =>{
    let arrAdj :{}[] = [];
    arrAdj.push({key: 'all', text:'All'});

    arr.map((item: string)=>{
        arrAdj.push({
            key: item.toLowerCase(),
            text: item
        });
    });

    return arrAdj;
};
export const getLocationGroup = async(context: WebPartContext, roomsList: string) =>{
    console.log("Get Rooms Location Group Function");
    const restUrl = context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('${roomsList}')/fields?$filter=EntityPropertyName eq 'LocationGroup'`;
    const results = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(response => response.json());

    return adjustLocation(results.value[0].Choices);
};

const adjustPeriods = (arr: []): {}[] =>{
    let arrAdj :{}[] = [];

    arr.map((item: any)=>{
        arrAdj.push({
            key: item.Id,
            text: item.Title,
            start: item.StartTime,
            end: item.EndTime,
            order: item.SortOrder
        });
    });

    return arrAdj;
};
export const getPeriods = async (context: WebPartContext, periodsList: string) =>{
    console.log("Get Periods Function");
    const restUrl = context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${periodsList}')/items?$orderBy=SortOrder asc`;
    const results = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(response => response.json());

    return adjustPeriods(results.value);
};

export const getGuidelines = async (context: WebPartContext, guidelinesList: string) =>{
    console.log("Get Guidelines Function");
    const restUrl = context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${guidelinesList}')/items`;
    const results = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(response => response.json());

    return results.value;
};

export const getRoomsCalendarName = (calendarSettingsList: any) : string =>{
    for (let calSetting of calendarSettingsList){
        if (calSetting.CalType === 'Room'){
            return calSetting.CalName;
        }
    }
    return 'Events';
};

export const getChosenDate = (startPeriodField: any, endPeriodField: any, formFieldParam: any) =>{
    const startPeriod = new Date(startPeriodField);
    const endPeriod = new Date(endPeriodField);
    const currDate = new Date(formFieldParam);

    const startPeriodHr = startPeriod.getHours();
    const startPeriodMin = startPeriod.getMinutes();
    const endPeriodHr = endPeriod.getHours();
    const endPeriodMin = endPeriod.getMinutes();

    const dateDay = currDate.getDate();
    const dateMonth = currDate.getMonth();
    const dateYear = currDate.getFullYear();

    let chosenStartDate = new Date();
    chosenStartDate.setDate(dateDay);
    chosenStartDate.setMonth(dateMonth);
    chosenStartDate.setFullYear(dateYear);
    chosenStartDate.setHours(startPeriodHr);
    chosenStartDate.setMinutes(startPeriodMin);

    let chosenEndDate = new Date();
    chosenEndDate.setDate(dateDay);
    chosenEndDate.setMonth(dateMonth);
    chosenEndDate.setFullYear(dateYear);
    chosenEndDate.setHours(endPeriodHr);
    chosenEndDate.setMinutes(endPeriodMin);

    return[chosenStartDate, chosenEndDate];
  };

export const addEvent = async (context: WebPartContext, roomsCalListName: string, eventDetails: any, roomInfo: any) => {
    console.log("roomInfo", roomInfo);
    const restUrl = context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${roomsCalListName}')/items`;
    const body: string = JSON.stringify({
        Title: eventDetails.titleField,
        Description: eventDetails.descpField,
        EventDate: getChosenDate(eventDetails.periodField.start, eventDetails.periodField.end, eventDetails.dateField)[0],
        EndDate: getChosenDate(eventDetails.periodField.start, eventDetails.periodField.end, eventDetails.dateField)[1],
        PeriodsId: eventDetails.periodField.key,
        RoomNameId: roomInfo.Id,
        Location: roomInfo.Title
    });
    const spOptions: ISPHttpClientOptions = {
        headers:{
            Accept: "application/json;odata=nometadata", 
            "Content-Type": "application/json;odata=nometadata",
            "odata-version": ""
        },
        body: body
    };
    const _data = await context.spHttpClient.post(restUrl, SPHttpClient.configurations.v1, spOptions);
    if(_data.ok){
        console.log('New Event is added!');
    }
};

