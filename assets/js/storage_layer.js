/**
 * Implemented as a singleton class:  to hold storage functions
 * 
 */

const LOCAL_STORAGE_KEY_CAL_EVENTS = "calendar";
class StorageLayer {


    
    /**
 * Assumes passing in array of HighScore objects, sorts by high score descending and saved into local storage.
 */
/* function saveHighScoresToStorage(scoresArr) {

    //  sort by high score
    scoresArr.sort(function(a,b){return b.score - a.score});

    var arrHighScores = localStorage.setItem(LOCAL_STORAGE_KEY_HIGHSCORES, JSON.stringify(scoresArr));

    return arrHighScores;  
} */

    // record single record object
    record(data) {
        console.log(`record ${key} = ${data}`);
        if (data != null) {
            // TODO: validate that object is of type CalendarEvent
            // retrieve all calendar events from storage ->  Array of CalendarEvent
            // replace record were hour_slot is same as
            // or do so in calling code?
        }
    }

    // TODO Does this need to return anything?
    recordArrayObjects(calEventsArr) {
        
        //console.log(`recordArrayObjects ${key} = ${data}`);
        console.log(`recordArrayObjects ${calEventsArr}`);
        
        localStorage.setItem(LOCAL_STORAGE_KEY_CAL_EVENTS, JSON.stringify(calEventsArr));
        
      /*   var arrCalendarEvents = localStorage.setItem(LOCAL_STORAGE_KEY_CAL_EVENTS, JSON.stringify(calEventsArr));
        return arrCalendarEvents; */
    }


    /**
     * @returns  array of objects where each object expected to be of class type HighScoreObject.
     */ // TODO: Decide if LOCAL STORAGE KEY is known here or in calling code. For now keep here.
    // retrieveAllRecords(key) {
    retrieveAllRecords() {

        //console.log(`retrieveAllRecords ${key}}`);
        console.log(`retrieveAllRecords `);
        var arrCalendarEvents = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CAL_EVENTS));
        return arrCalendarEvents;  
    }


    retrieveAll(key) {
        console.log(`retrieve ${key}}`);

    }

    /**
     * Do we need?
     */
    //clearAll(key) {
    clearAll(key) {
        //console.log(`clearAll ${key}}`);
        console.log(`clearAll `);
        localStorage.removeItem(LOCAL_STORAGE_KEY_CAL_EVENTS);
    }


    /**
     * Removes all high score info recorded in local storage.
     */
    clearAllCalEvents() {
        localStorage.removeItem(LOCAL_STORAGE_KEY_CAL_EVENTS);
    }


}


console.log(`loading storage layer`);
const storageLayerInstance = new StorageLayer();

Object.freeze(storageLayerInstance);    // ensures no modification of this obj


export  {storageLayerInstance};