import * as React from 'react';
import styles from './MergedCalendar.module.scss';
import { IMergedCalendarProps } from './IMergedCalendarProps';
//import { escape } from '@microsoft/sp-lodash-subset';

import {IDropdownOption} from '@fluentui/react';
import {useBoolean} from '@fluentui/react-hooks';

import {CalendarOperations} from '../Services/CalendarOperations';
import {getCalSettings, updateCalSettings} from '../Services/CalendarSettingsOps';
import {formatEvDetails} from '../Services/EventFormat';

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
  const [eventDetails, setEventDetails] = React.useState({});
  const [isDataLoading, { toggle: toggleIsDataLoading }] = useBoolean(false);

  React.useEffect(()=>{
    _calendarOps.displayCalendars(props.context, props.calSettingsList).then((result:{}[])=>{
      setEventSources(result);
    });
    getCalSettings(props.context, props.calSettingsList).then((result:{}[])=>{
      setCalSettings(result);
    });
  },[eventSources.length]);

  const chkHandleChange = (newCalSettings:{})=>{    
    return (ev: any, checked: boolean) => { 
      toggleIsDataLoading();
      updateCalSettings(props.context, props.calSettingsList, newCalSettings, checked).then(()=>{
        _calendarOps.displayCalendars(props.context, props.calSettingsList).then((result:{}[])=>{
          setEventSources(result);
          toggleIsDataLoading();
        });
      });
     };
  };
  const dpdHandleChange = (newCalSettings:any)=>{
    return (ev: any, item: IDropdownOption) => { 
      toggleIsDataLoading();
      updateCalSettings(props.context, props.calSettingsList, newCalSettings, newCalSettings.ShowCal, item.key).then(()=>{
        _calendarOps.displayCalendars(props.context, props.calSettingsList).then((result:{}[])=>{
          setEventSources(result);
          toggleIsDataLoading();
        });
      });
     };
  };
  const handleDateClick = (arg:any) =>{
    //console.log(arg);
    //console.log(formatEvDetails(arg));
    setEventDetails(formatEvDetails(arg));
    toggleHideDialog();
  };


  return(
    <div className={styles.mergedCalendar}>

      <ICalendar 
        eventSources={eventSources} 
        showWeekends={props.showWeekends ? props.showWeekends : false } 
        calSettings={calSettings}
        openPanel={openPanel}
        handleDateClick={handleDateClick}/>

      <IPanel
        dpdOptions={props.dpdOptions} 
        calSettings={calSettings}
        onChkChange={chkHandleChange}
        onDpdChange={dpdHandleChange}
        isOpen = {isOpen}
        dismissPanel = {dismissPanel}
        isDataLoading = {isDataLoading} />

      <ILegend calSettings={calSettings} />

      <IDialog 
        hideDialog={hideDialog} 
        toggleHideDialog={toggleHideDialog}
        eventDetails={eventDetails}/>

    </div>
  );
  
  
}
