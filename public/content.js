let postResults = [];
let authorResults = [];
let currentElementCount = 0;
const performExtraction = async (max, filters) => {
  const scrollAndExtract = async () => {
    const height = document.body.scrollHeight;
    window.scroll(0, height);
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const postCards = document.querySelectorAll(
      'ul.reusable-search__entity-result-list li div.artdeco-card div.feed-shared-update-v2'
    );

    const newElementCount = postCards.length;

    if (newElementCount > currentElementCount) {
      for (let i = currentElementCount; currentElementCount < max && i < newElementCount; i++) {
        let hashtagsArray = [];
        let hyperLinksArray = [];

        const card = postCards[i];
        const actorContainers = card?.querySelector('div.update-components-actor__container');
        const anchorLink = actorContainers?.querySelector('a.app-aware-link');
        const profileUrl = anchorLink?.getAttribute('href');
        const profileName = anchorLink?.getAttribute('aria-label');
        const profileRoleElement = actorContainers?.querySelector('.update-components-actor__description span');
        const profileRole = profileRoleElement?.innerText.trim() || profileRoleElement?.textContent.trim();
        const commentsCountElement = card.querySelector('.social-details-social-counts__comments .social-details-social-counts__count-value');
        const commentsCountText = commentsCountElement?.innerText || commentsCountElement?.textContent;
        const commentsCount = parseInt(commentsCountText?.trim()) || 0;
        const postContentElement = card?.querySelector('.feed-shared-update-v2__description .update-components-text');
        const postContent = postContentElement ? postContentElement?.innerText.replace(/\s+/g, ' ').trim() : "";
        const postDateElement = card?.querySelector('.update-components-actor__sub-description-link .update-components-actor__sub-description .update-components-text-view span span');
        const postDate = postDateElement?.innerText.trim();
        const hashtags = postContent?.match(/#[^\s#]+/g);

        // Add hashtags to the array if they exist
        if (hashtags) {
          hashtagsArray.push(...hashtags);
        }

        const hashtagHyperlinks = card.querySelectorAll('.update-components-text a');

        hashtagHyperlinks.forEach(hashtag => {
          const hyperLinkText = hashtag.textContent.trim();
          const hyperLink = hashtag.getAttribute('href');

          // Check if it's a hyperlink
          if (hyperLink) {
            hyperLinksArray.push({
              text: hyperLinkText,
              link: hyperLink
            });
          }
        });

        const post = {
          authorTitle: profileRole,
          selectedFilters: filters,
          hashtags: hashtagsArray,
          hyperLinks: hyperLinksArray.length ? hyperLinksArray : "no links",
          description: postContent,
          posted: postDate,
        };

        const author = {
          authorName: profileName,
          authorUrl: profileUrl,
          authorTitle: profileRole,
          total_comments: commentsCount,
        };

        postResults.push(post);
        authorResults.push(author);
        currentElementCount++;
      }

      if (currentElementCount < max) {
        await scrollAndExtract();
      } else {
        chrome.runtime.sendMessage({
          extractionComplete: true,
          data: { posts: postResults, authors: authorResults },
        });
      }
    }
  };
  // Initial call to start the extraction
  await scrollAndExtract();


};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startExtraction') {
    console.log('Received startExtraction message:', message);
    const { max, tabId, filters } = message;
    performExtraction(max, filters);
  }
});
