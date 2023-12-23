chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'performSearch') {
    const { searchKeyword } = message;
    const searchUrl = `https://www.linkedin.com/search/results/content/?keywords=%23${searchKeyword}`;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.storage.local.set({ prevUrl: currentTab.url });
      chrome.tabs.update(currentTab.id, { url: searchUrl });
    });
  } else if (message.action === 'startExtraction') {
    // Relay the "startExtraction" message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, message);
    });
  } else if (message.action === 'sendDataToApi') {
    // Handle the new message type to perform API call
    const { data } = message;

    // Perform API call using fetch directly in the background script
    fetch('http://datascience.jobrobo.io:5000/insert_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
      mode: 'no-cors'
    })
      .then((res) => {
        console.log('API request sent successfully!', res?.message);
      })
      .catch((error) => {
        console.error('Error sending API request:', error);
      });
  }
});
