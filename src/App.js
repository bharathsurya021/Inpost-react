// src/App.js
import React, { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import Output from './components/Output';
import DownloadLink from './components/DownloadLink';

const App = () => {
  const [outputData, setOutputData] = useState([]);
  const [downloadLinkVisible, setDownloadLinkVisible] = useState(false);

  /*eslint-disable no-undef */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.extractionComplete) {
      setOutputData(message.data);
      setDownloadLinkVisible(true);
    }
  });

  return (
    <div className="container">
      <h1>Welcome to Inpost</h1>
      <p style={{ textAlign: 'center', fontSize: '16px' }}>
        Search hashtag, extract profiles, and their post summaries
      </p>
      <SearchForm />
      <Output data={outputData} />
      {downloadLinkVisible && <DownloadLink data={outputData} />}
    </div>
  );
};

export default App;
