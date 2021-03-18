import * as React from 'react';
import styles from '../Room.module.scss';
import {IComboBoxOption, ComboBox, IComboBox} from '@fluentui/react';

import { IRoomDropdownProps } from './IRoomDropdownProps';

export default function IRoomDropdown (props: IRoomDropdownProps){
    
    return(
        <div>
            <ComboBox
                selectedKey={props.roomSelectedKey}
                label="Select Location"
                autoComplete="on"
                options={props.locationGroup}
                onChange={props.onFilterChanged}
            />
        </div>
    );
}