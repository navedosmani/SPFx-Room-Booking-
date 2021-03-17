import * as React from 'react';
import { IRoomsProps } from './IRoomsProps';
import IRoom from '../IRoom/IRoom';

export default function IRooms (props:IRoomsProps) {
    
    return(
        props.rooms.map((room: any)=>{
            return(
                <IRoom key = {room.Id}
                    capacity = {room.Capacity}
                    color = {room.Colour}
                    facilities = {room.facilities}
                    id = {room.Id}
                    locationGroup = {room.LocationGroup}
                    title = {room.Title}
                    img ={room.Photo0}
                    period = {room.Period_x0020__x0023_}
                    comments = {room.OData__Comments}
                    onCheckAvailClick = {props.onCheckAvailClick(room.Id)}
                    onViewDetailsClick = {props.onViewDetailsClick(room)}
                    onBookClick = {props.onBookClick(room)}
                />
            );
        })
    );
}