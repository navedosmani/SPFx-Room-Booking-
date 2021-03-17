import * as React from 'react';
import styles from '../Room.module.scss';
import { IRoomDetailsProps } from './IRoomDetailsProps';

export default function IRoomDeatils (props:IRoomDetailsProps) {
    return(
        <div>
            <h3>{props.roomInfo.title}</h3>
            <img width='150' src={JSON.parse(props.roomInfo.img)['serverRelativeUrl']} /> 
            <ul>
                <li><label>Capacity: </label><span>{props.roomInfo.capacity}</span></li>
                <li><label>Facilities: </label><span>{props.roomInfo.facilities}</span></li>
                <li><label>Period: </label><span>{props.roomInfo.period}</span></li>
                <li><label>Location Group: </label><span>{props.roomInfo.locationGroup}</span></li>
                <li><label>Comments: </label><span>{props.roomInfo.comments}</span></li>
            </ul>
        </div>
    );
}