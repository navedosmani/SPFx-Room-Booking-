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

import {CalendarOperations} from '../Services/CalendarOperations';

export default class MergedCalendar extends React.Component<IMergedCalendarProps, IMergedCalendarState, {}> {
  
  public _calendarOps : CalendarOperations;
  constructor(props:IMergedCalendarProps){
    super(props);
    this._calendarOps = new CalendarOperations();
    this.state = {
      weekendsVisible: false, 
      eventSources: [],
      calSettingsList: "CalendarSettings",
    };
  }

  public componentDidMount(){
    this._calendarOps.displayCalendars(this.props.context, this.state.calSettingsList).then((result:{}[])=>{
      this.setState({eventSources: result});
    });
  }

  public handleDateClick = (arg:any)=>{
    alert(arg.dateStr);
  }

  /*public renderEventContent = (eventInfo:any)=>{
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }*/
  
  public render(): React.ReactElement<IMergedCalendarProps> {
    return (
      <div>
        
        <h1>Testing FullCalendar with React</h1>
        <p>{escape(this.props.description)}</p>

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
          weekends={this.props.showWeekends}
          dateClick={this.handleDateClick}
          eventSources = {this.state.eventSources}
        />
      </div>
    );
  }
}
