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
