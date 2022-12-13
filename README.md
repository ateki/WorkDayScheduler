# WorkDayScheduler
Simple one day calendar app that allows user to save events for each hour of the day, persisted to local storage. Browser app using dysnamically updated HTML, CSS powered by jQuery.  Demonstrating use of 3rd Party APIs:  Moment.js to work with date and time.

## Description
The app displays current date along with a grid representing the day's calendar.  
A row represents each business hour for the current day (currently customised to run from 9am-6pm (formatted for 24 hour clock).
Along with the hour slot, a multi input text area is shown along wiht a save button.  
The user can edit the event description for any hour slot and by pressing the save button on the specific row, the event is updated in the persisted calendar.

Calendar data is persisted and is available following any browser restart as well as page reload.

No validation is carried out regarding the event content provided.

A feedback message appears on the successful update of a hour slot.

The description of each calendar entry is coded, according to whether it has passed, is in the future or is the current hour of the day.  THe following colours are used to differentiate between these:
- grey - timeslot is in the past
- red - current timeslot
- green - timeslot is in the future

<br>


The basic program makes  use of use:

- html and css 
- powered by Jquery and javascript
- Third APIs used include Moment.js for date and time manipulation/format.




## Usage
Live app can be found at https://ateki.github.io/WorkDayScheduler/


### Home page
The current reduced functionning app only has the below page, where any previously recorded events will be displayed in the calendar. <br>

Once a user has started interacting with the calendar, font colours will change as follows:
<ul>
<li>White font - the entry displayed is currently stored/now been updated in the persisted calendar.
No need to save again but can be edited again. </li>
<li>Blue font - highlights the entry description has been changed from what is persisted.  This has still to be saved to be recorded in storage. </li>
<li>Black font - User has clicked on the event description and may/may not have edited. Focus remains on the entry which is editable </li>
</ul>
<br>
<div> <img src=assets/images/scheduler-screenshot.png alt="WorkDay Schedule page"  style=" margin-right: 10px; border: 2px solid #555;"  />
</div>
<br>
<br>
For now, users can only save one calendar entry at a time - using the save button on the right of each row.  Once stored, a feedback message briefly appears at the top center of the calendar.  Please see example below: 
<br>

<div> 
<img src=assets/images/scheduler-feedback-screenshot.png alt="WorkDay Schedule page feedback message example"  style=" margin-right: 10px; border: 2px solid #555;"  />
</div>
The feedback message only appears for a short period of time and then disappears.<br>
<br>
<br>

Multi line event descriptions are possible, currently with no restrictions on the content.<br>
For example.<br>


<div> 
<img src=assets/images/scheduler-multiline-event.png alt="WorkDay Schedule feedback msg "  style=" margin-right: 10px; border: 2px solid #555;"  />
</div>


## Calendar Persistance

Calendar entries are stored in local storage and are persisted between browser restarts as well as page reloads.

REPO: https://github.com/ateki/WorkDayScheduler



## License

The last section of a high-quality README file is the license. This lets other developers know what they can and cannot do with your project. If you need help choosing a license, refer to [https://choosealicense.com/](https://choosealicense.com/).
