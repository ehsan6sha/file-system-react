import React, { Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router';
import { createRoot } from 'react-dom/client'; // Updated import for createRoot
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'; // Updated import for configureStore

import Sidebar from './components/Sidebar';
import './assets/styles/App.scss';

import reducers from './reducers';
import { ViewFiles } from './pages';
import generatedummyFileSystem from './utils/dummyFileSystem';

const rootEl = document.getElementById('root');

// Configure store using Redux Toolkit
const store = configureStore({
  reducer: reducers,
  preloadedState: {
    fileSystem: 
      localStorage.getItem('fileSystem') &&
      Object.keys(localStorage.getItem('fileSystem')!).length > 0
        ? JSON.parse(localStorage.getItem('fileSystem')!)
        : generatedummyFileSystem()
  }
});
console.log("App executed");
const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Sidebar />
        <ViewFiles />
      </Fragment>
    </Router>
  </Provider>
);

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}