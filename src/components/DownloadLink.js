import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DownloadLink = ({ data }) => {

  const generateUuidForData = (dataArray) => {
    return {
      collection: "linkedin_post_test",
      upsertId: "postId",
      postId: uuidv4(),
      scraped_data: dataArray,
    };
  };
  const csvContent = data
    .map((item) => `${item.profileName},${item.profileUrl},${item.description},${item.posted}`)
    .join('\n');

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    if (data && data?.length > 0) {
      const newData = generateUuidForData(data);
      const sendMessageToBackground = () => {
        // eslint-disable-next-line
        chrome.runtime.sendMessage({
          action: 'sendDataToApi',
          data: [newData],
        });
      };

      sendMessageToBackground();
    }

  }, [data]);

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
