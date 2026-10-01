import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import * as Icons from "heroicons-react";
import { Image } from "react-bootstrap";
import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../../pharmacy-logo.png";

import "./ReportSideBar.css";

const ReportSideBar = ({ active }) => {
  const lang = useSelector((state) => state.languageReducer);

  const location = useLocation();
  const currentPath = location.pathname;

  const [openMenus, setOpenMenus] = useState({}); 

  const menuItems = useMemo(() => [
    {
      key: "salesReports",
      label: lang?.salesReports || "Sales Reports",
      icon: <Icons.ShoppingCartOutline size={22} />,
      children: [
        { label: lang?.customerWiseSales || "Customer Wise Sales", pathKey: "customerWiseSalesReport", icon: <Icons.ShoppingCartOutline size={18} /> },
        { label: lang?.billerWiseSales || "Biller Wise Sales", pathKey: "billerWiseSales", icon: <Icons.UsersOutline size={18} /> },
        { label: lang?.userWiseSupplier || "Supplier wise Sales", pathKey: "supplierWiseSales", icon: <Icons.UserOutline size={18} /> },
    ],
    },
    // {
    //   key: "customerReport",
    //   label: lang?.customerReport || "Customer Reports",
    //   icon: <Icons.InboxInOutline size={22} />,
    //   children: [
    //     { label: lang?.supplierWiseCustomer || "Supplier Wise Customer", pathKey: "supplierWiseCustomer", icon: <Icons.UsersOutline size={18} /> },
    //     { label: lang?.userWiseCustomer || "User Wise Customer", pathKey: "userWiseCustomer", icon: <Icons.UserOutline size={18} /> },
    //   ],
    // },
    // {
    //   key: "purchaseReports",
    //   label: lang?.purchaseReports || "Purchase Reports",
    //   icon: <Icons.InboxInOutline size={22} />,
    //   children: [
    //     { label: lang?.supplierWisePurchase || "Supplier Wise Purchase", pathKey: "supplierWisePurchaseReport", icon: <Icons.UsersOutline size={18} /> },
    //     { label: lang?.userWisePurchase || "User Wise Purchase", pathKey: "userWisePurchaseReport", icon: <Icons.UserOutline size={18} /> },
    //   ],
    // },
    {
      key: "productReports",
      label: lang?.productReports || "Products Reports",
      icon: <Icons.ArchiveOutline size={22} />,
      children: [
        { label: lang?.productWisePurchase || "Product Wise Purchase", pathKey: "productWisePurchase", icon: <Icons.ClipboardListOutline size={18} /> },
        { label: lang?.productWiseSales || "Product Wise sales", pathKey: "productWiseSales", icon: <Icons.ClipboardListOutline size={18} /> },
        // { label: lang?.invoiceWiseProduct || "Invoice Wise Product", pathKey: "invoiceWiseProduct", icon: <Icons.ClipboardListOutline size={18} /> },
        // { label: lang?.outOfStockProducts || "Out Of Stock Products", pathKey: "outOfStockProducts", icon: <Icons.ClipboardListOutline size={18} /> },
      ],
    },
    {
      key: "profitLossReports",
      label: lang?.profitLossReports || "Profit Loss Reports",
      icon: <Icons.ChartPieOutline size={22} />,
      children: [
        { label: lang?.profitLossReport || "Profit Loss Report", pathKey: "profitLossReport", icon: <Icons.CurrencyDollarOutline size={18} /> },
      ],
    },
  ], [lang]);

  // Memoize isPathActive
  const isPathActive = useCallback(
    (pathKey) => {
      if (!pathKey) return false;
      const fullPath = `/reports/${pathKey}`;
      if (fullPath.includes('/:id')) {
        return !!matchPath(fullPath, currentPath);
      }
      return currentPath === fullPath || currentPath.startsWith(`${fullPath}/`);
    },
    [currentPath]
  );

  // Effect to open parent menus based on active route (using currentPath from useLocation)
  useEffect(() => {
    const newOpenMenus = {};
    menuItems.forEach((menu) => {
      if (menu.children) {
        const isChildPathActive = menu.children.some((child) => isPathActive(child.pathKey));
        if (isChildPathActive) {
          newOpenMenus[menu.key] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus);
  }, [currentPath, menuItems, isPathActive]);

  return (
    <aside className="sticky-md-top">
      <nav className="report-sidebar">
        <div className="report-sidebar-nav">
          <Link to="/dashboard">
            <Image src={logo} className="report-sidebar-logo" />
          </Link>
          
          {menuItems.map((menu) => (
            <div key={menu.key} className="report-sidebar-menu-section">
              {/* Parent Link */}
              <Link
                className={`report-sidebar-link ${isPathActive(menu.key) ? 'active' : ''}`}
                to={menu.children ? `/reports/${menu.children[0].pathKey}` : `/reports/${menu.key}`}
                onClick={() => {
                  if (menu.children) {
                    setOpenMenus(prev => ({ ...prev, [menu.key]: !prev[menu.key] }));
                  }
                }}
              >
                <div className="report-sidebar-menu-header">
                  <span className="report-sidebar-menu-title">
                    <span className="report-sidebar-icon">{menu.icon}</span>
                    <span>{menu.label}</span>
                  </span>
                  {menu.children && (
                    <span className="report-sidebar-icon">
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
              {openMenus[menu.key] && menu.children && (
                <div className="report-sidebar-submenu">
                  {menu.children.map((child, index) => (
                    <Link
                      key={index}
                      className={`report-sidebar-link report-sidebar-link-child ${isPathActive(child.pathKey) ? 'active' : ''}`}
                      to={`/reports/${child.pathKey}`}
                    >
                      <span className="report-sidebar-icon">{child.icon}</span>
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default ReportSideBar;
