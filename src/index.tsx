import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import Sidebar from './components/Sidebar';
import WNFSSetup from './components/WNFSSetup';
import { ViewFiles } from './pages';
import './assets/styles/App.scss';

import reducers from './reducers';
import { FileManager } from './utils/fulaFileSystem';
import { FulaDatastore } from './utils/fulaFileSystem';

const rootEl = document.getElementById('root');

const App: React.FC = () => {
  const [wnfsKey, setWnfsKey] = useState<Uint8Array | null>(null);
  const [fileSystem, setFileSystem] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const initializeWNFS = async () => {
      const credentials = localStorage.getItem('wnfs_credentials');
      if (credentials) {
        const { password, signature } = JSON.parse(credentials);
        const ed = new HDKEY(password);
        const key = ed.deriveKey(signature);
        setWnfsKey(key);
      }
    };
    initializeWNFS();
  }, []);

  useEffect(() => {
    const initializeFileSystem = async () => {
      if (wnfsKey) {
        const datastore = new FulaDatastore();
        const fileManager = new FileManager(datastore, wnfsKey);
        const rootCid = await fileManager.init();
        const folderData = await fileManager.generateFolderData(rootCid, 'root');
        
        const newStore = configureStore({
          reducer: reducers,
          preloadedState: { fileSystem: folderData }
        });
        
        setStore(newStore);
        setFileSystem(folderData);
      }
    };

    if (wnfsKey) {
      initializeFileSystem();
    }
  }, [wnfsKey]);

  if (!wnfsKey) {
    return <WNFSSetup onKeyGenerated={setWnfsKey} />;
  }

  if (!store || !fileSystem) {
    return <div>Loading...</div>;
  }

  return (
    <Provider store={store}>
      <Router>
        <React.Fragment>
          <Sidebar />
          <ViewFiles />
        </React.Fragment>
      </Router>
    </Provider>
  );
};

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}