import * as React from 'react';
import {Label} from '@fluentui/react';
import styles from '../MergedCalendar.module.scss';
import {IEventDetailsProps} from './IEventDetailsProps';
import {formateDate} from '../../Services/EventFormat';


export default function IEventDetails (props: IEventDetailsProps){

   

    return(
        <div>

            <Label>Title</Label><p>{props.Title}</p>
            <Label>Start time</Label><p>{formateDate(props.Start)}</p>
            {props.End && 
                <div><Label>End time</Label><p>{formateDate(props.End)}</p></div>
            }
            {props.Location &&
                <div><Label>Location</Label><p>{props.Location}</p></div>
            }
            {props.Body &&
                <div><Label>Description</Label><p dangerouslySetInnerHTML={{__html: props.Body}}></p></div>
            }


            {/*<b>All Day: </b><label>{props.AllDay}</label><br/>
            <b>Recurrence: </b><label>{props.Recurrence}</label><br/> */}
        </div>
    );
}