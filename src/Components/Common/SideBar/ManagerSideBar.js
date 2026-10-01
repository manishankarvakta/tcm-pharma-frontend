import * as Icons from "heroicons-react";
import { useState } from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../../logo.png";
import { signInUser } from "../../Utility/Auth";
import "./SideBar.css";
import { useSelector } from "react-redux";

const ManagerSideBar = () => {
  const auth = signInUser();
  const lang = useSelector((state) => state.languageReducer);

  let active = window.location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for toggle menu
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [openMenus, setOpenMenus] = useState({}); // Track which menus are open
  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey], // Toggle the specific menu
    }));
  };
  const menuItems = [
    {
      key: "dashboard",
      label: lang.dashboard,
      icon: <Icons.AdjustmentsOutline size={22} />,
      link: "/dashboard",
    },
    {
      key: "pos",
      label: "POS",
      icon: <Icons.ShoppingBagOutline size={22} />,
      link: "/pos",
    },

    {
      key: "sales",
      label: "Sales",
      icon: <Icons.ShoppingCartOutline size={22} />,
      links: [
        {
          label: "Sales",
          to: "/sales",
          icon: <Icons.ShoppingCartOutline size={18} />,
        },
        ...(auth?.storeSettings?.isEnableApi
          ? [
              {
                label: "Ecom Sales",
                to: "/ecom",
                icon: <Icons.ShoppingCartOutline size={18} />,
              },
            ]
          : []),
        {
          label: "Customers",
          to: "/customer",
          icon: <Icons.UsersOutline size={18} />,
        },
      ],
    },

    {
      key: "products",
      label: "Products",
      icon: <Icons.ArchiveOutline size={22} />,
      links: [
        {
          label: "Products",
          to: "/product",
          icon: <Icons.ArchiveOutline size={18} />,
        },
        {
          label: "Generic",
          to: "/generic",
          icon: <Icons.ChipOutline size={18} />,
        },

        {
          label: "Brand",
          to: "/brand",
          icon: <Icons.SparklesOutline size={18} />,
        },
        {
          label: "Group",
          to: "/group",
          icon: <Icons.SparklesOutline size={18} />,
        },
        {
          label: "Unit",
          to: "/unit",
          icon: <Icons.CubeTransparentOutline size={18} />,
        },
      ],
    },
    {
      key: "procurement",
      label: "Procurement",
      icon: <Icons.InboxInOutline size={22} />,
      links: [
        {
          label: "Purchase",
          to: "/purchase",
          icon: <Icons.CurrencyDollarOutline size={18} />,
        },
        {
          label: "GRN",
          to: "/grn",
          icon: <Icons.ClipboardCheckOutline size={18} />,
        },
        {
          label: "RTV",
          to: "/rtv",
          icon: <Icons.ReceiptRefundOutline size={18} />,
        },
        {
          label: "TPN",
          to: "/tpn",
          icon: <Icons.HomeOutline size={18} />,
        },
        {
          label: "Damage",
          to: "/damage",
          icon: <Icons.TrashOutline size={18} />,
        },
        {
          label: "Supplier",
          to: "/supplier",
          icon: <Icons.UsersOutline size={18} />,
        },
      ],
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: <Icons.ViewGridAddOutline size={22} />,
      links: [
        {
          label: "Inventories",
          to: "/inventory",
          icon: <Icons.CollectionOutline size={18} />,
        },
        {
          label: lang?.adjust,
          to: "/adjust",
          icon: <Icons.SwitchVerticalOutline size={18} />,
        },

        // {
        //   label: "Movement",
        //   to: "/inventory-movement",
        //   icon: <Icons.ArchiveOutline size={18} />,
        // },
      ],
    },
    {
      key: "exports",
      label: "Exports",
      icon: <Icons.DownloadOutline size={22} />,
      link: "/exports",
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Icons.CogOutline size={22} />,
      links: [
        {
          label: "Profile Settings",
          to: "/profile",
          icon: <Icons.UserOutline size={18} />,
        },
        // {
        //   label: "Users",
        //   to: "/user",
        //   icon: <Icons.UsersOutline size={18} />,
        // },

        {
          label: "SMS",
          to: "/sms",
          icon: <Icons.ChatAltOutline size={18} />,
        },
      ],
    },

    // Add more sections as needed
  ];
  return (
    <aside className="sticky-md-top">
      <div className="d-flex   pt-3 justify-content-between pb-2 gap-2 align-items-start">
        <Link className="nav-link logo" to="/dashboard">
          <Image src={logo} fluid />
        </Link>
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
                      className={`nav-link ${
                        openMenus[menu.key] ? "active" : ""
                      }`}
                      to={menu.links ? "#" : menu.link} // Use menu.link for items without submenus
                      onClick={() => menu.links && toggleMenu(menu.key)} // Toggle submenu visibility only if there are submenus
                    >
                      <div className="d-flex justify-content-between">
                        <span>
                          {menu.icon} {menu.label}
                        </span>
                        {/* Render arrow only for menu items with submenus */}
                        {menu.links && (
                          <span className="text-end">
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
          <Link
            className={`nav-link ${active === "/dashboard" && "active"}`}
            to="/dashboard"
          >
            <Icons.AdjustmentsOutline size={22}></Icons.AdjustmentsOutline>{" "}
            Dashboard
          </Link>
          <Link
            className={`nav-link ${active === "/sms" && "active"}`}
            to="/sms"
          >
            <Icons.ChatAltOutline size={22}></Icons.ChatAltOutline> SMS
          </Link>
          <Link
            className={`nav-link ${active === "/pos" && "active"}`}
            to="/pos"
          >
            <Icons.ShoppingBagOutline size={22}></Icons.ShoppingBagOutline> POS
          </Link>
          <Link
            className={`nav-link ${active === "/sales" && "active"}`}
            to="/sales"
          >
            <Icons.ShoppingCartOutline size={22}></Icons.ShoppingCartOutline>{" "}
            Sales
          </Link>
          <Link
            className={`nav-link ${active === "/ecom" && "active"}`}
            to="/ecom"
          >
            <Icons.ShoppingCartOutline size={22}></Icons.ShoppingCartOutline>{" "}
            Ecom Sales
          </Link>
          <Link
            className={`nav-link ${active === "/user" && "active"}`}
            to="/user"
          >
            <Icons.UserOutline size={22}></Icons.UserOutline> Users
          </Link>
          {/* <Link className={`nav-link ${active === '/user/ && 'active'add'}`} to="/user/add"><Icons.UserAddOutline size={22}></Icons.UserAddOutline> Create User</Link> */}
          <Link
            className={`nav-link ${active === "/product" && "active"}`}
            to="/product"
          >
            <Icons.ArchiveOutline size={22}></Icons.ArchiveOutline> Products
          </Link>
          <Link
            className={`nav-link ${active === "/brand" && "active"}`}
            to="/brand"
          >
            <Icons.ArchiveOutline size={22}></Icons.ArchiveOutline> Brand
          </Link>
          <Link
            className={`nav-link ${active === "/unit" && "active"}`}
            to="/unit"
          >
            <Icons.ArchiveOutline size={22}></Icons.ArchiveOutline> Unit
          </Link>
          {/* <Link
            className={`nav-link ${active === "/category" && "active"}`}
            to="/category"
          >
            <Icons.CubeTransparentOutline
              size={22}
            ></Icons.CubeTransparentOutline>{" "}
            Category
          </Link> */}
          <Link
            className={`nav-link ${active === "/customer" && "active"}`}
            to="/customer"
          >
            <Icons.UsersOutline size={22}></Icons.UsersOutline> Customer
          </Link>
          <Link
            className={`nav-link ${active === "/warehouse" && "active"}`}
            to="/warehouse"
          >
            <Icons.HomeOutline size={22}></Icons.HomeOutline> Warehouse
          </Link>
          <Link
            className={`nav-link ${active === "/tpn" && "active"}`}
            to="/tpn"
          >
            <Icons.HomeOutline size={22}></Icons.HomeOutline> TPN
          </Link>
          <Link
            className={`nav-link ${active === "/damage" && "active"}`}
            to="/damage"
          >
            <Icons.HomeOutline size={22}></Icons.HomeOutline> Damage
          </Link>
          <Link
            className={`nav-link ${active === "/supplier" && "active"}`}
            to="/supplier"
          >
            <Icons.UsersOutline size={22}></Icons.UsersOutline> Supplier
          </Link>
          <Link
            className={`nav-link ${active === "/purchase" && "active"}`}
            to="/purchase"
          >
            <Icons.CurrencyDollarOutline
              size={22}
            ></Icons.CurrencyDollarOutline>{" "}
            Purchase
          </Link>
          <Link
            className={`nav-link ${active === "/grn" && "active"}`}
            to="/grn"
          >
            <Icons.ArchiveOutline size={22}></Icons.ArchiveOutline> GRN
          </Link>

          <Link
            className={`nav-link ${active === "/rtv" && "active"}`}
            to="/rtv"
          >
            <Icons.ArchiveOutline size={22}></Icons.ArchiveOutline>RTV
          </Link>

          {/* <Link
                    className={`nav-link ${active === "/inventory" && "active"}`}
                    to="/inventory"
                >
                    <Icons.ViewGridAddOutline size={22}></Icons.ViewGridAddOutline>{" "}
                    Inventory
                </Link>
                <Link
                    className={`nav-link ${active === "/cogs" && "active"}`}
                    to="/cogs"
                >
                    <Icons.ViewListOutline size={22}></Icons.ViewListOutline> COGS
                </Link> */}
          <Link
            className={`nav-link ${active === "/exports" && "active"}`}
            to="/exports"
          >
            <Icons.ViewListOutline size={22}></Icons.ViewListOutline> Exports
          </Link>
        </>
      </nav>
    </aside>
  );
};

export default ManagerSideBar;
