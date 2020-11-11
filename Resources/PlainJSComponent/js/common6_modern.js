PDSB.MergedCalendar = (function () {

    var mergedCal = '[data-mergedCal]',
        template = {
            calDpd1: '<div class="accordion-management access-write-ribbon cal-dpd"><div class="form-inline">'+
                        '<div class="form-group mb-2">'+
                            '<span class="select-err-msg">Please choose a department</span>'+
                            '<select onchange="PDSB.MergedCalendar.DpdChange(this)" class="form-control" name="" id="eventDeptDpd"><option value="">Select Department...</option>',
            calDpd2:        '</select>'+
                        '</div><button type="button" class="btn btn-primary mb-2 cal-add-btn" onclick="PDSB.MergedCalendar.NewEvent()"><i class="fa fa-calendar-plus-o" aria-hidden="true"></i> Add New Event</button>'+
                     '</div></div>',
            dlgChkbox: '<div class="ms-CheckBox" onclick="PDSB.MergedCalendar.HandleChkClick(this)"><input tabindex="-1" type="checkbox" class="ms-CheckBox-input">' +
                            '<label role="checkbox" id="__CalID__" class="ms-CheckBox-field __isDisabled__" tabindex="0" name="checkboxb" aria-checked="__isChkd__">'+
                                '<span class="ms-Label">__CalTitle__</span>'+
                        '</label></div>__hasDpd__',
            dlgDpd: '<div class="ms-Dropdown __isDisabled__" tabindex="0"><i class="ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown"></i>' +
                    '<select class="ms-Dropdown-select">__Options__' +
                    '</select></div>',
            dlgDpdOp: '<option class="__isSel__" data-name="__OptionTitle__" value="__OptionID__" __isSelected__>__OptionName__</option>',
            extCalForm: '<table border="0" cellpadding="7" cellspacing="0" width="100%"><colgroup><col width="20%"/><col width="80%"/></colgroup><tbody>'+
                            '<tr><td>Title</td><td>__extCalTitle__</td></tr>'+
                            '<tr><td>Location</td><td>__extCalLoc__</td></tr>'+
                            '<tr><td>Start Time</td><td>__extCalStart__</td></tr>'+
                            '<tr><td>End Time</td><td>__extCalEnd__</td></tr>'+
                            '<tr><td valign="top">Description</td><td>__extCalBody__</td></tr>'+
                            '<tr><td></td><td></td></tr>'+
                            '<tr><td colspan="2" align="right"><input type="button" value="Close" onclick="SP.UI.ModalDialog.commonModalDialogClose(0,\'Canceled the dialog.\')" /></td></tr>'+
                            '</tbody></table>'
        },

        calOptions = {
            showWeekend: false,
            viewOnly: false,
            calList: ["Calendar"],
            calSettingsList : "CalendarSettings",
            rotarySettingsList : "RotaryCalendars",
            calSettings: [],
            secCalSettings: [],
            externalSchool: "schools.peelschools.org",
            azurePeelSchools: "https://pdsb1.azure-api.net/peelschools"
        },

        appConfig = {  
            auth: {  
                clientId: "2eb4dc90-8ac5-414b-ab9f-0be1be2c0b61", //EmpInfo App
                authority: "https://login.microsoftonline.com/a494743f-7201-494d-a452-f48c5388c4c0/"  
            },  
            cache: {  
                cacheLocation: "sessionStorage"   
            }  
        },
        requestPermissionScope = {  
            scopes: ["Calendars.ReadWrite.Shared"]   
        },  
        myMSALObj = new Msal.UserAgentApplication(appConfig),

        //functions
        getWebUrl = function(){
            var windowUrl = window.location.href.toLowerCase(), webUrl;
            if (windowUrl.indexOf('/pages/') != -1)
                webUrl = windowUrl.substring(0, windowUrl.indexOf('/pages/'));
            if (windowUrl.indexOf('/sitepages/') != -1)
                webUrl = windowUrl.substring(0, windowUrl.indexOf('/sitepages/'));
            return webUrl;
        },
        getCalSettings = function () {
            $.ajax({
                url: getWebUrl() + "/_api/web/lists/GetByTitle('" + calOptions.calSettingsList + "')/items?$select=Title,Id,CalType,ShowCal,BgColor,FgColor,CalName,CalURL",
                type: "GET",
                dataType: "json",
                async: false,
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                success: function (data) {
                    calOptions.calSettings = data.d.results;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.status == 404) {
                        alert("404: Calendar Settings List does not exist!");
                    }
                }
            })
        },
        getSecCalSettings = function () {
            $.ajax({
                url:  "/sites/contentTypeHub/_api/web/lists/GetByTitle('" + calOptions.rotarySettingsList + "')/items?$select=Title,Name,Id",
                type: "GET",
                dataType: "json",
                async: false,
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                success: function (data) {
                    calOptions.secCalSettings = data.d.results;
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.status == 404) {
                        alert("404: Rotary Calendar Settings List does not exist!");
                    }
                }
            })
        },
        openFabricDlg = function(){
            var dlgCal = document.querySelector(".dlgCal"), dialog = dlgCal.querySelector(".ms-Dialog"),
            dialogComponent = new fabric['Dialog'](dialog);
            resetDlgCnt();
            fillDlgCnt();
            wireFabricUI();
            dialogComponent.open();
        },
        wireFabricUI= function(){
            var dlgCal = document.querySelector(".dlgCal"), 
                checkBoxElements = dlgCal.querySelectorAll(".ms-CheckBox"), checkBoxComponents = [],
                dropDownElements = dlgCal.querySelectorAll('.ms-Dropdown'), dropDownComponents = [],
                actionButtonElements = dlgCal.querySelectorAll(".ms-Dialog-action"), actionButtonComponents = [];
            for (var j = 0; j < checkBoxElements.length; j++) {
                checkBoxComponents[j] = new fabric['CheckBox'](checkBoxElements[j]);
            };
            for (var i = 0; i < dropDownElements.length; ++i) {
                dropDownComponents = new fabric['Dropdown'](dropDownElements[i]);   
                for (var j=0; j<dropDownComponents._dropdownItems.length; j++){ //loading the selected dpd value
                    if (dropDownComponents._dropdownItems[j].oldOption.selected)
                        $(dropDownComponents._dropdownItems[j].newItem).click();
                }
            };
            for (var i = 0; i < actionButtonElements.length; i++) {
                actionButtonComponents[i] = new fabric['Button'](actionButtonElements[i], dlgBtnActionHandler);
            };
        },
        handleChkClick = function(chkbox){
            var $this = $(chkbox), $dpd = $this.next('.ms-Dropdown'), fabricDisabledClass = 'is-disabled';
            $dpd.hasClass(fabricDisabledClass) ? $dpd.removeClass(fabricDisabledClass): $dpd.addClass(fabricDisabledClass);
        },
        getDlgSelectedItems = function(){
            var selItems = [], listItem = {}, listItemID = "", listItemRotaryCal = "", listItemShow = "", item = {};
            $('.ms-CheckBox').each(function(){
                listItemID = $(this).find('label').attr('id');
                listItemRotaryCal = $(this).next('.ms-Dropdown').length == 1 && $(this).next('.ms-Dropdown:not(.is-disabled)').find('select').val() ? $(this).next('.ms-Dropdown:not(.is-disabled)').find('select').val() : ""
                listItemShow = $(this).find('label').hasClass('is-checked') ? true : false;
                listItem = {id: listItemID, showCal: listItemShow, rotaryCal: listItemRotaryCal}
                selItems.push(listItem);
            });
            return selItems;
        },
        dlgBtnActionHandler = function(){
            dlgResult = this.innerText.trim().toLowerCase();
            if(dlgResult == 'save'){
                updateList(getDlgSelectedItems());
                window.location.reload();
            }
        },
        isGraphCal = function(calType){
            return calType == 'Graph';
        },
        isRotaryCal = function(calType){
            return calType == 'Rotary';
        },
        updateList = function(items){
            var i, j, item = {}, itemShowCal, itemRotaryCal, 
                metaListName = "SP.Data." + calOptions.calSettingsList + "ListItem", rotaryCalName, rotaryCalTitle;
                
            $.ajax({
                url: getWebUrl() + "/_api/contextinfo",
                method: "POST",
                headers: { "Accept": "application/json; odata=verbose" },
                success:function(data){
                    for(i=0; i<items.length; i++){
                        itemShowCal = items[i].showCal, itemRotaryCal = items[i].rotaryCal;
                        if(itemRotaryCal != ""){
                            for (j=0; j<calOptions.secCalSettings.length; j++){
                                if(itemRotaryCal == calOptions.secCalSettings[j].Id){
                                    rotaryCalName = calOptions.secCalSettings[j].Name;
                                    rotaryCalTitle = calOptions.secCalSettings[j].Title;
                                }
                            }
                            item = {
                                __metadata : {type: metaListName},
                                ShowCal : itemShowCal,
                                CalName: itemShowCal == true ? rotaryCalTitle : calOptions.secCalSettings[0].Title,
                                Title: itemShowCal == true ? 'Rotary - ' + rotaryCalName : calOptions.secCalSettings[0].Name
                            }
                        }else{
                            item = {
                                __metadata : {type: metaListName},
                                ShowCal : itemShowCal
                            }
                        }
                        $.ajax({
                            url: getWebUrl() + "/_api/web/lists/GetByTitle('" + calOptions.calSettingsList + "')/items("+items[i].id+")",
                            type: "POST",
                            data: JSON.stringify(item),
                            headers: { 
                                "X-RequestDigest": data.d.GetContextWebInformation.FormDigestValue, //this is required for the SP modern pages
                                "accept": "application/json;odata=verbose",
                                "content-type": "application/json;odata=verbose",
                                "IF-MATCH": "*",
                                "X-HTTP-Method": "MERGE"
                            },
                            success: function(){
                                console.log("Item updated successfully");
                            },
                            error: function(){
                                console.log("An error occurred. Please try again.");
                            }
                        });
                    }
                },
                error:function(data){
                    console.log("error getting the digest value")
                }
            });
        },
        resetDlgCnt = function(){
            $('.ms-Dialog-content').empty();
        },
        fillDlgCnt = function(){
            var i,j, data = calOptions.calSettings, dataSec = calOptions.secCalSettings, dpdHTML = "", dpdOps = "";
            for (i = 0; i < data.length; i++) {
                if (data[i].CalType == 'Rotary'){
                    for(j=0; j<dataSec.length;j++){
                        dpdOps += template.dlgDpdOp
                            .replace('__OptionName__', dataSec[j].Name)
                            .replace('__OptionTitle__', dataSec[j].Title)
                            .replace('__OptionID__', dataSec[j].Id)
                            .replace('__isSelected__', data[i].CalName == dataSec[j].Title ? 'selected' : '')
                            .replace('__isSel__', data[i].CalName == dataSec[j].Title ? 'selected' : '');
                    } 
                    dpdHTML = template.dlgDpd
                        .replace('__Options__', dpdOps)
                        .replace('__isDisabled__', data[i].ShowCal == true ? '' : 'is-disabled');
                }
                $('.ms-Dialog-content').append(
                    template.dlgChkbox
                        .replace('__CalID__', data[i].Id)
                        .replace('__CalTitle__', data[i].CalType == 'Rotary' ? data[i].CalType : data[i].Title)
                        .replace(/__isDisabled__/g, data[i].CalType == 'My School' ? 'is-disabled' : '')
                        .replace('__isChkd__', data[i].ShowCal)
                        .replace('__hasDpd__', data[i].CalType == 'Rotary' ? dpdHTML : '')
                );
            };            
        },
        calNames = function () {
            //data-calList            
            var i, calList = [], data = calOptions.calSettings;
            for (i = 0; i < data.length; i++) {
                if (data[i].ShowCal){
                    if (isGraphCal(data[i].CalType)){ //Graph API Calendars
                        calList.push("GraphAPI");
                    }
                    else{
                        calList.push(data[i].CalName);
                    }
                }
            }
            return calList;
        },
        deptNames = function () {
            //data-cal-names
            var i, calNames = [], data = calOptions.calSettings;
            for (i = 0; i < data.length; i++) {
                if (data[i].ShowCal)
                    calNames.push(data[i].Title);
            }
            return calNames;
        },
        deptURLs = function () {
            //data-cal-urls
            var i, calUrls = [], data = calOptions.calSettings;
            for (i = 0; i < data.length; i++) {
                if (data[i].ShowCal)
                    calUrls.push(data[i].CalURL);
            }
            return calUrls;
        },
        deptBg = function () {
            //data-cal-bg
            var i, calBgs = [], data = calOptions.calSettings;
            for (i = 0; i < data.length; i++) {
                if (data[i].ShowCal)
                    calBgs.push(getColorHex(data[i].BgColor));
            }
            return calBgs;
        },
        deptFg = function () {
            //data-cal-bg
            var i, calFgs = [], data = calOptions.calSettings;
            for (i = 0; i < data.length; i++) {
                if (data[i].ShowCal)
                    calFgs.push(getColorHex(data[i].FgColor));
            }
            return calFgs;
        },
        calTypes = function(){
            var i, calTypes = [], data = calOptions.calSettings;
            for (i = 0; i < data.length; i++) {
                if (data[i].ShowCal)
                    calTypes.push(data[i].CalType);
            }
            return calTypes;
        },
        getColorHex = function (colorName) {
            var colorHex;
            switch (colorName) {
                case ("Black"):
                    colorHex = "#000000";
                    break;
                case ("Blue"):
                    colorHex = "#0096CF";
                    break;
                case ("Green"):
                    colorHex = "#27AE60";
                    break;
                case ("Grey"):
                    colorHex = "#9FA7A7";
                    break;
                case ("Mint"):
                    colorHex = "#1C9A82";
                    break;
                case ("Navy"):
                    colorHex = "#4C5F79";
                    break;
                case ("Orange"):
                    colorHex = "#EA8020";
                    break;
                case ("Pink"):
                    colorHex = "#F46C9E";
                    break;
                case ("Purple"):
                    colorHex = "#A061BA";
                    break;
                case ("Red"):
                    colorHex = "#D7574A";
                    break;
                case ("Teal"):
                    colorHex = "#38A8AC";
                    break;
                case ("White"):
                    colorHex = "#FFFFFF";
                    break;
                case ("Yellow"):
                    colorHex = "#DAA62F";
                    break;
            }
            return colorHex;
        },
        displayDpd = function (calArr, deptArr, dpdArr) {
            var calDpd = "", $calViewOnly = $(mergedCal).attr('viewOnly'), calViewOnly = $calViewOnly !== undefined ? true : calOptions.viewOnly;
            if (!calViewOnly) {
                for (var i = 0; i < dpdArr.length; i++) {
                    calDpd += "<option data-cal='" + calArr[i] + "' value='" + deptArr[i] + "'>" + dpdArr[i] + "</option>";
                }
                $(mergedCal).before(template.calDpd1 + calDpd + template.calDpd2);
            }
        },
        displayLegend = function (dpdArr, deptBg) {
            var calLegend = "";
            for (var i = 0; i < dpdArr.length; i++) {
                calLegend += "<div><span class='legend-sq' style='background:" + deptBg[i] + "'></span><span class='legend-txt'>" + dpdArr[i] + "</span></div>";
            }
            $(mergedCal).after("<div id='calLegend'>" + calLegend + "</div>")
        },
        formatDate = function(ipDate){
            return moment.utc(ipDate).format('YYYY-MM-DD hh:mm A');
        },
        formatStartDate = function (ipDate) {
            return moment.utc(ipDate).format('YYYY-MM-DD') + "T" + moment.utc(ipDate).format("hh:mm") + ":00Z";
        },
        formatEndDate = function (ipDate) {
            var nextDay = moment(ipDate).add(1, 'days');
            return moment.utc(nextDay).format('YYYY-MM-DD') + "T" + moment.utc(nextDay).format("hh:mm") + ":00Z";
        },
        newEvent = function () {
            var dept = $('#eventDeptDpd').val();
            var cal = $('#eventDeptDpd').find(':selected').attr('data-cal');
            if (dept == "") {
                $('.select-err-msg').show();
                $('.select-err-msg').next('select').addClass('select-err');
            }
            else {
                $('.select-err-msg').hide();
                $('.select-err-msg').next('select').removeClass('select-err');
                PDSB.UI.OpenResult('New Calendar Event', "/" + dept + "/Lists/" + cal + "/NewForm.aspx", true);
            }
        },
        dpdChange = function (dpd) {
            if ($(dpd).val() != "") {
                $('.select-err-msg').hide();
                $('.select-err-msg').next('select').removeClass('select-err');
            }
        },
        parseRecurrentEvent = function (recurrXML, startDate, endDate) {
            //console.log(recurrXML)
            if (recurrXML.indexOf("<recurrence>") != -1) {
                var rruleObj = {}, weekDay = {},
                    $recurrXML = $(recurrXML),
                    $recurrFreq = $recurrXML.find('repeat').html(),
                    isRepeatForever = $recurrXML.find('repeatForever').html(),
                    firstDayOfWeek = $recurrXML.find('firstDayOfWeek').html(),
                    repeatInstances = $recurrXML.find('repeatInstances').html();

                rruleObj.dtstart = startDate;   //dtstart
                rruleObj.until = endDate;   //until

                switch (true) {
                    case ($recurrFreq.indexOf('yearly') != -1):
                        rruleObj.freq = "yearly";   //freq                    
                        break;
                    case ($recurrFreq.indexOf('monthly') != -1):
                        rruleObj.freq = "monthly";
                        break;
                    case ($recurrFreq.indexOf('weekly') != -1):
                        rruleObj.freq = "weekly";
                        break;
                    case ($recurrFreq.indexOf('daily') != -1):
                        rruleObj.freq = "daily";
                        break;
                }

                if (repeatInstances) rruleObj.count = repeatInstances;   //count
                if ($($recurrFreq).attr('dayFrequency')) rruleObj.interval = parseInt($($recurrFreq).attr('dayFrequency')); //interval - daily
                if ($($recurrFreq).attr('weekFrequency')) rruleObj.interval = parseInt($($recurrFreq).attr('weekFrequency')); //interval - weekly
                if ($($recurrFreq).attr('monthFrequency')) rruleObj.interval = parseInt($($recurrFreq).attr('monthFrequency')); //interval - monthly
                if ($($recurrFreq).attr('yearFrequency')) rruleObj.interval = parseInt($($recurrFreq).attr('yearFrequency')); //interval - yearly
                if ($($recurrFreq).attr('month')) rruleObj.bymonth = parseInt($($recurrFreq).attr('month'));    //bymonth
                if ($($recurrFreq).attr('day')) rruleObj.bymonthday = parseInt($($recurrFreq).attr('day'));    //bymonthday
                if ($($recurrFreq).attr('weekday')) rruleObj.byweekday = [0, 1, 2, 3, 4];   //byweekday - passing weekDays

                if ($recurrFreq.indexOf('byday') != -1) {
                    weekDay.weekday = getWeekDay($recurrFreq);
                    if ($($recurrFreq).attr('weekdayOfMonth')) {
                        weekDay.n = getDayOrder($recurrFreq);
                    }
                    rruleObj.byweekday = [weekDay]; //byweekday - passing n, weekDay
                }

                //console.log(rruleObj);
                return rruleObj;

            } else return { dtstart: startDate, until: endDate, freq: "daily", interval: 1 }
        },
        getWeekDay = function (byDayTag) {
            var weekDay;
            switch ("TRUE") {
                case ($(byDayTag).attr('mo')):
                    weekDay = 0;
                    break;
                case ($(byDayTag).attr('tu')):
                    weekDay = 1;
                    break;
                case ($(byDayTag).attr('we')):
                    weekDay = 2;
                    break;
                case ($(byDayTag).attr('th')):
                    weekDay = 3;
                    break;
                case ($(byDayTag).attr('fr')):
                    weekDay = 4;
                    break;
                case ($(byDayTag).attr('sa')):
                    weekDay = 5;
                    break;
                case ($(byDayTag).attr('su')):
                    weekDay = 6;
                    break;
            }
            return weekDay;
        },
        getDayOrder = function (byDayTag) {
            var weekdayOfMonth = $(byDayTag).attr('weekdayOfMonth'), dayOrder;
            switch (weekdayOfMonth) {
                case ("first"):
                    dayOrder = 1;
                    break;
                case ("second"):
                    dayOrder = 2;
                    break;
                case ("third"):
                    dayOrder = 3;
                    break;
                case ("fourth"):
                    dayOrder = 4;
                    break;
                case ("last"):
                    dayOrder = -1;
                    break;
            }
            return dayOrder;
        },
        getCalsData = function (info, calURL, calListName, deptName, successCallback, failureCallback) {
            var opencall = $.ajax({
                url: calURL,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose"
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.status == 404) {
                        alert("404: " + calURL.substring(0, calURL.indexOf('?')));
                    }
                }
            });
            opencall.done(function (data, textStatus, jqXHR) {
                var events = [], startDateMod, endDateMod;
                for (index in data.d.results) {

                    //workaround for FullCalendar threshold bug for the all day events time 00:00:00Z
                    if (data.d.results[index].fAllDayEvent) {
                        startDateMod = new Date(data.d.results[index].EventDate);
                        startDateMod.setTime(startDateMod.getTime());
                        startDateMod = formatStartDate(startDateMod);

                        endDateMod = new Date(data.d.results[index].EndDate);
                        endDateMod.setTime(endDateMod.getTime());
                        endDateMod = formatEndDate(endDateMod);
                    }
                    else {
                        startDateMod = data.d.results[index].EventDate;
                        endDateMod = data.d.results[index].EndDate;
                    }

                    if (data.d.results[index].fRecurrence === true) {
                        //console.log(data.d.results[index].Title)
                        events.push({
                            title: data.d.results[index].Title,
                            id: data.d.results[index].ID,
                            _location: data.d.results[index].Location,
                            _body: data.d.results[index].Description,
                            _urlX: data.d.results[index].__metadata.uri,
                            _calListName: calListName,
                            _deptName: deptName,
                            _graphURL: null,
                            _external: data.d.results[index].__metadata.uri.toLowerCase().indexOf(calOptions.externalSchool) != -1 ? "External" : null,
                            start: startDateMod,
                            end: endDateMod,
                            allDay: data.d.results[index].fAllDayEvent,
                            recurr: data.d.results[index].fRecurrence,
                            recurrData: data.d.results[index].RecurrenceData,
                            rrule: parseRecurrentEvent(data.d.results[index].RecurrenceData, startDateMod, endDateMod)
                        });
                    } else {
                        events.push({
                            title: data.d.results[index].Title,
                            id: data.d.results[index].ID,
                            _location: data.d.results[index].Location,
                            _body: data.d.results[index].Description,
                            _urlX: data.d.results[index].__metadata.uri,
                            _calListName: calListName,
                            _deptName: deptName,
                            _graphURL: null,
                            _external: data.d.results[index].__metadata.uri.toLowerCase().indexOf(calOptions.externalSchool) != -1 ? "External" : null,
                            start: startDateMod,
                            end: endDateMod,
                            allDay: data.d.results[index].fAllDayEvent,
                            recurr: data.d.results[index].fRecurrence,
                        });
                    }
                }
                //console.log(events)
                successCallback(events);
            });
        },
        getGraphCalsData = function(info, calURL, deptName, successCallback, failureCallback){
            var events = [], calInfo;
            myMSALObj.acquireTokenSilent(requestPermissionScope).then(function (result) {  
                if(result != undefined){  
                    var headers = new Headers();  
                    var bearer = "Bearer " + result.accessToken;  
                    headers.append("Authorization", bearer);  
                    var options = {  
                        method: "GET",  
                        headers: headers  
                    };  
                }
                fetch(calURL, options).then(function(response) {  
                    var data  = response.json();
                    data.then(function(data){  
                        console.log("graph response:", data);
                        calInfo = data.value;
                        for (index in calInfo){
                            events.push({
                                title: calInfo[index].subject ,
                                id: calInfo[index].id,
                                start: formatStartDate(calInfo[index].start.dateTime),
                                end: formatStartDate(calInfo[index].end.dateTime),
                                _graphURL: calURL,
                                _location: calInfo[index].location.displayName,
                                _body: calInfo[index].body.content,
                                _deptName: deptName,
                            });
                        }
                        successCallback(events);
                    })  
                });
            }).catch(function (error) {  
                 console.log("graph token err:", error);  
           });
        },
        displayEvent = function (deptURL, calListName, calType, deptName) {
            if(!isGraphCal(calType)){
                return function (info, successCallback, failureCallback) {
                    getCalsData(info, deptURL, calListName, deptName, successCallback, failureCallback);
                }
            }else{
                return function (info, successCallback, failureCallback) {
                    getGraphCalsData(info, deptURL, deptName, successCallback, failureCallback)
                }
            }
        },
        displayCalendars = function (typeArr, calArr, deptArr, deptBg, deptFg, deptName) {
            var calendarEl = document.getElementById('calendar');
            var eventSources = [], eventSrc = {},
                $calShowWeekend = $(mergedCal).attr('showWeekend'), calShowWeekend = $calShowWeekend !== undefined ? true : calOptions.showWeekend;

            for (var i = 0; i < deptArr.length; i++) {
                var deptURL, schoolLocURL, schoolLoc;
                if (typeArr[i] == 'Graph'){ //graph api calendars
                    deptURL = deptArr[i];
                }else if(typeArr[i] == 'External'){ //external calendars
                    if (deptArr[i].toLowerCase().indexOf(calOptions.externalSchool) != -1){
                        schoolLocURL = deptArr[i].substring(8, deptArr[i].length); //remove https://
                        
                        if (deptArr[i].toLowerCase().indexOf(calOptions.externalSchool +'/sec/') != -1){
                            schoolLocURL =  schoolLocURL.substring(schoolLocURL.indexOf("/sec") +4, schoolLocURL.length);
                        }
                        
                        if ((schoolLocURL.match(/\//g) || []).length == 2){
                            schoolLoc = schoolLocURL.substring(schoolLocURL.indexOf('/') +1, schoolLocURL.lastIndexOf('/'));
                        }
                        else{
                            schoolLoc = schoolLocURL.substring(schoolLocURL.indexOf('/') +1, schoolLocURL.length);
                        }

                        if (deptArr[i].toLowerCase().indexOf(calOptions.externalSchool + '/sec/') != -1){
                            deptURL = calOptions.azurePeelSchools + "/sec/" + schoolLoc + "/_api/web/lists/getByTitle('" + calArr[i] + "')/items?$select=ID,Title,EventDate,EndDate,Location,Description,fAllDayEvent,fRecurrence,RecurrenceData&$orderby=EventDate desc&$top=1000";    
                        }                            
                        else{
                            deptURL = calOptions.azurePeelSchools + "/" + schoolLoc + "/_api/web/lists/getByTitle('" + calArr[i] + "')/items?$select=ID,Title,EventDate,EndDate,Location,Description,fAllDayEvent,fRecurrence,RecurrenceData&$orderby=EventDate desc&$top=1000";
                        }
                    }
                }else{ //internal and rotary calendars
                    deptURL = "/" + deptArr[i] + "/_api/Web/Lists/GetByTitle('" + calArr[i] + "')/items?$select=ID,Title,EventDate,EndDate,Location,Description,fAllDayEvent,fRecurrence,RecurrenceData&$top=1000";
                }
                
                eventSrc = {
                    events: displayEvent(deptURL, calArr[i], typeArr[i], deptName[i]),
                    color: deptBg[i],
                    textColor: deptFg[i]
                };                
                eventSources.push(eventSrc);
                //console.log("eventSources:", eventSources);
            }

            var calendar = new FullCalendar.Calendar(calendarEl, {
                //Plugins
                plugins: ['dayGrid', 'timeGrid', 'interaction', 'moment', 'rrule'],

                // Calendar Options
                editable: false,
                timezone: "UTC",
                droppable: false,
                header: {
                    left: 'today,prev,next,title',
                    center: '',
                    right: ''
                },
                weekends: calShowWeekend,
                eventTimeFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    meridiem: false
                },
                displayEventTime: true,

                // Multiple Calendars resources
                eventSources: eventSources,

                //open up the display form when a user clicks on an event
                eventClick: function (info) {
                    //console.log(info)
                    if(info.event._def.extendedProps._graphURL || info.event._def.extendedProps._external){
                        var extHtmlElem = document.createElement('div');
                        extHtmlElem.innerHTML = 
                            template.extCalForm
                                .replace('__extCalTitle__', info.event.title)
                                .replace('__extCalLoc__', info.event._def.extendedProps._location ? info.event._def.extendedProps._location : "")
                                .replace('__extCalStart__', formatDate(info.event.start))
                                .replace('__extCalEnd__', formatDate(info.event.end))
                                .replace('__extCalBody__', info.event._def.extendedProps._body ? info.event._def.extendedProps._body : "");
                        PDSB.UI.OpenHtml('Event Properties - ' + info.event._def.extendedProps._deptName , extHtmlElem);
                    }else{
                        var dispPath = info.event._def.extendedProps._urlX,
                            calListName = info.event._def.extendedProps._calListName;
                        dispPath = dispPath.substr(0, dispPath.indexOf('_api/'));

                        if ($('html').hasClass('access-write-ribbon')) {
                            PDSB.UI.OpenResult('Edit Event Properties', dispPath + "Lists/" + calListName + "/EditForm.aspx" + "?ID=" + info.event.id, true);
                        } else {
                            PDSB.UI.OpenResult('Event Properties - ' + info.event._def.extendedProps._deptName , dispPath + "Lists/" + calListName + "/DispForm.aspx" + "?ID=" + info.event.id, false);
                        }
                    }
                }
            });
            calendar.render();
        },
        init = function () {
            $(function () {
                getCalSettings();
                getSecCalSettings();

                displayDpd(calNames(), deptURLs(), deptNames());
                displayLegend(deptNames(), deptBg());
                displayCalendars(calTypes(), calNames(), deptURLs(), deptBg(), deptFg(), deptNames());
            })
        };

    init();

    return {
        NewEvent: newEvent,
        DpdChange: dpdChange,
        CalOptions: calOptions,
        OpenFabricDlg : openFabricDlg,
        HandleChkClick : handleChkClick,
        Init: init
    }
}());








