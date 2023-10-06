import React from 'react';

const DownloadLink = ({ data }) => {
  const csvContent = data
    .map((item) => `${item.profileUrl},${item.summary}`)
    .join('\n');

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.csv';
    a.click();
    URL.revokeObjectURL(url);

    /*eslint-disable no-undef */
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabID = tabs[0].id;
      chrome.storage.local.get(['prevUrl'], function (result) {
        const prevUrl = JSON.stringify(result.prevUrl);
        // After storing the previous URL, navigate to the search URL
        chrome.scripting.executeScript({
          target: { tabId: activeTabID },
          function: (url) => {
            url = url.replace(/"/g, '');
            window.location.href = url;
          },
          args: [prevUrl],
        });
      });
    });
  };

  return (
    <div>
      <a
        id="downloadLink"
        onClick={handleDownload}
        style={{ display: 'block' }}
      >
        Download CSV
      </a>
    </div>
  );
};

export default DownloadLink;
