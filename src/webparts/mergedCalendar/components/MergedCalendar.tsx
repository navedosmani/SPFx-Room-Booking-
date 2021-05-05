import * as React from 'react';
import styles from './MergedCalendar.module.scss';
import roomStyles from './Room.module.scss';
import { IMergedCalendarProps } from './IMergedCalendarProps';
//import { escape } from '@microsoft/sp-lodash-subset';

import {IDropdownOption, DefaultButton, Panel, IComboBox, IComboBoxOption, MessageBar, MessageBarType, MessageBarButton, PanelType} from '@fluentui/react';
import {useBoolean} from '@fluentui/react-hooks';

import {CalendarOperations} from '../Services/CalendarOperations';
import {updateCalSettings} from '../Services/CalendarSettingsOps';
import {addToMyGraphCal, getMySchoolCalGUID} from '../Services/CalendarRequests';
import {formatEvDetails} from '../Services/EventFormat';
import {setWpData} from '../Services/WpProperties';
import {getRooms, getPeriods, getLocationGroup, getGuidelines, getRoomsCalendarName, addEvent, deleteEvent, updateEvent, isEventCreator} from '../Services/RoomOperations';

import ICalendar from './ICalendar/ICalendar';
import IPanel from './IPanel/IPanel';
import ILegend from './ILegend/ILegend';
import IDialog from './IDialog/IDialog';
import IRooms from './IRooms/IRooms';
import IRoomBook from './IRoomBook/IRoomBook';
import IRoomDetails from './IRoomDetails/IRoomDetails';
import IRoomDropdown from './IRoomDropdown/IRoomDropdown';
import IRoomGuidelines from './IRoomGuidelines/IRoomGuidelines';

import toast, { Toaster } from 'react-hot-toast';

export default function MergedCalendar (props:IMergedCalendarProps) {
  
  const _calendarOps = new CalendarOperations();
  const [eventSources, setEventSources] = React.useState([]);
  const [calSettings, setCalSettings] = React.useState([]);
  const [eventDetails, setEventDetails] = React.useState(null);

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isDataLoading, { toggle: toggleIsDataLoading }] = useBoolean(false);
  const [showWeekends, { toggle: toggleshowWeekends }] = useBoolean(props.showWeekends);
  const [listGUID, setListGUID] = React.useState('');

  const [rooms, setRooms] = React.useState([]);
  const [roomId, setRoomId] = React.useState(null);
  const [roomInfo, setRoomInfo] = React.useState(null);
  const [eventId, setEventId] = React.useState(null);
  const [isCreator, setIsCreator] = React.useState(false);
  const [isOpenDetails, { setTrue: openPanelDetails, setFalse: dismissPanelDetails }] = useBoolean(false);
  const [isOpenBook, { setTrue: openPanelBook, setFalse: dismissPanelBook }] = useBoolean(false);
  const [bookFormMode, setBookFormMode] = React.useState('New');
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
  
  const loadLatestCalendars = async (callback?: any) =>{
    _calendarOps.displayCalendars(props.context, calSettingsList, roomId).then((results: any)=>{
      setRoomsCalendar(getRoomsCalendarName(results[0]));
      setCalSettings(results[0]);
      setEventSources(results[1]);
      callback ? callback() : null;
    });
  };

  const popToast = (toastMsg: string) =>{
    toast.success(toastMsg, {
      duration: 2000,
      style: {
        margin: '150px',
      },
      className: roomStyles.popNotif            
    });
  };

  // UseEffect
  React.useEffect(()=>{
    loadLatestCalendars();
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
  }, []);

  const chkHandleChange = (newCalSettings:{})=>{    
    return (ev: any, checked: boolean) => { 
      toggleIsDataLoading();
      updateCalSettings(props.context, calSettingsList, newCalSettings, checked).then(()=>{
        loadLatestCalendars(toggleIsDataLoading);
      });
     };
  };  
  const dpdHandleChange = (newCalSettings:any)=>{
    return (ev: any, item: IDropdownOption) => { 
      toggleIsDataLoading();
      updateCalSettings(props.context, props.calSettingsList, newCalSettings, newCalSettings.ShowCal, item.key).then(()=>{
        loadLatestCalendars(toggleIsDataLoading);
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
  // const handleDateClick = (arg:any) =>{
  //   //console.log("arg", arg);
  //   //console.log(formatEvDetails(arg));
  //   setEventDetails(formatEvDetails(arg));
  //   toggleHideDialog();
  // };

  const handleAddtoCal = ()=>{
    addToMyGraphCal(props.context).then((result)=>{
      console.log('calendar updated', result);
    });
  };


  //Booking Forms states
  const [formField, setFormField] = React.useState({
    titleField: "",
    descpField: "",
    periodField : {key: '', text:'', start:new Date(), end:new Date()},
    dateField : new Date(),
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
    periodField : {key: '', text:'', start:new Date(), end:new Date()},
    dateField : new Date(),    
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

  const handleDateClick = (arg:any) =>{    
    if(arg.event._def.extendedProps.roomId){
      setBookFormMode('View');
      const evDetails: any = formatEvDetails(arg);
      // console.log("arg", arg);
      //console.log("evDetails", evDetails);
      setEventId(evDetails.EventId);
      setRoomInfo(evDetails);
      // setRoomInfo(evDetails.Room);
      setEventDetails(evDetails);
      
      isEventCreator(props.context, roomsCalendar, evDetails.EventId).then((v)=>{
        setIsCreator(v);
      });
      getGuidelines(props.context, guidelinesList).then((results)=>{
        setGuidelines(results);
      });
      getPeriods(props.context, periodsList, evDetails.RoomId, new Date(evDetails.Start)).then((results)=>{
        setPeriods(results);
      });
      
      setFormField({
        ...formField,
        titleField: evDetails.Title,
        descpField: evDetails.Body,
        periodField : {key: evDetails.PeriodId, text:evDetails.Period, start:new Date(evDetails.Start), end:new Date(evDetails.End)},
        dateField : new Date(evDetails.Start),    
        addToCalField: evDetails.AddToMyCal
      });    

      dismissPanelDetails();
      openPanelBook();
    }
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
    setBookFormMode('New');
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
  const onNewBookingClickHandler = ()=>{
    handleError(()=>{
      
      getPeriods(props.context, periodsList, roomInfo.Id, formField.dateField).then((results: any)=>{
        setPeriods(results);
        
        let seletedPeriod = results.filter(item => item.key === formField.periodField.key);
        if (!seletedPeriod[0].disabled){          
          addEvent(props.context, roomsCalendar, formField, roomInfo).then(()=>{
            const callback = () =>{
              dismissPanelBook();
              popToast('A New Event Booking is successfully added!');
            };
            loadLatestCalendars(callback);
          });
        }else{ //Period already booked
          setErrorMsgField({titleField: "", periodField: "Looks like the period is already booked! Please choose another one."});
          setFormField({
            ...formField,
            periodField : {key: '', text:'', start:new Date(), end:new Date()}
          });
        }
      });
      
    });
  };

  const onEditBookingClickHandler = () =>{
    setBookFormMode('Edit');
  };
  const onDeleteBookingClickHandler = (eventIdParam: any) =>{
    deleteEvent(props.context, roomsCalendar, eventIdParam).then(()=>{
      const callback = () =>{
        dismissPanelBook();
        popToast('The Event Booking is successfully deleted!');   
      };
      loadLatestCalendars(callback);
    });
  };
  const onUpdateBookingClickHandler = (eventIdParam: any) =>{
    getPeriods(props.context, periodsList, roomInfo.Id, formField.dateField).then((results: any)=>{
      setPeriods(results);
      
      let seletedPeriod = results.filter(item => item.key === formField.periodField.key);
      if (!seletedPeriod[0].disabled){          
        updateEvent(props.context, roomsCalendar, eventIdParam, formField, roomInfo).then(()=>{
          const callback = () =>{
            dismissPanelBook();
            popToast('Event Booking is successfully updated!');
          };
          loadLatestCalendars(callback);
        });
      }else{ //Period already booked
        setErrorMsgField({titleField: "", periodField: "Looks like the period is already booked! Please choose another one."});
        setFormField({
          ...formField,
          periodField : {key: '', text:'', start:new Date(), end:new Date()}
        });
      }
    });
  };

  return(
    <div className={styles.mergedCalendar}>

      <Toaster />

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

      {/* <IDialog 
        hideDialog={hideDialog} 
        toggleHideDialog={toggleHideDialog}
        eventDetails={eventDetails}
        handleAddtoCal = {handleAddtoCal}
        /> */}

      <Panel
        isOpen={isOpenDetails}
        onDismiss={dismissPanelDetails}
        headerText={roomInfo ? roomInfo.Title : 'Room Details'}
        className={roomStyles.roomBookPanel}
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
        className={roomStyles.roomBookPanel}
        onDismiss={dismissPanelBook}
        headerText={roomInfo && bookFormMode === 'New' ? roomInfo.Title : (eventDetails ? eventDetails.Room : '')}
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
        isBlocking={false}>
        <IRoomBook 
          formField = {formField}
          errorMsgField={errorMsgField} 
          periodOptions = {periods}
          onChangeFormField={onChangeFormField}
          roomInfo={roomInfo}
          dismissPanelBook={dismissPanelBook}
          bookFormMode = {bookFormMode}
          onNewBookingClick={onNewBookingClickHandler}
          onEditBookingClick={onEditBookingClickHandler}
          onDeleteBookingClick={onDeleteBookingClickHandler}
          onUpdateBookingClick={onUpdateBookingClickHandler}
          eventId = {eventId}
          isCreator = {isCreator}
        >
          <MessageBar 
            className={roomStyles.guidelinesMsg}
            messageBarType={MessageBarType.warning}
            isMultiline={false}
            truncated={true}
            overflowButtonAriaLabel="See more"> 
            <IRoomGuidelines guidelines = {guidelines} /> 
          </MessageBar>
        </IRoomBook>
      </Panel>
    </div>
  );
  
  
}
