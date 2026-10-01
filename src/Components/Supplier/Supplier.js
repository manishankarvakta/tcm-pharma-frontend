import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../Common/Header/Header";
import "./Supplier.css";
// import { useForm } from "react-hook-form";
// import { notify } from "../Utility/Notify";
import { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import {
  useCountSupplierQuery,
  // useSuppliersQuery,
  // useSupplierQuery,
  // useAddSupplierMutation,
  // useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useSupplierPagenationQuery,
} from "../../services/supplierApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SideBar from "../Common/SideBar/SideBar";
import AlertService from "../Utility/AlertService";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";

const Supplier = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  //   const { data } = useSuppliersQuery();
  const [deleteSupplier] = useDeleteSupplierMutation();
  // get totel product count
  const pageCountQuery = useCountSupplierQuery({ aamarId });

  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const lang = useSelector((state) => state.languageReducer);



  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useSupplierPagenationQuery({
      page,
      size,
      aamarId,
      q,
    });


  console.log('Supplier Data::>', data);

  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
  }, [pageCountQuery]);

  const deleteHandler = async (id) => {
    try {
      const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Supplier?");
      if (confirmed) {

        const res = await deleteSupplier(id);
        if (res) {
          // TODO::
          // add error hendaler for delete error
          console.log(res);
        } else {
          console.log("Delete Operation Canceled by Supplier!");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
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

  const handleSearch = (e) => {
    setQ(e.target.value);
    refetch();
  };

  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  };

  let i = 1;

  // console.log('Supplier Data::>', data)

  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.supplier}></Header>
            <div className=" d-md-flex mt-3 justify-content-between align-items-center">
              <div className=" row">
                <form>
                  <div className="input-group  d-flex gap-2  ">
                    <select
                      className="form-select rounded "
                      onChange={(e) => handleDataLimit(e)}
                      style={{ width: "25%" }}
                    >
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                      <option value="250">250</option>
                    </select>
                    <input
                      className="form-control rounded flex-grow-1"
                      type="text"
                      placeholder="search"
                      onKeyUp={(e) => handleSearch(e)}
                      style={{ width: "60%" }}
                    />
                    {/* <input type="text" className="form-control" aria-label="Text input with dropdown button"> */}
                  </div>
                </form>
              </div>
              <div className="d-flex gap-2 justify-content-md-center align-items-center">
                <div className="">
                  <Link
                    to="/supplier/import"
                    className="float-end btn btn-dark my-3"
                  >
                    <Icons.PlusOutline size={22}></Icons.PlusOutline> {lang?.importSupplier}
                  </Link>
                </div>
                <div className="">
                  <Link
                    to="/create-supplier"
                    className="float-end btn btn-dark my-3"
                  >
                    {lang?.createSupplier}
                  </Link>
                </div>
              </div>
            </div>
            <div>
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
            <div className="row">
              {/* <div className="col-md-12">
                <Link
                  to="/create-supplier"
                  className="float-end btn btn-dark my-3"
                >
                  Create Supplier
                </Link>
              </div> */}
              <div className="col-md-12">
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        {/* <th scope="col">#</th> */}
                        <th scope="col">Code</th>
                        <th scope="col">Supplier</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Name</th>
                        {/* <th scope="col">Address</th> */}
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading || isFetching ? (
                        Array(10)
                          .fill(0)
                          .map((_, index) => (
                            <tr key={index}>
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
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton width={40} height={20} />
                              </td>
                            </tr>
                          ))
                      ) : data?.length > 0 ? (
                        data
                          ?.slice()
                          .sort((a, b) => a.code - b.code)
                          .map((supplier) => (
                            <tr key={supplier?._id}>
                              {/* <th scope="row">{i++}</th> */}
                              <th scope="row">{supplier?.code}</th>
                              <td>{supplier?.company}</td>
                              <td>
                                {supplier?.email ? supplier?.email : "No Email"}
                              </td>
                              <td>
                                {supplier?.phone ? supplier?.phone : "No Phone"}
                              </td>
                              <td>
                                {supplier?.name ? supplier?.name : "No Name"}
                              </td>
                              {/* <td>{supplier?.address}</td> */}
                              <td className="d-flex gap-3">
                                <Link to={`/supplier-ledger/${supplier._id}`}>
                                  <Icons.DocumentTextOutline
                                    className="icon-edit"
                                    size={20}
                                  ></Icons.DocumentTextOutline>
                                </Link>
                                <Link to={`/update-supplier/${supplier._id}`}>
                                  <Icons.PencilAltOutline
                                    className="icon-edit"
                                    size={20}
                                  ></Icons.PencilAltOutline>
                                </Link>
                                {/* <Icons.TrashOutline
                                  className="icon-trash"
                                  onClick={() => deleteHandler(supplier._id)}
                                  size={20}
                                ></Icons.TrashOutline> */}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">No Supplier Found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Supplier;
