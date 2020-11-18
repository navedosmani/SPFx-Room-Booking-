import * as React from 'react';

import {IEventDetailsProps} from './IEventDetailsProps';

export default function IEventDetails (props: IEventDetailsProps){
    return(
        <div>
            <label>Title: </label><label>{props.Title}</label> <br/>
            <label>Location: </label><label>{props.Location}</label>
        </div>
    );
}