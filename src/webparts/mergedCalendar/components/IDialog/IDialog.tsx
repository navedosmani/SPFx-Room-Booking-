import * as React from 'react';
import {Dialog, DialogType, DialogFooter, DefaultButton} from '@fluentui/react';

import {IDialogProps} from './IDialogProps';

export default function IDialog(props:IDialogProps){
    const modelProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
      };
      const dialogContentProps = {
        type: DialogType.largeHeader,
        title: 'All emails together',
        subText: 'Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.',
      };

      return (
        <>
          <Dialog
            hidden={props.hideDialog}
            onDismiss={props.toggleHideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modelProps}>
            <DialogFooter>
              <DefaultButton onClick={props.toggleHideDialog} text="Close" />
            </DialogFooter>
          </Dialog>
        </>
      );
}