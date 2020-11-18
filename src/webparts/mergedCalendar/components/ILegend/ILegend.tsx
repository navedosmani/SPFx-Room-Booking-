import * as React from 'react';
import './ILegend.scss';
import styles from '../MergedCalendar.module.scss';
import { ILegendProps } from './ILegendProps';

export default function ILegend(props:ILegendProps){
    
    return(
        <div className={styles.calendarLegend}>
            <ul>
            {
                props.calSettings.map((value:any, index)=>{
                    return(
                        
                        <li key={index}>
                            {value.ShowCal &&
                                <div>
                                    <span className={styles.legendBullet +' calLegend_'+value.BgColor}></span>
                                    <span className={styles.legendText}>{value.Title}</span>
                                </div>
                            }
                        </li>
                    )
                })
            }
            </ul>
        </div>
    );
}