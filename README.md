# SPFx Room Booking system based on the SPFx-Merged-Calendar solution
A SPFx Merged Calendar React web-part. Aggregates different types of calendars; internal, external, graph, google using Full Calendar plugin.

# Features
- Merged Calendar features
- Adding a calendar of type Room
- Displaying rooms with title, image, color, and interaction options like: booking, view details, and show/hide room
- Displaying room details
- Show/Hide Rooms based on selection
- Booking a room with detecting conflicts and preventing them
- Add/Edit/Delete Booking
- Add to my calendar feature
- Popping notifications on add/edit/delete events using react hot toast library
- UI enhancements

# Dependencies
- Calendar Settings list
- Events list
- Rooms list
- Periods list 
- Guidelines list

# Libraries 
`npm install rrule`<br/>
`npm install --save @fullcalendar/react @fullcalendar/rrule @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction`<br/>
`npm install moment`<br/>
`npm install @fluentui/react`<br/>
`npm install @fluentui/react-hooks`<br/>
`npm install office-ui-fabric-core`<br/>
`npm install react-hot-toast`

# Testing
`gulp package-solution`<br/>
`gulp serve --nobrowser`

# Deployment
`gulp bundle --ship`<br/>
`gulp package-solution --ship`

# Room Booking Deployment version 
spfx-room-booking
84fd9f85-a309-4b1e-98fd-db8ae45e1323

# Room Booking Testing version
spfx-room-booking-testing
00f6c2d2-68b5-4e6e-ba23-03566cedad3d

