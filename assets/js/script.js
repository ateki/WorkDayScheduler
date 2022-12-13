/**-------------------------------------------------------------
 * 
 * Filename: script.js
 * Desc:
 * Logic for accessing stored Event Calendar for current day, updating
 * saving and displaying.
 * Along with event listeners associated entering and saving new calendar entries
 * as well as feedback message
 * Author: Irene Atek
 * --------------------------------------------------------------
 */
  



/**
 * Module imports
 */
import {storageLayerInstance} from './storage_layer.js';   



/**
 * Global constants
 */

/*  Business Day start and end - represented in 24 hour clock  (0-23) */
const START_BUS_DAY_HR = 9;        
const END_BUS_DAY_HR = 18; 


 /* Duration feedback will be displayed on each question cycle */
 const FEEDBACK_DISPLAY_DURATION = 2000;  // 2 secs in millisecs
 
/* Feedback messages */
const MSG_FEEDBACK_EVENTS_SAVED = 'Event added to local storage.';

/* 
 * Colours used to indicate when event has been edited, 
 * remains editable as well as once it has been recorded/persisted.
 */
const CSS_COLOR_EVENT_RECORDED = 'white';
const CSS_COLOR_EVENT_EDITABLE = 'black';
const CSS_COLOR_EVENT_EDITED = '#06aed5';


/**
 *  Query Selectors 
 */
var calendarContainerEl = $('#events-container');   
var currDateHeaderEl = $('#currentDay');  
var feedbackEl = $('.feedback');
var feedbackImgEl = $('.feedback_img');


/**
 * Class to represent an entry in the EventsCalendar
 * Properties:   
 *    - timeSlot (should be int 0-23 to represent hour of 24 hour clock)
 *    - eventDesc (string representing multiline event description)
 */ 
class CalendarEvent {

    constructor(timeSlot, eventDesc) {
      this.timeSlot = timeSlot;      
      this.desc = eventDesc;
    }
}



/** ----------------------------------------
 * Utility Functions
 -------------------------------------------*/


/**
 * Does param represent a valid hour in 24 hour clock?
 * @param {*} int representing hour 
 * @returns true if between 0-23, false otherwise
 */ 
// TODO: Add param validation
function isValidTimeSlot(hour) {
  if (hour>=0 && hour<24) {
    return true;
  } else {
    return false;
  }
}


/**
 * Searches passed in existing calendarEvents to see if there is an entry for the
 * supplied hour.  
 * @param {*} hour an integer represent hour in 24 hour clock (0-23)
 * @param {*} calendarEvents an array of CalendarEvent objects representing existing stored calendar
 * @returns CalendarEvent object if there exists an entry for specified hour in existing Calendar.
 * Returns null if either:
 *  - No entry exists or 
 *  - A null  is passed in for calendarEvents.
 */
// TODO: Add param hour validation
function findCalendarEventByHour(hour, calendarEvents) {

  if (calendarEvents == null) {
    // no calendar events exists
    return null;
  }

  for (var i=0; i<calendarEvents.length; i++) {
    if (calendarEvents[i].timeSlot == hour) {
      // found entry for specified hour
      return calendarEvents[i];
    }
  }

  // no entry exists
  return null;
}




/** ----------------------------------------
 * Functions to  dynamically generate and/or 
 * update HTML and customise css.
 -------------------------------------------*/


/**
* Sets up the element not to be shown:
* - using bootstrap and so adds 'invisible' to the element's classlist not hide.
* Note function will not impact any other classes that are currently on the element
* and so multi classes should be allowed along with the 'hide'.  
* No dupes are possible as classlist represents set of tokens it will only hold unique items.
* @param {*} element 
*/
function hide(element) {
  element.addClass("invisible");
}


/**
* Ensures class of element no longer includes 'visible'.
* - using bootstrap and so adds 'visible' to the element's classlist not show.
* Note function will only remove 'hide' class and have no impact on any other classes 
* that are currently on the element before function call.
* @param {*} element 
*/
function show(element) {
  element.removeClass("invisible");
}


/**
 * Displays current date in the header of page.
 * Date is formatted as  Day of Wk, Month Date in following format:
 * : Friday, December 9th
 */
function displayHeaderCurrDate() {
  var currDate = moment().format('dddd, MMMM Do');
  currDateHeaderEl.text(currDate);
}


/**
* Updates 'msg' in the feedback element and makes feedback text and associated tick icon
* visible. 
* @param {*} msg String to be displayed as feedback msg.
*/
function displayFeedback(msg) {
  feedbackEl.text(msg);
  show(feedbackEl);
  show(feedbackImgEl);
}


/**
* Clears feedback message, making both the feedback text and associated tick icon invisible.
*/
function clearFeedback() {
  feedbackEl.innerText= '';
  hide(feedbackEl);
  hide(feedbackImgEl);
}


/**
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
// TODO: Validate hr arg - between 0-23
function createHourElment(hr) {
    var timeBlockEl = $('<div>');        
    var time = moment(hr,'HH').format('ha'); 
    timeBlockEl
        .addClass("col-md-1 hour")          
        .text(time);
    return timeBlockEl;
}


/**
 * Creates associated calendar event decription element.
 * @param {*} calEvent a string representing the description of a new calendar event.
 * @param {*} hr representing hour of timeslot associated with the calendar event
 * @param {*} calendarEvents representing 
 * @returns html textarea element representing a calendar event description (eventDesc) for given hr.
 */
function createEventDescrEl(hr, eventDesc) {

    var eventDescEl = $('<textarea>');        
    eventDescEl.addClass('col-md-10 description');
    // link to hour representing time slot
    eventDescEl.attr('id', `calendar-event-${hr}`); 
    if (eventDesc!= null) {
      eventDescEl.val(eventDesc);     
    }

    return eventDescEl;
}


/**
 * Create a save button, customised with id indicating the hr_time_slot associated with,so that when triggered
 * will be able to determine which slot to update/save.
 * 
 * @param {*} hr_time_slot int representing 24 hour clock time slot button will be used to update/save
 * @returns html button element with a child save icon along with customised id btn-<hr_time_slot>
 */
function createSaveButtonEl(hr_time_slot) {

    var saveBtnEl = $('<button>');
    saveBtnEl.addClass('btn btn-lg saveBtn');
    saveBtnEl.attr('id', `btn-${hr_time_slot}`);
    saveBtnEl.append('<i class="fa-regular fa-floppy-disk"></i>');
    return saveBtnEl;
}


/**
 * Pulls the stored existing calendar and determines how to display
 * on the page: dynamically generating and customing the html/css accordingly.
 * Finally the newly created elements are appended onto the existing html element
 * represented by calendarContainerEl.
 */
function displayCalendar() {

    var desc;
    var rowEl;
    var timeBlockEl;
    var calendarObj;
    var calEventDescEl;
    var businessHour;
    var saveBtnEl;

    
    var nowHour = moment().hour();  // current hour
    var storedCalendar=storageLayerInstance.retrieveAllRecords();

    for (var hr=START_BUS_DAY_HR; hr<END_BUS_DAY_HR; hr++) {

        // create html representing 'hr' time block row of calendar display
        rowEl = createTimeBlockRowEl();
        timeBlockEl = createHourElment(hr);
        saveBtnEl = createSaveButtonEl(hr);

        // create and customise event description associated with current hr timeslot

        // retrieve any existing entry from stored calendar for current hr 
        calendarObj = findCalendarEventByHour(hr, storedCalendar);
        if (calendarObj!= null) {
           desc = calendarObj.desc;
        } else {
            desc = null;
        }
        calEventDescEl = createEventDescrEl(hr, desc); 
        
        // Format calendar event element according to current time
        businessHour = moment(hr,'HH').hour();
        if (nowHour > businessHour) {
          calEventDescEl.addClass('past');
        } else if (nowHour == businessHour) {
          calEventDescEl.addClass('present');
        } else {
          calEventDescEl.addClass('future');
        }
        
    
      // Append newly created elements to existing container element representing calendar events display
      rowEl.append(timeBlockEl);
      rowEl.append(calEventDescEl);
      rowEl.append(saveBtnEl);
      calendarContainerEl.append(rowEl);
    }
}




/** ----------------------------------------
 * Functions to process calls to remove or 
 * retrieve existing stored Calendar entries.
 * -----------------------------------------*/


/**
 * Retrieves stored calendar and removes the calendar entry associated with given hour_slot.
 * The updated calendar will then be persisted in storage,
 * If no entry exists for specified hour_slot, no changes are made to stored calendar.
 * 
 * @param {*} hour_slot 
 */
function removeCalendarEvent(hour_slot) {

  var update=false;
  var arrCalendarEvents = storageLayerInstance.retrieveAllRecords();

  for (var i=0; i<arrCalendarEvents.length; i++) {
    var calendarEventObj = arrCalendarEvents[i];
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
* 
* Creates a new calendar entry (represented by CalendarEvent object)
* for time specified by hour_slot arg and entry description of event_desc.
* The new entry will then be used to update the persisted calendar in storage.
*
* @param {} hour_slot 
* @param {*} input 
*/   // TODO: validate
function recordCalendarEvent(hour_slot, event_desc) {

    if (typeof hour_slot==='string' || hour_slot instanceof String ) {
      hour_slot = parseInt(hour_slot);
    } else if (! Number.isInteger(hour_slot)) {
        throw new Error(`recordCalendarEvent expects a string to be parsed into integer or an integer for hour_slot`);
    }
    // retrieve all if any records currently stored  var arrCalendarEvents = StorageLayerInstance.retrieveAll(SOME_KEY);
    
    var update=false;
    var foundExistingEntry = false;

    var arrCalendarEvents = storageLayerInstance.retrieveAllRecords();
    if (arrCalendarEvents ==null) {

      // first entry in stored calendar
      arrCalendarEvents=[];
      
    }  else {

        for (var i=0; i<arrCalendarEvents.length; i++) {
          var calendarEventObj = arrCalendarEvents[i];

          if (hour_slot == calendarEventObj.timeSlot) {

            foundExistingEntry = true;

            // NOTE: Don't bother checking if event_desc is the same as too long to check if any of multi line text has changed
            // Keeping simple by always updating existing entry desc with new event desc
            arrCalendarEvents[i].desc = event_desc;
            update=true;
            break;
          }
        }
    }

      
    if (!foundExistingEntry) {
      // First entry for given timeslot - push onto existing entries arr
      arrCalendarEvents.push(new CalendarEvent(hour_slot, event_desc));
      update=true;
    }

    if (update) {
      // persist updated calendar in storage
      saveAllCalendarEvents(arrCalendarEvents);
    }        
           
  }


/**
 * Sorts the calEventsArr (by CalendarEvent timeSlot, ascending order.)
 * Once data sorted, stores array as persistent data.
 * @param {*} calEventsArr assumes array of CalendarEvent objects
 */// TODO: Param validation
function saveAllCalendarEvents(calEventsArr) {

    // sort by timeSlot ascending
    calEventsArr.sort(function(a,b){
      return a.timeSlot - b.timeSlot
    }); 

    storageLayerInstance.recordArrayObjects(calEventsArr);
}





/** ----------------------------------------
 * Event Listeners.
 * -----------------------------------------*/


/**
 * Sets up required JQuery event listeners for page.
 * To listen for:
 *     - click event for event calendar description
 *     - event description textarea change event
 *     - click of either save button or it's child icon click
 */
// TODO: Break up and name functions rather than call anon.
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



  /** Picks up on clicks bubbling up to the parent container holding all the events items.  
   * However only processes if button or button's child I tag triggered listneer. 
   */
  $('#events-container').on('click', function(eventObject) {
    
        var buttonId;
        
        // Get hour of calendar event - using id of button or parent button of image triggering listener
        if (eventObject.target.tagName=="BUTTON") {
          buttonId = eventObject.target.id;

        } else if (eventObject.target.tagName == "I") {
          // retrieve id of parent button
          var buttonEl = $(eventObject.target).parent();
          buttonId = buttonEl.attr('id');

        } else {
          // else ignore click
          return;
        }

        // extract integer representing 24 hour clock
        var hour_slot = buttonId.replace('btn-','');

        // Read associated textarea where id = `calendar-event-${hour_slot}`;
        var input = $(`#calendar-event-${hour_slot}`).val().trim();

        if (input != "") {
          // New entry => entry to be added to calendar
          recordCalendarEvent(hour_slot, input);

        } else {
          // No input => Entry to be cleared from calendar
          removeCalendarEvent(hour_slot);
        }

        /* Show message for specified timeout before clearing. */
        displayFeedback(MSG_FEEDBACK_EVENTS_SAVED);  
        setTimeout(clearFeedback, FEEDBACK_DISPLAY_DURATION);

        /* Modify color of associated textarea not, button or image, to show item still to be saved */
        $(`#calendar-event-${hour_slot}`).css('color', CSS_COLOR_EVENT_RECORDED); 
        
    });  // end event calendar click

  } // end loadEventListeners





/** ----------------------------------------
 * Main onload functionality
 * -----------------------------------------*/


//function onLoad() {
function main() {

   // validate business hours on page load only.
  if (START_BUS_DAY_HR > END_BUS_DAY_HR) { 
    throw new Error("START_BUS_DAY_HR should be before END_BUS_DAY_HR.");
  }
  
  clearFeedback();
  displayHeaderCurrDate();  
  displayCalendar();
  loadEventListeners();

}


main();
//onLoad();
