// import React from "react";
import * as Icons from "heroicons-react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAccountheadsQuery, useDeleteAccountHeadMutation } from "../../services/accountHeadApi";
import { notify } from "../Utility/Notify";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";

const AccountHeads = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  let i = 1;
    const lang = useSelector((state) => state.languageReducer);
  
  const {
    data,
    error, isLoading, isFetching, isSuccess
  } = useAccountheadsQuery({ aamarId });
  const [deleteAccountsHead] = useDeleteAccountHeadMutation();
  // console.log(data)
  const handleDataLimit = () => {};
  const handleSearch = () => {};
  const deleteHandler = async (e) => {
    // console.log(e)
    const confirm = window.confirm("Are you Sure? Delete this Account Head?");
    if (confirm) {
        await deleteAccountsHead(e)
          .then((res) => {
             if (res?.data === "can not delete") {
               notify("Can Not delete This Account Head", "error");
             } else {
               notify("Account Head is Deleted", "success");
             }
          })
          .catch((err) => {
            console.log(err);
            notify("Account Head Delete Error", "error");
          });
    } else {
      notify("Account Head Delete Canceled", "error");
    }
  };

  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-12">
                <Header title={lang?.allAccountsHead}></Header>
              </div>
              <div className="col-md-6 mt-2 mb-2">
                <form>
                  <div className="input-group mb-3 ">
                    <select
                      className="form-select rounded"
                      onClick={(e) => handleDataLimit(e)}
                    >
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                      <option value="250">250</option>
                    </select>
                    <input
                      className="form-control ms-1 rounded"
                      type="text"
                      onKeyUp={(e) => handleSearch(e)}
                    />
                    {/* <input type="text" className="form-control" aria-label="Text input with dropdown button"> */}
                  </div>
                </form>
                {/* Pagenation */}

                {/* <nav aria-label="Page navigation example">
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
                </nav> */}
              </div>
              <div className="col-md-4"></div>
              {/* <div className="col-md-9  mt-2 mb-2">Filters</div> */}
              <div className="col-md-2  mt-2 mb-2">
                <Link to="/addAccountHead" className="btn btn-dark float-end">
                  <Icons.Plus className="icon-edit" size={20}></Icons.Plus>
                  {lang?.addAccountHead}
                </Link>
              </div>
            </div>

            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Code</th>
                    <th scope="col " className="text-nowrap">
                      Sub AccountHead
                    </th>
                    <th scope="col">AccountHead</th>
                    <th scope="col" className="text-nowrap">
                      AccountHead Code
                    </th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((acHead, index) => (
                      <tr key={acHead?._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{acHead?.code}</td>
                        <td>{acHead?.name}</td>
                        <td>
                          {acHead?.maId
                            ? acHead?.maId?.name
                            : "Master Account Head"}
                        </td>
                        <td>{acHead?.maId ? acHead?.maId?.code : ""}</td>
                        <td>{acHead?.status}</td>
                        <td>
                          <Link to={`/accountheads/update/${acHead._id}`}>
                            <Icons.PencilAltOutline
                              className="icon-edit"
                              size={20}
                            ></Icons.PencilAltOutline>
                          </Link>
                          <Icons.TrashOutline
                            className="icon-trash"
                            size={20}
                            onClick={() => deleteHandler(acHead?._id)}
                          ></Icons.TrashOutline>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No AccountHead Found
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
  );
};

export default AccountHeads;
