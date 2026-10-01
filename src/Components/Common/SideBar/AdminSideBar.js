import * as Icons from "heroicons-react";
import { useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath } from "react-router-dom";
import { selectLanguage } from "../../../features/languageSlice";
import { languages } from "../../../language";
import logo from "../../../pharmacy-logo.png";
import { signInUser } from "../../Utility/Auth";
import "./SideBar.css";

const AdminSideBar = () => {
  const auth = signInUser();
  let active = window.location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for toggle menu
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [openMenus, setOpenMenus] = useState({}); // Track which menus are open
  const lang = useSelector((state) => state.languageReducer);
  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey], // Toggle the specific menu
    }));
  };

  // console.log("LanguageAdmin:", lang);
  const menuItems = [
    {
      key: "dashboard",
      label: lang.dashboard,
      icon: <Icons.AdjustmentsOutline size={22} />,
      link: "/dashboard",
    },
    // {
    //   key: "daybook",
    //   label: "Day Book",
    //   icon: <Icons.BookOpenOutline size={22} />,
    //   link: "/daybook",
    // },
    {
      key: "pos",
      label: lang.pos,
      icon: <Icons.ShoppingBagOutline size={22} />,
      link: "/pos",
    },
    {
      key: "sales",
      label: lang?.sales,
      icon: <Icons.ShoppingCartOutline size={22} />,
      links: [
        {
          label: lang?.sales,
          to: "/sales",
          icon: <Icons.ShoppingCartOutline size={18} />,
        },
        // ...(auth?.storeSettings?.isEnableApi
        //   ? [
        //       {
        //         label: "Ecom Sales",
        //         to: "/ecom",
        //         icon: <Icons.ShoppingCartOutline size={18} />,
        //       },
        //     ]
        //   : []),

        {
          label: lang.customers,
          to: "/customer",
          icon: <Icons.UsersOutline size={18} />,
        },
        // {
        //   label: "CustomerGroup",
        //   to: "/customerGroup",
        //   icon: <Icons.UsersOutline size={18} />,
        // },
        // {
        //   label: "Due Bills",
        //   to: "/duesale",
        //   icon: <Icons.ShoppingBagOutline size={18} />,
        // },
      ],
    },
    {
      key: "accounts",
      label: lang.transaction,
      icon: <Icons.CurrencyDollarOutline size={22} />,
      links: [
        {
          label: lang.accounts,
          to: "/accounts",
          icon: <Icons.CurrencyBangladeshiOutline size={18} />,
        },
        {
          label: lang.accountsHead,
          to: "/accountheads",
          icon: <Icons.BookmarkAltOutline size={18} />,
        },

        // {
        //   label: "Collection",
        //   to: "/payments",
        //   icon: <Icons.CurrencyBangladeshiOutline size={18} />,
        // },
        // {
        //   label: "Ledger",
        //   to: "/ledger",
        //   icon: <Icons.ChartPieOutline size={18} />,
        // },
      ],
    },
    {
      key: "products",
      label: lang.products,
      icon: <Icons.ArchiveOutline size={22} />,
      links: [
        {
          label: lang.products,
          to: "/product",
          icon: <Icons.ArchiveOutline size={18} />,
        },
        {
          label: lang.generics,
          to: "/generic",
          icon: <Icons.CubeTransparentOutline size={18} />,
        },
        {
          label: lang.brand,
          to: "/brand",
          icon: <Icons.SparklesOutline size={18} />,
        },
        {
          label: lang.group,
          to: "/group",
          icon: <Icons.ChipOutline size={18} />,
        },
      ],
    },
    {
      key: "procurement",
      label: lang.procurement,
      icon: <Icons.InboxInOutline size={22} />,
      links: [
        {
          label: lang.purchase,
          to: "/purchase",
          icon: <Icons.CurrencyDollarOutline size={18} />,
        },
        {
          label: lang.GRN,
          to: "/grn",
          icon: <Icons.ClipboardCheckOutline size={18} />,
        },
        {
          label: lang.RTV,
          to: "/rtv",
          icon: <Icons.ReceiptRefundOutline size={18} />,
        },
        {
          label: lang.TPN,
          to: "/tpn",
          icon: <Icons.HomeOutline size={18} />,
        },

        {
          label: lang.supplier,
          to: "/supplier",
          icon: <Icons.UsersOutline size={18} />,
        },
      ],
    },
    {
      key: "inventory",
      label: lang.inventory,
      icon: <Icons.ViewGridAddOutline size={22} />,
      links: [
        {
          label: lang.inventories,
          to: "/inventory",
          icon: <Icons.CollectionOutline size={18} />,
        },
        {
          label: "Stock Ledger",
          to: "/stock-ledger",
          icon: <Icons.BookOpenOutline size={18} />,
        },
        {
          label: lang?.adjust,
          to: "/adjust",
          icon: <Icons.SwitchVerticalOutline size={18} />,
        },

        // {
        //   label: "COGS",
        //   to: "/cogs",
        //   icon: <Icons.ReceiptTaxOutline size={18} />,
        // },
        // {
        //   label: lang.movement,
        //   to: "/inventory-movement",
        //   icon: <Icons.ArchiveOutline size={18} />,
        // },
        
        {
          label: lang.damage,
          to: "/damage",
          icon: <Icons.TrashOutline size={18} />,
        },
      ],
    },
    {
      key: "exports",
      label: lang.exports,
      icon: <Icons.DownloadOutline size={22} />,
      link: "/exports",
    },
    {
      key: "settings",
      label: lang.settings,
      icon: <Icons.CogOutline size={22} />,
      links: [
        {
          label: lang.profileSetting,
          to: "/profile",
          icon: <Icons.UserOutline size={18} />,
        },
        {
          label: lang.users,
          to: "/user",
          icon: <Icons.UsersOutline size={18} />,
        },
        {
          label: lang.warehouse,
          to: "/warehouse",
          icon: <Icons.HomeOutline size={18} />,
        },
        {
          label: lang.sms,
          to: "/sms",
          icon: <Icons.ChatAltOutline size={18} />,
        },
        {
          label: lang.storeSetting,
          to: "/settings",
          icon: <Icons.CogOutline size={18} />,
        },
        {
          label: "Backup",
          to: "/settings/backup",
          icon: <Icons.DatabaseOutline size={18} />,
        },
      ],
    },

    // Add more sections as needed
  ];
  const dispatch = useDispatch();
  const language = useSelector((state) => state.languageReducer);

  const handleChangeLang = (lang) => {
    // console.log(lang);

    if (lang === "en") {
      console.log("EN", "success");
      dispatch(selectLanguage(languages.en));
    } else {
      console.log("BN", "success");
      dispatch(selectLanguage(languages.bn));
    }

    // TODO: save user language to user -> storeSettings
  };
  return (
    <aside className="sticky-md-top ">
      <div className="d-flex   pt-3 justify-content-between pb-2 gap-2 align-items-start">
        <Link className="nav-link logo" to="/">
          <Image src={logo} fluid />
        </Link>

        {/* small device sidebar */}

        <div>
          <div onClick={toggleSidebar} className="me-2 d-block d-md-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
              style={{
                width: "24px", // Size of the icon
                height: "24px",
                color: "#333", // Icon color
              }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>

          {/* <GiHamburgerMenu
            className="d-md-none me-2 d-sm-block"
            style={{ fontSize: "30px" }}
          /> */}
          <nav className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className="nav-links">
              <>
                <h2 className="mb-3 d-flex justify-content-center">
                  <Image
                    src={logo}
                    style={{ width: "150px", height: "auto" }}
                    fluid
                  />
                </h2>
                {menuItems.map((menu) => (
                  <div key={menu.key}>
                    {/* Parent Link */}
                    <Link
                      className={`nav-link  ${
                        openMenus[menu.key] ? "active" : ""
                      }`}
                      to={menu.links ? "#" : menu.link} // Use menu.link for items without submenus
                      onClick={() => menu.links && toggleMenu(menu.key)} // Toggle submenu visibility only if there are submenus
                    >
                      <div className="d-flex justify-content-between  ">
                        <span>
                          {menu.icon} {menu.label}
                        </span>
                        {/* Render arrow only for menu items with submenus */}
                        {menu.links && (
                          <span className="text-end ">
                            {openMenus[menu.key] ? (
                              <Icons.ChevronDownOutline size={16} />
                            ) : (
                              <Icons.ChevronRightOutline size={16} />
                            )}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Submenu Links */}
                    {openMenus[menu.key] && menu.links && (
                      <ul className="p-0 ps-4">
                        {menu.links.map((link, index) => (
                          <li key={index}>
                            <Link
                              className={`nav-link pt-0 ${
                                active === link.to ? "active" : ""
                              }`}
                              to={link.to}
                            >
                              {link.icon} {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            </div>
            <div className="sidebar-info  mt-5">
              <span className="mx-2 d-flex align-items-center d-md-none ">
                <div className="input-group">
                  <select
                    className="form-select "
                    onChange={(e) => handleChangeLang(e.target.value)}
                    value={language?.lang}
                  >
                    <option value="bn">বাংলা</option>
                    <option value="en">English</option>
                  </select>
                </div>
                {/* <strong className="me-1 d-none d-lg-inline">
                  
                </strong> */}
                {/* <span>{whName}</span> */}
              </span>
            </div>
          </nav>

          {/* Optional - When sidebar is closed, use backdrop (optional) */}
          <div
            className={`position-fixed top-0 start-0 w-100 h-100 bg-black opacity-50 ${
              isSidebarOpen ? "d-block" : "d-none"
            }`}
            onClick={toggleSidebar} // Close sidebar when backdrop is clicked
            style={{
              zIndex: "998", // Ensure backdrop is below sidebar
            }}
          ></div>
        </div>
      </div>
      {/* DASHBOARD */}
      <nav
        className="nav flex-column d-none d-sm-block"
        style={{ overflowY: "scroll", display: "block", height: "100vh" }}
      >
        <>
          {/* DASHBOARD */}
          <Link
            className={`nav-link ${active === "/dashboard" && "active"}`}
            to="/dashboard"
          >
            <Icons.AdjustmentsOutline size={22}></Icons.AdjustmentsOutline>{" "}
            {lang.dashboard}
          </Link>

          {/* POS */}
          <Link
            className={`nav-link ${active === "/pos" && "active"}`}
            to="/pos"
          >
            <Icons.ShoppingBagOutline size={22} /> {lang.pos}
          </Link>

          {/* SALES DW */}
          <Link
            className={`nav-link ${
              (active === "/ecom" ||
                active === "/sales" ||
                active === "/articleSaleExport" ||
                active === "/categorySaleExport" ||
                active === "/customer") &&
              "active"
            }`}
            to="/sales"
          >
            <div className="d-flex justify-content-between">
              <span>
                <Icons.ShoppingCartOutline size={22} /> {lang.sales}
              </span>
              <span className="text-end">
                {active === "/sales" ||
                active === "/customer" ||
                active === "/categorySaleExport" ||
                active === "/articleSaleExport" ? (
                  <Icons.ChevronDownOutline size={16} />
                ) : (
                  <Icons.ChevronRightOutline size={16} />
                )}
                {/*  */}
              </span>
            </div>
          </Link>
          <ul
            className={`p-0 ps-4 ${
              active === "/sales" ||
              active === "/customer" ||
              active === "/categorySaleExport" ||
              active === "/articleSaleExport"
                ? "d-bolck"
                : "d-none"
            }`}
          >
            <li>
              <Link
                className={`nav-link pt-0 ${
                  active === "/sales" ||
                  active === "/articleSaleExport" ||
                  active === "/categorySaleExport"
                    ? "active"
                    : ""
                }`}
                to="/sales"
              >
                <Icons.ShoppingCartOutline
                  size={18}
                ></Icons.ShoppingCartOutline>{" "}
                {lang.sales}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link mt-0 ${
                  active === "/customer" && "active"
                }`}
                to="/customer"
              >
                <Icons.UsersOutline size={18}></Icons.UsersOutline>{" "}
                {lang.customers}
              </Link>
            </li>
          </ul>

          {/* ACCOUNTS DW */}
          <Link
            className={`nav-link ${
              (active === "/accountheads" ||
                active === "/accounts" ||
                active === "/addAfterSale" ||
                active === "/addAccountExpense" ||
                active === "/addAccount" ||
                matchPath("/accountheads/update/:id", active) ||
                active === "/ledger" ||
                active === "/addAccountHead") &&
              "active"
            }`}
            to="/accounts"
          >
            <div className="d-flex justify-content-between">
              <span>
                <Icons.CurrencyDollarOutline size={22} /> {lang?.accounts}
              </span>
              <span className="text-end">
                {active === "/accountheads" ||
                active === "/accounts" ||
                active === "/addAfterSale" ||
                active === "/addAccountExpense" ||
                active === "/addAccount" ||
                active === "/ledger" ||
                active === "/addAccountHead" ? (
                  <Icons.ChevronDownOutline size={16} />
                ) : (
                  <Icons.ChevronRightOutline size={16} />
                )}
                {/*  */}
              </span>
            </div>
          </Link>
          <ul
            className={`p-0 ps-4 ${
              active === "/accountheads" ||
              active === "/accounts" ||
              matchPath("/accountheads/update/:id", active) ||
              active === "/addAfterSale" ||
              active === "/addAccountExpense" ||
              active === "/addAccount" ||
              active === "/ledger" ||
              active === "/addAccountHead"
                ? "d-bolck"
                : "d-none"
            }`}
          >
            <li>
              <Link
                className={`nav-link  pt-0 ${
                  (active === "/accounts" ||
                    active === "/addAfterSale" ||
                    active === "/addAccountExpense" ||
                    active === "/addAccount") &&
                  "active"
                }`}
                to="/accounts"
              >
                <Icons.CurrencyBangladeshiOutline size={18} />
                {lang?.transaction}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link  pt-0 ${
                  (active === "/accountheads" ||
                    matchPath("/accountheads/update/:id", active) ||
                    active === "/addAccountHead") &&
                  "active"
                }`}
                to="/accountheads"
              >
                <Icons.BookmarkAltOutline size={18} /> {lang?.accountsHead}
              </Link>
            </li>
          </ul>

          {/* RPODUCT DW */}
          <Link
            className={`nav-link ${
              (active === "/product" ||
                active === "/product/import" ||
                active === "/price/import" ||
                active === "/product/add" ||
                active === "/brand" ||
                active === "/brand/import" ||
                active === "/group" ||
                active === "/group/import" ||
                active === "/generic" ||
                active === "/generic/import") &&
              "active"
            }`}
            to="/product"
          >
            <div className="d-flex justify-content-between">
              <span>
                <Icons.ArchiveOutline size={22} /> {lang?.products}
              </span>
              <span className="text-end">
                {active === "/product" ||
                active === "/product/import" ||
                active === "/price/import" ||
                active === "/product/add" ||
                active === "/brand" ||
                active === "/brand/import" ||
                active === "/unit" ||
                active === "/group" ||
                active === "/group/import" ||
                active === "/generic" ||
                active === "/generic/import" ? (
                  <Icons.ChevronDownOutline size={16} />
                ) : (
                  <Icons.ChevronRightOutline size={16} />
                )}
                {/*  */}
              </span>
            </div>
          </Link>
          <ul
            className={`p-0 ps-4 ${
              active === "/product" ||
              active === "/product/import" ||
              active === "/price/import" ||
              active === "/product/add" ||
              active === "/brand" ||
              active === "/brand/import" ||
              active === "/group" ||
              active === "/group/import" ||
              active === "/generic" ||
              active === "/generic/import"
                ? "d-bolck"
                : "d-none"
            }`}
          >
            <li>
              <Link
                className={`nav-link mt-0 ${
                  (active === "/product" ||
                    active === "/product/import" ||
                    active === "/price/import" ||
                    active === "/product/add") &&
                  "active"
                }`}
                to="/product"
              >
                <Icons.ArchiveOutline size={18} /> {lang?.products}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link mt-0 ${
                  (active === "/group" || active === "/group/import") &&
                  "active"
                }`}
                to="/group"
              >
                <Icons.ChipOutline size={18} /> {lang?.group}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link mt-0 ${
                  (active === "/generic" ||
                    active === "/generic/addCategory" ||
                    active === "/generic/import") &&
                  "active"
                }`}
                to="/generic"
              >
                <Icons.CubeTransparentOutline
                  size={18}
                ></Icons.CubeTransparentOutline>{" "}
                {lang?.generic}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link mt-0 ${
                  (active === "/brand" || active === "/brand/import") &&
                  "active"
                }`}
                to="/brand"
              >
                <Icons.SparklesOutline size={18} /> {lang?.brand}
              </Link>
            </li>
          </ul>

          {/* procurement */}
          <Link
            className={`nav-link ${
              (active === "/purchase" ||
                active === "/purchase-createSearch" ||
                active === "/purchase-create" ||
                active === "/grn" ||
                active === "/grn-create" ||
                active === "/grn-details" ||
                active === "/grn-summary" ||
                active === "/rtv" ||
                active === "/rtv-create" ||
                active === "/rtv-details" ||
                active === "/rtv-summary" ||
                active === "/tpn" ||
                active === "/tpn-out" ||
                matchPath("/supplier-ledger/:id", active) ||
                matchPath("/update-supplier/:id", active) ||
                active === "/tpn-details" ||
                active === "/tpn-summary" ||
                active === "/supplier" ||
                active === "/create-supplier" ||
                active === "/supplier/import") &&
              "active"
            }`}
            to="/purchase"
          >
            <div className="d-flex justify-content-between">
              <span>
                <Icons.InboxInOutline size={22} /> {lang?.procurement}
              </span>
              <span className="text-end">
                {active === "/purchase" ||
                active === "/purchase-createSearch" ||
                active === "/purchase-create" ||
                active === "/grn" ||
                active === "/grn-create" ||
                active === "/grn-details" ||
                active === "/grn-summary" ||
                active === "/rtv" ||
                active === "/rtv-create" ||
                active === "/rtv-details" ||
                active === "/rtv-summary" ||
                active === "/tpn" ||
                active === "/tpn-out" ||
                active === "/tpn-details" ||
                active === "/tpn-summary" ||
                active === "/supplier" ||
                active === "/supplier/import" ||
                active === "/create-supplier" ? (
                  <Icons.ChevronDownOutline size={16} />
                ) : (
                  <Icons.ChevronRightOutline size={16} />
                )}
                {/*  */}
              </span>
            </div>
          </Link>
          <ul
            className={`p-0 ps-4 ${
              active === "/purchase" ||
              active === "/purchase-createSearch" ||
              active === "/purchase-create" ||
              active === "/grn" ||
              active === "/grn-create" ||
              active === "/grn-details" ||
              active === "/grn-summary" ||
              active === "/rtv" ||
              active === "/rtv-create" ||
              active === "/rtv-details" ||
              active === "/rtv-summary" ||
              active === "/tpn" ||
              active === "/tpn-out" ||
              active === "/tpn-details" ||
              active === "/tpn-summary" ||
              active === "/supplier" ||
              matchPath("/supplier-ledger/:id", active) ||
              matchPath("/update-supplier/:id", active) ||
              active === "/create-supplier" ||
              active === "/supplier/import"
                ? "d-bolck"
                : "d-none"
            }`}
          >
            <li>
              <Link
                className={`nav-link mt-0 ${
                  (active === "/purchase" ||
                    active === "/purchase-create" ||
                    active === "/purchase-createSearch") &&
                  "active"
                }`}
                to="/purchase"
              >
                <Icons.CurrencyDollarOutline
                  size={18}
                ></Icons.CurrencyDollarOutline>{" "}
                {lang?.purchase}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link  pt-0 ${
                  (active === "/grn" ||
                    active === "/grn-create" ||
                    active === "/grn-details" ||
                    active === "/grn-summary") &&
                  "active"
                }`}
                to="/grn"
              >
                <Icons.ClipboardCheckOutline size={18} /> {lang?.GRN}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link pt-0 ${
                  (active === "/rtv" ||
                    active === "/rtv-create" ||
                    active === "/rtv-details" ||
                    active === "/rtv-summary") &&
                  "active"
                }`}
                to="/rtv"
              >
                <Icons.ReceiptRefundOutline size={18} /> {lang?.RTV}
              </Link>
            </li>

            <li>
              <Link
                className={`nav-link pt-0 ${
                  (active === "/tpn" ||
                    active === "/tpn-out" ||
                    active === "/tpn-details" ||
                    active === "/tpn-summary") &&
                  "active"
                }`}
                to="/tpn"
              >
                <Icons.HomeOutline size={18}></Icons.HomeOutline> {lang?.TPN}
              </Link>
            </li>

            <li>
              <Link
                className={`nav-link pt-0 ${
                  (active === "/supplier" ||
                    active === "/supplier/import" ||
                    matchPath("/update-supplier/:id", active) ||
                    matchPath("/supplier-ledger/:id", active) ||
                    active === "/create-supplier") &&
                  "active"
                }`}
                to="/supplier"
              >
                <Icons.UsersOutline size={18}></Icons.UsersOutline>{" "}
                {lang?.supplier}
              </Link>
            </li>
          </ul>

          {/* INVENTORY */}
          <Link
            className={`nav-link ${
              (active === "/inventory" ||
                active === "/stock-ledger" ||
                active === "/adjust" ||
                active === "/movement" ||
                // active === "/inventory-movement" ||
                active === "/cogs" ||
                active === "/damage" ||
                active === "/damagecreate" ||
                active === "/damage-details" ||
                active === "/damage-summary") &&
              "active"
            }`}
            to="/inventory"
          >
            <div className="d-flex justify-content-between">
              <span>
                <Icons.ViewGridAddOutline size={22} /> {lang?.inventory}
              </span>
              <span className="text-end">
                {active === "/inventory" ? (
                  <Icons.ChevronDownOutline size={16} />
                ) : (
                  <Icons.ChevronRightOutline size={16} />
                )}
                {/*  */}
              </span>
            </div>
          </Link>
          <ul
            className={`p-0 ps-4 ${
              active === "/inventory" ||
              active === "/stock-ledger" ||
              active === "/adjust" ||
              active === "/movement" ||
              // active === "/inventory-movement" ||
              active === "/cogs" ||
              active === "/damage" ||
              active === "/damagecreate" ||
              active === "/damage-details" ||
              active === "/damage-summary"
                ? "d-bolck"
                : "d-none"
            }`}
          >
            <li>
              <Link
                className={`nav-link pt-0 ${
                  active === "/inventory" && "active"
                }`}
                to="/inventory"
              >
                <Icons.CollectionOutline size={18} /> {lang?.inventories}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link pt-0 ${active === "/adjust" && "active"}`}
                to="/adjust"
              >
                <Icons.SwitchVerticalOutline size={18} /> {lang?.adjust}
              </Link>
            </li>
            {/* <li>
              <Link
                className={`nav-link pt-0 ${
                  active === "/movement" && "active"
                }`}
                to="/movement"
              >
                <Icons.ArchiveOutline size={18} /> Movement
              </Link>
            </li> */}
            {/* <li>
              <Link
                className={`nav-link pt-0 ${
                  active === "/inventory-movement" && "active"
                }`}
                to="/inventory-movement"
              >
                <Icons.ArchiveOutline size={18} /> {lang?.movement}
              </Link>
            </li> */}
            <li>
              <Link
                className={`nav-link pt-0 ${
                  active === "/stock-ledger" && "active"
                }`}
                to="/stock-ledger"
              >
                <Icons.BookOpenOutline size={18} /> Stock Ledger
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link pt-0 ${
                  (active === "/damage" ||
                    active === "/damagecreate" ||
                    active === "/damage-details" ||
                    active === "/damage-summary") &&
                  "active"
                }`}
                to="/damage"
              >
                <Icons.TrashOutline size={18} /> {lang?.damage}
              </Link>
            </li>
          </ul>

          {/* <Link
            className={`nav-link ${
              (active === "/exports" ||
                active === "/popular" ||
                active === "/supplierSaleExport" ||
                active === "/allCategorySales") &&
              "active"
            }`}
            to="/exports"
          >
            <Icons.DownloadOutline size={22} /> {lang?.exports}
          </Link> */}

          {/* Reports */}
          <Link
            className={`nav-link ${active === "/reports" && "active"}`}
            to="/reports"
          >
            <Icons.ClipboardListOutline size={22} /> {lang?.reports}
          </Link>

          {/* SETTINGS */}
          <Link
            className={`nav-link ${
              (active === "/user" ||
                active === "/user/add" ||
                active === "/settings" ||
                active === "/settings/backup" ||
                active === "/warehouse" ||
                matchPath("user/:id", active) ||
                matchPath("user/update/:id", active) ||
                matchPath("warehouse/update/:id", active) ||
                active === "/sms" ||
                active === "/profile") &&
              "active"
            }`}
            to="/settings"
          >
            <div className="d-flex justify-content-between">
              <span>
                <Icons.CogOutline size={22} /> {lang?.settings}
              </span>
              <span className="text-end">
                {active === "/user" ||
                active === "/user/add" ||
                active === "/settings/backup" ||
                matchPath("user/:id", active) ||
                matchPath("user/update/:id", active) ||
                matchPath("warehouse/update/:id", active) ||
                active === "/warehouse" ||
                active === "/sms" ||
                active === "/profile" ? (
                  <Icons.ChevronDownOutline size={16} />
                ) : (
                  <Icons.ChevronRightOutline size={16} />
                )}
                {/*  */}
              </span>
            </div>
          </Link>
          <ul
            className={`p-0 ps-4 ${
              active === "/user" ||
              active === "/user/add" ||
              active === "/settings/backup" ||
              matchPath("user/:id", active) ||
              matchPath("user/update/:id", active) ||
              matchPath("warehouse/update/:id", active) ||
              active === "/warehouse" ||
              active === "/sms" ||
              active === "/profile" ||
              active === "/settings"
                ? "d-bolck"
                : "d-none"
            }`}
          >
            <li>
              <Link
                className={`nav-link mt-0 ${active === "/profile" && "active"}`}
                to="/profile"
              >
                <Icons.UserOutline size={18} /> {lang?.profileSetting}
              </Link>
            </li>
            <li>
              {/* USER */}
              <Link
                className={`nav-link mt-0 ${
                  (active === "/user" ||
                    active === "/user/add" ||
                    matchPath("user/:id", active) ||
                    matchPath("user/update/:id", active)) &&
                  "active"
                }`}
                to="/user"
              >
                <Icons.UsersOutline size={18} /> {lang?.users}
              </Link>
            </li>

            <li>
              {/* WAREHOUSE */}
              <Link
                className={`nav-link mt-0 ${
                  (matchPath("warehouse/update/:id", active) ||
                    active === "/warehouse") &&
                  "active"
                }`}
                to="/warehouse"
              >
                <Icons.HomeOutline size={18} /> {lang?.warehouse}
              </Link>
            </li>
            <li>
              {/* SMS */}
              <Link
                className={`nav-link mt-0 ${active === "/sms" && "active"}`}
                to="/sms"
              >
                <Icons.ChatAltOutline size={18}></Icons.ChatAltOutline>{" "}
                {lang?.sms}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link mt-0 ${
                  active === "/settings" && "active"
                }`}
                to="/settings"
              >
                <Icons.CogOutline size={18} /> {lang?.storeSettings}
              </Link>
            </li>
            <li>
              <Link
                className={`nav-link mt-0 ${
                  active === "/settings/backup" && "active"
                }`}
                to="/settings/backup"
              >
                <Icons.DatabaseOutline size={18} /> Backup
              </Link>
            </li>
          </ul>
        </>
      </nav>
    </aside>
  );
};
export default AdminSideBar;
