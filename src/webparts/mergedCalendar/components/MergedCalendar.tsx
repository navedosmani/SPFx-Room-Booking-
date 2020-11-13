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

import {Panel, DefaultButton, PrimaryButton, Checkbox, Stack, Dropdown, IDropdownStyles, IDropdownOption} from '@fluentui/react';
import {useBoolean} from '@fluentui/react-hooks';

import {CalendarOperations} from '../Services/CalendarOperations';
import {getCalSettings} from '../Services/CalendarRequests';

export default function MergedCalendar (props:IMergedCalendarProps) {
  
  const _calendarOps = new CalendarOperations();
  const [eventSources, setEventSources] = React.useState(props.eventSources);
  const [calSettings, setCalSettings] = React.useState([]);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const stackTokens = { childrenGap: 10 };
  const options: IDropdownOption[] = [
    { key: 'E1Day', text: 'Day 1 Cycle' },
    { key: 'E2Day', text: 'Day 2 Cycle' },
    { key: 'E3Day', text: 'Day 3 Cycle' },
    { key: 'E4Day', text: 'Day 4 Cycle' },
    { key: 'E5Day', text: 'Day 5 Cycle' },
    { key: 'E6Day', text: 'Day 6 Cycle' },
    { key: 'E7Day', text: 'Day 7 Cycle' },
    { key: 'E8Day', text: 'Day 8 Cycle' },
    { key: 'E9Day', text: 'Day 9 Cycle' },
    { key: 'E10Day', text: 'Day 10 Cycle' },
  ];

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
  })

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
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
      >
        <Stack tokens={stackTokens}>
          <Checkbox label="My School" disabled defaultChecked />
          <Checkbox label="Rotary" />
          <Dropdown
            placeholder="Select an option"            
            options={options}
          />    
          {/* {calSettings.map((data, id)=>{
            <Checkbox key={id} label={data.Title} />
          })}       */}
          <Checkbox label="Test 2" />
          <Checkbox label="Test 3" />
        </Stack>
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

    </div>
  );
  
  
}
