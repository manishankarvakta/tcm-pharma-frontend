import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../Common/Header/Header';
import LoadingModal from '../Common/Modal/LoadingModal';
import SideBar from '../Common/SideBar/SideBar';

const ReceiveTPN = () => {
    const navigate = useNavigate()
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
    const [loader, setLoader] = useState(false)
    const handleLoaderClose = () => setLoader(false);
    return (
        <div>
            <div className="container-fluid">
                <LoadingModal
                    title={"Please Wait"}
                    onShow={loader}
                    handleClose={handleLoaderClose}
                ></LoadingModal>
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="Product In via TPN"></Header>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="col-md-6">




                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Toaster position="bottom-right" />
        </div >
    );
};

export default ReceiveTPN;