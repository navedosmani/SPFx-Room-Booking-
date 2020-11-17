import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import {useBoolean} from '@fluentui/react-hooks';
import {Panel, Checkbox, Stack, Dropdown} from '@fluentui/react';

import styles from '../MergedCalendar.module.scss';
import {CalendarProps} from './CalendarProps';

export default function Calendar(props:CalendarProps){

    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const stackTokens = { childrenGap: 20 , maxWidth: 250};

    /*const onRenderFooterContent = React.useCallback(
      () => (
        <div>
          <PrimaryButton onClick={dismissPanel} className={styles.marginR10}>Save</PrimaryButton>
          <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
        </div>
      ),
      [dismissPanel],
    );*/
    
    function handleDateClick(arg:any){
      //alert(arg.dateStr);
    }

    return(
        <div className={styles.calendarCntnr}>
          
          <div>
              <Panel
                isOpen={isOpen}
                onDismiss={dismissPanel}
                headerText="Calendar Settings"
                closeButtonAriaLabel="Close"
                //onRenderFooterContent={onRenderFooterContent}
                isFooterAtBottom={true}
                className={styles.calendarPanel}>

                <Stack tokens={stackTokens}>
                  {props.calSettings.map((value:any, index) => {        
                    return (
                      <div>
                        <Checkbox key={index} onChange={props.onChkChange(value)} defaultChecked={value.Chkd} label={value.Title} disabled={value.Disabled} />
                        {value.Dpd &&
                          <Dropdown onChange={props.onDpdChange(value)} className={styles.marginT5} placeholder="Select Day..."  defaultSelectedKey={value.CalName} options={props.dpdOptions} />
                        }
                      </div>
                    )
                  })}
                </Stack>

                {/* <Spinner label="Please Wait, Calendars are updating..." ariaLive="assertive" labelPosition="right" /> */}
              </Panel>
          </div>
          
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
                  click : openPanel,
                }
              }}          
              initialView='dayGridMonth'
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={props.showWeekends}
              //dateClick={handleDateClick}
              eventSources = {props.eventSources}
            />
          </div>
      </div> 
    );
}