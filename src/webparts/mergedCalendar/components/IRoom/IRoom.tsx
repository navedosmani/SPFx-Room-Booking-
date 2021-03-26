import * as React from 'react';
import styles from '../Room.module.scss';
import { IRoomProps } from './IRoomProps';
import { initializeIcons } from '@uifabric/icons';
import {Icon} from '@fluentui/react/lib/Icon';



export default function IRoom (props:IRoomProps) {

    initializeIcons();
    return(
        <div className={styles.roomCard}>
            <h3>{props.roomInfo.Title}</h3> 
            <img width='150' src={JSON.parse(props.roomInfo.Photo0)['serverRelativeUrl']} />    
            <div className={styles.roomDetails}>
                <div className={styles.roomActions}>
                    <a onClick={() => props.onViewDetailsClick(props.roomInfo)}><Icon iconName='ChromeRestore' /> <span>{props.roomInfo.TitleRoomDetails}</span></a>
                    <a onClick={() => props.onBookClick(props)}><Icon iconName='CalendarMirrored' /><span>{props.roomInfo.TitleReserveNow}</span></a>
                    <a onClick={() => props.onCheckAvailClick(props.roomInfo.Id)}><Icon iconName='ReceiptCheck' /><span>{props.roomInfo.TitleCheckAvailability}</span></a>
                    <label>{props.roomInfo.TitleColor}: <span className={styles.roomBullet} style={{backgroundColor: props.roomInfo.Colour}}></span> {props.roomInfo.Colour}</label>
                </div>
            </div>
        </div> 
    );
}