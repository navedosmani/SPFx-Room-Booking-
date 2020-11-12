# SPFx-Merged-Calendar
A SPFx Merged Calendar React web-part. Aggregates different types of calendars; internal, external, graph, google using Full Calendar plugin.

Started in March 2020 with just plain JS

Plain JS component was done by October 2020

SPFx with React started in November 2020

November 10 - Adding SPFx files

Cloning to other machine



Milestones
------------
- FullCalendar Integration with react
- Get calendar information from SP list using Rest API & Display in FullCalendar
- FullCalendar full day event bug resolution
- FullCalendar Recurrent events parsing
- Reading external calendars from Azure API using HttpClient and not SPHttpClient
- Reading Graph calendars and modifying permissions


Terminal Commands
-------------------
npm install rrule

npm install --save @fullcalendar/react @fullcalendar/rrule @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

npm install moment


gulp package-solution

gulp serve --nobrowser


gulp bundle --ship

gulp package-solution --ship


<<<<<<< HEAD
=======
References/Issues
------------------
- https://github.com/SharePoint/sp-dev-docs/issues/2473
- https://docs.microsoft.com/en-us/sharepoint/dev/spfx/connect-to-anonymous-apis
- https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-msgraph 
- https://github.com/pnp/pnpjs/issues/502
- https://tahoeninjas.blog/2019/02/05/getting-around-cors-issues-in-spfx-with-sphttpclient/
- https://github.com/SharePoint/sp-dev-docs/issues/3086
- https://docs.rencore.com/spcaf/v7/SPF010802_DontUseHttpClientToConnectToSharePoint.html
- https://levelup.gitconnected.com/all-possible-ways-of-making-an-api-call-in-plain-javascript-c0dee3c11b8b
- https://davehaxblog.wordpress.com/2017/05/22/using-fetch-with-sharepoint-online/

>>>>>>> ccb92de2a10c2d8ad22ccf97d40fafd53d2f5948

