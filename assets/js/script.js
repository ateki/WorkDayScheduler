///* https://stackoverflow.com/questions/19867512/change-text-input-border-color */

/* 
TODO:
Either works.  See which is preferred
Break down into smaller and use ConstantSourceNode
1) Why is hover over button not triggering transition
2) Add button triggers - have parent pick them up
    will need some id on button 
    read text input check not null
3) Feedback interval - display msg for few seconds fromwithin save event listener
4) functions to save to local storage/retrieve etc...
Using jquery.
5) read from storage and display text as go through big display loop
 */

// Use VS Code theme:  Google vs theme and install:   One Monekai
// Dont let edit previous descriptions?  Requirement?
// transition of image on button not working with bootstrap
// Can we use flexbox and css grid instead?



/*
While/For Loop that loops starting at 9 and breaks at 5
- For each loop generate or build html timeblock row
  • Append timeblock to container
    º Hour
      - A number corresponding with the hour in 12 hour format
    º Textarea
      - Show existing event text, if any and allow user to input event text
    º Save Button
      - When clicked, store/reset the event text corresponding with the hour to localStorage
  • Increase hour by one
  • Check if hour is past, current or future and apply corresponding css class to timeblock
*/


/**
 * Module imports
 */
import {storageLayerInstance} from './storage_layer.js';   /*- MODULE modification -*/


// JD Are we best picking up elements with class/id?  Any advantages over one?
//var calendarContainerEl = $('.events-container'); // use class
var calendarContainerEl = $('#events-container');   // or use id?
var currDateHeaderEl = $('#currentDay');   // or use class




const HTML_TIMEBLOCK_ROW_CLASS = `row time-block`;
const HTML_TIMEBLOCK_HOUR_CLASS = `col-md-1 hour`;

// or
const HTML_TIMEBLOCK_ROW_DIV = ` <div class="row time-block">`;
const HTML_TIMEBLOCK_HOUR_DIV = `<div class="col-md-1 hour">`;

const HTML_DESCRIPTION_TEXTAREA = `<textarea class="col-md-10 description past"></textarea>`;
const HTML_SAVE_BUTTON_IMG = `<button class="btn btn-lg saveBtn"><i class="fa-regular fa-floppy-disk"></i></button>`;

// Original
const START_BUS_DAY_HR = 9;        // in 24 hour 
const END_BUS_DAY_HR = 18; 

// test
/* const START_BUS_DAY_HR = 15;        // in 24 hour 
const END_BUS_DAY_HR = 23; */

/**
 * 
 */ 

class CalendarEvent {

    constructor(timeSlot, eventDesc) {
      this.timeSlot = timeSlot;      // in 24 hour
      this.desc = eventDesc;
    }
}

/**
 * Displays current date in the header of page.
 * Date is formatted as  Day of Wk, Month Date in following format:
 * : Friday, December 9th
 */
function displayHeaderCurrDate() {
  // should we just create this one on load?
  var currDate = moment().format('dddd, MMMM Do');
  currDateHeaderEl.text(currDate);
}


// Debug method TEMP
function getEventDetails(event) {
  var eventDetails = `Event = 
    ${event.type} 
    <br/> X = 
    ${event.pageX}
    <br/>Y = 
    ${event.pageY} 
    <br/>Target Type = 
    ${event.target.type}
    <br/>Target Tag Name = 
    ${event.target.tagName}
    <br/>Target id = 
      ${event.target.id}
    `;

    var elementId = event.target.id;
    
  console.log(elementId);
  console.log(eventDetails);
  //$("#lead").html(eventDetails);
}
/* 
    //Bootstrap dummy html
          <div class="col-md-1 hour">

        <div class="row time-block">
          <div class="col-md-1 hour">
            4AM
          </div>
          <textarea class="col-md-10 description past"></textarea>
          <button class="btn btn-lg saveBtn"><i class="fa-regular fa-floppy-disk"></i></button>
        </div> */



/*         <div class="row time-block">
        <div class="col-md-1 hour">
          4AM
        </div>
        <textarea class="col-md-10 description past"></textarea>
        <button class="btn btn-lg saveBtn"><i class="fa-regular fa-floppy-disk"></i></button>
      </div>
 */



/* var now = moment().hour();
console.log(moment().format('hh:mm:ss'));
console.log(`curr moment = ${now}`); */
//console.log(`get hour as 24 hour ${now.hour()}`);

// TODO Take as 24 hour clock
// at 12.35 00:35 in morning should show them all as future

/**
 * 
 * @param {*} hour 
 * @returns 
 */
function isValidTimeSlot(hour) {
  if (hour>=0 && hour<24) {
    return true;
  } else {
    return false;
  }


}
/**
 * If null calendarEVents then auto returns null.
 * @param {*} arrCalendarEventObjects an array of CalendarEvent objects 
 * @returns CalendarEvent object if time_slot property of CalendarEvent equals the hour arg. 
 * Returns null otherwise.
 */
/**
 * 
 */
function findCalendarEventByHour(hour, calendarEvents) {
  console.log(`findCalendarEventByHour(${hour}, ${calendarEvents})`);
  if (calendarEvents == null) {
    // first entry in recorded calendar
    //calendarEvents = [];
    return null;
  }


  // validate hour is int >=0 and <24 and calendarEvents not null
  // if (isValidTimeSlot(hour)) {....}
  for (var i=0; i<calendarEvents.length; i++) {
    //if (calendarEvents[i]['timeSlot']==hour) {
    if (calendarEvents[i].timeSlot == hour) {
      return calendarEvents[i];
    }
  }

  return null;
}
// var calendarObj = getCalendarEventByHour(hr);


    
function displayCalendar() {

  console.log(`entered displayCalendar`);
  var calendarEvents=storageLayerInstance.retrieveAllRecords();
  // expect this to be ordered



  //var calendarContainerEl = $('.events-container'); // use class
  var calendarContainerEl = $('#events-container');   // or use id?
 
  // create moments representing start and end business 'hour'
  var businessHour = moment(START_BUS_DAY_HR,'HH').hour();
  var endBusinessHour = moment(END_BUS_DAY_HR,'HH').hour();
  
/*   if (startOfBusiness > endOfBusiness) {
    throw new Error("startOfBusiness>endOfBusiness")
  } */
  console.log(`businessHour = ${businessHour}`);
  console.log(`endBusinessHour = ${endBusinessHour}`);
  
  var hr=START_BUS_DAY_HR;
  
  // Retrieve hour of current timestamp 
  var nowHour = moment().hour();
  console.log(`nowHour = ${nowHour}`);

  // should we compare moments or ints?  ints simplier

  while (businessHour <= endBusinessHour){
  
    //while (startOfBusiness.hour() <= endOfBusiness.hour()){

    // is it better to increment moment and convert and test
    // or loop in other function which increments
    // then on each loop would just need a get now
    // for loop increments i++
    // which is used to create moment with that hour
    // before then if stmts just check now.hour with...m
    // Either way split up into smaller funcs.
    //var calendarContainerEl = $('#events-container');
  

      
    var rowEl = createTimeBlockRowEl();
    /*         // create Time block Element
        var timeBlockEl = $('<div>');         // TIME BLOCK ELEMENT
        var time = moment(startOfBusiness,'HH').format('ha'); 
        timeBlockEl
            .addClass("col-md-1 hour")           // TIME BLOCK CLASSES
            .text(time);
 */
    var businessHour = moment(hr,'HH').hour();
    var timeBlockEl = createHourElment(businessHour);
    var calEventDescEl = createEventDescrEl(hr, calendarEvents);
        
 

    if (nowHour > businessHour) {
      calEventDescEl.addClass('past');
    } else if (nowHour == businessHour) {
      calEventDescEl.addClass('present');
    } else {
      calEventDescEl.addClass('future');
    }
    // add custommised id with hour or idx in local storage
    var saveBtnEl = createSaveButtonEl("9999");
    
    // Append them to existing calendar events container element
    rowEl.append(timeBlockEl);
    rowEl.append(calEventDescEl);
    rowEl.append(saveBtnEl);
    calendarContainerEl.append(rowEl);

    // Increment to next business hour
    businessHour.add(1, 'hours');

  }
}



function displayCalendar_orig() {

  console.log(`entered displayCalendar`);

  //var calendarContainerEl = $('.events-container'); // use class
  var calendarContainerEl = $('#events-container');   // or use id?

  // validation
  // ensure bus day start and end  if start>end
  if (START_BUS_DAY_HR > END_BUS_DAY_HR) { 
      throw new Error("BUS DAY init is invalid.");
  }


  var startOfBusiness = moment(START_BUS_DAY_HR,'HH');
  var endOfBusiness = moment(END_BUS_DAY_HR,'HH');
  
  if (startOfBusiness > endOfBusiness) {
    throw new Error("startOfBusiness>endOfBusiness")
  }
  console.log(startOfBusiness.hour());
  console.log(endOfBusiness.hour());
  
  var hr=START_BUS_DAY_HR;
  
  var now = moment().hour();
  while (startOfBusiness.hour() <= endOfBusiness.hour()){

  // is it better to increment moment and convert and test
  // or loop in other function which increments
  // then on each loop would just need a get now
  // for loop increments i++
  // which is used to create moment with that hour
  // before then if stmts just check now.hour with...m
  // Either way split up into smaller funcs.
  
    
    var calendarContainerEl = $('#events-container');
  

      // create timeblock row
       // var rowEl = $(HTML_TIMEBLOCK_ROW_DIV);
       var rowEl = $('<div>');                //define and use ROW ELEMENT
       rowEl.addClass('row time-block');      // ROW CLASSES

      
        // create Time block Element
        var timeBlockEl = $('<div>');         // TIME BLOCK ELEMENT
        var time = moment(startOfBusiness,'HH').format('ha'); 
        timeBlockEl
            .addClass("col-md-1 hour")           // TIME BLOCK CLASSES
            .text(time);


        // create event description text area element
        var eventDescEl = $('<textarea>');        // EVENT_DESC_ELEMENT  or EVENT_TEXT_ELEMENT
        eventDescEl.addClass('col-md-10 description');

        if (now > startOfBusiness.hour()) {
          eventDescEl.addClass('past');
        } else if (now == startOfBusiness.hour()) {
          eventDescEl.addClass('present');
        } else {
          eventDescEl.addClass('future');
        }

          // create button with image
          // add custommised id with hour or idx in local storage
          
          var saveBtnEl = $('<button>');
          saveBtnEl.addClass('btn btn-lg saveBtn');

          //<button class="btn btn-lg saveBtn"><i class="fa-regular fa-floppy-disk"></i></button>

          saveBtnEl.append('<i class="fa-regular fa-floppy-disk"></i>');

        //calendarContainerEl.append(timeBlockEl);
        rowEl.append(timeBlockEl);
        rowEl.append(eventDescEl);
        rowEl.append(saveBtnEl);
        
       calendarContainerEl.append(rowEl);


    startOfBusiness.add(1, 'hours');
  
  }



}

/**
 * .
 * @returns html div element representing the time block
 */
function createTimeBlockRowEl() {

  var rowEl = $('<div>');                
  rowEl.addClass('row time-block');      
  return rowEl;
}

/**
 * Formats the hr parameter to have format hour am/pm ie: 9am, 10am
 * 
 * @param {*} hr - an integer representing an hour in time of the 24 hour clock ie: 0-24.
 * @returns html div element representing the hour time, with param time displayed.
 */
function createHourElment(hr) {
  // TODO: Validate arg is int between 0-23
  console.log(`createHourElement:  hr = ${hr}`);

  var timeBlockEl = $('<div>');        
  var time = moment(hr,'HH').format('ha'); 
  console.log(`createHourElement:  time = ${time}`);
  timeBlockEl
      .addClass("col-md-1 hour")          
      .text(time);
  return timeBlockEl;
}


/**
 * @param {*} calEvent a string representing the description of a calendar event.
 * @param {*} hr representing hour of timeslot associated with calendar event
 * @param {*} calendarEvents representing 
 * @returns html textarea element representing a calendar event description , with calEvent displayed.
 */
/**
 * for given new CalendarEvent object
 */
//function createEventDescrEl(hr, calEvent,calendarEvents) {
//function createEventDescrEl(storedCalendar, newCalEvent) {
function createEventDescrEl(hr, eventDesc) {

    /*         if (newEventDesc!= null) {
             calEventDescEl.val(calendarO)
 */


  var eventDescEl = $('<textarea>');        
  eventDescEl.addClass('col-md-10 description');

  // link to hour representing time slot
  eventDescEl.attr('id', `calendar-event-${hr}`); 

  /* if (storedCalendar!= null && newCalEvent!= null) {
    //var desc = calendarObj.desc;
    calEventDescEl.val(newCalEvent.desc) */

  if (eventDesc!= null) {
    eventDescEl.val(eventDesc); // Do we need to check this?
  }

  
  //var existingCalEvent = findCalendarEventByHour(newCalEvent.timeSlot, storedCalendar);
  //var desc = newCalEvent.desc;
  //if (existingCalEvent != null && desc != null)  {
      // set textarea.val
  //    eventDescEl.val(newCalEvent.desc)
  //}

  return eventDescEl;
}

// TODO: Add event listener to row container?
// TODO: 
          // add custommised id with hour or idx in local storage
/**
 * Customises the html button with some id to indicate/represent the calendar even / time block to be saved.
 * @param {*} id ??? Some id representing current calendar event time block
 * @returns html button element with save image , with id added to custom attribute ???
 */
function createSaveButtonEl(hr_time_slot) {

  var saveBtnEl = $('<button>');
  saveBtnEl.addClass('btn btn-lg saveBtn');
  saveBtnEl.attr('id', `btn-${hr_time_slot}`);
  //<button class="btn btn-lg saveBtn"><i class="fa-regular fa-floppy-disk"></i></button>
  saveBtnEl.append('<i class="fa-regular fa-floppy-disk"></i>');
  return saveBtnEl;
}



function displayCalendar2() {



    var desc;
    var rowEl;
    var timeBlockEl;
    var calendarObj;
    var calEventDescEl;
    var businessHour;
    var saveBtnEl;

    // Retrieve hour of current timestamp 
    var nowHour = moment().hour();
    console.log(`nowHour = ${nowHour}`);

    var storedCalendar=storageLayerInstance.retrieveAllRecords();

    for (var hr=START_BUS_DAY_HR; hr<END_BUS_DAY_HR; hr++) {
        // create html representing 'hr' time block row in calendar
        console.log(`hr = ${hr}`);
        rowEl = createTimeBlockRowEl();
        timeBlockEl = createHourElment(hr);

        // Retrieve any stored calendar entry for current hr timeslot
        calendarObj = findCalendarEventByHour(hr, storedCalendar);
        if (calendarObj!= null) {
           desc = calendarObj.desc;
        } else {
            desc = null;
        }

        calEventDescEl = createEventDescrEl(hr, desc); // or pass in calendar objt
        businessHour = moment(hr,'HH').hour();
        
        // Format calendar event element according to current time
        if (nowHour > businessHour) {
          calEventDescEl.addClass('past');
        } else if (nowHour == businessHour) {
          calEventDescEl.addClass('present');
        } else {
          calEventDescEl.addClass('future');
        }
        // add custommised id with hour or idx in local storage
        saveBtnEl = createSaveButtonEl(hr);
    
      // Append them to existing calendar events container element
      rowEl.append(timeBlockEl);
      rowEl.append(calEventDescEl);
      rowEl.append(saveBtnEl);
      calendarContainerEl.append(rowEl);
    }
}


function displayCalendar2_orig() {

  console.log(`entered displayCalendar`);

  //var calendarContainerEl = $('.container');
  var calendarContainerEl = $('#events-container');

  // ensure bus day start and end  if start>end
  if (START_BUS_DAY_HR > END_BUS_DAY_HR) { 
      throw new Error("BUS DAY init is invalid.");
  }


  var now = moment().hour();
  for (var hr=START_BUS_DAY_HR; hr<END_BUS_DAY_HR; hr++) {

      // create timeblock row     createTimeBlockRowEl() returns el
     // var rowEl = $(HTML_TIMEBLOCK_ROW_DIV);
     var rowEl = $('<div>');                //define and use ROW ELEMENT
     rowEl.addClass('row time-block');      // ROW CLASSES

    
      // create Time block Element bundle into createHourElment(time) return timeBlockEl
      var timeBlockEl = $('<div>');         // TIME BLOCK ELEMENT
      var time = moment(hr,'HH').format('ha'); 
      timeBlockEl
          .addClass("col-md-1 hour")           // TIME BLOCK CLASSES
          .text(time);


      // create event description text area element  createEventDescrEl(eventText, hr) return eventDescEl
      var eventDescEl = $('<textarea>');        // EVENT_DESC_ELEMENT  or EVENT_TEXT_ELEMENT
      eventDescEl.addClass('col-md-10 description');
     

      var businessHour = moment(hr,'HH').hour();

      if (now > businessHour) {
        eventDescEl.addClass('past');
      } else if (now == businessHour) {
        eventDescEl.addClass('present');
      } else {
        eventDescEl.addClass('future');
      }


        // create button with image   displaySaveBtn(id) return saveBtnEl
        // add custommised id with hour or idx in local storage
        
        var saveBtnEl = $('<button>');
        saveBtnEl.addClass('btn btn-lg saveBtn');

        //<button class="btn btn-lg saveBtn"><i class="fa-regular fa-floppy-disk"></i></button>

        saveBtnEl.append('<i class="fa-regular fa-floppy-disk"></i>');

      //calendarContainerEl.append(timeBlockEl);
      // Join up elements and then add to container el
      rowEl.append(timeBlockEl);
      rowEl.append(eventDescEl);
      rowEl.append(saveBtnEl);
      
     calendarContainerEl.append(rowEl);

  }
}


/**
 * 
 * @param {*} hour_slot 
 */
function removeCalendarEvent(hour_slot) {

  
  var arrCalendarEvents = storageLayerInstance.retrieveAllRecords();
  console.log(`1(removeCalendarEvent). arrCalendarEvents= ${arrCalendarEvents}`);

  var update=false;
  for (var i=0; i<arrCalendarEvents.length; i++) {
    var calendarEventObj = arrCalendarEvents[i];
    console.log(`checking for hour_slot ${hour_slot}`);
    if (calendarEventObj.timeSlot == hour_slot) {
      // remove from array
      arrCalendarEvents.splice(i, 1);
      update=true;
      break;
    }
  }
  if (update) {
    saveAllCalendarEvents(arrCalendarEvents);
  }
}



/**
* TODO: Move to DataLayer and allow this to call it
* 
* @param {} hour_slot 
* @param {*} input 
*/
function recordCalendarEvent(hour_slot, event_desc) {

  // TODO: validate

  // ADDED sort 13/12
  if (typeof hour_slot==='string' || hour_slot instanceof String ) {
    hour_slot = parseInt(hour_slot);
  } else if (! Number.isInteger(hour_slot)) {
      throw new Error(`recordCalendarEvent expects a string to be parsed into integer or an integer for hour_slot`);
  }
  // retrieve all if any records currently stored  var arrCalendarEvents = StorageLayerInstance.retrieveAll(SOME_KEY);
  
    var foundExistingEntry = false;
    var update=false;

    var arrCalendarEvents = storageLayerInstance.retrieveAllRecords();
    console.log(`1. arrCalendarEvents= ${arrCalendarEvents}`);

    if (arrCalendarEvents ==null) {
      arrCalendarEvents=[];
      
      console.log(`2. arrCalendarEvents= ${arrCalendarEvents}`);
    }  else {
      for (var i=0; i<arrCalendarEvents.length; i++) {
        var calendarEventObj = arrCalendarEvents[i];
        console.log(`checking for hour_slot ${hour_slot}`);
        console.log(`checking for calendarEventObj.hour_slot ${calendarEventObj.hour_slot}`);

        if (hour_slot == calendarEventObj.timeSlot) {
          foundExistingEntry = true;

          // NOTE: Don't bother checking if event_desc is the same as maybe too long to check if any of multi line text has changed
          // Keep it simple and just always update entry desc with new event desc
          arrCalendarEvents[i].desc = event_desc;
          update=true;
          break;
        }
      }
    }

      
    if (!foundExistingEntry) {
      // First entry for given timeslot - push onto existing entries
      
      console.log(`3. found first entry for given timeslot`);
      arrCalendarEvents.push(new CalendarEvent(hour_slot, event_desc));
      update=true;
    }

    
    console.log(`4. arrCalendarEvents= ${arrCalendarEvents}`);

    if (update) {
      // save updated calendar events
      // update storage with new entries
      saveAllCalendarEvents(arrCalendarEvents);
    }        
           
  }

  
  
/**
 * Assumes passing in array of CalendarEvent objects, 
 * sorts by timeSlot ascending order before being saved to storage.
 */
function saveAllCalendarEvents(calEventsArr) {

  // sort by timeSlot ascending
  calEventsArr.sort(function(a,b){
    return a.timeSlot - b.timeSlot
  }); 



/*   calEventsArr.sort((a,b) => 
    a.timeSlot - b.timeSlot
  ); */
  storageLayerInstance.recordArrayObjects(calEventsArr);



  //TODO Decide functionality between here and storage layer:  should this be here or in storage layer?

}

const CSS_COLOR_EVENT_RECORDED = 'white';
const CSS_COLOR_EVENT_EDITABLE = 'black';
const CSS_COLOR_EVENT_EDITED = '#06aed5';


/**
 * 
 */
function loadEventListeners() {

  /** When click textarea, font changes colour to show it is editable. */
  $('.description').on('click', function(eventObject){
      eventObject.stopPropagation();
      $(this).css('color', CSS_COLOR_EVENT_EDITABLE); 
  });


  
  /** When click textarea value changes, font changes colour to show it has to be saved. */
  $('.description').on('change', function(eventObject){
      eventObject.stopPropagation();
      $(this).css('color', CSS_COLOR_EVENT_EDITED); 
  });



  /** Pick up on button/button image click to save input event into CalendarEvents */
  $('#events-container').on('click', function(eventObject) {
      // TODO if click on event details change colour to black
      //$(this).css("color", "black");




      console.log(`events-container listener triggered....`);
      // eventObject.stopPropagation();  DO I NEED THIS?
      console.log(`eventObject.target.tagName = ${eventObject.target.tagName}`);

/*       // TODO: How best check for both but if IMG then need to get parent id
      if (eventObject.target.tagName == "I") {
        // retrieve parent of I which should be button
        console.log(`Image on button pressed`);
      } */

      // only for button event types
      // CAREFUL:  on click if BUTTON or I
      var buttonId;
      
      // Get hour of calendar event - using id of button or parent button of image triggering listener
      if (eventObject.target.tagName=="BUTTON") {
        console.log('button clicked');
        buttonId = eventObject.target.id;
        console.log(`save button triggered button id = *${buttonId}*`);

      } else if (eventObject.target.tagName == "I") {
        console.log('image on save button clicked');
        // retrieve id of parent button
        //var buttonEl = eventObject.target.parent;
        var buttonEl = $(eventObject.target).parent();

        console.log(`buttonEl= ${buttonEl}`);
        buttonId = buttonEl.attr('id');

       // buttonId = eventObject.parent().id;
        console.log(`image on save button triggered button id = *${buttonId}*`);

      } else {
        return;
        // else ignore
      }

        // process
   /*      var buttonId = eventObject.target.id;
        console.log(`save button triggered button id = *${buttonId}*`); */

        // extract integer representing 24 hour clock
        var hour_slot = buttonId.replace('btn-','');
        console.log(`save button pressed for hour slot ${hour_slot}`);
        console.log(hour_slot); 

        // Read associated textarea where id = `calendar-event-${hour_slot}`;
        //var input = $.trim($(`#calendar-event-${hour_slot}`).val());
        var input = $(`#calendar-event-${hour_slot}`).val().trim();
          console.log(`input = ${input}`);

        if (input != "") {
          //input = input.trim();
          console.log(`input = ${input}`);
        
          console.log(`calling recordCalendarEvent`);
          recordCalendarEvent(hour_slot, input);
        } else {
          // TODO Decide what should be done - display in feedback loop?
          //throw new Error("No event details provided to save.");
          // May have overwritten so delete from local storage?  call deleteCalendarEvent
          
          // remove or ensure removed from stored calendar
          
          console.log(`!!!!!!!!!!!!!!!!!!calling removeCalendarEvent`);
          removeCalendarEvent(hour_slot);
        }

        /* Modify color of associated textarea not button or image */
        
      

        
        displayFeedback(MSG_FEEDBACK_EVENTS_SAVED);  //TO DO ADD INTERVAL  change to events updated


        // Clear feedback msg after timeout
        setTimeout(clearFeedback, FEEDBACK_DISPLAY_DURATION);

        console.log(`**************updating textarea colour to ${CSS_COLOR_EVENT_RECORDED}`);
        console.log(`#calendar-event-${hour_slot}`);
        console.log($(`#calendar-event-${hour_slot}`));
        console.log($(`#calendar-event-${hour_slot}`).css('color'));

        $(`#calendar-event-${hour_slot}`).css('color', CSS_COLOR_EVENT_RECORDED); // still to be saved
        
        //$(this).siblings(`#calendar-event-${hour_slot}`).css('color', CSS_COLOR_EVENT_RECORDED); // still to be saved
        //$(this).css('color', CSS_COLOR_EVENT_RECORDED); // still to be saved
        console.log(`*************** should have now updated  textarea colour to ${CSS_COLOR_EVENT_RECORDED}`);
    
      
     
    });  // end anon function - TODO Name it and use name instead.  saveInputCalendarEvent()

  } // end loadEventListeners


     
 /**
  *     Utility functions 
  * 
  */


 /**
  * Sets up the element not to be shown:
  * - currently by adding 'hide' to the element's classlist.
  * See .css to ensure 'hide' style sets the element to not be shown.
  * Note function will not impact any other classes that are currently on the element
  * and so multi classes should be allowed along with the 'hide'.  
  * No dupes are possible as  classlist represents set of tokens it will only hold unique items.
  * @param {*} element 
  */
 function hide(element) {
  // ensure keep any other classes intact
  // element.classList.add("hide");
  //element.addClass("hide");
  // bootstrap not hide but invisible
  element.addClass("invisible");
}

/**
* Ensures  class of element no longer includes 'hide'.
* See .css to ensure 'hide' style displays the given element.
* Note function will only remove 'hide' class and have no impact on any other classes 
* that are currently on the element before function call.
* @param {*} element 
*/
function show(element) {
  // ensure keep any other classes intact
  //element.classList.remove("hide");
  console.log(`show()...`);
  //element.removeClass("hide");
  // bootstrap not hide but invisible
  element.removeClass("invisible");
}



/*
While/For Loop that loops starting at 9 and breaks at 5
- For each loop generate or build html timeblock row
  • Append timeblock to container
    º Hour
      - A number corresponding with the hour in 12 hour format
    º Textarea
      - Show existing event text, if any and allow user to input event text
    º Save Button
      - When clicked, store/reset the event text corresponding with the hour to localStorage
  • Increase hour by one
  • Check if hour is past, current or future and apply corresponding css class to timeblock
*/

 /* Duration feedback will be displayed on each question cycle */
 const FEEDBACK_DISPLAY_DURATION = 2000;  // 2 secs in millisecs
 
/* Feedback messages */
const MSG_FEEDBACK_EVENTS_SAVED = 'Events Added to local storage.';

var feedbackEl = $('.feedback');
var feedbackImgEl = $('.feedback_img');

function displayFeedback(msg) {
  console.log(`displayFeedback entered with msg = ${msg}`);
  console.log(feedbackEl);

  //feedbackEl.innerText= msg;
  //feedbackEl.textContent = msg;
  feedbackEl.text(msg);
  //feedbackEl.val(msg);
  
  console.log(`displayFeedback entered with msg = ${msg}`);
  {/* <i class="fa-solid fa-check"></i> */}
  show(feedbackEl);
  show(feedbackImgEl);
}



function clearFeedback() {
  feedbackEl.innerText= '';
  hide(feedbackEl);
  hide(feedbackImgEl);
}


/**
 * Main onload functionality
 */

//function onLoad() {
function main() {

   // validate business hours on page load only.
  if (START_BUS_DAY_HR > END_BUS_DAY_HR) { 
    throw new Error("START_BUS_DAY_HR should be before END_BUS_DAY_HR.");
  }

  
  clearFeedback();
  displayHeaderCurrDate();  //displayCurrDateHeader?
  displayCalendar2();
  //displayCalendar();
  loadEventListeners();


/*   var startOfBusiness = moment(9,'h');
  
  while (startOfBusiness.hour() < 18) {
    console.log(startOfBusiness.hour());
    console.log(startOfBusiness.hour());
    startOfBusiness.add(1,'hours');
  } */
}


main();
//onLoad();
