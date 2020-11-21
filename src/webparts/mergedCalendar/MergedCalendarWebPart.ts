import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MergedCalendarWebPartStrings';
import MergedCalendar from './components/MergedCalendar';
import { IMergedCalendarProps } from './components/IMergedCalendarProps';

export interface IMergedCalendarWebPartProps {
  description: string;  
  showWeekends: boolean;
}


export default class MergedCalendarWebPart extends BaseClientSideWebPart<IMergedCalendarWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMergedCalendarProps> = React.createElement(
      MergedCalendar,
      {
        description: this.properties.description,
        showWeekends: this.properties.showWeekends,
        context: this.context,
        calSettingsList: "CalendarSettings",
        dpdOptions : [
          { key: 'E1Day', text: '1 Day Cycle' },
          { key: 'E2Day', text: '2 Day Cycle' },
          { key: 'E3Day', text: '3 Day Cycle' },
          { key: 'E4Day', text: '4 Day Cycle' },
          { key: 'E5Day', text: '5 Day Cycle' },
          { key: 'E6Day', text: '6 Day Cycle' },
          { key: 'E7Day', text: '7 Day Cycle' },
          { key: 'E8Day', text: '8 Day Cycle' },
          { key: 'E9Day', text: '9 Day Cycle' },
          { key: 'E10Day', text: '10 Day Cycle' },
        ]
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                /*PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),*/
                PropertyPaneCheckbox('showWeekends', {
                  text: "Show Weekends",
                  checked : false,
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
