import * as React from 'react';
import styles from '../Room.module.scss';
import {Label} from '@fluentui/react';

import { IRoomGuidelinesProps } from './IRoomGuidelinesProps';

export default function IRoomGuidelines (props: IRoomGuidelinesProps){
    
    return(
        <div className={styles.guidelines}>
            <h4>Guidelines</h4>
            {props.guidelines.map((guideline: any)=>{
                return(
                    <div key={guideline.Id}>
                        <h5>{guideline.Title}</h5>
                        <p dangerouslySetInnerHTML={{__html: guideline.Guidelines}}></p>
                    </div>
                );
            })}
        </div>
    );
}