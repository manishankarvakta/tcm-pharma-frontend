import React, { useEffect, useState } from 'react';
import LoadingModal from '../Common/Modal/LoadingModal';
import SideBar from '../Common/SideBar/SideBar';
import Header from '../Common/Header/Header';
import ReactPaginate from 'react-paginate';
import { compareAsc, format } from "date-fns";
import { useProductCountQuery, useProductLedgerDetailsQuery, useProductLedgerExportQuery, useProductLedgerPagenationQuery } from '../../services/productApi';
import DatePicker from "react-datepicker";
import { Button, Table } from 'react-bootstrap';
import { useInventoriesCountQuery } from '../../services/inventoryApi';
import ExportStockCalculation from '../Common/Modal/ExportStockCalculation';
import * as Icons from "heroicons-react";
import ExportStockCalculationSummary from '../Common/Modal/ExportStockCalculationSummary';
import ProductDetailsLedger from '../Common/Modal/ProductDetailsLedger';
import { notify } from '../Utility/Notify';



const ProductLedger = () => {
    const [loader, setLoader] = useState(false);
    const handleLoaderClose = () => setLoader(false);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(100);
    const [q, setQ] = useState("");

    const [pageCount, setPageCount] = useState(0);
    const [pageNo, setPageNo] = useState();
    const [id, setId] = useState();

    const pageCountQuery = useInventoriesCountQuery();
    console.log('Inventory count ', pageCount)

    useEffect(() => {
        const { data } = pageCountQuery;
        setPageCount(data);
    }, [pageCountQuery]);

    const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
    const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));

    const [onExportShow, setOnExportShow] = useState(false);
    const handleExportClose = () => setOnExportShow(false);

    const [onDetailsShow, setOnDetailsShow] = useState(false);
    const handleDetailsClose = () => setOnDetailsShow(false);

    const [onExportSummaryShow, setOnExportSummarytShow] = useState(false);
    const handleExportSummaryClose = () => setOnExportSummarytShow(false);

    const { data, error, isLoading, isFetching, isSuccess, refetch } =
        useProductLedgerPagenationQuery({
            startDate,
            endDate,
            page,
            size,
            q,
        });
    const { data: exportP, isSuccess: eIsExport, refetch: eRefetch } = useProductLedgerExportQuery({
        startDate,
        endDate,
    });
    const { data: pDetails, error: perror, isLoading: pisLoading, isFetching: pisFetching, isSuccess: pisSuccess, refetch: prefetch } =
        useProductLedgerDetailsQuery({
            id,
            startDate,
            endDate,

        });

    useEffect(() => {
        data ? setLoader(false) : setLoader(true);
    }, [data]);

    // console.log("ledger", data)

    useEffect(() => {
        refetch()
    }, [startDate, endDate, page, size, q]);

    useEffect(() => {
        prefetch()
    }, [startDate, endDate, id, pisSuccess]);

    useEffect(() => {
        eRefetch()
        if (exportP?.message) {
            notify("Report Generation SuccessFull")
        }
    }, [exportP, startDate, endDate, eIsExport]);

    // console.log("exportP", exportP)

    const handleDataLimit = (e) => {
        setSize(parseInt(e.target.value));
        setPageNo(getPageNumber);
        refetch();
    }
    const handleSearch = (e) => {
        setQ(e.target.value);
        refetch();
    }
    const handlePageClick = (data) => {
        setPage(parseInt(data.selected));
        setPageNo(getPageNumber);
        refetch();
    };
    const getPageNumber = () => {
        const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
    };
    const handelExportModal = () => {
        // console.log("hello");
        setOnExportShow(true);
    };
    const handelExportSummaryModal = () => {
        // console.log("hello");
        setOnExportSummarytShow(true);
    };

    const handleProductDetailsView = (id) => {
        // console.log("id", id);
        setOnDetailsShow(true)
        setId(id)
        prefetch()

    };
    return (
        <div>
            <div className="container-fluid ">
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
                        <Header title="All Products"></Header>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <form>
                                    <div className="input-group mb-3">
                                        <select
                                            className="form-select"
                                            onChange={(e) => handleDataLimit(e)}
                                        >
                                            <option value="100">100</option>
                                            <option value="150">150</option>
                                            <option value="200">200</option>
                                            <option value="250">250</option>
                                        </select>
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder='Search'
                                            onKeyUp={(e) => handleSearch(e)}
                                        />
                                        {/* <input type="text" className="form-control" aria-label="Text input with dropdown button"> */}
                                    </div>
                                </form>
                                <nav aria-label="Page navigation example">
                                    <ReactPaginate
                                        previousLabel={"<<"}
                                        nextLabel={">>"}
                                        breakLabel={"..."}
                                        //dynamic page count
                                        // page count total product / size
                                        pageCount={Math.ceil(parseInt(pageCount) / parseInt(size))}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={6}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination pt-0 pb-2"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                    ></ReactPaginate>
                                </nav>
                            </div>
                            <div className="col-md-6">

                                {/* Sort date range */}
                                <div className="date-picker d-flex mt-2 mb-2 align-items-center">
                                    <b>Start:</b>
                                    <DatePicker
                                        selected={new Date(startDate)}
                                        className="form-control me-2"
                                        onChange={(date) =>
                                            setStartDate(format(new Date(date), "MM-dd-yyyy"))
                                        }
                                    />
                                    <span width="10px"></span>
                                    <b>End:</b>
                                    <DatePicker
                                        selected={new Date(endDate)}
                                        className="form-control"
                                        onChange={(date) =>
                                            setEndDate(format(new Date(date), "MM-dd-yyyy"))
                                        }
                                    />
                                </div>

                            </div>
                            <div className="col-md-4">
                                <span className="float-end">
                                    <Button
                                        className="btn btn-dark mb-2 float-start me-2"
                                        onClick={handelExportModal}
                                    >
                                        <Icons.PlusOutline size={22}></Icons.PlusOutline> Export Details
                                    </Button>
                                </span>
                            </div>

                            <div className="col-md-4">
                                <span className="float-end">
                                    <Button
                                        className="btn btn-dark mb-2 float-start me-2"
                                        onClick={handelExportSummaryModal}
                                    >
                                        <Icons.PlusOutline size={22}></Icons.PlusOutline> Export Summary
                                    </Button>
                                </span>
                            </div>
                        </div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Article Code</th>
                                    <th>Name</th>
                                    <th>Group</th>
                                    <th>Tp</th>
                                    <th>MRP</th>
                                    <th>Opn</th>
                                    <th>Grn</th>
                                    {/* <th>Grn Total</th> */}
                                    <th>Sale</th>
                                    <th>SReturn</th>
                                    {/* <th>Sale Total</th> */}
                                    <th>RTV</th>
                                    {/* <th>RTV Total</th> */}
                                    <th>Dmg</th>
                                    {/* <th>Damage Total</th> */}
                                    <th>TPN</th>
                                    <th>Closing</th>
                                    <th>Stock Value</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length > 0 ? (
                                    data?.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                {product?.article_code}
                                            </td>
                                            <td>{product.name}</td>
                                            <td className="text-wrap">{product?.group?.name}</td>
                                            <td>{product?.tp}</td>
                                            <td>{product?.mrp}</td>
                                            <td>{product?.grnPQty + product?.saleRPQty - product?.salePQty - product?.damagePQty - product?.rtvPQty - product?.tpnPQty}</td>
                                            <td>{product?.grnQty}</td>
                                            <td>{product?.saleQty}</td>
                                            <td>{product?.saleRQty}</td>
                                            <td>{product?.rtvQty}</td>
                                            <td>{product?.damageQty}</td>
                                            <td>{product?.tpnQty}</td>
                                            <td>{(product?.grnPQty + product?.saleRPQty - product?.salePQty - product?.damagePQty - product?.rtvPQty - product?.tpnPQty
                                            ) + (product?.grnQty + product?.saleRQty - product?.saleQty - product?.damageQty - product?.rtvQty - product?.tpnQty)}</td>
                                            <td>{(parseFloat(product?.tp) * ((product?.grnPQty + product?.saleRPQty - product?.salePQty - product?.damagePQty - product?.rtvPQty - product?.tpnPQty
                                            ) + (product?.grnQty + product?.saleRQty - product?.saleQty - product?.damageQty - product?.rtvQty - product?.tpnQty))).toFixed(2)}</td>
                                            <td>
                                                <Icons.EyeOutline
                                                    onClick={() => handleProductDetailsView(product._id)}
                                                    className="icon-eye me-1"
                                                    size={20}
                                                ></Icons.EyeOutline></td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr colSpan={9}>No Product Found</tr>
                                )}
                            </tbody>

                        </Table>
                    </div>
                </div>

            </div>
            <ExportStockCalculation
                onShow={onExportShow}
                handleClose={handleExportClose}
                start={startDate}
                end={endDate}
            >
            </ExportStockCalculation>
            <ExportStockCalculationSummary
                onShow={onExportSummaryShow}
                handleClose={handleExportSummaryClose}
                start={startDate}
                end={endDate}
            >
            </ExportStockCalculationSummary>
            <ProductDetailsLedger
                onShow={onDetailsShow}
                handleClose={handleDetailsClose}
                pDetails={pDetails}
                start={startDate}
                end={endDate}
            >
            </ProductDetailsLedger>
        </div>
    );
};

export default ProductLedger;