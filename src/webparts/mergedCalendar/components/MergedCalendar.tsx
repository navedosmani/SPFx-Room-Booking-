import * as React from 'react';
import styles from './MergedCalendar.module.scss';
import { IMergedCalendarProps } from './IMergedCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';

import {IDropdownOption} from '@fluentui/react';

import {CalendarOperations} from '../Services/CalendarOperations';
import {getCalSettings, updateCalSettings} from '../Services/CalendarSettingsOps';

import Calendar from './Calendar/Calendar';
import Legend from './Legend/Legend';

export default function MergedCalendar (props:IMergedCalendarProps) {
  
  const _calendarOps = new CalendarOperations();
  const [eventSources, setEventSources] = React.useState([]);
  const [calSettings, setCalSettings] = React.useState([]);

  React.useEffect(()=>{
    _calendarOps.displayCalendars(props.context, props.calSettingsList).then((result:{}[])=>{
      setEventSources(result);
    });
    getCalSettings(props.context, props.calSettingsList).then((result:{}[])=>{
      setCalSettings(result);
    })
  },[eventSources.length])

  const chkHandleChange = (calSettings:{})=>{
    return (ev: any, checked: boolean) => { 
      updateCalSettings(props.context, props.calSettingsList, calSettings, checked).then(()=>{
        _calendarOps.displayCalendars(props.context, props.calSettingsList).then((result:{}[])=>{
          setEventSources(result);
        });
      })
     }
  }
  const dpdHandleChange = (calSettings:any)=>{
    return (ev: any, item: IDropdownOption) => { 
      updateCalSettings(props.context, props.calSettingsList, calSettings, calSettings.ShowCal, item.key).then(()=>{
        _calendarOps.displayCalendars(props.context, props.calSettingsList).then((result:{}[])=>{
          setEventSources(result);
        });
      })
     }
  }

  return(
    <div className={styles.mergedCalendar}>

      <Calendar eventSources={eventSources} 
        showWeekends={props.showWeekends} 
        calSettingsList={props.calSettingsList} 
        context={props.context} 
        dpdOptions={props.dpdOptions}
        calSettings={calSettings}
        onChkChange={chkHandleChange}
        onDpdChange={dpdHandleChange}/>

      <Legend calSettings={calSettings}></Legend>

    </div>
  );
  
  
}
