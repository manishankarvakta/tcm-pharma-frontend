import React from 'react';

const PrintReceiptTest = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}>My cool content here!</div>
  );
});
export default PrintReceiptTest;
