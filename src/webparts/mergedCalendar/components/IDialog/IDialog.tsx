import * as React from 'react';
import {Dialog, DialogType, DialogFooter, DefaultButton} from '@fluentui/react';

import {IDialogProps} from './IDialogProps';
import IEventDetails from  '../IEventDetails/IEventDetails';

export default function IDialog(props:IDialogProps){
    const modelProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
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
            modalProps={modelProps}>

            <IEventDetails 
                Title={props.evDetails.title} 
                // Location={props.evDetails.extendedProps._location} />
                Location={props.evDetails.location} />

            <DialogFooter>
              <DefaultButton onClick={props.toggleHideDialog} text="Close" />
            </DialogFooter>
          </Dialog>
        </>
      );
}