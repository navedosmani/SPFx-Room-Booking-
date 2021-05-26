import * as React from 'react';
import roomStyles from '../Room.module.scss';
import {CommandBarButton, IIconProps, Link, Icon} from '@fluentui/react';
import {IRoomsManageProps} from './IRoomsManageProps';

export default function IRoomsManage (props: IRoomsManageProps) {
    
    const addIcon: IIconProps = { iconName: 'Add' };
    const newRoomURL = `${props.context.pageContext.web.serverRelativeUrl}/Lists/${props.roomsList}/Newform.aspx`;
    const newPeriodURL = `${props.context.pageContext.web.serverRelativeUrl}/Lists/${props.periodsList}/Newform.aspx`;
    const newGuidelinesURL = `${props.context.pageContext.web.serverRelativeUrl}/Lists/${props.guidelinesList}/Newform.aspx`;

    return(
        <div className={roomStyles.roomsManage}>
            <hr/>
            <div>
                <CommandBarButton iconProps={addIcon} text="Add Room" onClick={() => props.onRoomsManageAdd(newRoomURL)} />
                <CommandBarButton iconProps={addIcon} text="Add Period" onClick={() => props.onRoomsManageAdd(newPeriodURL)}/>
                <CommandBarButton iconProps={addIcon} text="Add Guidelines" onClick={() => props.onRoomsManageAdd(newGuidelinesURL)}/>
            </div>
            <Link className={roomStyles.siteManage} href={`${props.context.pageContext.web.serverRelativeUrl}/SitePages/Site-Management.aspx`}><Icon iconName='Settings' />Site Management</Link>
        </div>
    );
}