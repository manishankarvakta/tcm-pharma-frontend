import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';


const PrintTest = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  

  return (
    <>
    <div>
      <button onClick={handlePrint}>Print this out!</button>
    </div>
    <div ref={componentRef}>
        <p>print</p>
    </div>
    </>
  );
}
export default PrintTest;