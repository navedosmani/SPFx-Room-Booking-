import * as React from 'react';
import './ILegend.scss';
import styles from '../MergedCalendar.module.scss';
import roomStyles from '../Room.module.scss';
import { ILegendProps } from './ILegendProps';

export default function ILegend(props:ILegendProps){
    return(
        <div className={styles.calendarLegend}>
            <ul>
            {
                props.calSettings.map((value:any)=>{
                    return(
                        <React.Fragment>
                            {value.ShowCal && value.CalType !== 'Room' &&
                                <li key={value.Id}>
                                    <a href={value.LegendURL} target="_blank" data-interception="off">
                                        <span className={styles.legendBullet +' calLegend_'+value.BgColor}></span>
                                        <span className={styles.legendText}>{value.Title}</span>
                                    </a>
                                </li>
                            }
                            {value.ShowCal && value.CalType === 'Room' &&
                                props.rooms.map((room: any)=>{
                                    return(
                                        <li key={value.Id} className={roomStyles.roomLegendItem}>
                                            <a>
                                                <span style={{backgroundColor: room.Colour}} className={styles.legendBullet}></span>
                                                <span className={styles.legendText}>{room.Title}</span>
                                            </a>
                                        </li>
                                    );
                                })
                            }
                        </React.Fragment>
                    );
                })
            }
            </ul>
        </div>
    );
}





