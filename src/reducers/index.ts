import { combineReducers } from 'redux';
import fileSystem from './fileSystemReducer';

// Define the shape of the root state
export interface RootState {
  fileSystem: ReturnType<typeof fileSystem>;
}

// Combine reducers with correct typing
const rootReducer = combineReducers<RootState>({
  fileSystem,
});

export default rootReducer;