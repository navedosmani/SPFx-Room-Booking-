import {WebPartContext} from "@microsoft/sp-webpart-base";
import {SPHttpClient} from "@microsoft/sp-http";

export const getRooms = async (context: WebPartContext, roomsList: string) =>{
    console.log("Get Rooms Function");
    const restUrl = context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${roomsList}')/items`;
    const results = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(response => response.json());

    return results.value;
};


export const getLocationGroup = async(context: WebPartContext, roomsList: string) =>{
    console.log("Get Rooms Location Group Function");
    const restUrl = context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('${roomsList}')/fields?$filter=EntityPropertyName eq 'LocationGroup'`;
    const results = await context.spHttpClient.get(restUrl, SPHttpClient.configurations.v1).then(response => response.json());

    return adjustLocation(results.value[0].Choices);
};
const adjustLocation = (arr: []): {}[] =>{
    let arrAdj :{}[] = [];
    arrAdj.push({key: 'all', text:'All'});

    arr.map((item: string)=>{
        arrAdj.push({
            key: item.toLowerCase(),
            text: item
        })
    });

    return arrAdj;
};