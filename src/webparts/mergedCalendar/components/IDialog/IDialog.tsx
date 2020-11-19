import * as React from 'react';
import {Dialog, DialogType, DialogFooter, DefaultButton} from '@fluentui/react';

import {IDialogProps} from './IDialogProps';
import IEventDetails from  '../IEventDetails/IEventDetails';

export default function IDialog(props:IDialogProps){
    const modelProps = {
        isBlocking: false,
        //styles: { main: { minWidth: '30%' } },
      };
      const dialogContentProps = {
        type: DialogType.largeHeader,
        title: 'Event Details',
        subText: '',
      };
  
      return (
        <>
          <Dialog
            hidden={props.hideDialog}
            onDismiss={props.toggleHideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modelProps}
            minWidth="35%" >

            <IEventDetails 
                Title ={props.eventDetails.evInfo1.title} 
                Start ={props.eventDetails.evInfo1.startStr}
                End = {props.eventDetails.evInfo1.endStr}
                AllDay = {props.eventDetails.evInfo2.allDay}
                Body = {props.eventDetails.evInfo3._body}
                Location = {props.eventDetails.evInfo3._location}
                Recurrence = {props.eventDetails.evInfo3.recurrData}
            />
            <DialogFooter>
              <DefaultButton onClick={props.toggleHideDialog} text="Close" />
            </DialogFooter>
          </Dialog>
        </>
      );
}