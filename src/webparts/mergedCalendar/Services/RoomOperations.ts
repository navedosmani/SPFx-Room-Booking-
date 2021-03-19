import {WebPartContext} from "@microsoft/sp-webpart-base";
import {SPHttpClient} from "@microsoft/sp-http";

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
