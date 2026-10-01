import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  inputAmount,
  inputCardNo,
  inputCardType,
  inputCheckBankNo,
  inputCheckNo,
  inputDate,
  inputFromDate,
  inputMFSPhone,
  inputMFSType,
  inputNote,
  inputPaidTo,
  inputPaymentMethodType,
  inputPaymentType,
  inputToDate,
  inputType,
  resetAccount,
  selectAccountHead,
  // selectStatus,
  selectSupplier,
} from "../../features/accountSlice";
import { useAddAccountMutation } from "../../services/accountApi";
import { useSaleByDateAfterSaleQuery } from "../../services/saleApi";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";

const AddAfterSale = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.languageReducer);

  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm({});
  const accountData = useSelector((state) => state.accountReducer);

  const [addAccount] = useAddAccountMutation();

  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [paymentDate, setPaymentDate] = useState(
    format(new Date(), "MM-dd-yyyy")
  );

  let i = 1;

  const [supplier, setSupplier] = useState("");
  const [isCash, setIsCash] = useState(true);
  const [isCheque, setIsCheque] = useState(false);
  const [isCard, setIsCard] = useState(false);
  const [isMfs, setIsMfs] = useState(false);

  const { data, isSuccess, refetch } = useSaleByDateAfterSaleQuery({
    startDate,
    endDate,
    supplier,
  });
  useEffect(() => {
    refetch();
    dispatch(inputType("Debit"));
    dispatch(inputPaymentType("Payment"));
    dispatch(inputToDate(endDate));
    dispatch(inputFromDate(startDate));
    dispatch(selectAccountHead("643e3ff315c557ac29f9d7e7"));
    // const total = totalCalculation(data)
    if (data?.totalTP) {
      dispatch(inputAmount((data?.totalTP).toFixed(2)));
    }
  }, [startDate, endDate, supplier, data]);
  // console.log("data", data)

  const handleVendorChange = (e) => {
    setSupplier(e.option);
    dispatch(selectSupplier(e.option));
    refetch();
  };
  const handleDeSelectCash = () => {
    setIsCash(false);
    dispatch(inputPaymentMethodType(""));
  };
  const handleCash = () => {
    setIsCash(true);
    setIsCheque(false);
    setIsCard(false);
    setIsMfs(false);
    dispatch(inputPaymentMethodType("Cash"));
  };
  const handleDeselectCheque = () => {
    setIsCheque(false);
    dispatch(inputPaymentMethodType(""));
  };
  const handleCheque = () => {
    setIsCheque(true);
    setIsCash(false);
    // setIsCheque(false)
    setIsCard(false);
    setIsMfs(false);
    dispatch(inputPaymentMethodType("Cheque"));
  };
  const handleDeselectCard = () => {
    setIsCard(false);
    dispatch(inputPaymentMethodType(""));
  };
  const handleIsCard = () => {
    setIsCard(true);
    setIsCash(false);
    setIsCheque(false);
    // setIsCard(false)
    setIsMfs(false);
    dispatch(inputPaymentMethodType("Card"));
  };
  const handleDeselectMfs = () => {
    setIsMfs(false);
    dispatch(inputPaymentMethodType(""));
  };
  const handleIsMfs = () => {
    setIsMfs(true);
    setIsCash(false);
    setIsCheque(false);
    setIsCard(false);
    dispatch(inputPaymentMethodType("MFS"));
    // setIsMfs(false)
  };
  const handleAddAccountAfterSale = async () => {
    if (accountData.paymentMethodType === "") {
      notify("Please Select A Payment Type", "error");
      return;
    } else {
      // console.log("accountData", accountData)
      // console.log(accountData)
      if (accountData.supplier === null) {
        notify("Please Select A Supplier", "error");
      } else {
        // console.log("accountData", accountData)
        await addAccount({ ...accountData, aamarId })
          .then((res) => {
            // console.log(res)
            if (res?.data) {
              notify("Account Created SuccessFully", "success");
              navigate(`/accounts`);
              dispatch(resetAccount());
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  const navigateToAccount = () => {
    navigate(`/accounts`);
    dispatch(resetAccount());
  };
  return (
    <div>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.afterSalePayment}></Header>
            <div className="row">
              {/* <div className="col-md-9  mt-2 mb-2">Filters</div> */}
              <div className="d-flex gap-2 mt-2 justify-content-end">
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
            <Form
              className="pt-3"
              onSubmit={handleSubmit(handleAddAccountAfterSale)}
            >
              <div className="col-md-12">
                <div className="d-md-flex">
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-8">
                        <Form.Group className="" controlId="warehouse">
                          <Form.Label>Supplier</Form.Label>
                          <SelectSupplier
                            handleOnchange={handleVendorChange}
                            //   {...setValue("supplier", `${supplierProductId}`)}
                            // {...register("supplier_code", { required: true })}
                          ></SelectSupplier>
                        </Form.Group>
                      </div>
                      <div className="col-4">
                        <Form.Group className="" controlId="warehouse">
                          <Form.Label>Payment Date</Form.Label>
                          <DatePicker
                            selected={new Date(paymentDate)}
                            className="form-control"
                            onChange={(date) => {
                              setPaymentDate(
                                format(new Date(date), "MM-dd-yyyy")
                              );
                              dispatch(
                                inputDate(format(new Date(date), "MM-dd-yyyy"))
                              );
                            }}
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-6 ">
                        <Form.Group className="" controlId="warehouse">
                          <Form.Label>Start Date</Form.Label>
                          <DatePicker
                            selected={new Date(startDate)}
                            className="form-control me-2"
                            onChange={(date) =>
                              setStartDate(format(new Date(date), "MM-dd-yyyy"))
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-6">
                        <Form.Group className="" controlId="warehouse">
                          <Form.Label>End Date</Form.Label>
                          <DatePicker
                            selected={new Date(endDate)}
                            className="form-control"
                            onChange={(date) =>
                              setEndDate(format(new Date(date), "MM-dd-yyyy"))
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <p>Payment Method</p>
                        <p>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex justify-content-center align-items-center">
                              <b>Cash </b>
                              {isCash ? (
                                <BsCheckSquare
                                  onClick={() => handleDeSelectCash()}
                                />
                              ) : (
                                <BsSquare onClick={() => handleCash()} />
                              )}
                            </div>
                            <div className="d-flex justify-content-center align-items-center ms-3">
                              <b>Cheque </b>
                              {isCheque ? (
                                <BsCheckSquare
                                  onClick={() => handleDeselectCheque()}
                                />
                              ) : (
                                <BsSquare onClick={() => handleCheque()} />
                              )}
                            </div>
                            <div className="d-flex justify-content-center align-items-center ms-3">
                              <b>Card </b>
                              {isCard ? (
                                <BsCheckSquare
                                  onClick={() => handleDeselectCard()}
                                />
                              ) : (
                                <BsSquare onClick={() => handleIsCard()} />
                              )}
                            </div>
                            <div className="d-flex justify-content-center align-items-center ms-3">
                              <b>MFS </b>
                              {isMfs ? (
                                <BsCheckSquare
                                  onClick={() => handleDeselectMfs()}
                                />
                              ) : (
                                <BsSquare onClick={() => handleIsMfs()} />
                              )}
                            </div>
                          </div>
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <p>
                          Amount :
                          <input
                            onChange={(e) =>
                              dispatch(inputAmount(e.target.value))
                            }
                            type="text"
                            className="form-control quantity"
                            width="60%"
                            value={accountData?.amount}
                          ></input>
                        </p>
                      </div>
                      <div className="col-6">
                        <p>
                          Name :
                          <input
                            onChange={(e) =>
                              dispatch(inputPaidTo(e.target.value))
                            }
                            type="text"
                            className="form-control quantity"
                            width="60%"
                          ></input>
                        </p>
                      </div>
                      <div className="col-6">
                        {isCheque ? (
                          <p>
                            Cheque No :
                            <input
                              onChange={(e) =>
                                dispatch(inputCheckNo(e.target.value))
                              }
                              type="text"
                              className="form-control quantity"
                              width="60%"
                            ></input>
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-6">
                        {isCheque ? (
                          <p>
                            Bank Name :
                            <Form.Select
                              name="bankName"
                              id="bankName"
                              aria-label="Default select example"
                              onChange={(e) =>
                                dispatch(inputCheckBankNo(e.target.value))
                              }
                              className="form-control"
                            >
                              <option value="Bank Asia" selected>
                                Bank Asia
                              </option>
                              <option value="Padma Bank"> Padma Bank </option>
                              <option value="Standard Chartered Bank">
                                {" "}
                                Standard Chartered Bank{" "}
                              </option>
                              <option value="City Bank"> City Bank </option>
                              <option value="Dutch Bangla Bank">
                                {" "}
                                Dutch Bangla Bank{" "}
                              </option>
                              {/* <option value="Union Pay"> Union Pay </option>
                                                <option value="LankaBangla"> LankaBangla </option>
                                                <option value="IPDC card"> IPDC card </option>
                                                <option value="NPSB card"> NPSB card </option> */}
                            </Form.Select>
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-6">
                        {isCard ? (
                          <p>
                            Card No :
                            <input
                              onChange={(e) =>
                                dispatch(inputCardNo(e.target.value))
                              }
                              type="text"
                              className="form-control quantity"
                              width="60%"
                            ></input>
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-6">
                        {isCard ? (
                          <p>
                            Type :
                            <Form.Select
                              onChange={(e) =>
                                dispatch(inputCardType(e.target.value))
                              }
                              name="cardType"
                              id="cardType"
                              aria-label="Default select example"
                              className="form-control"
                            >
                              <option value="Visa" selected>
                                Visa
                              </option>
                              <option value="Master"> Master </option>
                              <option value="Amex"> Amex </option>
                              <option value="Citymax"> Citymax </option>
                              <option value="DBBL Nexus"> DBBL Nexus </option>
                              <option value="Union Pay"> Union Pay </option>
                              <option value="LankaBangla"> LankaBangla </option>
                              <option value="IPDC card"> IPDC card </option>
                              <option value="NPSB card"> NPSB card </option>
                            </Form.Select>
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-6">
                        {isMfs ? (
                          <p>
                            Phone No :
                            <input
                              onChange={(e) =>
                                dispatch(inputMFSPhone(e.target.value))
                              }
                              type="text"
                              className="form-control quantity"
                              width="60%"
                            ></input>
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-6">
                        {isMfs ? (
                          <p>
                            Type :
                            <Form.Select
                              onChange={(e) =>
                                dispatch(inputMFSType(e.target.value))
                              }
                              name="mfsName"
                              className="form-control"
                              id="mfsName"
                              aria-label="Default select example"
                            >
                              <option value="bKash"> Bkash</option>
                              <option value="Nagad"> Nagad </option>
                              <option value="Upay"> Upay </option>
                              <option value="Rocket"> Rocket</option>
                              <option value="Okwallet"> Okwallet</option>
                              <option value="M-cash"> M-cash</option>
                              <option value="Citytouch"> Citytouch </option>
                              <option value="Dmoney"> Dmoney </option>
                              <option value="I-pay"> I-pay</option>
                              <option value="Q-Cash"> Q-Cash</option>
                              <option value="Sure Cash"> Sure Cash</option>
                            </Form.Select>
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <p>
                          Note :
                          <textarea
                            onChange={(e) =>
                              dispatch(inputNote(e.target.value))
                            }
                            type="text"
                            className="form-control quantity"
                            width="60%"
                          ></textarea>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="row">
                      <Form.Label className="fw-bold ">
                        Sold Products
                      </Form.Label>

                      <div className="px-3">
                        <Table className=" table-responsive ">
                          <thead className="">
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Code</th>
                              <th scope="col">Name</th>
                              <th scope="col">Sold</th>
                              <th scope="col">TP</th>
                              {/* <th scope="col">MRP</th> */}
                              {/* <th scope="col">Group</th> */}
                              {/* <th scope="col">Actions </th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {/* {isLoading && <h2>...Loading</h2>}
                            {isFetching && <h2>...isFetching</h2>}
                            {error && <h2>Something went wrong</h2>} */}
                            {data?.product?.length > 0 ? (
                              data?.product?.map((product) => (
                                <tr key={product?._id}>
                                  <th scope="row">{i++}</th>
                                  <td>{product?.article_code}</td>
                                  <td>{product?.name}</td>
                                  <td>{product?.totalQuantity}</td>
                                  <td>{product?.tp}</td>
                                  {/* <td>{product?.mrp}</td> */}
                                </tr>
                              ))
                            ) : (
                              <tr colSpan={9}>No Products Sold</tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                    <div className="row px-2">
                      <div className="col-12 d-flex justify-content-between align-items-center ">
                        <p>
                          <b>Total QTY</b>: {data?.totalItemOty?.toFixed(2)}
                        </p>
                        <p>
                          <b>Total Tp</b>: {data?.totalTP?.toFixed(2)}{" "}
                        </p>
                        {/* <p><b>Total MRP</b>: {(data?.totalMRP)?.toFixed(2)}</p> */}
                        {/* <p><b>Total Profit</b>: {(data?.totalMRP - data?.totalTP)?.toFixed(2)} </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  navigateToAccount();
                }}
                variant="dark"
                className="float-center me-2"
              >
                <Icons.X size={20}></Icons.X> Cancel
              </Button>

              <Button variant="dark" className="float-center" type="submit">
                <Icons.PlusOutline size={20}></Icons.PlusOutline> Save
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAfterSale;
