import * as React from 'react';
import styles from './MergedCalendar.module.scss';
import roomStyles from './Room.module.scss';
import { IMergedCalendarProps } from './IMergedCalendarProps';
//import { escape } from '@microsoft/sp-lodash-subset';

import {IDropdownOption, DefaultButton, PrimaryButton, Panel, IComboBox, IComboBoxOption, MessageBar, MessageBarType, MessageBarButton, PanelType} from '@fluentui/react';
import {useBoolean} from '@fluentui/react-hooks';

import {CalendarOperations} from '../Services/CalendarOperations';
import {updateCalSettings} from '../Services/CalendarSettingsOps';
import {addToMyGraphCal, getMySchoolCalGUID} from '../Services/CalendarRequests';
import {formatEvDetails} from '../Services/EventFormat';
import {setWpData} from '../Services/WpProperties';
import {getRooms, getPeriods, getLocationGroup, getGuidelines, getRoomsCalendarName, addEvent, getChosenDate} from '../Services/RoomOperations';

import ICalendar from './ICalendar/ICalendar';
import IPanel from './IPanel/IPanel';
import ILegend from './ILegend/ILegend';
import IDialog from './IDialog/IDialog';
import IRooms from './IRooms/IRooms';
import IRoomBook from './IRoomBook/IRoomBook';
import IRoomDetails from './IRoomDetails/IRoomDetails';
import IRoomDropdown from './IRoomDropdown/IRoomDropdown';
import IRoomGuidelines from './IRoomGuidelines/IRoomGuidelines';

export default function MergedCalendar (props:IMergedCalendarProps) {
  
  const _calendarOps = new CalendarOperations();
  const [eventSources, setEventSources] = React.useState([]);
  const [calSettings, setCalSettings] = React.useState([]);
  const [eventDetails, setEventDetails] = React.useState({});

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isDataLoading, { toggle: toggleIsDataLoading }] = useBoolean(false);
  const [showWeekends, { toggle: toggleshowWeekends }] = useBoolean(props.showWeekends);
  const [listGUID, setListGUID] = React.useState('');

  const [rooms, setRooms] = React.useState([]);
  const [roomId, setRoomId] = React.useState(null);
  const [roomInfo, setRoomInfo] = React.useState(null);
  const [isOpenDetails, { setTrue: openPanelDetails, setFalse: dismissPanelDetails }] = useBoolean(false);
  const [isOpenBook, { setTrue: openPanelBook, setFalse: dismissPanelBook }] = useBoolean(false);
  const [filteredRooms, setFilteredRooms] = React.useState(rooms);
  const [roomSelectedKey, setRoomSelectedKey] = React.useState<string | number | undefined>('all');
  const [locationGroup, setLocationGroup] = React.useState([]);
  const [periods, setPeriods] = React.useState([]);
  const [guidelines, setGuidelines] = React.useState([]);
  const [isFiltered, { setTrue: showFilterWarning, setFalse: hideFilterWarning }] = useBoolean(false);
  const [roomsCalendar, setRoomsCalendar] = React.useState('Events');
  
  const calSettingsList = props.calSettingsList ? props.calSettingsList : "CalendarSettings";
  const roomsList = props.roomsList ? props.roomsList : "Rooms";
  const periodsList = props.periodsList ? props.periodsList : "Periods";
  const guidelinesList = props.guidelinesList ? props.guidelinesList : "Guidelines";
  
  React.useEffect(()=>{
    _calendarOps.displayCalendars(props.context, calSettingsList, roomId).then((results: any)=>{
      setRoomsCalendar(getRoomsCalendarName(results[0]));
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
    // getPeriods(props.context, periodsList).then((results)=>{
    //   setPeriods(results);
    // });
    // getGuidelines(props.context, guidelinesList).then((results)=>{
    //   setGuidelines(results);
    // });
  }, []);

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
    //console.log("arg", arg);
    //console.log(formatEvDetails(arg));
    setEventDetails(formatEvDetails(arg));
    toggleHideDialog();
  };

  const handleAddtoCal = ()=>{
    addToMyGraphCal(props.context).then((result)=>{
      console.log('calendar updated', result);
    });
  };


  //Booking Forms states
  const [formField, setFormField] = React.useState({
    titleField: "",
    descpField: "",
    periodField : {key: '', text:'', start:new Date(), end:new Date(), order:''},
    dateField : new Date(),
    startHrField : {key:'12 AM', text: '12 AM'},
    startMinField : {key:'00', text: '00'},
    endHrField : {key:'12 AM', text: '12 AM'},
    endMinField : {key:'00', text: '00'},
    addToCalField: false
  });
  //error handeling
  const [errorMsgField , setErrorMsgField] = React.useState({
    titleField: "",
    periodField : "",
  });
  const resetFields = () =>{
    setFormField({
    titleField: "",
    descpField: "",
    periodField : {key: '', text:'', start:new Date(), end:new Date(), order:''},
    dateField : new Date(),    
    startHrField : {key:'12 AM', text: '12 AM'},
    startMinField : {key:'00', text: '00'},
    endHrField : {key:'12 AM', text: '12 AM'},
    endMinField : {key:'00', text: '00'},
    addToCalField: false
    });
    setErrorMsgField({
      titleField: "",
      periodField : "",
    });
  };
  const onChangeFormField = (formFieldParam: string) =>{
    return (event: any, newValue?: any)=>{
      //Note to self
      //(newValue === undefined && typeof event === "object") //this is for date
      //for date, there is no 2nd param, the newValue is the main one
      //typeof newValue === "boolean" //this one for toggle buttons
      setFormField({
        ...formField,
        [formFieldParam]: (newValue === undefined && typeof event === "object") ? event : (typeof newValue === "boolean" ? !!newValue : newValue || ''),
      });

      setErrorMsgField({titleField: "", periodField: ""});

      if(formFieldParam === 'dateField'){
        getPeriods(props.context, periodsList, roomInfo.Id, event).then((results)=>{
          setPeriods(results);
        });
      }

    };
  };
  
  const handleError = (callback:any) =>{
    if (formField.titleField == "" && formField.periodField.key == ""){
      setErrorMsgField({titleField: "Title Field Required", periodField: "Period Field Required"});
    }
    else if (formField.titleField == ""){
      setErrorMsgField({titleField: "Title Field Required", periodField: ""});
    }
    else if (formField.periodField.key == ""){
      setErrorMsgField({titleField: "", periodField: "Period Field Required"});
    }
    else{
      setErrorMsgField({titleField: "", periodField: ""});
      callback();
    }
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

  //Rooms functions
  const onCheckAvailClick = (roomIdParam: number) =>{
    setRoomId(roomIdParam);
    showFilterWarning();
  };
  const onResetRoomsClick = ()=>{
    setRoomId(null);
    hideFilterWarning();
  };
  const onViewDetailsClick = (roomInfoParam: any) =>{
    setRoomInfo(roomInfoParam);
    dismissPanelBook();
    openPanelDetails();
  };
  const onBookClick = (bookingInfoParam: any) =>{
    getPeriods(props.context, periodsList, bookingInfoParam.roomInfo.Id, formField.dateField).then((results)=>{
      setPeriods(results);
    });
    getGuidelines(props.context, guidelinesList).then((results)=>{
      setGuidelines(results);
    });

    resetFields();
    setRoomInfo(bookingInfoParam.roomInfo);
    dismissPanelDetails();
    openPanelBook();
  };

  //when clicking on the book button in the panel
  const getRoomFormFields = ()=>{
    handleError(()=>{
      
      getPeriods(props.context, periodsList, roomInfo.Id, formField.dateField).then((results: any)=>{
        setPeriods(results);
        
        let seletedPeriod = results.filter(item => item.key === formField.periodField.key);
        if (!seletedPeriod[0].disabled){          
          addEvent(props.context, roomsCalendar, formField, roomInfo).then(()=>{
            dismissPanelBook();
            _calendarOps.displayCalendars(props.context, calSettingsList, roomId).then((results: any)=>{
              setRoomsCalendar(getRoomsCalendarName(results[0]));
              setCalSettings(results[0]);
              setEventSources(results[1]);
            });
          });
        }else{ //Period already booked
          setErrorMsgField({titleField: "", periodField: "Looks like the period is already booked! Please choose another one."});
          setFormField({
            ...formField,
            periodField : {key: '', text:'', start:new Date(), end:new Date(), order:''}
          });
        }
      });
      
    });
  };

  return(
    <div className={styles.mergedCalendar}>

      <div style={{float:'left', width: '28%'}}> 
      
        <IRoomDropdown 
          onFilterChanged={onFilterChanged}
          roomSelectedKey={roomSelectedKey}
          locationGroup = {locationGroup}
        />
        <IRooms 
          rooms={filteredRooms} 
          onCheckAvailClick={() => onCheckAvailClick} 
          onBookClick={()=> onBookClick}
          onViewDetailsClick={()=>onViewDetailsClick}
        />
      </div>

      <div style={{float:'left', width: '70%', marginLeft: '2%', position: 'relative'}}>
        {isFiltered &&
          <div className={roomStyles.filterWarning}>
            <MessageBar
              messageBarType={MessageBarType.warning}
              isMultiline={false}
              actions={
              <div>
                  <MessageBarButton onClick={onResetRoomsClick}>Reset Filter</MessageBarButton>
              </div>
              }
            >
              Please note that you are not viewing all rooms now. Click 'Reset Filter' to view all.
            </MessageBar>
          </div>
        }
        <ICalendar 
          // eventSources={filteredEventSources} 
          eventSources={eventSources} 
          showWeekends={showWeekends}
          openPanel={openPanel}
          handleDateClick={handleDateClick}
          context={props.context}
          listGUID = {listGUID}/>

        <ILegend 
          calSettings={calSettings} 
          rooms={filteredRooms}
        />
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
        onChkViewChange= {chkViewHandleChange}
        />

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
        isBlocking={false}
        // isLightDismiss={true}
        >
            <IRoomDetails roomInfo={roomInfo} />
            <div className={styles.panelBtns}>
              <DefaultButton className={styles.marginL10} onClick={dismissPanelDetails} text="Cancel" />
            </div>
      </Panel>
      <Panel
        isOpen={isOpenBook}
        type={PanelType.medium}
        onDismiss={dismissPanelBook}
        headerText="Book Room"
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
        isBlocking={false}>
          <MessageBar
            messageBarType={MessageBarType.warning}
            isMultiline={false}
            truncated={true}
            overflowButtonAriaLabel="See more"
          > 
            <IRoomGuidelines guidelines = {guidelines} /> 
          </MessageBar>
        <IRoomBook 
          formField = {formField}
          errorMsgField={errorMsgField} 
          periodOptions = {periods}
          onChangeFormField={onChangeFormField}
          roomInfo={roomInfo}
        />
        
        <div>
          <PrimaryButton text="Book" onClick={getRoomFormFields}/>
          <DefaultButton className={styles.marginL10} onClick={dismissPanelBook} text="Cancel" />
        </div>
      </Panel>


    </div>
  );
  
  
}
