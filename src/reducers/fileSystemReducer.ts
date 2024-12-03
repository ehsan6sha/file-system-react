import dummyFileSystem from '../utils/dummyFileSystem';
import { ADD_ENTRY, DELETE_ENTRY } from '../utils/constants';
import { DeleteEntry, AddEntry } from '../utils/fileSystem';

// Define the structure of a file or folder entry
interface FileSystemEntry {
  id: string;
  name: string;
  type: string;
  children?: FileSystemEntry[];
}

// Define the shape of the action object
interface Action {
  type: string;
  payload: any; // You can replace 'any' with a more specific type if known
}

// Define the reducer function
const fileSystemReducer = (
  data: FileSystemEntry[] = dummyFileSystem,
  action: Action
): FileSystemEntry[] => {
  switch (action.type) {
    case ADD_ENTRY: {
      const newEntry = action.payload as FileSystemEntry;
      return AddEntry(data, newEntry);
    }

    case DELETE_ENTRY: {
      return DeleteEntry(data, action.payload);
    }

    default:
      return data;
  }
};

export default fileSystemReducer;