import * as Icons from "heroicons-react";
import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Card,
  Container,
  Image,
  ListGroup,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../pharmacy-logo.png";
import profile from "../../../profile.jpg";
import banglaIcon from "../../../flags/bangladshicon.jpeg";
import englishIcon from "../../../flags/englishicon.png";
import { useEcomSalesByStatusQuery } from "../../../services/ecomApi";
import {
  useUpdateUserMutation,
  useUsersQuery,
} from "../../../services/userApi";
import { useWarehouseQuery } from "../../../services/warehouseApi";
import { signInUser } from "../../Utility/Auth";
import "./Header.css";
import { languages } from "../../../language";
import { selectLanguage } from "../../../features/languageSlice";
import { FaWifi } from "react-icons/fa";
import { FiWifiOff } from "react-icons/fi";
import InternetStatusIcon from "../Network/InternetStatusIcon";
import { notify } from "../../Utility/Notify";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/";
const ENDPOINT = process.env.REACT_APP_WS_URL || "ws://localhost:5001/";

const Header = ({ title }) => {
  //active page check
  let activePage =
    window.location.pathname.includes("/reports") ||
    window.location.pathname.includes("/eCommerceStoreSetup");

  const user = signInUser();
  // console.log("user",user)

  const { aamarId, warehouse } = user || {};
  const {
    data: userData,
    isSuccess: isUserSuccess,
    refetch: isUserRefetch,
  } = useUsersQuery({
    warehouse,
    aamarId,
  });
  // console.log("userData", userData);

  const dispatch = useDispatch();
  const newOrder = useSelector((state) => state.ecomSalesReducer.newOrder);

  const { data, isSuccess } = useEcomSalesByStatusQuery("order");
  const [playAudio, setPlayAudio] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);
  const lang = useSelector((state) => state.languageReducer);

  const posSaleData = useSelector((state) => state.posReducer);



  // console.log("User:", user);
  // const user = JSON.parse(localStorage.getItem("user"));
  // console.log("user", user);

  const accessToken = localStorage.getItem("accessTokens");
  const navigate = useNavigate();

  // console.log("user Info::>", user);

  const [updateHoldSale] = useUpdateUserMutation();

  //warehouse name get
  const [whName, setWhName] = useState(" ");

  const { data: wh, refetch } = useWarehouseQuery(user?.warehouse);

  // console.log("data", wh?.name, user?.warehouse);
  useEffect(() => {
    if (user?.warehouse) {
      refetch();
    }
  }, [user?.warehouse, refetch]);

  useEffect(() => {
    if (wh) {
      setWhName(wh?.name);
      refetch();
    }
  }, [wh, refetch]);
  // console.log('warehouse',wh)

  // handleLogOut
  const handleLogout = async (e) => {
    e.preventDefault();
    //CHECK IF POS HAS CART
    // console.log("posSaleData", posSaleData); // Check posSaleData
    if (posSaleData?.products?.length > 0) {
      let hold = localStorage.getItem("hold_cart");
      let holdData = JSON.parse(hold);
      // console.log("holdData before update", holdData); // Check holdData before update
      if (holdData !== null) {
        holdData = [
          ...holdData,
          { products: posSaleData.products, order: new Date() },
        ];
      } else {
        holdData = [{ products: posSaleData.products, order: new Date() }];
      }
      // console.log("holdData after update", holdData); // Check holdData after update
      // UPDATE USER HOLD DATA
      await Promise.all([updateHoldSale({ _id: user.id, holdSale: holdData })]);
      // console.log("Hold sale updated successfully"); // Log after hold sale update
      // LOGOUT PROCESS
      localStorage.clear();
      navigate("/login", { replace: true });
    } else {
      //LOGOUT PROCESS
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  const handleUserProfile = (id) => {
    navigate(`/profile`);
  };
  const language = useSelector((state) => state.languageReducer);

  const handleChangeLang = (lang) => {
    // console.log(lang);

    if (lang === "en") {
      // console.log("EN", "success");
      dispatch(selectLanguage(languages.en));
    } else {
      // console.log("BN", "success");
      dispatch(selectLanguage(languages.bn));
    }

    // TODO: save user language to user -> storeSettings
  };

  // console.log("user",user)

  // user photo
  const matchedUser =
    isUserSuccess && Array.isArray(userData)
      ? userData.find((item) => item._id === user?.id)
      : null;

  const userPhoto = matchedUser?.photo;

  const [open, setOpen] = useState(false);

  const options = [
    { value: "bn", label: "বাংলা", icon: banglaIcon },
    { value: "en", label: "English", icon: englishIcon },
  ];

  const selected =
    options.find((opt) => opt.value === language?.lang) || options[0];

  const handleCopyAamarId = () => {
    if (user?.aamarId) {
      navigator.clipboard.writeText(user.aamarId);
      notify(`Aamar ID ( ${user.aamarId} ) copied!`, "success");
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="no-toggle sticky-md-top ">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center gap-4">
            {/* {activePage && (
              <div className="d-flex align-items-center gap-4 mr-4">
                <Link to="/dashboard" className=" d-flex align-items-center">
                  <Icons.ArrowLeft size={24} />
                </Link>
                <Image src={logo} height="30" alt="Logo" />
              </div>
            )} */}
            {/* Logo */}
            <Navbar.Brand className="logo me-md-5 d-none d-sm-block  ">
              <div className="d-flex justify-content-between align-items-center gap-4">
                {activePage && (
                  <Link to="/dashboard" className="nav-link text-end ml-4">
                    <Icons.ArrowLeft size={24} />
                  </Link>
                )}
                <Link className="nav-link text-end ml-4">
                  {title ? title : <Image src={logo} height="50" />}
                </Link>
              </div>
            </Navbar.Brand>
          </div>

          {/* Remove the toggle button */}
          <div className="d-flex justify-content-between align-items-center">
            {/* Empty Nav Space */}
            <Nav
              className="me-auto"
              style={{ maxHeight: "100px" }}
              navbarScroll
            />
            {/* {loggedInUser?.type !== "ecom" ? (
              <Nav>
                <Link className="nav-link" to="/pos">
                  <Icons.CalculatorOutline size={22}></Icons.CalculatorOutline>{" "}
                </Link>
              </Nav>
            ) : (
              ""
            )} */}
            <div className="me-3 ">
              <div className="mb-0 d-flex align-items-center  text-small">
                {/* internet */}
                <div>
                  <InternetStatusIcon />
                </div>

                {/* Warehouse Section */}
                <span className="me-3 d-flex align-items-center">
                  <Icons.HomeOutline size={18} className="me-1" />
                  <span>{whName}</span>
                </span>

                {/* Aamar ID Section */}
                <div className="d-flex  align-items-center">
                  <strong className="me-1 d-none d-md-inline">
                    {lang.aamarID}:
                  </strong>
                  <p className="d-md-none d-flex  m-0">AId:</p>

                  <span className="d-flex ">
                    <span
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={handleCopyAamarId}
                    >
                      {user?.aamarId}
                    </span>
                  </span>
                </div>

                {/* language field */}

                <div className="dropdown ms-2">
                  {/* Selected Button */}
                  <button
                    className="btn btn-white btn-sm dropdown-toggle d-flex align-items-center gap-2 w-100 border"
                    type="button"
                    id="languageDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded={open ? "true" : "false"}
                    onClick={() => setOpen(!open)}
                    style={{
                      minWidth: "120px", // 🔥
                      maxWidth: "120px",
                      borderRadius: "0.375rem",
                      borderColor: "#ced4da",
                    }}
                  >
                    <Image
                      src={selected.icon}
                      alt={selected.label}
                      height={16}
                      width={24}
                    />
                    <span className="text-truncate">{selected.label}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <ul
                    className={`dropdown-menu ${
                      open ? "show" : ""
                    } w-100 border`}
                    aria-labelledby="languageDropdown"
                    style={{
                      minWidth: "120px",
                      maxWidth: "120px",
                      borderRadius: "0.375rem",
                      borderColor: "#ced4da",
                      overflowY: "visible", // 👈 Scroll off
                      maxHeight: "unset",
                    }}
                  >
                    {options.map((opt) => (
                      <li key={opt.value}>
                        <button
                          className="dropdown-item d-flex align-items-center gap-2"
                          type="button"
                          onClick={() => {
                            handleChangeLang(opt.value);
                            setOpen(false);
                          }}
                        >
                          <Image
                            src={opt.icon}
                            alt={opt.label}
                            height={16}
                            width={24}
                          />
                          <span>{opt.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Admin and POS Links */}
            <Nav className="d-flex ms-2 ms-md-0  align-items-center">
              {(user?.type === "admin" || user?.type === "POS") && (
                <Link
                  className="nav-link d-flex me-2 me-md-0 align-items-center"
                  to="/pos"
                >
                  <Icons.CalculatorOutline size={24} />
                </Link>
              )}
              {/* <Link
                className={`nav-link d-flex d-none d-sm-block align-items-center ${
                  active === "/dashboard" ? "active" : ""
                }`}
                to="/dashboard"
              >
                <Icons.AdjustmentsOutline size={22} />
              </Link> */}
            </Nav>

            {accessToken ? (
              <NavDropdown
                title={
                  <img
                    // src={user?.photo || profile}
                    src={
                      userPhoto
                        ? `${
                            process.env.REACT_APP_PHOTO_URL
                          }${encodeURIComponent(userPhoto)}`
                        : profile
                    }
                    alt="User"
                    width="30"
                    height="30"
                    title={user?.username}
                    className="rounded-circle border border-secondary"
                  />
                }
                align="end"
                className=" p-1"
                id="user-profile-dropdown"
              >
                <div style={{ width: "200px" }}>
                  <Card className="text-center profile-card border-0">
                    <div className="position-relative mt-3 mb-2">
                      <div className="progress-circle" data-progress={50}>
                        <img
                          // src={user?.photo || profile}
                          src={
                            userPhoto
                              ? `${
                                  process.env.REACT_APP_PHOTO_URL
                                }${encodeURIComponent(userPhoto)}`
                              : profile
                          }
                          width="70"
                          alt="profile"
                          className="rounded-circle profile-img"
                        />
                      </div>
                      <Card.Body className="my-0">
                        <Card.Title
                          style={{
                            fontSize: "14px",
                            // fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          {user?.name}
                        </Card.Title>
                        <Card.Subtitle style={{ fontSize: "12px" }}>
                          @{user?.username} - {user?.type}
                        </Card.Subtitle>
                      </Card.Body>
                      {/* <hr/> */}
                    </div>
                    <ListGroup variant="flush" className="text-start ">
                      <ListGroup.Item
                        as={Link}
                        to="/profile"
                        className="custom-list-item "
                        style={{
                          fontSize: "16px",
                          // fontWeight: "600",
                          // color: "#333",
                        }}
                      >
                        <Icons.UserCircleOutline size={22} /> Profile
                      </ListGroup.Item>
                      <ListGroup.Item
                        as={Link}
                        onClick={handleLogout}
                        className="custom-list-item"
                        style={{
                          fontSize: "16px",
                          // fontWeight: "600",
                          // color: "#333",
                        }}
                      >
                        <Icons.LoginOutline size={22} /> Log Out
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </div>
              </NavDropdown>
            ) : (
              <Nav>
                <Link className="nav-link" to="/login">
                  <Icons.LoginOutline size={22} /> Login
                </Link>
              </Nav>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
