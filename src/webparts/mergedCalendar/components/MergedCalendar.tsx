import * as React from 'react';
import styles from './MergedCalendar.module.scss';
import { IMergedCalendarProps } from './IMergedCalendarProps';
//import { escape } from '@microsoft/sp-lodash-subset';

import {IDropdownOption, DefaultButton, PrimaryButton, Panel, IComboBox, IComboBoxOption} from '@fluentui/react';
import {useBoolean} from '@fluentui/react-hooks';

import {CalendarOperations} from '../Services/CalendarOperations';
import {updateCalSettings} from '../Services/CalendarSettingsOps';
import {addToMyGraphCal, getMySchoolCalGUID} from '../Services/CalendarRequests';
import {formatEvDetails} from '../Services/EventFormat';
import {setWpData} from '../Services/WpProperties';
import {getRooms, getPeriods, getLocationGroup} from '../Services/RoomOperations';

import ICalendar from './ICalendar/ICalendar';
import IPanel from './IPanel/IPanel';
import ILegend from './ILegend/ILegend';
import IDialog from './IDialog/IDialog';
import IRooms from './IRooms/IRooms';
import IRoomBook from './IRoomBook/IRoomBook';
import IRoomDetails from './IRoomDetails/IRoomDetails';
import IRoomDropdown from './IRoomDropdown/IRoomDropdown';

export default function MergedCalendar (props:IMergedCalendarProps) {
  
  const _calendarOps = new CalendarOperations();
  const [eventSources, setEventSources] = React.useState([]);
  // const [filteredEventSources, setFilteredEventSources] = React.useState(eventSources);
  const [calSettings, setCalSettings] = React.useState([]);
  const [eventDetails, setEventDetails] = React.useState({});

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isDataLoading, { toggle: toggleIsDataLoading }] = useBoolean(false);
  const [showWeekends, { toggle: toggleshowWeekends }] = useBoolean(props.showWeekends);
  const [listGUID, setListGUID] = React.useState('');

  const [rooms, setRooms] = React.useState([]);
  const [roomId, setRoomId] = React.useState(null);
  const [roomInfo, setRoomInfo] = React.useState({});
  const [isOpenDetails, { setTrue: openPanelDetails, setFalse: dismissPanelDetails }] = useBoolean(false);
  const [isOpenBook, { setTrue: openPanelBook, setFalse: dismissPanelBook }] = useBoolean(false);
  const [filteredRooms, setFilteredRooms] = React.useState(rooms);
  const [roomSelectedKey, setRoomSelectedKey] = React.useState<string | number | undefined>('all');
  const [locationGroup, setLocationGroup] = React.useState([]);

  const calSettingsList = props.calSettingsList ? props.calSettingsList : "CalendarSettings";
  const roomsList = props.roomsList ? props.roomsList : "Rooms";
  const periodsList = props.periodsList ? props.periodsList : "Periods";
  const guidelinesList = props.guidelinesList ? props.guidelinesList : "Guidelines";
  
  React.useEffect(()=>{
    _calendarOps.displayCalendars(props.context, calSettingsList, roomId).then((results: any)=>{
      setCalSettings(results[0]);
      setEventSources(results[1]);
    });
    /*getMySchoolCalGUID(props.context, calSettingsList).then((result)=>{
      setListGUID(result);
    });*/
    getRooms(props.context, roomsList).then((results)=>{
      setRooms(results);
      setFilteredRooms(results);
    });
  },[eventSources.length, roomId]);

  React.useEffect(()=>{
    getLocationGroup(props.context, roomsList).then((results)=>{
      setLocationGroup(results);
    });
    getPeriods(props.context, periodsList).then((results)=>{
      console.log('periods', results);
      //setRooms(results);
    });
  }, []);


  // React.useEffect(()=>{
  //   if(roomId) {

  //     setFilteredEventSources(eventSources.filter((event) => {event.roomId == }))
  //   } else {
  //     setFilteredEventSources(eventSources);
  //   }
    
  // },[eventSources.length, roomId]);

  const chkHandleChange = (newCalSettings:{})=>{    
    return (ev: any, checked: boolean) => { 
      toggleIsDataLoading();
      updateCalSettings(props.context, calSettingsList, newCalSettings, checked).then(()=>{
        _calendarOps.displayCalendars(props.context, calSettingsList, roomId).then((results:any)=>{
          setCalSettings(results[0]);
          setEventSources(results[1]);
          toggleIsDataLoading();
        });
      });
     };
  };  
  const dpdHandleChange = (newCalSettings:any)=>{
    return (ev: any, item: IDropdownOption) => { 
      toggleIsDataLoading();
      updateCalSettings(props.context, props.calSettingsList, newCalSettings, newCalSettings.ShowCal, item.key).then(()=>{
        _calendarOps.displayCalendars(props.context, props.calSettingsList, roomId).then((results: any)=>{
          setCalSettings(results[0]);
          setEventSources(results[1]);
          toggleIsDataLoading();
        });
      });
     };
  };
  const chkViewHandleChange = (ev: any, checked: boolean) =>{
    toggleIsDataLoading();
    setWpData(props.context, "showWeekends", checked).then(()=>{
      toggleshowWeekends();
      toggleIsDataLoading();
    });
    
  };
  const handleDateClick = (arg:any) =>{
    //console.log(arg);
    //console.log(formatEvDetails(arg));
    setEventDetails(formatEvDetails(arg));
    toggleHideDialog();
  };

  const handleAddtoCal = ()=>{
    addToMyGraphCal(props.context).then((result)=>{
      console.log('calendar updated', result);
    });
  };

  //Filter Rooms
  const onFilterChanged = (ev: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
    setRoomSelectedKey(option.key);
    if(option.key === 'all'){
      setFilteredRooms(rooms);
    }else{
      setFilteredRooms(rooms.filter(room => room.LocationGroup.toLowerCase().indexOf(option.text.toLowerCase()) >= 0));
    }
  };

  //Rooms
  const onCheckAvailClick = (roomId: number) =>{
    setRoomId(roomId);
  };
  const onResetRoomsClick = ()=>{
    setRoomId(null);
  };
  const onViewDetailsClick = (roomInfo: any) =>{
    setRoomInfo(roomInfo);
    dismissPanelBook();
    openPanelDetails();
  };
  const onBookClick = (roomInfo: any) =>{
    setRoomInfo(roomInfo);
    dismissPanelDetails();
    openPanelBook();
  };


  //Booking Forms
  const [formField, setFormField] = React.useState({
    titleField: "",
    descpField: "",
  });
  const onChangeFormField = React.useCallback(
    (event: any, newValue?: any) => {   
      setFormField({
        ...formField,
        [event.target.id]: typeof newValue === "boolean" ? !!newValue : newValue || ''
      });
    },
    [formField],
  );
  const [errorMsgField , setErrorMsgField] = React.useState({
    titleField: "",
    linkField: ""
  });
  const resetFields = () =>{
    setFormField({
      titleField: "",
      descpField: "",
    });
    setErrorMsgField({titleField:"", linkField:""});
  };

  

  return(
    <div className={styles.mergedCalendar}>

      <div style={{float:'left', width: '28%'}}> 
        <IRoomDropdown 
          onFilterChanged={onFilterChanged}
          roomSelectedKey={roomSelectedKey}
          locationGroup = {locationGroup}
        />
        <a onClick={onResetRoomsClick}>Reset Rooms</a>
        <IRooms 
          rooms={filteredRooms} 
          onCheckAvailClick={() => onCheckAvailClick} 
          onBookClick={()=> onBookClick}
          onViewDetailsClick={()=>onViewDetailsClick}
        />
      </div>

      <div style={{float:'left', width: '70%', marginLeft: '2%'}}>
        <ICalendar 
          // eventSources={filteredEventSources} 
          eventSources={eventSources} 
          showWeekends={showWeekends}
          openPanel={openPanel}
          handleDateClick={handleDateClick}
          context={props.context}
          listGUID = {listGUID}/>

        <ILegend calSettings={calSettings} />
      </div>

      <IPanel
        dpdOptions={props.dpdOptions} 
        calSettings={calSettings}
        onChkChange={chkHandleChange}
        onDpdChange={dpdHandleChange}
        isOpen = {isOpen}
        dismissPanel = {dismissPanel}
        isDataLoading = {isDataLoading} 
        showWeekends= {showWeekends} 
        onChkViewChange= {chkViewHandleChange}/>

      <IDialog 
        hideDialog={hideDialog} 
        toggleHideDialog={toggleHideDialog}
        eventDetails={eventDetails}
        handleAddtoCal = {handleAddtoCal}
        />

      <Panel
        isOpen={isOpenDetails}
        onDismiss={dismissPanelDetails}
        headerText="Room Details"
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
        isBlocking={false}>
            <IRoomDetails roomInfo={roomInfo} />
            <div className={styles.panelBtns}>
              <DefaultButton onClick={dismissPanelDetails} text="Cancel" />
            </div>
      </Panel>
      <Panel
        isOpen={isOpenBook}
        onDismiss={dismissPanelBook}
        headerText="Book Room"
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
        isBlocking={false}>
            <IRoomBook 
              formField = {formField}
              errorMsgField={errorMsgField} 
              onChangeFormField={onChangeFormField}
            />
            <div className={styles.panelBtns}>
              <PrimaryButton text="Book" />
              <DefaultButton onClick={dismissPanelBook} text="Cancel" />
            </div>
      </Panel>


    </div>
  );
  
  
}
