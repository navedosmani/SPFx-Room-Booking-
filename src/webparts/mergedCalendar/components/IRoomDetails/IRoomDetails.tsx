import * as React from 'react';
import styles from '../Room.module.scss';
import { IRoomDetailsProps } from './IRoomDetailsProps';

export default function IRoomDeatils (props:IRoomDetailsProps) {
    return(
        <div>
            <h3>{props.roomInfo.Title}</h3>
            <img width='150' src={JSON.parse(props.roomInfo.Photo0)['serverRelativeUrl']} /> 
            <ul>
                <li><label>Capacity: </label><span>{props.roomInfo.Capacity}</span></li>
                <li><label>Facilities: </label><span>{props.roomInfo.Facilities1}</span></li>
                <li><label>Period: </label><span>{props.roomInfo.Period_x0020__x0023_}</span></li>
                <li><label>Location Group: </label><span>{props.roomInfo.LocationGroup}</span></li>
                <li><label>Type of Resource: </label><span>{props.roomInfo.TypeofResouce}</span></li>
                <li><label>Comments: </label><span>{props.roomInfo.OData__Comments}</span></li>
            </ul>
        </div>
    );
}