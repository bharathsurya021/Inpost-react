// SearchForm.js
import React, { useState } from 'react';
import Filter from './Filter';

const SearchForm = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [searchTabId, setSearchTabId] = useState(null);
  // const [selectedContentTypeOptions, setSelectedContentTypeOptions] = useState([]);
  const [selectedSortByOption, setSelectedSortByOption] = useState(null);
  const [selectedDatePostedOption, setSelectedDatePostedOption] = useState(null);
  const [emailFilter, setEmailFilter] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [monthsFilter, setMonthsFilter] = useState(1);
  const [minCommentsFilter, setMinCommentsFilter] = useState(1);
  const datePostedOptions = [
    { value: 'past-24h', label: 'Past 24 Hours' },
    { value: 'past-week', label: 'Past Week' },
    { value: 'past-month', label: 'Past Month' },
  ];
  // const contentTypeOptions = [
  //   { value: 'posts', label: 'Posts' },
  //   { value: 'jobposts', label: 'Job Posts' },
  // ];
  const sortByOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'top', label: 'Top Match' },
  ];
  const [emailOptions] = useState([
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ]);
  const handleSearch = () => {
    const keyword = searchKeyword;
    // const hasJobPostsFilter = selectedContentTypeOptions.some(
    //   (option) => option.value === 'jobposts'
    // );

    let searchUrl = 'https://www.linkedin.com/search/results/content/?contentType=%22jobs%22';

    // if (hasJobPostsFilter) {
    //   searchUrl += '?contentType=%22jobs%22';
    // }

    const datePosted = selectedDatePostedOption ? selectedDatePostedOption.value : '';
    if (datePosted) {
      searchUrl += `&datePosted="${datePosted}"`;
    }
    // searchUrl += `${hasJobPostsFilter ? '&' : '?'}keywords=${encodeURIComponent(keyword)}`;
    searchUrl += `&keywords=${encodeURIComponent(keyword)}`;

    const sortBy = selectedSortByOption
      ? selectedSortByOption.value === 'latest'
        ? 'date_posted'
        : selectedSortByOption.value === 'top'
          ? 'relevance'
          : ''
      : '';

    if (sortBy) {
      searchUrl += `&sortBy="${sortBy}"`;
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
        filters: {
          sortBy: selectedSortByOption ? selectedSortByOption.value : null,
          datePosted: selectedDatePostedOption ? selectedDatePostedOption.value : null,
          isEmail: emailFilter,
          commentsPosted: monthsFilter,
          commentsLimit: parseInt(minCommentsFilter, 10),
        },
      });
    }
  };
  const handleEmailFilterChange = (value) => {
    setEmailFilter(value);
    setShowAdvancedFilters(value);
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
        {/* <Filter
          selectedOptions={selectedContentTypeOptions}
          setSelectedOptions={setSelectedContentTypeOptions}
          options={contentTypeOptions}
          label="Content Type"
        /> */}

        <Filter
          selectedOptions={selectedSortByOption}
          setSelectedOptions={(selected) => setSelectedSortByOption(selected)}
          options={sortByOptions}
          label="Sort By"
        />

        <Filter
          selectedOptions={selectedDatePostedOption}
          setSelectedOptions={(selected) => setSelectedDatePostedOption(selected)}
          options={datePostedOptions}
          label="Date Posted"
        />
        <div className='page-container'>
          <label>Emails:</label>
          <div className='email-filter-container'>
            {emailOptions.map(option => (
              <div className='email-filter-inputs' key={option.value}>
                <input
                  type="radio"
                  id={`email${option.value}`}
                  name="emailFilter"
                  value={option.value}
                  checked={emailFilter === (option.value === 'Yes')}
                  onChange={() => handleEmailFilterChange(option.value === 'Yes')}
                />
                <label htmlFor={`email${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>

        </div>
        {showAdvancedFilters && (
          <div className='advanced-filters-container'>
            <div className='advanced-filter-container'>
              <label htmlFor="monthsFilter">Posted Under (in months):</label>
              <input
                type="number"
                id="monthsFilter"
                min={1}
                value={monthsFilter}
                onChange={(e) => setMonthsFilter(e.target.value)}
              />
            </div>

            <div className='advanced-filter-container'>
              <label htmlFor="minCommentsFilter">Minimum Comments:</label>
              <input
                type="number"
                id="minCommentsFilter"
                min={1}
                value={minCommentsFilter}
                onChange={(e) => setMinCommentsFilter(e.target.value)}
              />
            </div>
          </div>
        )}

        <button onClick={handleSearch}>Search keyword</button>
      </div>

      <div className="page-container">
        <label htmlFor="numPosts">Number of Posts:</label>
        <input
          type="number"
          id="numPosts"
          min={1}
          max={150}
          value={numPages}
          onChange={(e) => setNumPages(e.target.value)}
        />
        <button onClick={handleExtraction}>Extract Data</button>
      </div>
    </>
  );
};

export default SearchForm;
