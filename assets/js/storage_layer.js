/**
 * Implemented as a singleton class:  for persistence layer and functions.
 * This singleton class is simply a persistence layer which should be called to
 * persist calendar data to Storage.
 * THis layer should keep data of implementation hidden to calling code.
 * Note this layer should remain agnostic to the datastructure of calendar being 
 * persisted.  The calling code using this layer should be solely in charge for representing
 * and understanding the impelmentation of the calendar.
 * 
 */

/**
 * Global constants
 */
const LOCAL_STORAGE_KEY_CAL_EVENTS = "calendar";


/**
 * Singleton Class
 */
class StorageLayer {

    /**
      * Persists the passed in calEventsArr to local storage under the key LOCAL_STORAGE_KEY_CAL_EVENTS.
      * @param {Store} calEventsArr should be array of objects representing calendar event.
      * This layer is agnostic to structure of objects passed in and  simply stores the argument an stringified 
      * JSON string to local storage. // TODO Validate arg
      */ 
    recordArrayObjects(calEventsArr) {
        localStorage.setItem(LOCAL_STORAGE_KEY_CAL_EVENTS, JSON.stringify(calEventsArr));
    }


    /**
     * Retrieves from local storage the stringified JSON stored under the key  LOCAL_STORAGE_KEY_CAL_EVENTS.
     * This function parses the JSON from stored text to a Javascript object representing calendar events. 
     * @returns Object representing the persisted calendar events.  Note this function should remain agnostic to the
     * structure of objects persisted and simply returns the stored object from local storage.
     */
    retrieveAllRecords() {
        var arrCalendarEvents = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CAL_EVENTS));
        return arrCalendarEvents;  
    }


    /**
     * Removes  persisted calendar events information from local storage
     * - stored under the key LOCAL_STORAGE_KEY_CAL_EVENTS.
     */
    clearAllCalEvents() {
        localStorage.removeItem(LOCAL_STORAGE_KEY_CAL_EVENTS);
    }
}



/**
 * Singleton pattern implemented to ensure no changes possible and only one instance of object.
 */
const storageLayerInstance = new StorageLayer();

Object.freeze(storageLayerInstance);    // ensures no modification of this obj

export  {storageLayerInstance};