chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'performSearch') {
    const { searchKeyword } = message;
    const searchUrl = `https://www.linkedin.com/search/results/all/?keywords=%23${searchKeyword}`;

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
  }
});
