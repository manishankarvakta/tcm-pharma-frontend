import {
  // startOfToday,
  //  endOfToday,
  format,
} from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { BsCheckSquare, BsSquare } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deselectGRN,
  deselectPO,
  inputAmount,
  inputCardNo,
  inputCardType,
  inputCheckBankNo,
  inputCheckNo,
  inputDate,
  inputMFSPhone,
  inputMFSType,
  inputNote,
  inputPaidTo,
  inputPaymentMethodType,
  inputPaymentType,
  // selectStatus,
  resetAccount,
  selectAccountHead,
  // inputType,
  selectAccountUser,
  selectGRN,
  selectPO,
  selectSupplier,
} from "../../features/accountSlice";
import { useAddAccountMutation } from "../../services/accountApi";
import { useGrnBySupplierQuery } from "../../services/grnApi";
import { usePurchaseSupplierAccountQuery } from "../../services/purchasApi";
import SelectGrnAccount from "../Common/CustomSelect/SelectGrnAccount";
import SelectPurchaseAccount from "../Common/CustomSelect/SelectPurchaseAccount";
import SelectSupplier from "../Common/CustomSelect/SelectSupplier";
import Header from "../Common/Header/Header";
import SideBar from "../Common/SideBar/SideBar";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";

const AddAccount = () => {
  const auth = signInUser();
  const { aamarId } = auth;
  const lang = useSelector((state) => state.languageReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm({});
  // const accountData = useSelector((state) => state);
  const accountData = useSelector((state) => state.accountReducer);
  const [addAccount] = useAddAccountMutation();
  useEffect(() => {
    // console.log(accountData)
  });

  const [paymentDate, setPaymentDate] = useState(
    format(new Date(), "MM-dd-yyyy")
  );
  const [isPO, setIsPO] = useState(false);
  const [isGRN, setIsGRN] = useState(false);
  const [isCash, setIsCash] = useState(true);
  const [isCheque, setIsCheque] = useState(false);
  const [isCard, setIsCard] = useState(false);
  const [isMfs, setIsMfs] = useState(false);

  const [isShowPO, setIsShowPO] = useState(false);
  const [isShowGrn, setIsShowGrn] = useState(false);

  const [poInfo, setPoInfo] = useState({});
  const [grnInfo, setGrnInfo] = useState({});
  const [supplier, setSupplier] = useState("");

  const {
    data: po,
    isSuccess: poIsSuccess,
    refetch: poRefetch,
  } = usePurchaseSupplierAccountQuery(`${supplier}`);
  const {
    data: grn,
    isSuccess: grnIsSuccess,
    refetch: grnRefetch,
  } = useGrnBySupplierQuery(`${supplier}`);
  const user = signInUser();
  // console.log(user)

  useEffect(() => {
    poRefetch();
    grnRefetch();
  }, [supplier]);

  useEffect(() => {
    if (user?.id) {
      dispatch(selectAccountUser(user.id));
    }
    // dispatch(selectAccountHead("643e3ff315c557ac29f9d7e7"))
  }, []);

  //   console.log(po);
  //   console.log(grn);

  const handleVendorChange = (e) => {
    // console.log(e);
    setSupplier(e.option);
    dispatch(selectSupplier(e.option));
    poRefetch();
    grnRefetch();
    dispatch(inputAmount(0));
  };
  const handlePOChange = (e) => {
    // console.log(e);
    if (e && e.option) {
      setPoInfo(e.po);
      setIsShowPO(true);
      setIsShowGrn(false);
      dispatch(selectPO(e.option));
      dispatch(deselectGRN());
      dispatch(inputPaymentType("Advance"));
      dispatch(inputAmount(e.po.total.toFixed(2)));
    }
  };
  const handleGRNChange = (e) => {
    // console.log(e);
    if (e && e.option) {
      setGrnInfo(e.grn);
      setIsShowGrn(true);
      setIsShowPO(false);
      dispatch(selectGRN(e.option));
      dispatch(deselectPO());
      dispatch(inputPaymentType("Payment"));
      dispatch(inputAmount(e.grn.total.toFixed(2)));
    }
  };

  const handleDeSelectIsPO = () => {
    setIsPO(false);
    setIsShowPO(false);
    dispatch(selectAccountHead(null));
    dispatch(inputAmount(0));
  };
  const handleIsPO = () => {
    dispatch(inputAmount(0));
    setIsPO(true);
    if (isGRN === true) {
      setIsGRN(false);
    }
    dispatch(selectAccountHead("643e3fd515c557ac29f9d7e2"));
  };
  const handleDeselectIsGRN = () => {
    dispatch(inputAmount(0));
    setIsGRN(false);
    setIsShowGrn(false);
    dispatch(selectAccountHead(null));
    dispatch(inputAmount(0));
  };
  const handleIsGRN = () => {
    dispatch(inputAmount(0));
    setIsGRN(true);
    if (isPO === true) {
      setIsPO(false);
    }
    dispatch(selectAccountHead("643e3ff315c557ac29f9d7e7"));
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
  const handleAddAccount = async () => {
    if (accountData.paymentMethodType === "") {
      notify("Please Select A Payment Type", "error");
      return;
    } else {
      //   console.log("accountData", accountData);
      //   console.log(accountData);
      if (accountData.supplier === null) {
        notify("Please Select A Supplier", "error");
      } else {
        if (accountData.accountHead === null) {
          notify("Please Select A PO/GRN", "error");
        } else {
          //   console.log("accountData", accountData);
          const newData = { ...accountData, aamarId };

          await addAccount(newData)
            .then((res) => {
              //   console.log(res);
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
            <Header title={lang?.addPayment}></Header>
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
            <Form className="pt-3" onSubmit={handleSubmit(handleAddAccount)}>
              <div className="row">
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-8">
                      <Form.Group className="" controlId="warehouse">
                        <Form.Label>Supplier</Form.Label>
                        <SelectSupplier
                          handleOnchange={handleVendorChange}
                          //   {...setValue("supplier", `${supplierProductId}`)}
                          // {...register("supplier_code", { required: true })}
                        ></SelectSupplier>
                      </Form.Group>
                    </div>
                    <div className="col-md-4 mt-2 mt-md-0">
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
                  <div className="row">
                    <div className="col-md-6">
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
                    <div className="col-md-4 d-flex justify-content-md-end align-items-center">
                      <Form.Label>
                        <p>PO/GRN</p>

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex justify-content-center align-items-center">
                            <b>PO </b>
                            {isPO ? (
                              <BsCheckSquare
                                onClick={() => handleDeSelectIsPO()}
                              />
                            ) : (
                              <BsSquare onClick={() => handleIsPO()} />
                            )}
                          </div>
                          <div className="d-flex justify-content-center align-items-center ms-3">
                            <b>GRN </b>
                            {isGRN ? (
                              <BsCheckSquare
                                onClick={() => handleDeselectIsGRN()}
                              />
                            ) : (
                              <BsSquare onClick={() => handleIsGRN()} />
                            )}
                          </div>
                        </div>
                      </Form.Label>
                    </div>
                  </div>
                  <div className="row">
                    {isPO ? (
                      <div className="col-12">
                        <Form.Group className="" controlId="warehouse">
                          <Form.Label>Purchase NO</Form.Label>
                          <SelectPurchaseAccount
                            data={po}
                            isSuccess={poIsSuccess}
                            handleVendorChange={handlePOChange}
                          ></SelectPurchaseAccount>
                        </Form.Group>
                      </div>
                    ) : (
                      <></>
                    )}
                    {isGRN ? (
                      <div className="col-12">
                        <Form.Group className="" controlId="warehouse">
                          <Form.Label>GRN NO</Form.Label>
                          <SelectGrnAccount
                            data={grn}
                            isSuccess={grnIsSuccess}
                            handleVendorChange={handleGRNChange}
                          ></SelectGrnAccount>
                        </Form.Group>
                      </div>
                    ) : (
                      <></>
                    )}
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
                          onChange={(e) => dispatch(inputNote(e.target.value))}
                          type="text"
                          className="form-control quantity"
                          width="60%"
                        ></textarea>
                      </p>
                    </div>
                  </div>
                  <div className="row"></div>
                </div>
                <div className="col-md-3">
                  {isShowPO === true && (
                    <div className="col-12">
                      <h6>PO Information</h6>
                      <p>Po NO: {poInfo?.poNo}</p>
                      <p>
                        Created At:{" "}
                        {poInfo?.createdAt
                          ? format(new Date(), "MM/dd/yyyy")
                          : ""}
                      </p>
                      <p>Total: {poInfo?.total}</p>
                      <p>Total Item: {poInfo?.totalItem}</p>
                      <p>Status: {poInfo?.status}</p>
                    </div>
                  )}
                  {isShowGrn === true && (
                    <div className="col-12">
                      <h6>GRN Information</h6>
                      <p>GRN NO: {grnInfo?.grnNo}</p>
                      <p>
                        Created At:{" "}
                        {grnInfo?.createdAt
                          ? format(new Date(), "MM/dd/yyyy")
                          : ""}
                      </p>
                      <p>Total: {grnInfo?.total}</p>
                      <p>Total Item: {grnInfo?.totalItem}</p>
                      <p>Status: {grnInfo?.status}</p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={() => navigateToAccount()}
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

export default AddAccount;
