import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Toast = () => {
    const i = [1,2,3,4,5,6,7];
    const notify = (note) => toast(`Here is your toast. ${note}`);
    return (
        <div>
            <h1>Toast's are here</h1>
            {/* <button onClick={notify} className="btn btn-dark">Toast Me</button>
            {
                i.map(ie=> notify(ie))
            } */}
            <Toaster 
                position="bottom-right"            
            />
        </div>
    );
};

export default Toast;