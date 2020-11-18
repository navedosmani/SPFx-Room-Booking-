import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

import styles from '../MergedCalendar.module.scss';
import {ICalendarProps} from './ICalendarProps';

export default function ICalendar(props:ICalendarProps){

    return(
        <div className={styles.calendarCntnr}>
          
          <div>
            <FullCalendar
              plugins = {
                [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]
              }
              headerToolbar = {{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay, settingsBtn'
              }}
              customButtons = {{
                settingsBtn : {
                  text : 'Settings',
                  click : props.openPanel,
                }
              }}          
              initialView='dayGridMonth'
              editable={false}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={props.showWeekends}
              eventClick={props.handleDateClick}
              eventSources = {props.eventSources}
            />
          </div>
      </div> 
    );
}