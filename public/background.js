async function sendDataToApi(data) {
  try {
    const response = await fetch('http://datascience.jobrobo.io:5000/insert_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('API request sent successfully!', response.status, responseData);
  } catch (error) {
    console.error('Error sending API request:', error);
  }
}

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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, message);
    });
  } else if (message.action === 'sendDataToApi') {
    // Call the API function with the data
    const { data } = message;
    sendDataToApi(data);
  }
});
