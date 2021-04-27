import * as React from 'react';
import {Stack, TextField, Dropdown, IDropdownOption, DatePicker, IDatePickerStrings, DayOfWeek, IComboBoxOption, ComboBox, IComboBox, Text, Toggle} from '@fluentui/react';
import styles from '../Room.module.scss';
import { IRoomBookProps } from './IRoomBookProps';
import {getChosenDate} from '../../Services/RoomOperations';
import * as moment from 'moment';

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
    
    const hours: IComboBoxOption[] = [
        { key: '12 AM', text: '12 AM' },
        { key: '1 AM', text: '1 AM' },
        { key: '2 AM', text: '2 AM' },
        { key: '3 AM', text: '3 AM' },
        { key: '4 AM', text: '4 AM' },
        { key: '5 AM', text: '5 AM' },
        { key: '6 AM', text: '6 AM' },
        { key: '7 AM', text: '7 AM' },
        { key: '8 AM', text: '8 AM' },
        { key: '9 AM', text: '9 AM' },
        { key: '10 AM', text: '10 AM' },
        { key: '11 AM', text: '11 AM' },
        { key: '12 PM', text: '12 PM' },
        { key: '1 PM', text: '1 PM' },
        { key: '2 PM', text: '2 PM' },
        { key: '3 PM', text: '3 PM' },
        { key: '4 PM', text: '4 PM' },
        { key: '5 PM', text: '5 PM' },
        { key: '6 PM', text: '6 PM' },
        { key: '7 PM', text: '7 PM' },
        { key: '8 PM', text: '8 PM' },
        { key: '9 PM', text: '9 PM' },
        { key: '10 PM', text: '10 PM' },
        { key: '11 PM', text: '11 PM' },
    ];
    const minutes: IComboBoxOption[] = [
        { key: '00', text: '00' },
        { key: '05', text: '05' },
        { key: '10', text: '10' },
        { key: '15', text: '15' },
        { key: '20', text: '20' },
        { key: '25', text: '25' },
        { key: '30', text: '30' },
        { key: '35', text: '35' },
        { key: '40', text: '40' },
        { key: '45', text: '45' },
        { key: '50', text: '50' },
        { key: '55', text: '55' },
    ];

    return(
        <div className={styles.bookingForm}>
            <h3>{props.roomInfo.Title}</h3>
            <Stack tokens={stackTokens}>
                <Stack>
                    <TextField 
                        label="Title" 
                        required 
                        value={props.formField.titleField} 
                        onChange={props.onChangeFormField('titleField')} 
                        errorMessage={props.errorMsgField.titleField} 
                    />  
                    <TextField 
                        label="Description"
                        multiline rows={3}
                        value={props.formField.descpField} 
                        onChange={props.onChangeFormField('descpField')}
                    />   
                    <DatePicker
                        isRequired={true}
                        firstDayOfWeek={firstDayOfWeek}
                        strings={DayPickerStrings}
                        label="Date"
                        ariaLabel="Select a date"
                        onSelectDate={props.onChangeFormField('dateField')}
                        value={props.formField.dateField}
                    />
                    <Dropdown 
                        placeholder="Select a period" 
                        label="Period" 
                        required
                        selectedKey={props.formField.periodField ? props.formField.periodField.key : undefined}
                        options={props.periodOptions} 
                        onChange={props.onChangeFormField('periodField')} 
                        errorMessage={props.errorMsgField.periodField} 
                    />
                    <TextField 
                        label='Start Time' 
                        readOnly
                        disabled
                        value={moment(getChosenDate(props.formField.periodField.start, props.formField.periodField.end, props.formField.dateField)[0]).format('hh:mm A')}
                    />
                    <TextField 
                        label='End Time' 
                        readOnly
                        disabled
                        value={moment(getChosenDate(props.formField.periodField.start, props.formField.periodField.end, props.formField.dateField)[1]).format('hh:mm A')}
                    />
                    <Toggle 
                        label="Add this event to my Calendar" 
                        onText="Yes" 
                        offText="No" 
                        checked={props.formField.addToCalField}
                        onChange={props.onChangeFormField('addToCalField')}
                    />
                    {/*<Label>Start Time</Label>
                     <Stack horizontal tokens={stackTokens}>
                        <Stack>
                            <ComboBox
                                selectedKey={props.formField.startHrField ? props.formField.startHrField.key : undefined}
                                autoComplete="on"
                                options={hours}
                                onChange={props.onChangeFormField('startHrField')}
                            />
                        </Stack>
                        <Stack>
                            <ComboBox
                                selectedKey={props.formField.startMinField ? props.formField.startMinField.key : undefined}
                                autoComplete="on"
                                options={minutes}
                                onChange={props.onChangeFormField('startMinField')}
                            />
                        </Stack>
                    </Stack> */}
                    {/*<Label>End Time</Label>
                     <Stack horizontal tokens={stackTokens}>
                        <Stack>
                            <ComboBox
                                selectedKey={props.formField.endHrField ? props.formField.endHrField.key : undefined}
                                required
                                autoComplete="on"
                                options={hours}
                                onChange={props.onChangeFormField('endHrField')}
                            />
                        </Stack>
                        <Stack>
                            <ComboBox
                                selectedKey={props.formField.endMinField ? props.formField.endMinField.key : undefined}
                                required
                                autoComplete="on"
                                options={minutes}
                                onChange={props.onChangeFormField('endMinField')}
                            />
                        </Stack>
                    </Stack> */}
                </Stack>
            </Stack>
        </div>
    );
}