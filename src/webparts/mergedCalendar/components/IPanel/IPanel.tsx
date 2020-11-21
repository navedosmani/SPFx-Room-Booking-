import * as React from 'react';
import styles from '../MergedCalendar.module.scss';
import { IPanelProps } from './IPanelProps';

import {Panel, Checkbox, Stack, Dropdown, Spinner, SpinnerSize, Overlay} from '@fluentui/react';

export default function IPanel (props:IPanelProps) {

    const stackTokens = { childrenGap: 20 , maxWidth: 250};    

    return(
        <Panel
            isOpen={props.isOpen}
            onDismiss={props.dismissPanel}
            headerText="Calendar Settings"
            closeButtonAriaLabel="Close"
            isFooterAtBottom={true}>
            <div className={styles.calendarPanel}>
                <Stack tokens={stackTokens}>
                    {props.calSettings.map((value:any, index) => {        
                        return (
                            <div>
                            <Checkbox key={index} onChange={props.onChkChange(value)} defaultChecked={value.Chkd} label={value.Title} disabled={value.Disabled} />
                            {value.Dpd &&
                                <Dropdown onChange={props.onDpdChange(value)} className={styles.marginT5} placeholder="Select Day..."  defaultSelectedKey={value.CalName} options={props.dpdOptions} />
                            }
                            </div>
                        );
                    })}
                </Stack>
            </div>
            {props.isDataLoading &&
                <div>
                    <Overlay></Overlay>
                    <div className={styles.marginT20}>
                        <Spinner size={SpinnerSize.medium} label="Please Wait, Calendars are updating..." ariaLive="assertive" labelPosition="right" />
                    </div>
                </div>
            }
        </Panel>
    );
}