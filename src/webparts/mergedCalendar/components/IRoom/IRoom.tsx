import * as React from 'react';
import styles from '../Room.module.scss';
import { IRoomProps } from './IRoomProps';

export default function IRoom (props:IRoomProps) {

    // const onCheckAvailClick = (roomId : number)=>{
    //     const allEvents = document.querySelectorAll('.roomEvent');
    //     const targetEventClass = 'roomID-' + roomId;

    //     for (let i =0; i < allEvents.length; i++){
    //         if (allEvents[i].className.indexOf(targetEventClass) === -1){
    //             allEvents[i].classList.add('roomEventHidden');
    //         }
    //     }
    // };

    return(
        <div className={styles.roomCard}>
            <h3>{props.title}</h3> 
            <img width='150' src={JSON.parse(props.img)['serverRelativeUrl']} />    
            <div className={styles.roomDetails}>
                <div className={styles.roomActions}>
                    <a onClick={() => props.onViewDetailsClick(props)}>Room Details</a>
                    <a onClick={() => props.onBookClick(props)}>Reserve Now</a>
                    <a onClick={() => props.onCheckAvailClick(props.id)}>Check Availability</a>
                    {/* <a onClick={() => onCheckAvailClick(props.id)}>Check Availability - NO CALL</a> */}
                    <label>Color <span>{props.color}</span></label>
                </div>
            </div>
        </div> 
    );
}