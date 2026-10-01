import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Header from '../../../Common/Header/Header';
import SideBar from '../../../Common/SideBar/SideBar';
import OrderCancel from '../../components/OrderCancel';
import OrderComplete from '../../components/OrderComplete';
import OrderInDeliver from '../../components/OrderInDeliver';
import OrderInProcess from '../../components/OrderInProcess';
import OrderReceived from '../../components/OrderReceived';

const Ecom = () => {
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="Ecom Sale"></Header>
                        <Tabs
                            defaultActiveKey="received-order"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="received-order" title="New Orders">
                                <OrderReceived></OrderReceived>
                            </Tab>
                            <Tab eventKey="order-process" title="Orders In Process">
                                <OrderInProcess></OrderInProcess>
                            </Tab>
                            {/* <Tab eventKey="deliver" title="Deliver" >
                                <OrderInDeliver></OrderInDeliver>
                            </Tab> */}
                            <Tab eventKey="complete-process" title="Complete" >
                                <OrderComplete></OrderComplete>
                            </Tab>
                            <Tab eventKey="cancel-orders" title="Cancel Orders">
                                <OrderCancel></OrderCancel>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Ecom;