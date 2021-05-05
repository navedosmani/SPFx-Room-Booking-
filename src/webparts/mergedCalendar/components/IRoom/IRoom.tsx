import * as React from 'react';
import styles from '../Room.module.scss';
import { IRoomProps } from './IRoomProps';
import {IIconProps, initializeIcons, ActionButton} from '@fluentui/react';

export default function IRoom (props:IRoomProps) {

    initializeIcons();
    const detailsIcon: IIconProps = { iconName: 'Articles' };
    const reserveIcon: IIconProps = { iconName: 'PrimaryCalendar' };
    const checkAvailIcon: IIconProps = { iconName: 'ReceiptCheck' };

    return(
        <div className={styles.roomCard}>
            <h3 style={{borderBottomColor: props.roomInfo.Colour}}><span className={styles.roomBullet} style={{backgroundColor: props.roomInfo.Colour}}></span>{props.roomInfo.Title}</h3> 
            <img width='150' src={JSON.parse(props.roomInfo.Photo0)['serverRelativeUrl']} />    
            <div className={styles.roomDetails}>
                <div className={styles.roomActions}>
                    <ActionButton className={styles.roomActBtn} iconProps={detailsIcon} onClick={() => props.onViewDetailsClick(props.roomInfo)}>{props.roomInfo.TitleRoomDetails}</ActionButton>
                    <ActionButton className={styles.roomActBtn} iconProps={reserveIcon} onClick={() => props.onBookClick(props)}>{props.roomInfo.TitleReserveNow}</ActionButton>
                    <ActionButton className={styles.roomActBtn} iconProps={checkAvailIcon} onClick={() => props.onCheckAvailClick(props.roomInfo.Id)}>{props.roomInfo.TitleCheckAvailability}</ActionButton>
                    {/* <label>{props.roomInfo.TitleColor}: <span className={styles.roomBullet} style={{backgroundColor: props.roomInfo.Colour}}></span> {props.roomInfo.Colour}</label> */}
                </div>
            </div>
        </div> 
    );
}