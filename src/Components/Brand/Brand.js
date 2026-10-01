import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import {
  // useBrandsQuery,
  // useBrandQuery,
  useAddBrandMutation,
  useBrandCountQuery,
  useBrandPaginationQuery,
  // useUpdateBrandMutation,
  useDeleteBrandMutation
} from "../../services/brandApi";
import Header from "../Common/Header/Header";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { apiUniqueErrHandle } from "../Utility/Utility";
import axios from "../../services/apiClient";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import PackageModal from "../Common/Modal/PackageModal";
import AlertService from "../Utility/AlertService";
const Brand = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  const [addBrand, { isLoading: isAdding }] = useAddBrandMutation();
  const lang = useSelector((state) => state.languageReducer);
  const { register, handleSubmit, reset } = useForm({});
  const [deleteBrand] = useDeleteBrandMutation();
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");
  const [brandCode, setBrandCode] = useState();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);


  const { data, isSuccess, isLoading, isFetching, refetch } = useBrandPaginationQuery({
    page,
    size,
    aamarId,
    q
  });
  let navigate = useNavigate();
  let i = 1;



  const pageCountQuery = useBrandCountQuery({ aamarId });
  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
  }, [pageCountQuery]);

  const handleDataLimit = (e) => {
    setSize(parseInt(e.target.value));
    setPageNo(getPageNumber);
    refetch();
  };

  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
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

  // CHECK UNIQUE
  const checkCodeInAPI = async (code) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/brand/unique/${code}/${aamarId}`,
        {
          params: { code }
        }
      );
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

    setBrandCode(numericCode);
    return numericCode;
  };

  useEffect(() => {
    generateUniqueSixDigitCode();
  }, []);

  const onSubmit = async (data) => {
    try {
      const generatedCode = await generateUniqueSixDigitCode();
      // Pass the form data and aamarId as part of a single object
      const response = await addBrand({
        ...data,
        code: generatedCode,
        aamarId
      });

      if (response) {
        if (response?.error) {
          apiUniqueErrHandle(response);
        } else {
          reset({
            name: "",
            code: "",
            photo: "",
            details: "",
            status: "",
            aamarId: auth?.aamarId
          });
          return navigate("/brand");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      refetch();
    }
  };

  const deleteHandler = async (id) => {
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Brand?");
    if (confirmed) {
      const res = await deleteBrand(id);
      if (res) {
        // TODO::
        // add error hendaler for delete error
        console.log(res);
      } else {
        console.log("Delete Operation Canceled by Brand!");
        return;
      }
    }
  };

  const handleReset = () => {
    reset({
      name: "",
      code: "",
      photo: "",
      details: "",
      status: "active"
    });
  };
  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.brand}></Header>
            <div className="row">
              <div className="col-md-12 ">
                <span className="float-end">
                  <Link
                    className="btn btn-dark mb-2 float-end me-2 mt-2"
                    to="/brand/import"
                  >
                    <Icons.PlusOutline size={22}></Icons.PlusOutline>{" "}
                    {lang?.importBrand}
                  </Link>
                </span>
              </div>
              <div className="col-md-4 ">
                <div className="sticky-md-top ">
                  <div className="card mt-2">
                    <div className="card-header">
                      <h5 className="card-title">
                        {data?._id ? "Update" : "Add"} Brand
                      </h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mb-3">
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputCustomer">Brand Name</label>
                            <input
                              {...register("name", { required: true })}
                              type="text"
                              className="form-control"
                              id="inputCustomer"
                              aria-describedby="emailHelp"
                              placeholder="Unit Name"
                            />
                          </div>
                          <div className="form-group col-12  mb-3">
                            <label htmlFor="inputCustomer">Brand Code</label>
                            <input
                              {...register("code", { required: true })}
                              type="text"
                              className="form-control"
                              id="inputCustomer"
                              aria-describedby="emailHelp"
                              value={brandCode}
                              placeholder="Brand Code"
                            />
                          </div>
                          {/* <div className="form-group col-12  mb-3">
                            <label htmlFor="inputMC"> Company</label>
                            <input
                              {...register("company")}
                              type="text"
                              className="form-control"
                              id="phone"
                              placeholder="company"
                            />
                          </div> */}
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
                            <label htmlFor="MCId">status</label>
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
                          ) : data?._id ? (
                            <>
                              <Icons.SaveOutline></Icons.SaveOutline>
                            </>
                          ) : (
                            <>
                              <Icons.Plus> </Icons.Plus>
                            </>
                          )}
                          Brand
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
                      <th scope="col">Brand Name</th>
                      <th scope="col">Details</th>
                      <th scope="col">status</th>
                      <th scope="col">ActionBtn</th>
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
                     ) : data ? (
                       data
                         .slice()
                         .sort((a, b) => a.code - b.code)
                         .map((Brand) => (
                           <tr key={Brand._id}>
                             <th scope="row">{i++}</th>
                             <td>{Brand.code}</td>
                             <td>{Brand.name}</td>
                             <td>{Brand.details}</td>
                             <td>{Brand.status}</td>
                             <td>
                               <Link to={`/brand/update/${Brand._id}`}>
                                 <Icons.PencilAltOutline
                                   className="icon-edit"
                                   size={20}
                                 ></Icons.PencilAltOutline>
                               </Link>
 
                               <Icons.TrashOutline
                                 className="icon-trash"
                                 onClick={() => deleteHandler(Brand._id)}
                                 size={20}
                               ></Icons.TrashOutline>
                             </td>
                           </tr>
                         ))
                     ) : (
                       <tr>
                         <td colSpan={6} className="text-center">
                           No Brand Found
                         </td>
                       </tr>
                     )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Brand;
