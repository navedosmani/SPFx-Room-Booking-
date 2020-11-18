import * as React from 'react';
import styles from './MergedCalendar.module.scss';
import { IMergedCalendarProps } from './IMergedCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';

import {IDropdownOption, DefaultButton} from '@fluentui/react';
import {useBoolean} from '@fluentui/react-hooks';

import {CalendarOperations} from '../Services/CalendarOperations';
import {getCalSettings, updateCalSettings} from '../Services/CalendarSettingsOps';

import ICalendar from './ICalendar/ICalendar';
import IPanel from './IPanel/IPanel';
import ILegend from './ILegend/ILegend';
import IDialog from './IDialog/IDialog';

export default function MergedCalendar (props:IMergedCalendarProps) {
  
  const _calendarOps = new CalendarOperations();
  const [eventSources, setEventSources] = React.useState([]);
  const [calSettings, setCalSettings] = React.useState([]);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [evDetails1, setEvDetails1] = React.useState({});
  const [evDetails2, setEvDetails2] = React.useState({});
  const [evDetails3, setEvDetails3] = React.useState({});

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
  const handleDateClick = (arg:any) =>{
    console.log(arg);
    setEvDetails1(arg.event);
    setEvDetails2(arg.event._def);
    setEvDetails3(arg.event.extendedProps);
    toggleHideDialog();
  }


  return(
    <div className={styles.mergedCalendar}>

      <ICalendar 
        eventSources={eventSources} 
        showWeekends={props.showWeekends} 
        calSettings={calSettings}
        openPanel={openPanel}
        handleDateClick={handleDateClick}/>

      <IPanel
        dpdOptions={props.dpdOptions} 
        calSettings={calSettings}
        onChkChange={chkHandleChange}
        onDpdChange={dpdHandleChange}
        isOpen = {isOpen}
        dismissPanel = {dismissPanel}/>

      <ILegend calSettings={calSettings} />

      <IDialog 
        hideDialog={hideDialog} 
        toggleHideDialog={toggleHideDialog}
        evDetails1={evDetails1}
        evDetails2={evDetails2} 
        evDetails3={evDetails3}/>

    </div>
  );
  
  
}
