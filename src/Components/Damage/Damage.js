/* eslint-disable react-hooks/exhaustive-deps */
import axios from "../../services/apiClient";
import { format } from "date-fns";
import * as Icons from "heroicons-react";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  useDamageByDateQuery,
  useDamagesExportQuery,
  useDeleteDamageMutation,
} from "../../services/damageApi";
import CsvDownloader from "../Common/CsvDownloader/CsvDownloader";
import WareHouseDW from "../Common/CustomSelect/WareHouseDW";
import Header from "../Common/Header/Header";
import DamageViewModal from "../Common/Modal/DamageViewModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SideBar from "../Common/SideBar/SideBar";
import useInventory from "../Hooks/useInventory";
import { signInUser } from "../Utility/Auth";
import { notify } from "../Utility/Notify";
import { useWarehouseQuery } from "../../services/warehouseApi";
import { useSelector } from "react-redux";
import AlertService from "../Utility/AlertService";

const Damage = () => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const [selectedOption, setSelectedOption] = useState({});
  const navigate = useNavigate();
  const user = signInUser();
  const { aamarId } = user;
  const lang = useSelector((state) => state.languageReducer);

  const [exportCSV, setExportCSV] = useState([]);
  const [startDate, setStartDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [endDate, setEndDate] = useState(format(new Date(), "MM-dd-yyyy"));
  const [warehouse, setWarehouse] = useState("allWh");

  const [damage, setDamage] = useState([]);
  const [totalDamage, setTotalDamage] = useState(0);

  const [onShow, setOnShow] = useState(false);
  const handleClose = () => setOnShow(false);



  const [onShowDamage, setOnShowDamage] = useState(false);
  const handleCloseDamage = () => setOnShowDamage(false);

  const { updateInventoryInOnDamageDel, updateInventoryOutOnDamageIn } =
    useInventory();

  // const { data, isSuccess } = useDamagesQuery();
  // console.log(data)
  const { data, isSuccess, isLoading, isFetching, refetch } = useDamageByDateQuery({
    startDate,
    endDate,
    warehouse,
    aamarId,
  });

  useEffect(() => {
    let total = 0;
    data?.map((purchase) => {
      total = total + purchase?.total;
    });
    setTotalDamage(total);
    setExportCSV(data);
  }, [data, isSuccess]);

  // eslint-disable-next-line no-unused-vars
  const { data: damageExport, isSuccess: damageExportIsSuccess } =
    useDamagesExportQuery({ startDate, endDate, warehouse });
  const [deleteDamage] = useDeleteDamageMutation();


  useEffect(() => {
    if (data) {
      setDamage(data); // Update sales only when data is available
      setExportCSV(data || []); // Ensure exportCSV is an array, fallback to empty array
    }
  }, [isSuccess, data]);

  const navigateToDamageCreate = () => {
    navigate(`/damagecreate`);
  };

  const handleDamageExport = () => {
    console.log(damageExport);
    setOnShowDamage(true);
  };
  const headers = [
    { label: "Damage No", key: "damageNo" },
    { label: "Warehouse", key: "warehouse" },
    { label: "Date", key: "date" },
    { label: "Preapred By", key: "user" },
    { label: "Warehouse", key: "warehouse" },
    { label: "Total Items", key: "totalItem" },
    { label: "Total", key: "total" },
    { label: "Reason", key: "note" },
  ];

  const loggedInUser = signInUser();
  useEffect(() => {
    reset({
      userId: loggedInUser.id,
    });
  }, []);

  // submit function

  const { register, handleSubmit, reset, setValue } = useForm({});
  let i = 1;

  //   delete function

  const deleteHandler = async (id) => {
    try {
      let newIn = [];
      /// axios diye data from data get
      const result = await axios.get(`${BASE_URL}/damage/${id}`);
      console.log(result?.data);

      newIn = [
        ...newIn,
        {
          article_code: result?.data?.product?.article_code,
          qty: result?.data?.qty,
          priceId: result?.data?.priceId,
          name: result?.data?.product?.name,
        },
      ];

      const confirmed = await AlertService.confirm("Are you Sure?", "Delete this Damage?");
      if (confirmed) {

        const res = await deleteDamage(id);
        if (res) {
          // TODO::
          const inventory = await updateInventoryInOnDamageDel(newIn);
          console.log(inventory);

          notify("Damage Delete successful", "success");
        } else {
          notify("Delete Operation Canceled!", "error");
          return;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  useEffect(() => {
    refetch();
  }, [startDate, endDate, warehouse]);

  useEffect(() => {
    refetch();
    if (user?.type === "admin") {
      setWarehouse("allWh");
    } else {
      setWarehouse(user?.warehouse);
    }
  }, []);

  //show damage details
  const damageDetailsHandler = async (id) => {
    console.log("damage id", id);
    const damage = await axios.get(`${BASE_URL}/damage/${id}`);
    console.log(damage.data);
    setDamage(damage.data);
    setOnShow(true);
  };
  const handleOnchangeWareHouse = (e) => {
    if (e.option !== "no-warehouse") {
      setWarehouse(e.option);
    } else {
      setWarehouse("allWh");
    }
    console.log("handle data:", e);
  };
  const [whName, setWhName] = useState(" ");

  const { data: wh } = useWarehouseQuery(user?.warehouse);

  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  const preHeader = [
    [`${user?.storeSettings?.storeName || "No-Name"}`],
    [`${user?.storeSettings?.address?.street || "No-Street"}`],
    [
      `${user?.storeSettings?.address?.city || "No-City"}-${user?.storeSettings?.address?.post || "No-PostalCode"
      }`,
    ],
    [`warehouse - ${whName || "No-Warehouse"}`],
    [`Aamar Id-${user?.aamarId || "No-Aamar Id"}`],
    [`Damage Report`],

    [], // Empty row for spacing
  ];
  return (
    <div>
      <div className="container-fluid">

        <div className="row">
          <div className="col-md-2">
            <SideBar></SideBar>
          </div>
          <div className="col-md-10">
            <Header title={lang?.damage}></Header>
            <div className="d-md-flex align-items-center justify-content-between mb-3 mt-3">
              <div className="date-picker d-md-flex gap-2 mt-2 mb-2 align-items-center">
                {/* <b>Start:</b> */}
                <div className="date-picker d-flex gap-1 mt-2 mb-2 align-items-center">
                  <DatePicker
                    selected={new Date(startDate)}
                    className="form-control me-2"
                    onChange={(date) =>
                      setStartDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />
                  <span width="10px"></span>
                  {/* <b>End:</b> */}
                  <DatePicker
                    selected={new Date(endDate)}
                    className="form-control"
                    onChange={(date) =>
                      setEndDate(format(new Date(date), "MM-dd-yyyy"))
                    }
                  />
                </div>
                {user?.type === "admin" && (
                  <div
                    className="mt-2 mt-md-0 mb-2 mb-md-0 "
                    style={{
                      width:
                        window.innerWidth >= 1024
                          ? 280
                          : window.innerWidth >= 768
                            ? 280
                            : "100%", // Adjust width based on screen size
                    }}
                  >
                    {/* <b>Warehouse:</b> */}

                    <WareHouseDW
                      id="warehouse"
                      name="warehouse"
                      className="col-md-4 ms-2 z-999 position-absolute"
                      handleOnChange={handleOnchangeWareHouse}
                      MenuProps={{
                        container: document.body,
                        PaperProps: {},
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-md-center align-items-center gap-2">
                <div>
                  <Button
                    className="btn btn-dark  float-end"
                    onClick={() => navigateToDamageCreate()}
                  >
                    {lang?.createDamage}
                  </Button>
                </div>
                <div className="col-auto">
                  {Array.isArray(exportCSV) && exportCSV.length > 0 ? (
                    <CsvDownloader
                      preheader={preHeader}
                      buttonName={
                        <span>
                          <Icons.DownloadOutline
                            className="icon-trash text-warning"
                            size={22}
                          />{" "}
                          {lang?.downloadReport}
                        </span>
                      }
                      data={exportCSV}
                      fileName={`Export Damage Report - [${today.toDateString()}].csv`}
                    />
                  ) : (
                    <button className="btn btn-dark" disabled>
                      {lang?.loadingCSV}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Damage ID</th>
                      <th scope="col">Damage Date</th>
                      <th scope="col">Prepared By</th>
                      <th scope="col">Warehouse</th>
                      <th scope="col">Total items</th>
                      <th scope="col">Total</th>
                      <th scope="col">Reason</th>
                      {/* <th scope="col">warehouse</th> */}
                      <th scope="col">ActionBtn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log("data", data)}
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
                       data?.map((damage) => (
                         <tr key={damage._id}>
                           <th scope="row">{i++}</th>
                           <td>{damage?.damageNo}</td>
                           <td>
                             {damage?.createdAt &&
                               format(new Date(damage.createdAt), "MM/dd/yyyy")}
                           </td>
                           <td>{damage?.user}</td>
                           <td>{damage?.warehouse}</td>
                           <td>{damage?.totalItem}</td>
                           <td>{damage?.total?.toFixed(2)}</td>
                           <td>{damage.note}</td>
                           {/* <td>{damage?.warehouse?.name}</td> */}
                           <td>
                             <Icons.EyeOutline
                               className="icon-eye"
                               onClick={() => damageDetailsHandler(damage._id)}
                               size={20}
                             ></Icons.EyeOutline>
                             <Icons.TrashOutline
                               className="icon-trash"
                               onClick={() => deleteHandler(damage._id)}
                               size={20}
                             ></Icons.TrashOutline>
                           </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan={9} className="text-center">
                           No damage Found
                         </td>
                       </tr>
                     )}
                    {
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td></td> */}
                        {/* <td></td> */}
                        <td>Total :</td>
                        <td>{totalDamage.toFixed(2)}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DamageViewModal
        onShow={onShow}
        handleClose={handleClose}
        damage={damage}
      ></DamageViewModal>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Damage;
