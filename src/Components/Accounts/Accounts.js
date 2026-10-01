import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import {
  useAccountByDateQuery,
  useAccountQuery,
  useUpdateAccountDeleteMutation,
} from "../../services/accountApi";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import AlertService from "../Utility/AlertService";
import { signInUser } from "../Utility/Auth";
import { useSelector } from "react-redux";
import { notify } from "../Utility/Notify";
import AccountView from "./AccountView";


const Accounts = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const lang = useSelector((state) => state.languageReducer);

  // const data = []
  const { data, isSuccess, refetch } = useAccountByDateQuery({
    startDate,
    endDate,
    aamarId,
  });
  const [deleteUpdateAccount] = useUpdateAccountDeleteMutation();
  // console.log(data)
  // const { data, isSuccess, refetch } = useAccountsQuery()
  let i = 1;

  const [accountId, setAccountId] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const { data: accountDetails, refetch: accountDEtailsRefetch } =
    useAccountQuery(accountId);
  useEffect(() => {
    if (accountId !== "") {
      accountDEtailsRefetch();
    }
  }, [accountId]);
  useEffect(() => {
    refetch();
  }, [startDate, endDate, aamarId]);
  const handleDataLimit = () => { };
  const handleSearch = () => { };
  const deleteHandler = async (e) => {
    // console.log(e)
    const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Category?");
    if (confirmed) {
      await deleteUpdateAccount({ _id: e })
        .then((res) => {
          //   console.log(res);
          notify("Category delete successful", "error");
        })
        .then((err) => {
          console.log(err);
          notify("Can not delete", "error");
        });
    } else {
      notify("Account Delete Canceled", "error");
    }
  };
  const handleAccountsView = async (e) => {
    setShow(true);
    // console.log(e);
    setAccountId(e);
    // accountDEtailsRefetch()
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
                <Header title={lang?.transaction}></Header>
              </div>
              <div className="d-md-flex align-items-center justify-content-between mb-3 mt-2 gap-2 ">
                <div className="d-flex gap-2">
                  {/* <b>Start:</b> */}
                  <DatePicker
                    selected={new Date(startDate)}
                    className="form-control me-2"
                    onChange={(date) =>
                      setStartDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />

                  {/* <b>End:</b> */}
                  <DatePicker
                    selected={new Date(endDate)}
                    className="form-control"
                    onChange={(date) =>
                      setEndDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />
                </div>
                <div className="d-flex gap-2 mt-2 mt-md-0">
                  <div className="">
                    <Link
                      to="/addAfterSale"
                      className="btn  btn-sm btn-dark float-end"
                    >
                      <Icons.Plus className="icon-edit" size={20}></Icons.Plus>
                      {lang?.afterSalePayment}
                    </Link>
                  </div>
                  {/* <div className="col-md-9  mt-2 mb-2">Filters</div> */}
                  <div className="">
                    <Link
                      to="/addAccountExpense"
                      className="btn btn-dark float-end btn-sm"
                    >
                      <Icons.Plus className="icon-edit" size={20}></Icons.Plus>
                      {lang?.addExpense}
                    </Link>
                  </div>
                  <div className="">
                    <Link
                      to="/addAccount"
                      className="btn btn-sm btn-dark float-end"
                    >
                      <Icons.Plus className="icon-edit" size={20}></Icons.Plus>
                      {lang?.addPayment}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col" className="py-3">
                      #
                    </th>
                    <th scope="col" className="py-3 text-nowrap">
                      AC No
                    </th>
                    <th scope="col" className="py-3 text-nowrap">
                      Account Head
                    </th>
                    <th scope="col" className="py-3">
                      Date
                    </th>
                    <th scope="col" className="py-3">
                      Amount
                    </th>
                    <th scope="col" className="py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((ac, index) => (
                      <tr key={ac?._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{ac?.acId}</td>
                        <td>{ac?.accountHead?.name}</td>
                        <td>
                          {format(
                            new Date(ac?.createdAt),
                            "yyyy-MM-dd HH:mm:ss"
                          )}
                        </td>
                        <td>{ac?.amount}</td>
                        <td>
                          <Icons.EyeOutline
                            onClick={() => handleAccountsView(ac._id)}
                            className="icon-eye me-1"
                            size={20}
                          />
                          <Icons.TrashOutline
                            className="icon-trash"
                            size={20}
                            onClick={() => deleteHandler(ac._id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-3">
                        No Accounts Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <AccountView
        show={show}
        handleClose={handleClose}
        accountId={accountId}
        accountDetails={accountDetails}
      ></AccountView>
    </div>
  );
};

export default Accounts;
