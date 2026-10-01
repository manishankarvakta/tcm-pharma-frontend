import React, { useRef, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DamageNewProductSelect from '../Common/CustomSelect/DamageNewProductSelect';
import WareHouseDW from '../Common/CustomSelect/WareHouseDW';
import Header from '../Common/Header/Header';
import LoadingModal from '../Common/Modal/LoadingModal';
import SideBar from '../Common/SideBar/SideBar';
import * as Icons from "heroicons-react";
import TpnProductImporter from '../Common/CsvImporter/TpnProductImporter';
import TpnProductSearch from '../Common/CustomSelect/TpnProductSearch';
import { signInUser } from '../Utility/Auth';
import axios from 'axios';
import { notify } from '../Utility/Notify';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, tpnWarehouseForm, tpnWarehouseTo } from '../../features/tpnSlice';

const CreateTpn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = signInUser();
    const tpnData = useSelector((state) => state.tpnReducer);
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
    const [loader, setLoader] = useState(false)
    const handleLoaderClose = () => setLoader(false);
    const [csvData, setCsvData] = useState([]);
    const [tpnProducts, setTpnProducts] = useState([]);

    const tpnProductsRef = useRef(null);

    // console.log(tpnData)
    dispatch(selectUser(user.id));
    // const handleOnchangeWareHouseFrom = (e) => {
    //     console.log(e)
    //     dispatch(tpnWarehouseForm(e.option))
    // }
    // const handleOnchangeWareHouseTo = (e) => {
    //     console.log(e)
    //     dispatch(tpnWarehouseTo(e.option))
    // }
    // const addToList = async (data) => {
    //     console.log(data)
    //     if (data) {
    //         console.log("add to list:", data);
    //         await tpnProductsRef.current.blur();
    //         let listData = tpnData.products;

    //         let newProduct = {};
    //         // unique check
    //         const idExist = listData.find((pro) => pro.id === data._id);
    //         if (idExist) {
    //             notify("Product Already in List", "error");
    //             // console.log()
    //         } else {
    //             notify("Product is Added", "success");

    //             newProduct = {
    //                 id: data?._id,
    //                 name: data?.name,
    //                 article_code: data?.article_code,
    //                 qty: 1,
    //                 order: listData?.length + 1,
    //                 priceId: data?.priceList[0]._id,
    //                 tp: data?.priceList[0].tp,
    //                 reason: "",
    //             };
    //             listData = [...listData, newProduct];
    //         }

    //         // console.log("upcoming damage:", newProduct);
    //         // console.log("Updated damage:", listData);
    //         setTpnProducts(listData);
    //         dispatch(tpnProducts(listData));
    //     } else {
    //         return false;
    //     }
    // }

    // const handleImportButton = () => {
    //     let importProducts = [];
    //     let i = 1;
    //     console.log(csvData);
    //     // setOnShow(true);
    //     if (csvData?.length > 0) {
    //         csvData.map(async (pro) => {
    //             // console.log(pro);
    //             try {
    //                 const details = await axios(
    //                     `${BASE_URL}/product/pro-details/${pro.article_code}`
    //                 );
    //                 // console.log(details);
    //                 if (details.status === 200) {
    //                     const data = details.data;
    //                     importProducts = [
    //                         ...importProducts,
    //                         {
    //                             id: data?._id,
    //                             article_code: data?.article_code,
    //                             priceId: data?.priceList[0]?._id,
    //                             tp: data?.priceList[0]?.tp > 0 ? data?.priceList[0]?.tp : 0,
    //                             name: data?.name,
    //                             qty: pro.qty,
    //                             tax: 0,
    //                             discount: 0,
    //                             order: i++,
    //                         },
    //                     ];
    //                     setTpnProducts(importProducts)
    //                 }
    //             } catch (err) {
    //                 notify(err, "error");
    //             } finally {
    //                 console.log(importProducts);
    //                 //   dispatch(selectProducts(importProducts));
    //                 if (importProducts?.length === csvData?.length) {
    //                     // setOnShow(false);
    //                 }
    //             }
    //         });
    //     } else {
    //         //   setOnShow(false);
    //         notify("There is no products to import", "error");
    //     }
    // };
    return (
        <div>
            <div className="container-fluid">
                {/* <LoadingModal
                    title={"Please Wait"}
                    onShow={loader}
                    handleClose={handleLoaderClose}
                ></LoadingModal> */}
                <div className="row">
                    <div className="col-md-2">
                        <SideBar></SideBar>
                    </div>
                    <div className="col-md-10">
                        <Header title="Product Out via TPN"></Header>
                        {/* <Form className="pt-3">
                            <div className="row">
                                <div className="col-6">
                                    <Form.Group className="" controlId="warehouse">
                                        <Form.Label>Warehouse From</Form.Label>
                                        <WareHouseDW
                                            //   {...setValue("warehouse", `${wh}`)}
                                            id="warehouse"
                                            name="warehouse"
                                            handleOnChange={handleOnchangeWareHouseFrom}
                                        //   wh={wh !== "" ? wh : 0}
                                        // {...register("warehouse")}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="">
                                        <Form.Label>Warehouse To</Form.Label>
                                        <WareHouseDW
                                            //   {...setValue("warehouse", `${wh}`)}
                                            id="warehouse"
                                            name="warehouse"
                                            handleOnChange={handleOnchangeWareHouseTo}
                                        //   wh={wh !== "" ? wh : 0}
                                        // {...register("warehouse")}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-6 my-3">
                                    <Form.Label>Products</Form.Label>
                                    <TpnProductSearch
                                        className="searchProduct"
                                        // getValue={getValue}
                                        addToList={addToList}
                                        tpnProductsRef={tpnProductsRef}
                                    ></TpnProductSearch>
                                </div>
                                <div className="col-6 my-3 ">
                                    <TpnProductImporter
                                        setCsvData={setCsvData}
                                        handleImportButton={handleImportButton}
                                        title=""
                                    />
                                </div>
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">Transported Products List</div>
                                        <div className="card-body">
                                            <Table className="mt-3 ">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Code</th>
                                                        <th>Name</th>
                                                        {/* <th>Tax</th> */}
                        {/* <th>Quantity</th>
                                                        <th>TP</th>
                                                        {/* <th>Tax</th> */}
                        {/* <th>Total</th> */}
                        {/* <th>Reason</th> */}
                        {/* </tr> */}
                        {/* </thead> */}

                        {/* <tbody> */}
                        {/* <DamageProducts
                            damageProducts={damageData?.products}
                            i={i}
                            // removeQuantities={removeQuantities}
                            // addQuantities={addQuantities}
                            handleOnChangePrice={handleOnChangePrice}
                            handleCustomReason={handleCustomReason}
                            handleCustomQty={handleCustomQty}
                            removeFromCart={removeFromCart}
                          ></DamageProducts> */}
                        {/* </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 my-2">
                                    <Form.Group className="" controlId="formBasicEmail">
                                        <Form.Label>Note</Form.Label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            placeholder="Note"
                                        //   onChange={(e) => dispatch(selectNote(e.target.value))}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <Table className="bordered striped ">
                                <thead>
                                    <tr>
                                        <th>Total Items:</th>
                                        <th>Total Cost: </th>
                                    </tr>
                                </thead>
                            </Table>
                            <Button
                                variant="dark"
                                // onClick={handleDamageSubmit}
                                className="float-end my-2"
                                type="button"
                            >
                                <Icons.SaveOutline size={20} /> Submit
                            </Button>
                            <Button
                                variant="dark"
                                className="float-end my-2 mx-2"
                                type="button"
                            // onClick={emptyDamage}
                            >
                                Reset Cart
                            </Button>
                        </Form> */}
                    </div>
                </div>
            </div>

            <Toaster position="bottom-right" />
        </div >
    );
};

export default CreateTpn;