import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Header from "../Common/Header/Header";
import "./Category.css";
import * as Icons from "heroicons-react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SideBar from "../Common/SideBar/SideBar";
import {
  // useCategoriesQuery,
  useDeleteCategoryMutation,
  useCategoryPagenationQuery,
  useCategoryCountQuery,
} from "../../services/categoryApi";
import ReactPaginate from "react-paginate";
// import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingModal from "../Common/Modal/LoadingModal";
import AlertService from "../Utility/AlertService";

const Categories = () => {
  let i = 1;
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [q, setQ] = useState("");

  const [loader, setLoader] = useState(false);
  const handleLoaderClose = () => setLoader(false);

  //   const { data, error, isLoading, isFetching, isSuccess } =
  //     useCategoriesQuery();

  // get totel product count
  const pageCountQuery = useCategoryCountQuery();
  useEffect(() => {
    const { data } = pageCountQuery;
    setPageCount(data);
  }, [pageCountQuery]);

  const [deleteCategory] = useDeleteCategoryMutation();

  const { data, error, isLoading, isFetching, isSuccess, refetch } =
    useCategoryPagenationQuery({
      page,
      size,
      q,
    });

  useEffect(() => {
    data ? setLoader(false) : setLoader(true);
  }, [data]);
  // console.log(data)

  const handleSearch = (e) => {
    setQ(e.target.value);
    refetch();
  };
  // console.log(pageNo);
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

  // console.log(pageCount, size);
  const getPageNumber = () => {
    const cont = Math.ceil(parseInt(pageCount) / parseInt(size));
  };

  const deleteHandler = async (id) => {
    setLoader(true);
    try {
      const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Category?");
      if (confirmed) {
        const res = await deleteCategory(id);
        if (res) {
          // TODO::
          // add error hendaler for delete error
          console.log(res);
        } else {
          console.log("Delete Operation Canceled by Category!");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

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
            <div className="row">
              <div className="col-md-12">
                <Header title="All Categories"></Header>
              </div>
              <div className="col-md-6 mt-2 mb-2">
                <form>
                  <div className="input-group mb-3">
                    <select
                      className="form-select"
                      onClick={(e) => handleDataLimit(e)}
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
              <div className="col-md-4"></div>
              {/* <div className="col-md-9  mt-2 mb-2">Filters</div> */}
              <div className="col-md-2  mt-2 mb-2">
                <Link to="./addCategory" className="btn btn-dark float-end">
                  <Icons.Plus className="icon-edit" size={20}></Icons.Plus>
                  Add Category
                </Link>
              </div>
            </div>

            <Table hover>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Category</th>
                  <th scope="col">Master Category</th>
                  <th scope="col">Group</th>
                  <th scope="col">MC ID</th>
                  <th scope="col">Actions </th>
                </tr>
              </thead>
              <tbody>
                {/* {isLoading && <h2>...Loading</h2>}
                {isFetching && <h2>...isFetching</h2>}
                {error && <h2>Something went wrong</h2>} */}
                {data?.length > 0 ? (
                  data?.map((category) => (
                    <tr key={category?._id}>
                      <th scope="row">{i++}</th>
                      <td>{category?.name}</td>
                      <td>
                        {category?.mc ? category?.mc?.name : "Master Category"}
                      </td>
                      <td>{category?.group}</td>
                      <td>{category?.mcId}</td>
                      <td>
                        {/* <Link to={`/category/${category._id}`}>
                          <Icons.EyeOutline
                            className="icon-eye"
                            size={20}
                          ></Icons.EyeOutline>
                        </Link> */}

                        <Link to={`/category/update/${category._id}`}>
                          <Icons.PencilAltOutline
                            className="icon-edit"
                            size={20}
                          ></Icons.PencilAltOutline>
                        </Link>
                        <Icons.TrashOutline
                          className="icon-trash"
                          size={20}
                          onClick={() => deleteHandler(category._id)}
                        ></Icons.TrashOutline>
                      </td>
                    </tr>
                  ))
                ) : (
                  // <tr>
                  //   <td colSpan={6}>
                  //     {isLoading && <Skeleton count={100} />}
                  //     {/* {isFetching && <h2>...isFetching</h2>}
                  //     {error && <h2>Something went wrong</h2>} */}
                  //   </td>
                  // </tr>
                  <tr colSpan={9}>No Categories Found</tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Categories;
