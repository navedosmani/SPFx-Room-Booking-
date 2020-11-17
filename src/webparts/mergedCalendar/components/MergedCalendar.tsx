import * as React from 'react';
import styles from './MergedCalendar.module.scss';
import { IMergedCalendarProps } from './IMergedCalendarProps';
import { IMergedCalendarState } from './IMergedCalendarState';
import { escape } from '@microsoft/sp-lodash-subset';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

import {Panel, DefaultButton, PrimaryButton, Checkbox, Stack, Dropdown, IDropdownOption, Spinner} from '@fluentui/react';
import {useBoolean} from '@fluentui/react-hooks';

import {CalendarOperations} from '../Services/CalendarOperations';
import {getCalSettings, updateCalSettings} from '../Services/CalendarSettingsOps';

import CalendarLegend from './CalendarLegend';

export default function MergedCalendar (props:IMergedCalendarProps) {
  
  const _calendarOps = new CalendarOperations();
  const [eventSources, setEventSources] = React.useState([]);
  const [calSettings, setCalSettings] = React.useState([]);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [isChecked, setIsChecked] = React.useState(true);

  const stackTokens = { childrenGap: 20 , maxWidth: 250};
  
  function handleDateClick(arg:any){
    alert(arg.dateStr);
  }

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

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={dismissPanel} className={styles.marginR10}>Save</PrimaryButton>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel],
  );

  return(
    <div className={styles.mergedCalendar}>
      <h1>Testing FullCalendar with React</h1>
      <p>{escape(props.description)}</p>      

      <DefaultButton text="Calendar Settings" onClick={openPanel} className={styles.settingsBtn} />
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        headerText="Calendar Settings"
        closeButtonAriaLabel="Close"
        //onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
        className={styles.calendarPanel}>

        <Stack tokens={stackTokens}>
          {calSettings.map((value, index) => {        
            return (
              <div>
                <Checkbox key={index} onChange={chkHandleChange(value)} defaultChecked={value.Chkd} label={value.Title} disabled={value.Disabled} />
                {value.Dpd &&
                  <Dropdown onChange={dpdHandleChange(value)} className={styles.marginT5} placeholder="Select Day..."  defaultSelectedKey={value.CalName} options={props.dpdOptions} />
                }
              </div>
            )
          })}
        </Stack>

        {/* <Spinner label="Please Wait, Calendars are updating..." ariaLive="assertive" labelPosition="right" /> */}
      </Panel>

      <div className={styles.calendarCntnr}>
        <FullCalendar
          plugins = {
            [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]
          }
          headerToolbar = {{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={props.showWeekends}
          dateClick={handleDateClick}
          eventSources = {eventSources}
        />
      </div> 

      <CalendarLegend calSettings={calSettings}></CalendarLegend>

    </div>
  );
  
  
}
