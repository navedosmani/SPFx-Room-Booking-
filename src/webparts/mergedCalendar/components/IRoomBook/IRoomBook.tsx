import * as React from 'react';
import {Stack, TextField, Dropdown, Panel} from '@fluentui/react';
import styles from '../Room.module.scss';
import { IRoomBookProps } from './IRoomBookProps';



export default function IRoomBook (props:IRoomBookProps) {

    const stackTokens = { childrenGap: 50 };
    const dropdownStyles = { dropdown: { width: 300 } };

    return(
        <div>
            <Stack tokens={stackTokens}>
                <Stack>
                    <TextField 
                        id="titleField" 
                        name="titleField" 
                        label="Title" 
                        required 
                        value={props.formField.titleField} 
                        onChange={props.onChangeFormField} 
                        errorMessage={props.errorMsgField.titleField} 
                    />  
                    <TextField 
                        id="descpField" 
                        name="descpField" 
                        label="Description"
                        value={props.formField.descpField} 
                        onChange={props.onChangeFormField}
                    />  
                    {/* <Dropdown 
                        placeholder="Select a period" id="periodField"
                        label="Period" 
                        selectedKey={props.formField.descpField ? props.formField.descpField.key : undefined}
                        options={props.periodOptions} 
                        styles={dropdownStyles}
                        onChange={props.onChangeFormField} 
                    /> */}
                </Stack>
            </Stack>
        </div>
    );

}