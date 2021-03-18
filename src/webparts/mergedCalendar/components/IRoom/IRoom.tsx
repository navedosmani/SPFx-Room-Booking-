import * as React from 'react';
import styles from '../Room.module.scss';
import { IRoomProps } from './IRoomProps';

export default function IRoom (props:IRoomProps) {

    return(
        <div className={styles.roomCard}>
            <h3>{props.roomInfo.Title}</h3> 
            <img width='150' src={JSON.parse(props.roomInfo.Photo0)['serverRelativeUrl']} />    
            <div className={styles.roomDetails}>
                <div className={styles.roomActions}>
                    <a onClick={() => props.onViewDetailsClick(props.roomInfo)}>{props.roomInfo.TitleRoomDetails}</a>
                    <a onClick={() => props.onBookClick(props)}>{props.roomInfo.TitleReserveNow}</a>
                    <a onClick={() => props.onCheckAvailClick(props.roomInfo.Id)}>{props.roomInfo.TitleCheckAvailability}</a>
                    <label>{props.roomInfo.TitleColor} <span style={{backgroundColor: props.roomInfo.Colour}}>{props.roomInfo.Colour}</span></label>
                </div>
            </div>
        </div> 
    );
}