import * as React from 'react';
import roomStyles from '../Room.module.scss';
import { IRoomDetailsProps } from './IRoomDetailsProps';
import { FontIcon } from '@fluentui/react/lib/Icon';

export default function IRoomDetails (props:IRoomDetailsProps) {
    return(
        <div className={roomStyles.roomDetailsPanel}>
            <h3>Room Details</h3>
            <div 
                style={{backgroundColor: props.roomInfo.Colour}} 
                className={roomStyles.roomColor}>
            </div>
            <div className={roomStyles.roomImageCntnr}>
                {props.roomInfo.Photo !== undefined &&
                    <img width='150' src={JSON.parse(props.roomInfo.Photo)['serverRelativeUrl']} /> 
                }
            </div>
            <ul>
                <li>
                    <FontIcon aria-label="Capacity" iconName="Group" className={roomStyles.roomDetailsIcon} />
                    <label>Capacity: </label><span>{props.roomInfo.Capacity}</span>
                </li>
                <li>
                    <FontIcon aria-label="Facilities" iconName="Settings" className={roomStyles.roomDetailsIcon} />
                    <label>Facilities: </label><span>{props.roomInfo.Facilities1}</span>
                </li>
                {/* <li>
                    <FontIcon aria-label="Period" iconName="PrimaryCalendar" className={roomStyles.roomDetailsIcon} />
                    <label>Period: </label><span>{props.roomInfo.Period_x0020__x0023_}</span>
                </li> */}
                <li>
                    <FontIcon aria-label="Locaion Group" iconName="PinnedSolid" className={roomStyles.roomDetailsIcon} />
                    <label>Location Group: </label><span>{props.roomInfo.LocationGroup}</span>
                    </li>
                <li>
                    <FontIcon aria-label="Type of Resource" iconName="ClipboardList" className={roomStyles.roomDetailsIcon} />
                    <label>Type of Resource: </label><span>{props.roomInfo.TypeofResouce}</span>
                    </li>
                <li>
                    <FontIcon aria-label="Comments" iconName="Comment" className={roomStyles.roomDetailsIcon} />
                    <label>Comments: </label><span>{props.roomInfo.OData__Comments}</span>
                    </li>
            </ul>
        </div>
    );
}