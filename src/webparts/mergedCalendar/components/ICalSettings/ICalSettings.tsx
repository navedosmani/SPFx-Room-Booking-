import * as React from 'react';
import styles from '../MergedCalendar.module.scss';
import { ICalSettingsProps } from './ICalSettingsProps';

import {Checkbox, Stack, Dropdown} from '@fluentui/react';

export default function ICalSettings (props:ICalSettingsProps) {

    const stackTokens = { childrenGap: 20 , maxWidth: 250};    

    return(
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
    );
}