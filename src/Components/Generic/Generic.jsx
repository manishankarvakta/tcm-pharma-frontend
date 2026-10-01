import axios from "../../services/apiClient";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  useAddGenericMutation,
  useDeleteGenericMutation,
  useGenericCountQuery,
  useGenericPaginationQuery,
} from "../../services/genericApi";
import Header from "../Common/Header/Header";
import GenericEditModal from "../Common/Modal/GenericEditModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { apiUniqueErrHandle } from "../Utility/Utility";
import { useSelector } from "react-redux";
import PackageModal from "../Common/Modal/PackageModal";
import AlertService from "../Utility/AlertService";

const Generic = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  // const {refetch: dataRefetch } = useGenericsQuery();
  const lang = useSelector((state) => state.languageReducer);

  let navigate = useNavigate();



  const { register, handleSubmit, reset } = useForm({});
  const [addGeneric, { isLoading: isAdding }] = useAddGenericMutation();
  const [deleteGeneric] = useDeleteGenericMutation();
  const [generic, setGeneric] = useState({});
  const [onShow, setOnShow] = useState(false);
  const handleOnShowClose = () => setOnShow(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const [genericCode, setGenericCode] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useGenericPaginationQuery({
      page,
      size,
      aamarId,
      q,
    });

  let i = 1;
  console.log("data", data);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // CHECK UNIQUE
  const checkCodeInAPI = async (code) => {
    try {
      const response = await axios.get(`${BASE_URL}/generic/unique/${code}/${aamarId}`, {
        params: { code },
      });
      console.log(response.data.exists);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking code in API:", error);
      return false; // Default to not found in case of an error
    }
  };

  const generateUniqueSixDigitCode = async () => {
    let numericCode;
    do {
      const uuid = uuidv4();
      numericCode = parseInt(uuid.split("-")[0], 16) % 1000000;
      numericCode = String(numericCode).padStart(6, "0");
    } while (await checkCodeInAPI(numericCode));

    setGenericCode(numericCode);
    return numericCode;
  };

  useEffect(() => {
    generateUniqueSixDigitCode();
  }, []);



  const pageCountQuery = useGenericCountQuery({ aamarId });
  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
    console.log("data", data);
  }, [pageCountQuery]);

  const onSubmit = async (data) => {
    // setLoader(true);
    try {
      const generatedCode = await generateUniqueSixDigitCode();
      const response = await addGeneric({
        ...data,
        code: generatedCode,
        aamarId,
      });
      if (response?.error) {
        apiUniqueErrHandle(response);
      } else {
        reset({
          name: "",
          details: "",
          status: "active",
          aamarId: auth?.aamarId,
        });
        console.log(response?.data?.message);
        navigate("/generic");
      }
    } catch (err) {
      console.log("Error in submission:", err);
    } finally {
      refetch();
    }
  };

  const deleteHandler = async (id) => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Generic?");
    if (confirmed) {
      const res = await deleteGeneric(id);
      if (res) {
        // TODO::
        // add error handler for delete error
        console.log(res);
      } else {
        console.log("Delete Operation Canceled for Generic!");
        return;
      }
    }
  };
  const handleReset = () => {
    reset({
      name: "",
      code: "",
      details: "",
      status: "active",
    });
  };
  const handleEditGeneric = (generic) => {
    setGeneric(generic);
    setOnShow(true);
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
  const handlePageClick = (data) => {
    console.log(data);
    setPage(parseInt(data.selected));
    setPageNo(getPageNumber);
    refetch();
  };
  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  };
  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.generic}></Header>
            <div className="row">
              <div className="col-md-12 ">
                <span className="float-end">
                  <Link
                    className="btn btn-dark mb-2 float-end me-2 mt-2"
                    to="/generic/import"
                  >
                    <Icons.PlusOutline size={22}></Icons.PlusOutline> {lang?.importGeneric}

                  </Link>
                </span>
              </div>
              <div className="col-md-4 ">
                <div className="sticky-md-top ">
                  <div className="card mt-2">
                    <div className="card-header">
                      <h5 className="card-title">
                        {data?._id ? "Update" : "Add"} Generic
                      </h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mb-3">
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputCustomer">Generic Name</label>
                            <input
                              {...register("name", { required: true })}
                              type="text"
                              className="form-control"
                              id="inputCustomer"
                              aria-describedby="emailHelp"
                              placeholder="Generic Name"
                            />
                          </div>

                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputMC"> Code</label>
                            <input
                              {...register("code")}
                              type="text"
                              className="form-control"
                              id="genericCode"
                              value={genericCode}
                              readOnly
                            />
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputMC"> Details</label>
                            <textarea
                              {...register("details")}
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="details"
                            />
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="MCId">Status</label>
                            <select
                              {...register("status")}
                              className="form-control"
                              id="address"
                              placeholder="Address"
                            >
                              <option value="active">active</option>
                              <option value="inactive">inactive</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="reset"
                          onClick={handleReset}
                          className="btn btn-outline-dark col-4 col-md-4"
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-dark col-8 col-md-8"
                          disabled={isAdding}
                        >
                          {isAdding ? (
                            <Spinner animation="border" size="sm" className="me-2" />
                          ) : (
                            <>
                              <Icons.Plus> </Icons.Plus>
                            </>
                          )}
                          Generic
                        </button>
                      </form>
                    </div>
                  </div>
                  {/* <CsvImporter setCsvData={setCsvData} handleImportButton={handleImportButton} title="Customer"></CsvImporter> */}
                </div>
              </div>
              <div className="col-md-8">
                <form>
                  <div className="input-group mb-3 mt-2">
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
                      placeholder="search"
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

                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Code</th>
                      <th scope="col">Generic Name</th>
                      <th scope="col">Details</th>
                      <th scope="col">Status</th>
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
                     ) : Array.isArray(data) ? (
                       data.map((generic, index) => (
                         <tr key={generic._id}>
                           <th scope="row">{index + 1}</th>
                           <td>{generic.code}</td>
                           <td>{generic.name}</td>
                           <td>{generic.details}</td>
                           <td>{generic.status}</td>
                           <td>
                             <Icons.PencilAltOutline
                               onClick={() => handleEditGeneric(generic)}
                               className="icon-edit"
                               size={20}
                             />
                             <Icons.TrashOutline
                               className="icon-trash"
                               onClick={() => deleteHandler(generic._id)}
                               size={20}
                             />
                           </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan={6} className="text-center">No data available</td>
                       </tr>
                     )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GenericEditModal
        onShow={onShow}
        handleClose={handleOnShowClose}
        generic={generic}
      ></GenericEditModal>
    </div>
  );
};

export default Generic;
