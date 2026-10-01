import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import * as Icons from "heroicons-react";
import { Link } from "react-router-dom";
import SideBar from "../Common/SideBar/SideBar";
import "./Products.css";
import { Toaster } from "react-hot-toast";
import { FaBarcode } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import ReactPaginate from "react-paginate";
import {
  useDeleteProductMutation,
  useProductCountQuery,
  useProductPagenationQuery,
} from "../../services/productApi";
import Skeleton from "react-loading-skeleton";
import ProductBarCodeModal from "../Common/Modal/ProductBarCodeModal";
import ProductPriceModal from "../Common/Modal/ProductPriceModal";
import { signInUser } from "../Utility/Auth";
import AlertService from "../Utility/AlertService";
import { useSelector } from "react-redux";

const Products = () => {
  const [show, setShow] = useState(false);
  const [showP, setPShow] = useState(false);
  const auth = signInUser();
  const { aamarId } = auth;
  const lang = useSelector((state) => state.languageReducer);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePClose = () => setPShow(false);
  const handlePShow = () => setPShow(true);

  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");

  const [barcodeData, setBarCodeData] = useState({});

  // Price table pop up
  const [selectedProduct, setSelectedProduct] = useState("");

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // get totel product count
  const pageCountQuery = useProductCountQuery({ aamarId });


  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useProductPagenationQuery({
      page,
      size,
      aamarId,
      q,
    });

  // console.log("product data", data);
  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
  }, [pageCountQuery]);



  const [deleteProduct] = useDeleteProductMutation();
  const deleteHandler = async (id) => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Product?");
    if (confirmed) {
      const res = await deleteProduct(id);
      if (res) {
        console.log(res);
      } else {
        console.log("Delete Operation Canceled by Category!");
        return;
      }
    }
  };
  const handleSearch = (e) => {
    setQ(e.target.value);
    refetch();
  };
  const handlePageClick = (data) => {
    setPage(parseInt(data.selected));
    setPageNo(getPageNumber);
    refetch();
  };

  const handleDataLimit = (e) => {
    setSize(parseInt(e.target.value));
    setPageNo(getPageNumber);
    refetch();
  };

  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  };

  const handleBarCode = (code, mrp, name) => {
    setBarCodeData({
      code: code,
      mrp: mrp,
      name: name,
    });
    handleShow();
  };

  const handelPriceUpdateModal = (id) => {
    setSelectedProduct(id);
    handlePShow();
  };

  return (
    <div>
      <div className="container-fluid ">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.allProducts}></Header>
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
                      onKeyUp={(e) => handleSearch(e)}
                    />
                    {/* <input type="text" className="form-control" aria-label="Text input with dropdown button"> */}
                  </div>
                </form>
                {/* Pagenation */}

                <nav aria-label="Page navigation example">
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
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
                <span className="float-end">
                  {/* <button className='btn btn-dark me-2' onClick={handleShow}><Icons.UploadOutline size={22}></Icons.UploadOutline> Import Product</button> */}
                  <Link
                    className="btn btn-dark mb-2 float-end"
                    to="/product/add"
                  >
                    <Icons.PlusOutline size={22}></Icons.PlusOutline> {lang?.addProduct}
                  </Link>
                  
                  <Link
                    className="btn btn-dark mb-2 float-end me-2"
                    to="/product/import"
                  >
                    <Icons.PlusOutline size={22}></Icons.PlusOutline> {lang?.importProduct}
                  </Link>
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>BC </th>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Generic</th>
                    <th>Stock</th>
                    <th className="px-4">Code</th>
                    <th>TP</th>
                    <th>MRP</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading || isFetching ? (
                    Array(10)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index}>
                          <td>
                            <Skeleton width={25} height={25} />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton />
                          </td>
                          <td>
                            <Skeleton width={80} />
                          </td>
                          <td>
                            <Skeleton width={50} />
                          </td>
                          <td>
                            <Skeleton width={50} />
                          </td>
                          <td>
                            <Skeleton width={40} height={20} />
                          </td>
                        </tr>
                      ))
                  ) : data?.length > 0 ? (
                    data?.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <FaBarcode
                            onClick={() =>
                              handleBarCode(
                                product.article_code,
                                product?.priceList !== null &&
                                  product?.priceList?.length > 0
                                  ? product.priceList[0].mrp
                                  : 0,
                                product.name
                              )
                            }
                            size={25}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td className="text-wrap">{product?.group?.name}</td>
                        <td className="text-wrap">{product?.generic?.name}</td>
                        <td className=" pe-5">
                          {parseFloat(product?.inventory?.currentQty)
                            ? parseFloat(product?.inventory?.currentQty)
                            : 0}
                        </td>
                        <td className="px-4">{product.article_code}</td>
                        <td>{parseFloat(product.tp).toFixed(2)}</td>
                        <td>{parseFloat(product.mrp).toFixed(2)}</td>
                        <td>
                          <p>
                            <Link
                              to={`/product/ledger/${product._id}`}
                              target="_blank"
                            >
                              <Icons.DocumentTextOutline
                                className="icon-edit"
                                size={20}
                              />
                            </Link>
                            <Link
                              to={`/product/update/${product._id}`}
                              target="_blank"
                            >
                              <Icons.PencilAltOutline
                                className="icon-edit"
                                size={20}
                              ></Icons.PencilAltOutline>
                            </Link>

                            {product?.inventory?.currentQty === undefined && (
                              <Icons.TrashOutline
                                className="icon-trash"
                                size={20}
                                onClick={() => deleteHandler(product._id)}
                              ></Icons.TrashOutline>
                            )}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No Product Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {/* pagination */}
            {/* <ProductDataTable></ProductDataTable> */}
            {/* Pagenation */}

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
        </div>
      </div>
      <ProductBarCodeModal
        show={show}
        handleClose={handleClose}
        barcodeData={barcodeData}
      ></ProductBarCodeModal>
      {selectedProduct && (
        <ProductPriceModal
          show={showP}
          handleClose={handlePClose}
          animation={false}
          productId={selectedProduct}
        ></ProductPriceModal>
      )}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Products;
