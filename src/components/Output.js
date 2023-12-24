import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Output = ({ data }) => {
  const generateUuidForData = (dataArray) => {
    return dataArray.map((item) => ({
      ...item,
      collection: "linkedin_post_test",
      upsertId: "postId",
      postId: uuidv4(),
    }));
  };

  useEffect(() => {
    if (data && data?.length > 0) {
      const newData = generateUuidForData(data);
      const sendMessageToBackground = () => {
        // eslint-disable-next-line
        chrome.runtime.sendMessage({
          action: 'sendDataToApi',
          data: newData,
        });
      };

      sendMessageToBackground();
    }

  }, [data]);


  return (
    <div>
      <textarea
        id="output"
        rows="10"
        cols="60"
        value={data.length === 0 ? 'No data' : JSON.stringify(data, null, 2)}
        readOnly
      ></textarea>
    </div>
  );
};

export default Output;
