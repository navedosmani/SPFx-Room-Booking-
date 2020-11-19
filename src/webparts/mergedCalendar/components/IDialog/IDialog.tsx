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
                Title ={props.evDetails1.title} 
                Start ={props.evDetails1.startStr}
                End = {props.evDetails1.endStr}
                AllDay = {props.evDetails2.allDay}
                Body = {props.evDetails3._body}
                Location = {props.evDetails3._location}
                Recurrence = {props.evDetails3.recurrData}
            />
            <DialogFooter>
              <DefaultButton onClick={props.toggleHideDialog} text="Close" />
            </DialogFooter>
          </Dialog>
        </>
      );
}