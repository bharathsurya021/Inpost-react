import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DownloadLink = ({ data }) => {
  const generateUuidForData = (dataArray, collection, upsertId) => {
    return {
      collection,
      upsertId,
      [upsertId]: uuidv4(),
      scraped_data: dataArray,
    };
  };


  const handleDownload = () => {
    const combinedData = [...generateUuidForData(data.posts, "linkedin_post_test", "postId"), ...generateUuidForData(data.authors, "linkedin_post_author_test", "authorId")];

    const csvContent = combinedData
      .map((item) => {
        const { scraped_data } = item;
        return `${scraped_data.profileName || ''},${scraped_data.profileUrl || ''},${scraped_data.description || ''},${scraped_data.posted || ''}`;
      })
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    if (data && data.posts && data?.posts?.length > 0) {
      const postsData = generateUuidForData(data.posts, "linkedin_post_test", "postId");

      const sendMessageToBackground = () => {
        // eslint-disable-next-line
        chrome.runtime.sendMessage({
          action: 'sendDataToApi',
          data: [postsData],
        });
      };

      sendMessageToBackground();
    }
  }, [data.posts]);

  useEffect(() => {
    if (data && data?.authors && data?.authors?.length > 0) {
      const authorsData = generateUuidForData(data.authors, "linkedin_post_author_test", "authorId");

      const sendMessageToBackground = () => {
        // eslint-disable-next-line
        chrome.runtime.sendMessage({
          action: 'sendDataToApi',
          data: [authorsData],
        });
      };

      sendMessageToBackground();
    }
  }, [data.authors]);

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
