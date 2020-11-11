import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
//import { sp } from "@pnp/sp";


export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart <IHelloWorldWebPartProps> {

  private apiClient: AadHttpClient;  
  //PEEL - api call
  private apiId : string = "eb994916-2c73-4bc6-b4bd-c945f62eac26";
  private apiUrl : string = "https://pdsbserviceapi.azurewebsites.net/api/wcf/GetLunchRoomSupByLocation?LocationId=1415";
  
  protected onInit(): Promise<void> {
    /*sp.setup({
      spfxContext: this.context      
    });  */    

    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.aadHttpClientFactory
        .getClient(this.apiId)
        .then((client: AadHttpClient): void => {
          this.apiClient = client;
          resolve();
        }, err => reject(err));
    });
  }

  public render(): void {
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'Making AAD API Request');

    this.apiClient
      .get(this.apiUrl, AadHttpClient.configurations.v1)
      .then((res: HttpClientResponse): Promise<any> => {
        return res.json();
      })
      .then((jsonText: any): void => {
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        
        this.domElement.innerHTML = `
        <div>JSON Response Values:</div><br/>
          <div>
           ${jsonText}
          </div>`;
      }, (err: any): void => {
        this.context.statusRenderer.renderError(this.domElement, err);
      });
  }




}
