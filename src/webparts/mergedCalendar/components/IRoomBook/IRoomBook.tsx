import * as React from 'react';
import {Stack, TextField, Dropdown, IDropdownOption, DatePicker, IDatePickerStrings, DayOfWeek, IComboBoxOption, ComboBox, IComboBox} from '@fluentui/react';
import styles from '../Room.module.scss';
import { IRoomBookProps } from './IRoomBookProps';

export default function IRoomBook (props:IRoomBookProps) {

    const DayPickerStrings: IDatePickerStrings = {
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        goToToday: 'Go to today',
        prevMonthAriaLabel: 'Go to previous month',
        nextMonthAriaLabel: 'Go to next month',
        prevYearAriaLabel: 'Go to previous year',
        nextYearAriaLabel: 'Go to next year',
        closeButtonAriaLabel: 'Close date picker',
        monthPickerHeaderAriaLabel: '{0}, select to change the year',
        yearPickerHeaderAriaLabel: '{0}, select to change the month',
      };

    const stackTokens = { childrenGap: 50 };
    const [firstDayOfWeek, setFirstDayOfWeek] = React.useState(DayOfWeek.Sunday);
    
    const items: IComboBoxOption[] = [
        { key: '12am', text: '12:00 AM' },
        { key: '1230am', text: '12:30 AM' },
        { key: '1am', text: '1:00 AM' },
        { key: '130am', text: '1:30 AM' },
        { key: '2am', text: '2:00 AM' },
        { key: '230am', text: '2:30 AM' },
        { key: '3am', text: '3:00 AM' },
    ];
    const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();

    const [selectedKey, setSelectedKey] = React.useState<string | number | undefined>('10:00');
    const onChange1 = (ev: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
        setSelectedKey(option.key);
    };
    const onChange2 = (ev: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
        setSelectedKey(option.key);
    };

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
                        multiline rows={3}
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
                    <DatePicker
                        firstDayOfWeek={firstDayOfWeek}
                        strings={DayPickerStrings}
                        label="Date"
                        ariaLabel="Select a date"
                    />
                    <ComboBox
                        selectedKey={selectedKey}
                        label="Start Time"
                        autoComplete="on"
                        options={items}
                        onChange={onChange1}
                    />
                    <ComboBox
                        selectedKey={selectedKey}
                        label="End Time"
                        autoComplete="on"
                        options={items}
                        onChange={onChange2}
                    />
                </Stack>
            </Stack>
        </div>
    );

}