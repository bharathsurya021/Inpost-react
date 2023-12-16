import React, { useState } from 'react';
import Filter from './filter';

const SearchForm = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [searchTabId, setSearchTabId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSearch = () => {
    const keyword = searchKeyword;
    const hasJobPostsFilter = selectedOptions.some(
      (option) => option.value === 'jobposts'
    );
    const hasLatestFilter = selectedOptions.some(
      (option) => option.value === 'latest'
    );

    let searchUrl = 'https://www.linkedin.com/search/results/content/';

    if (hasJobPostsFilter) {
      searchUrl += '?contentType=%22jobs%22/';
    }

    searchUrl += `${hasJobPostsFilter ? '&' : '?'}keywords=%23${keyword}`;

    if (hasLatestFilter) {
      searchUrl += '&sortBy="date_posted"';
    }

    // Check if a searchTabId is already set, if not, open the URL and set the tab ID
    /*eslint-disable no-undef */
    if (!searchTabId) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const currentUrl = tabs[0].url;
        setSearchTabId(currentTab.id);
        chrome.storage.local.set({ prevUrl: currentUrl });
        chrome.tabs.update(currentTab.id, { url: searchUrl });
      });
    } else {
      // If searchTabId is already set, just update the current tab's URL
      chrome.tabs.update(searchTabId, { url: searchUrl });
    }
  };

  const handleExtraction = () => {
    console.log(searchKeyword, searchTabId);
    /*eslint-disable no-undef */
    if (searchTabId) {
      chrome.tabs.sendMessage(searchTabId, {
        action: 'startExtraction',
        max: numPages,
        tabId: searchTabId,
      });
    }
  };

  return (
    <>
      <div className="search-container">
        <label htmlFor="searchKeyword">Search Keyword:</label>
        <input
          type="text"
          placeholder="Enter a keyword to search"
          id="searchKeyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Filter
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
        <button onClick={handleSearch}>Search keyword</button>
      </div>

      <div className="page-container">
        <label htmlFor="numPosts">Number of Posts:</label>
        <input
          type="number"
          id="numPosts"
          min="1"
          value={numPages}
          onChange={(e) => setNumPages(e.target.value)}
        />
        <button onClick={handleExtraction}>Extract Data</button>
      </div>
    </>
  );
};

export default SearchForm;
