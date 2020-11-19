import * as React from 'react';
import styles from '../MergedCalendar.module.scss';
import {IEventDetailsProps} from './IEventDetailsProps';
import {formateDate} from '../../Services/EventFormat';


export default function IEventDetails (props: IEventDetailsProps){

    return(
        <div className={styles.eventDetails}>

            <div className={styles.evFld}>
                <label className={styles.evLbl}>Title</label>
                <div className={styles.evIp}>{props.Title}</div>
            </div>
            <div className={styles.evFld}>
                <label className={styles.evLbl}>Start time</label>
                <div className={styles.evIp}>
                    {props.Start}
                    {props.AllDay &&
                        <i> (All Day Event)</i>
                    }
                </div>
            </div>
            {props.End && 
                <div className={styles.evFld}>
                    <label className={styles.evLbl}>End Time</label>
                    <div className={styles.evIp}>{props.End}</div>
                </div>
            }
            {props.Location &&
                <div className={styles.evFld}>
                    <label className={styles.evLbl}>Location</label>
                    <div className={styles.evIp}>{props.Location}</div>
                </div>
            }
            {props.Body &&
                <div className={styles.evFld}>
                    <label className={styles.evLbl +" "+ styles.nonFL}>Description</label>
                    <div><p dangerouslySetInnerHTML={{__html: props.Body}}></p></div>
                </div>
            }


            {/*<b>All Day: </b><label>{props.AllDay}</label><br/>
            <b>Recurrence: </b><label>{props.Recurrence}</label><br/> */}
        </div>
    );
}