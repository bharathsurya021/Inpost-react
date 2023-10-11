let results = [];
let extractionCount = 1;
const performExtraction = (max) => {
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
        performExtraction(max);
      }, 2000);
    } else if (extractionCount === max) {
      chrome.runtime.sendMessage({
        extractionComplete: true,
        data: results,
      });
      return results;
    }
  }, 2000);
  return results;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startExtraction') {
    console.log('Received startExtraction message:', message);
    const { max, tabId } = message;

    performExtraction(max);
  }
});
