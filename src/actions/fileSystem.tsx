import { ADD_ENTRY, DELETE_ENTRY } from '../utils/constants';

// Define the structure of an entry
interface Entry {
  id: string;
  name: string;
  // Add other properties as needed
}

// Define the structure of an action with a generic payload
interface Action<T> {
  type: string;
  payload: T;
}

// Define the action creator for adding an entry
export const addEntry = (entry: Entry): Action<Entry> => {
  return {
    type: ADD_ENTRY,
    payload: entry,
  };
};

// Define the action creator for deleting an entry
export const deleteEntry = (entry: Entry): Action<Entry> => {
  return {
    type: DELETE_ENTRY,
    payload: entry,
  };
};