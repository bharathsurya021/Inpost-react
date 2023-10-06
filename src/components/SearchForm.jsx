import React, { useState } from 'react';

const SearchForm = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [numPages, setNumPages] = useState(10);
  const handleExtraction = async () => {
    try {
      /*eslint-disable no-undef */
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const activeTabId = tab.id;
      const max = Number(numPages);

      chrome.storage.local.set({
        extractionCount: 0,
        results: [],
      });
      chrome.storage.local.get(
        ['extractionCount', 'results'],
        function (result) {
          const extractionCount = result.extractionCount || 0;
          const results = result.results || [];
          chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: performExtraction,
            args: [activeTabId, extractionCount, results, max],
          });
        }
      );
    } catch (error) {
      alert('Extraction failed:', error);
    }
  };

  const performExtraction = (tabId, extractionCount, results, max) => {
    const height = document.body.scrollHeight;
    window.scroll(0, height);

    const liElements = document.querySelectorAll(
      'ul.reusable-search__entity-result-list li.reusable-search__result-container'
    );

    for (let i = 0; i < liElements.length; i++) {
      const li = liElements[i];
      const anchor = li.querySelector('a.app-aware-link');
      const paragraph = li.querySelector('p.entity-result__content-summary');

      if (anchor && paragraph) {
        const profileUrl = anchor.href;
        const summary = paragraph.textContent.replace(/\s+/g, ' ').trim();
        results.push({ profileUrl, summary });
      }
    }

    extractionCount++;

    setTimeout(() => {
      const nextButton = document.querySelector('button[aria-label="Next"]');
      if (nextButton && extractionCount < max) {
        nextButton.click();
        setTimeout(() => {
          performExtraction(tabId, extractionCount, results, max);
        }, 2000);
      } else if (extractionCount === max) {
        /*eslint-disable no-undef */
        chrome.runtime.sendMessage({
          extractionComplete: true,
          data: results,
        });
        return results;
      }
    }, 2000);
    return results;
  };

  const handleSearch = () => {
    const keyword = searchKeyword;
    const searchUrl = `https://www.linkedin.com/search/results/all/?keywords=%23${keyword}`;

    /*eslint-disable no-undef */
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabID = tabs[0].id;
      const currentUrl = tabs[0].url;
      chrome.storage.local.set({ prevUrl: currentUrl }, function () {
        // After storing the previous URL, navigate to the search URL
        chrome.scripting.executeScript({
          target: { tabId: activeTabID },
          function: (url) => {
            window.location.href = url;
          },
          args: [searchUrl],
        });
      });
    });
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
        <button onClick={handleSearch}>Search keyword</button>
      </div>
      <div className="page-container">
        <label htmlFor="numPages">Number of Pages:</label>
        <input
          type="number"
          id="numPages"
          min="10"
          value={numPages}
          onChange={(e) => setNumPages(e.target.value)}
        />
        <button onClick={handleExtraction}>Extract Data</button>
      </div>
    </>
  );
};

export default SearchForm;
