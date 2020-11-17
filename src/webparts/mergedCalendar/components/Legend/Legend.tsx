import * as React from 'react';
import './legend.scss';
import styles from '../MergedCalendar.module.scss';
import { LegendProps } from './LegendProps';

export default function Legend(props:LegendProps){
    
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