import * as React from 'react';
import './legend.scss';
import { CalendarLegendProps } from './CalendarLegendProps';

export default function CalendarLegend(props:CalendarLegendProps){
    
    return(
        <div className="calendarLegend">
            <ul>
            {
                props.calSettings.map((value:any, index)=>{
                    return(
                        
                        <li key={index}>
                            {value.ShowCal &&
                                <div>
                                    <span className={'legendBullet bg'+value.BgColor}></span>
                                    <span className="legendText">{value.Title}</span>
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